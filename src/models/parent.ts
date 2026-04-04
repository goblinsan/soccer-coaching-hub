/**
 * Parent data model and input types for the parent portal
 */

export interface Parent {
  id: string;
  teamId: string;
  email: string;
  inviteToken: string;
  accepted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type InviteParentInput = {
  teamId: string;
  coachId: string;
  email: string;
};
