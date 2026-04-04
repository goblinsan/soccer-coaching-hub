/**
 * Team data model and input types
 */

export interface Team {
  id: string;
  coachId: string;
  coachIds: string[];
  name: string;
  ageGroup?: string;
  season?: string;
  playerIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateTeamInput = {
  coachId: string;
  name: string;
  ageGroup?: string;
  season?: string;
};

export type UpdateTeamInput = {
  name?: string;
  ageGroup?: string;
  season?: string;
};
