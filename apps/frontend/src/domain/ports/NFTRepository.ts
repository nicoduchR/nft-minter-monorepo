import { NFT } from '../entities/NFT';

export interface NFTRepository {
  getUserNFTs(): Promise<NFT[]>;
  getNFTById(id: string): Promise<NFT>;
  getAllNFTs(): Promise<NFT[]>;
} 