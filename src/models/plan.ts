/**
 * Practice Plan data model and input types
 */

export interface Drill {
  name: string;
  description: string;
  durationMinutes: number;
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

export type CreatePlanInput = {
  teamId: string;
  coachId: string;
  title: string;
  date: Date;
  durationMinutes: number;
  drills?: Drill[];
  notes?: string;
};

export type UpdatePlanInput = {
  title?: string;
  date?: Date;
  durationMinutes?: number;
  drills?: Drill[];
  notes?: string;
};
