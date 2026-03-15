/**
 * User / Coach data model and input types
 */

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  firstName: string;
  lastName: string;
  bio?: string;
  organization?: string;
  teamIds: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type CreateUserInput = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  bio?: string;
  organization?: string;
};

export type UpdateUserInput = {
  firstName?: string;
  lastName?: string;
  bio?: string;
  organization?: string;
};

export type PublicUser = Omit<User, 'passwordHash' | 'salt'>;
