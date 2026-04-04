/**
 * Practice plan management service for creating, editing, and organizing practice plans
 */

import { randomBytes } from 'crypto';
import type {
  PracticePlan,
  Drill,
  CreatePlanInput,
  UpdatePlanInput,
  CreateDrillInput,
  UpdateDrillInput,
} from '../models/plan';
import type { PlanRepository } from '../repositories/planRepository';
import type { TeamRepository } from '../repositories/teamRepository';

const ID_BYTES = 16;

function generateId(): string {
  return randomBytes(ID_BYTES).toString('hex');
}

export class PlanService {
  constructor(
    private readonly planRepo: PlanRepository,
    private readonly teamRepo: TeamRepository,
  ) {}

  createPlan(input: CreatePlanInput): PracticePlan {
    const team = this.teamRepo.findById(input.teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    if (team.coachId !== input.coachId) {
      throw new Error('You do not have permission to create a plan for this team.');
    }
    const now = new Date();
    const plan: PracticePlan = {
      id: generateId(),
      teamId: input.teamId,
      coachId: input.coachId,
      title: input.title,
      date: input.date,
      durationMinutes: input.durationMinutes,
      drills: (input.drills ?? []).map((d) => ({ id: generateId(), ...d })),
      notes: input.notes,
      createdAt: now,
      updatedAt: now,
    };
    return this.planRepo.save(plan);
  }

  getPlan(planId: string): PracticePlan | undefined {
    return this.planRepo.findById(planId);
  }

  getPlansByCoach(coachId: string): PracticePlan[] {
    return this.planRepo.findByCoachId(coachId);
  }

  getPlansByTeam(teamId: string): PracticePlan[] {
    return this.planRepo.findByTeamId(teamId);
  }

  updatePlan(planId: string, coachId: string, input: UpdatePlanInput): PracticePlan {
    const plan = this.planRepo.findById(planId);
    if (!plan) {
      throw new Error('Practice plan not found.');
    }
    if (plan.coachId !== coachId) {
      throw new Error('You do not have permission to update this plan.');
    }
    const updated: PracticePlan = { ...plan, ...input, updatedAt: new Date() };
    return this.planRepo.save(updated);
  }

  deletePlan(planId: string, coachId: string): void {
    const plan = this.planRepo.findById(planId);
    if (!plan) {
      throw new Error('Practice plan not found.');
    }
    if (plan.coachId !== coachId) {
      throw new Error('You do not have permission to delete this plan.');
    }
    this.planRepo.delete(planId);
  }

  addDrill(planId: string, coachId: string, input: CreateDrillInput): PracticePlan {
    const plan = this.planRepo.findById(planId);
    if (!plan) {
      throw new Error('Practice plan not found.');
    }
    if (plan.coachId !== coachId) {
      throw new Error('You do not have permission to modify this plan.');
    }
    const drill: Drill = { id: generateId(), ...input };
    const updated: PracticePlan = {
      ...plan,
      drills: [...plan.drills, drill],
      updatedAt: new Date(),
    };
    return this.planRepo.save(updated);
  }

  updateDrill(
    planId: string,
    drillId: string,
    coachId: string,
    input: UpdateDrillInput,
  ): PracticePlan {
    const plan = this.planRepo.findById(planId);
    if (!plan) {
      throw new Error('Practice plan not found.');
    }
    if (plan.coachId !== coachId) {
      throw new Error('You do not have permission to modify this plan.');
    }
    const drillIndex = plan.drills.findIndex((d) => d.id === drillId);
    if (drillIndex === -1) {
      throw new Error('Drill not found in this plan.');
    }
    const updatedDrills = plan.drills.map((d, i) =>
      i === drillIndex ? { ...d, ...input, id: d.id } : d,
    );
    const updated: PracticePlan = { ...plan, drills: updatedDrills, updatedAt: new Date() };
    return this.planRepo.save(updated);
  }

  removeDrill(planId: string, drillId: string, coachId: string): PracticePlan {
    const plan = this.planRepo.findById(planId);
    if (!plan) {
      throw new Error('Practice plan not found.');
    }
    if (plan.coachId !== coachId) {
      throw new Error('You do not have permission to modify this plan.');
    }
    const drillExists = plan.drills.some((d) => d.id === drillId);
    if (!drillExists) {
      throw new Error('Drill not found in this plan.');
    }
    const drills = plan.drills.filter((d) => d.id !== drillId);
    const updated: PracticePlan = { ...plan, drills, updatedAt: new Date() };
    return this.planRepo.save(updated);
  }

  reorderDrills(planId: string, coachId: string, drillIds: string[]): PracticePlan {
    const plan = this.planRepo.findById(planId);
    if (!plan) {
      throw new Error('Practice plan not found.');
    }
    if (plan.coachId !== coachId) {
      throw new Error('You do not have permission to modify this plan.');
    }
    const planDrillIds = new Set(plan.drills.map((d) => d.id));
    if (drillIds.length !== plan.drills.length || !drillIds.every((id) => planDrillIds.has(id))) {
      throw new Error('Drill IDs do not match the drills in this plan.');
    }
    const drillMap = new Map(plan.drills.map((d) => [d.id, d]));
    const drills = drillIds.map((id) => drillMap.get(id) as Drill);
    const updated: PracticePlan = { ...plan, drills, updatedAt: new Date() };
    return this.planRepo.save(updated);
  }

  summarizePlan(planId: string): string {
    const plan = this.planRepo.findById(planId);
    if (!plan) {
      throw new Error('Practice plan not found.');
    }
    const lines: string[] = [
      `Practice Plan: ${plan.title}`,
      `Date: ${plan.date.toDateString()}`,
      `Total Duration: ${plan.durationMinutes} minutes`,
      '',
      'Drills:',
    ];
    plan.drills.forEach((drill, index) => {
      lines.push(`  ${index + 1}. ${drill.name} (${drill.durationMinutes} min)`);
      lines.push(`     ${drill.description}`);
      if (drill.diagramUrl) {
        lines.push(`     Diagram: ${drill.diagramUrl}`);
      }
    });
    if (plan.notes) {
      lines.push('', `Notes: ${plan.notes}`);
    }
    return lines.join('\n');
  }
}
