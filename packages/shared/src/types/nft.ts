/**
 * Shared NFT types for both frontend and backend
 */

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: NFTAttribute[];
}

export interface NFTAttribute {
  trait_type: string;
  value: string | number;
}

export enum NFTStatus {
  PENDING = 'pending',
  MINTING = 'minting',
  MINTED = 'minted',
  FAILED = 'failed'
}

export interface NFT {
  id: string;
  tokenId?: string;
  contractAddress?: string;
  owner: string;
  metadata: NFTMetadata;
  status: NFTStatus;
  txHash?: string;
  createdAt: Date;
  updatedAt: Date;
} 