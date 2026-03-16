/**
 * Authentication service for coach sign-up, login, and profile management
 */

import { scryptSync, randomBytes, timingSafeEqual } from 'crypto';
import type { User, CreateUserInput, UpdateUserInput, PublicUser } from '../models/user';
import type { UserRepository } from '../repositories/userRepository';

const SALT_BYTES = 16;
const KEY_LENGTH = 64;
const TOKEN_BYTES = 32;

export type LoginResult = {
  user: PublicUser;
  token: string;
};

function generateId(): string {
  return randomBytes(TOKEN_BYTES).toString('hex');
}

function stripSensitiveFields(user: User): PublicUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    bio: user.bio,
    organization: user.organization,
    teamIds: [...user.teamIds],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export class AuthService {
  private readonly sessions = new Map<string, string>();

  constructor(private readonly userRepo: UserRepository) {}

  signUp(input: CreateUserInput): PublicUser {
    if (this.userRepo.exists(input.email)) {
      throw new Error('An account with this email already exists.');
    }
    const salt = randomBytes(SALT_BYTES).toString('hex');
    const passwordHash = scryptSync(input.password, salt, KEY_LENGTH).toString('hex');
    const now = new Date();
    const user: User = {
      id: generateId(),
      email: input.email.toLowerCase().trim(),
      passwordHash,
      salt,
      firstName: input.firstName,
      lastName: input.lastName,
      bio: input.bio,
      organization: input.organization,
      teamIds: [],
      createdAt: now,
      updatedAt: now,
    };
    return stripSensitiveFields(this.userRepo.save(user));
  }

  logIn(email: string, password: string): LoginResult {
    const user = this.userRepo.findByEmail(email);
    if (!user || !this.verifyPassword(password, user.passwordHash, user.salt)) {
      throw new Error('Invalid email or password.');
    }
    const token = randomBytes(TOKEN_BYTES).toString('hex');
    this.sessions.set(token, user.id);
    return { user: stripSensitiveFields(user), token };
  }

  logOut(token: string): void {
    this.sessions.delete(token);
  }

  validateSession(token: string): PublicUser | undefined {
    const userId = this.sessions.get(token);
    if (!userId) return undefined;
    const user = this.userRepo.findById(userId);
    return user ? stripSensitiveFields(user) : undefined;
  }

  updateProfile(userId: string, input: UpdateUserInput): PublicUser {
    const user = this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    const updated: User = {
      ...user,
      ...input,
      updatedAt: new Date(),
    };
    return stripSensitiveFields(this.userRepo.save(updated));
  }

  changePassword(userId: string, oldPassword: string, newPassword: string): void {
    const user = this.userRepo.findById(userId);
    if (!user) {
      throw new Error('User not found.');
    }
    if (!this.verifyPassword(oldPassword, user.passwordHash, user.salt)) {
      throw new Error('Current password is incorrect.');
    }
    const newSalt = randomBytes(SALT_BYTES).toString('hex');
    const newHash = scryptSync(newPassword, newSalt, KEY_LENGTH).toString('hex');
    this.userRepo.save({ ...user, passwordHash: newHash, salt: newSalt, updatedAt: new Date() });
  }

  private verifyPassword(password: string, hash: string, salt: string): boolean {
    const hashBuffer = Buffer.from(hash, 'hex');
    const testHash = scryptSync(password, salt, KEY_LENGTH);
    return timingSafeEqual(hashBuffer, testHash);
  }
}
