/**
 * Parent portal service for inviting parents and providing view-only access to team schedules
 */

import { randomBytes } from 'crypto';
import type { Parent, InviteParentInput } from '../models/parent';
import type { PracticePlan } from '../models/plan';
import type { ParentRepository } from '../repositories/parentRepository';
import type { TeamRepository } from '../repositories/teamRepository';
import type { PlanRepository } from '../repositories/planRepository';

const ID_BYTES = 16;
const TOKEN_BYTES = 32;

function generateId(): string {
  return randomBytes(ID_BYTES).toString('hex');
}

function generateToken(): string {
  return randomBytes(TOKEN_BYTES).toString('hex');
}

export class ParentPortalService {
  constructor(
    private readonly parentRepo: ParentRepository,
    private readonly teamRepo: TeamRepository,
    private readonly planRepo: PlanRepository,
  ) {}

  inviteParent(input: InviteParentInput): Parent {
    const team = this.teamRepo.findById(input.teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    if (!team.coachIds.includes(input.coachId)) {
      throw new Error('You do not have permission to invite parents to this team.');
    }
    const existing = this.parentRepo.findByEmail(input.email, input.teamId);
    if (existing) {
      throw new Error('A parent with this email has already been invited to this team.');
    }
    const now = new Date();
    const parent: Parent = {
      id: generateId(),
      teamId: input.teamId,
      email: input.email.toLowerCase().trim(),
      inviteToken: generateToken(),
      accepted: false,
      createdAt: now,
      updatedAt: now,
    };
    return this.parentRepo.save(parent);
  }

  acceptInvite(token: string): Parent {
    const parent = this.parentRepo.findByInviteToken(token);
    if (!parent) {
      throw new Error('Invalid or expired invite token.');
    }
    if (parent.accepted) {
      throw new Error('This invite has already been accepted.');
    }
    const updated: Parent = { ...parent, accepted: true, updatedAt: new Date() };
    return this.parentRepo.save(updated);
  }

  getSchedule(token: string): PracticePlan[] {
    const parent = this.parentRepo.findByInviteToken(token);
    if (!parent || !parent.accepted) {
      throw new Error('Access denied. Please accept your team invite first.');
    }
    return this.planRepo.findByTeamId(parent.teamId);
  }

  getParentsByTeam(teamId: string, coachId: string): Parent[] {
    const team = this.teamRepo.findById(teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    if (!team.coachIds.includes(coachId)) {
      throw new Error('You do not have permission to view parents for this team.');
    }
    return this.parentRepo.findByTeamId(teamId);
  }

  removeParent(parentId: string, coachId: string): void {
    const parent = this.parentRepo.findById(parentId);
    if (!parent) {
      throw new Error('Parent not found.');
    }
    const team = this.teamRepo.findById(parent.teamId);
    if (!team || !team.coachIds.includes(coachId)) {
      throw new Error('You do not have permission to remove this parent.');
    }
    this.parentRepo.delete(parentId);
  }
}
