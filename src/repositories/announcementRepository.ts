/**
 * In-memory repository for Announcement data
 */

import type { Announcement } from '../models/announcement';

export class AnnouncementRepository {
  private readonly store = new Map<string, Announcement>();

  save(announcement: Announcement): Announcement {
    this.store.set(announcement.id, { ...announcement });
    return { ...announcement };
  }

  findById(id: string): Announcement | undefined {
    const announcement = this.store.get(id);
    return announcement ? { ...announcement } : undefined;
  }

  findByTeamId(teamId: string): Announcement[] {
    const results: Announcement[] = [];
    for (const announcement of this.store.values()) {
      if (announcement.teamId === teamId) {
        results.push({ ...announcement });
      }
    }
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  delete(id: string): boolean {
    return this.store.delete(id);
  }
}
