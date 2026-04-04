/**
 * Player roster management service for adding and editing players
 */

import { randomBytes } from 'crypto';
import type { Player, CreatePlayerInput, UpdatePlayerInput } from '../models/player';
import type { PlayerRepository } from '../repositories/playerRepository';
import type { TeamRepository } from '../repositories/teamRepository';

const ID_BYTES = 16;

function generateId(): string {
  return randomBytes(ID_BYTES).toString('hex');
}

export class PlayerService {
  constructor(
    private readonly playerRepo: PlayerRepository,
    private readonly teamRepo: TeamRepository,
  ) {}

  addPlayer(input: CreatePlayerInput): Player {
    const team = this.teamRepo.findById(input.teamId);
    if (!team) {
      throw new Error('Team not found.');
    }
    const now = new Date();
    const player: Player = {
      id: generateId(),
      teamId: input.teamId,
      firstName: input.firstName,
      lastName: input.lastName,
      jerseyNumber: input.jerseyNumber,
      position: input.position,
      dateOfBirth: input.dateOfBirth,
      guardianEmail: input.guardianEmail,
      createdAt: now,
      updatedAt: now,
    };
    const saved = this.playerRepo.save(player);
    this.teamRepo.save({ ...team, playerIds: [...team.playerIds, saved.id], updatedAt: now });
    return saved;
  }

  getPlayer(playerId: string): Player | undefined {
    return this.playerRepo.findById(playerId);
  }

  getRoster(teamId: string): Player[] {
    return this.playerRepo.findByTeamId(teamId);
  }

  updatePlayer(playerId: string, coachId: string, input: UpdatePlayerInput): Player {
    const player = this.playerRepo.findById(playerId);
    if (!player) {
      throw new Error('Player not found.');
    }
    const team = this.teamRepo.findById(player.teamId);
    if (!team || !team.coachIds.includes(coachId)) {
      throw new Error('You do not have permission to update this player.');
    }
    const updated: Player = { ...player, ...input, updatedAt: new Date() };
    return this.playerRepo.save(updated);
  }

  removePlayer(playerId: string, coachId: string): void {
    const player = this.playerRepo.findById(playerId);
    if (!player) {
      throw new Error('Player not found.');
    }
    const team = this.teamRepo.findById(player.teamId);
    if (!team || !team.coachIds.includes(coachId)) {
      throw new Error('You do not have permission to remove this player.');
    }
    this.playerRepo.delete(playerId);
    const playerIds = team.playerIds.filter((id) => id !== playerId);
    this.teamRepo.save({ ...team, playerIds, updatedAt: new Date() });
  }
}
