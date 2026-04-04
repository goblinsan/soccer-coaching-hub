/**
 * In-memory repository for PracticePlan data
 */

import type { PracticePlan } from '../models/plan';

export class PlanRepository {
  private readonly store = new Map<string, PracticePlan>();

  save(plan: PracticePlan): PracticePlan {
    this.store.set(plan.id, this.copyPlan(plan));
    return this.copyPlan(plan);
  }

  findById(id: string): PracticePlan | undefined {
    const plan = this.store.get(id);
    return plan ? this.copyPlan(plan) : undefined;
  }

  findByCoachId(coachId: string): PracticePlan[] {
    const results: PracticePlan[] = [];
    for (const plan of this.store.values()) {
      if (plan.coachId === coachId) {
        results.push(this.copyPlan(plan));
      }
    }
    return results;
  }

  findByTeamId(teamId: string): PracticePlan[] {
    const results: PracticePlan[] = [];
    for (const plan of this.store.values()) {
      if (plan.teamId === teamId) {
        results.push(this.copyPlan(plan));
      }
    }
    return results;
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }

  private copyPlan(plan: PracticePlan): PracticePlan {
    return { ...plan, drills: plan.drills.map((d) => ({ ...d })) };
  }
}
