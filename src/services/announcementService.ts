/**
 * Announcement service for coaches to broadcast messages to parents
 */

import { randomBytes } from 'crypto';
import type {
  Announcement,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from '../models/announcement';
import type { AnnouncementRepository } from '../repositories/announcementRepository';
import type { TeamRepository } from '../repositories/teamRepository';

const ID_BYTES = 16;

function generateId(): string {
  return randomBytes(ID_BYTES).toString('hex');
}

export class AnnouncementService {
  constructor(
    private readonly announcementRepo: AnnouncementRepository,
    private readonly teamRepo: TeamRepository,
  ) {}

  createAnnouncement(input: CreateAnnouncementInput): Announcement {
    const team = this.teamRepo.findById(input.teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    if (!team.coachIds.includes(input.coachId)) {
      throw new Error('You do not have permission to post announcements for this team.');
    }
    const now = new Date();
    const announcement: Announcement = {
      id: generateId(),
      teamId: input.teamId,
      coachId: input.coachId,
      title: input.title,
      message: input.message,
      createdAt: now,
      updatedAt: now,
    };
    return this.announcementRepo.save(announcement);
  }

  getAnnouncement(announcementId: string): Announcement | undefined {
    return this.announcementRepo.findById(announcementId);
  }

  getAnnouncementsByTeam(teamId: string): Announcement[] {
    return this.announcementRepo.findByTeamId(teamId);
  }

  updateAnnouncement(
    announcementId: string,
    coachId: string,
    input: UpdateAnnouncementInput,
  ): Announcement {
    const announcement = this.announcementRepo.findById(announcementId);
    if (!announcement) {
      throw new Error('Announcement not found.');
    }
    if (announcement.coachId !== coachId) {
      throw new Error('You do not have permission to update this announcement.');
    }
    const updated: Announcement = { ...announcement, ...input, updatedAt: new Date() };
    return this.announcementRepo.save(updated);
  }

  deleteAnnouncement(announcementId: string, coachId: string): void {
    const announcement = this.announcementRepo.findById(announcementId);
    if (!announcement) {
      throw new Error('Announcement not found.');
    }
    const team = this.teamRepo.findById(announcement.teamId);
    if (!team || !team.coachIds.includes(coachId)) {
      throw new Error('You do not have permission to delete this announcement.');
    }
    this.announcementRepo.delete(announcementId);
  }
}
