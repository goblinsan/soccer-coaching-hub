/**
 * Announcement data model and input types for coach-to-parent messaging
 */

export interface Announcement {
  id: string;
  teamId: string;
  coachId: string;
  title: string;
  message: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateAnnouncementInput = {
  teamId: string;
  coachId: string;
  title: string;
  message: string;
};

export type UpdateAnnouncementInput = {
  title?: string;
  message?: string;
};
