/**
 * Team management service for creating and managing coach teams
 */

import { randomBytes } from 'crypto';
import type { Team, CreateTeamInput, UpdateTeamInput } from '../models/team';
import type { TeamRepository } from '../repositories/teamRepository';
import type { UserRepository } from '../repositories/userRepository';

const ID_BYTES = 16;

function generateId(): string {
  return randomBytes(ID_BYTES).toString('hex');
}

export class TeamService {
  constructor(
    private readonly teamRepo: TeamRepository,
    private readonly userRepo: UserRepository,
  ) {}

  createTeam(input: CreateTeamInput): Team {
    const coach = this.userRepo.findById(input.coachId);
    if (!coach) {
      throw new Error('Coach not found.');
    }
    const now = new Date();
    const team: Team = {
      id: generateId(),
      coachId: input.coachId,
      name: input.name,
      ageGroup: input.ageGroup,
      season: input.season,
      playerIds: [],
      createdAt: now,
      updatedAt: now,
    };
    const saved = this.teamRepo.save(team);
    this.userRepo.save({ ...coach, teamIds: [...coach.teamIds, saved.id], updatedAt: now });
    return saved;
  }

  getTeam(teamId: string): Team | undefined {
    return this.teamRepo.findById(teamId);
  }

  getTeamsByCoach(coachId: string): Team[] {
    return this.teamRepo.findByCoachId(coachId);
  }

  updateTeam(teamId: string, coachId: string, input: UpdateTeamInput): Team {
    const team = this.teamRepo.findById(teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    if (team.coachId !== coachId) {
      throw new Error('You do not have permission to update this team.');
    }
    const updated: Team = { ...team, ...input, updatedAt: new Date() };
    return this.teamRepo.save(updated);
  }

  deleteTeam(teamId: string, coachId: string): void {
    const team = this.teamRepo.findById(teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    if (team.coachId !== coachId) {
      throw new Error('You do not have permission to delete this team.');
    }
    this.teamRepo.delete(teamId);
    const coach = this.userRepo.findById(coachId);
    if (coach) {
      const teamIds = coach.teamIds.filter((id) => id !== teamId);
      this.userRepo.save({ ...coach, teamIds, updatedAt: new Date() });
    }
  }
}
