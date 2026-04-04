/**
 * In-memory repository for Parent data
 */

import type { Parent } from '../models/parent';

export class ParentRepository {
  private readonly store = new Map<string, Parent>();

  save(parent: Parent): Parent {
    this.store.set(parent.id, { ...parent });
    return { ...parent };
  }

  findById(id: string): Parent | undefined {
    const parent = this.store.get(id);
    return parent ? { ...parent } : undefined;
  }

  findByTeamId(teamId: string): Parent[] {
    const results: Parent[] = [];
    for (const parent of this.store.values()) {
      if (parent.teamId === teamId) {
        results.push({ ...parent });
      }
    }
    return results;
  }

  findByInviteToken(token: string): Parent | undefined {
    for (const parent of this.store.values()) {
      if (parent.inviteToken === token) {
        return { ...parent };
      }
    }
    return undefined;
  }

  findByEmail(email: string, teamId: string): Parent | undefined {
    for (const parent of this.store.values()) {
      if (parent.email.toLowerCase() === email.toLowerCase() && parent.teamId === teamId) {
        return { ...parent };
      }
    }
    return undefined;
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }
}
