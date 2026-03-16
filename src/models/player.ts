/**
 * Player data model and input types
 */

export interface Player {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  jerseyNumber?: number;
  position?: string;
  dateOfBirth?: Date;
  guardianEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreatePlayerInput = {
  teamId: string;
  firstName: string;
  lastName: string;
  jerseyNumber?: number;
  position?: string;
  dateOfBirth?: Date;
  guardianEmail?: string;
};

export type UpdatePlayerInput = {
  firstName?: string;
  lastName?: string;
  jerseyNumber?: number;
  position?: string;
  dateOfBirth?: Date;
  guardianEmail?: string;
};
