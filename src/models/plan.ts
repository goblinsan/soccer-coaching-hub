/**
 * Practice Plan data model and input types
 */

export interface Drill {
  id: string;
  name: string;
  description: string;
  durationMinutes: number;
  diagramUrl?: string;
}

export interface PracticePlan {
  id: string;
  teamId: string;
  coachId: string;
  title: string;
  date: Date;
  durationMinutes: number;
  drills: Drill[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export type CreateDrillInput = {
  name: string;
  description: string;
  durationMinutes: number;
  diagramUrl?: string;
};

export type UpdateDrillInput = {
  name?: string;
  description?: string;
  durationMinutes?: number;
  diagramUrl?: string;
};

export type CreatePlanInput = {
  teamId: string;
  coachId: string;
  title: string;
  date: Date;
  durationMinutes: number;
  drills?: CreateDrillInput[];
  notes?: string;
};

export type UpdatePlanInput = {
  title?: string;
  date?: Date;
  durationMinutes?: number;
  notes?: string;
};
