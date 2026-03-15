/**
 * In-memory repository for Player data
 */

import type { Player } from '../models/player';

export class PlayerRepository {
  private readonly store = new Map<string, Player>();

  save(player: Player): Player {
    this.store.set(player.id, { ...player });
    return { ...player };
  }

  findById(id: string): Player | undefined {
    const player = this.store.get(id);
    return player ? { ...player } : undefined;
  }

  findByTeamId(teamId: string): Player[] {
    const results: Player[] = [];
    for (const player of this.store.values()) {
      if (player.teamId === teamId) {
        results.push({ ...player });
      }
    }
    return results;
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }
}
