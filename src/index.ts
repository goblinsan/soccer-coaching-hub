/**
 * Soccer Coaching Hub - Application Entry Point
 */

export const APP_NAME = 'Soccer Coaching Hub';
export const APP_VERSION = '1.0.0';

// Models
export type { User, CreateUserInput, UpdateUserInput, PublicUser } from './models/user';
export type { Team, CreateTeamInput, UpdateTeamInput } from './models/team';
export type { Player, CreatePlayerInput, UpdatePlayerInput } from './models/player';
export type { Drill, PracticePlan, CreatePlanInput, UpdatePlanInput } from './models/plan';

// Repositories
export { UserRepository } from './repositories/userRepository';
export { TeamRepository } from './repositories/teamRepository';
export { PlayerRepository } from './repositories/playerRepository';

// Services
export { AuthService } from './services/authService';
export type { LoginResult } from './services/authService';
export { TeamService } from './services/teamService';
export { PlayerService } from './services/playerService';
