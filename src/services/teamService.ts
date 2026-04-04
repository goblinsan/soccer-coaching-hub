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
      coachIds: [input.coachId],
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

  addCoach(teamId: string, primaryCoachId: string, newCoachId: string): Team {
    const team = this.teamRepo.findById(teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    if (team.coachId !== primaryCoachId) {
      throw new Error('Only the primary coach can add coaches to this team.');
    }
    const newCoach = this.userRepo.findById(newCoachId);
    if (!newCoach) {
      throw new Error('Coach not found.');
    }
    if (team.coachIds.includes(newCoachId)) {
      throw new Error('Coach is already on this team.');
    }
    const now = new Date();
    const updated: Team = {
      ...team,
      coachIds: [...team.coachIds, newCoachId],
      updatedAt: now,
    };
    const saved = this.teamRepo.save(updated);
    this.userRepo.save({ ...newCoach, teamIds: [...newCoach.teamIds, teamId], updatedAt: now });
    return saved;
  }

  removeCoach(teamId: string, primaryCoachId: string, coachIdToRemove: string): Team {
    const team = this.teamRepo.findById(teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    if (team.coachId !== primaryCoachId) {
      throw new Error('Only the primary coach can remove coaches from this team.');
    }
    if (coachIdToRemove === primaryCoachId) {
      throw new Error('The primary coach cannot be removed from the team.');
    }
    if (!team.coachIds.includes(coachIdToRemove)) {
      throw new Error('Coach is not on this team.');
    }
    const now = new Date();
    const updated: Team = {
      ...team,
      coachIds: team.coachIds.filter((id) => id !== coachIdToRemove),
      updatedAt: now,
    };
    const saved = this.teamRepo.save(updated);
    const removedCoach = this.userRepo.findById(coachIdToRemove);
    if (removedCoach) {
      const teamIds = removedCoach.teamIds.filter((id) => id !== teamId);
      this.userRepo.save({ ...removedCoach, teamIds, updatedAt: now });
    }
    return saved;
  }
}
