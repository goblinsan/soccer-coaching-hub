/**
 * Soccer Coaching Hub - Application Entry Point
 */

export const APP_NAME = 'Soccer Coaching Hub';
export const APP_VERSION = '1.0.0';

// Models
export type { User, CreateUserInput, UpdateUserInput, PublicUser } from './models/user';
export type { Team, CreateTeamInput, UpdateTeamInput } from './models/team';
export type { Player, CreatePlayerInput, UpdatePlayerInput } from './models/player';
export type {
  Drill,
  PracticePlan,
  CreateDrillInput,
  UpdateDrillInput,
  CreatePlanInput,
  UpdatePlanInput,
} from './models/plan';
export type { Parent, InviteParentInput } from './models/parent';
export type {
  Announcement,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from './models/announcement';

// Repositories
export { UserRepository } from './repositories/userRepository';
export { TeamRepository } from './repositories/teamRepository';
export { PlayerRepository } from './repositories/playerRepository';
export { PlanRepository } from './repositories/planRepository';
export { ParentRepository } from './repositories/parentRepository';
export { AnnouncementRepository } from './repositories/announcementRepository';

// Services
export { AuthService } from './services/authService';
export type { LoginResult } from './services/authService';
export { TeamService } from './services/teamService';
export { PlayerService } from './services/playerService';
export { PlanService } from './services/planService';
export { ParentPortalService } from './services/parentPortalService';
export { AnnouncementService } from './services/announcementService';
