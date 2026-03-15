/**
 * In-memory repository for Team data
 */

import type { Team } from '../models/team';

export class TeamRepository {
  private readonly store = new Map<string, Team>();

  save(team: Team): Team {
    this.store.set(team.id, { ...team, playerIds: [...team.playerIds] });
    return this.copyTeam(team);
  }

  findById(id: string): Team | undefined {
    const team = this.store.get(id);
    return team ? this.copyTeam(team) : undefined;
  }

  findByCoachId(coachId: string): Team[] {
    const results: Team[] = [];
    for (const team of this.store.values()) {
      if (team.coachId === coachId) {
        results.push(this.copyTeam(team));
      }
    }
    return results;
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }

  private copyTeam(team: Team): Team {
    return { ...team, playerIds: [...team.playerIds] };
  }
}
