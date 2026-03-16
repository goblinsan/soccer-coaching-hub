/**
 * In-memory repository for User data
 */

import type { User } from '../models/user';

export class UserRepository {
  private readonly store = new Map<string, User>();

  save(user: User): User {
    this.store.set(user.id, { ...user });
    return { ...user };
  }

  findById(id: string): User | undefined {
    const user = this.store.get(id);
    return user ? { ...user } : undefined;
  }

  findByEmail(email: string): User | undefined {
    for (const user of this.store.values()) {
      if (user.email.toLowerCase() === email.toLowerCase()) {
        return { ...user };
      }
    }
    return undefined;
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }

  exists(email: string): boolean {
    return this.findByEmail(email) !== undefined;
  }
}
