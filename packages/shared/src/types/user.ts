/**
 * Shared user types for both frontend and backend
 */

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin'
}

export interface User {
  id: string;
  email: string;
  walletAddress: string;
  username?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile {
  id: string;
  username?: string;
  walletAddress: string;
  nftCount: number;
} 