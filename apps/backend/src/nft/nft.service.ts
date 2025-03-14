import { Injectable } from '@nestjs/common';
import {
  NFT,
  NFTMetadata,
  NFTStatus,
  DEFAULT_GAS_LIMIT,
  DEFAULT_GAS_PRICE,
} from '@nft-minter/shared';

@Injectable()
export class NftService {
  private nfts: NFT[] = [];

  /**
   * Create a new NFT
   * @param userId User ID of the owner
   * @param metadata NFT metadata
   * @returns The created NFT
   */
  async createNFT(userId: string, metadata: NFTMetadata): Promise<NFT> {
    const nft: NFT = {
      id: `nft_${Date.now()}`,
      owner: userId,
      metadata,
      status: NFTStatus.PENDING,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.nfts.push(nft);
    return nft;
  }

  /**
   * Mint an NFT on the blockchain
   * @param nftId ID of the NFT to mint
   * @returns The minted NFT
   */
  async mintNFT(nftId: string): Promise<NFT> {
    const nft = this.nfts.find((n) => n.id === nftId);

    if (!nft) {
      throw new Error('NFT not found');
    }

    // Update status to minting
    nft.status = NFTStatus.MINTING;
    nft.updatedAt = new Date();

    try {
      // Simulate blockchain interaction
      console.log(
        `Minting NFT with gas limit: ${DEFAULT_GAS_LIMIT} and gas price: ${DEFAULT_GAS_PRICE} gwei`,
      );

      // Simulate a successful mint
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Update NFT with blockchain data
      nft.status = NFTStatus.MINTED;
      nft.tokenId = `${Math.floor(Math.random() * 1000000)}`;
      nft.contractAddress = '0x1234567890123456789012345678901234567890';
      nft.txHash = `0x${Array.from({ length: 64 }, () =>
        Math.floor(Math.random() * 16).toString(16),
      ).join('')}`;
      nft.updatedAt = new Date();

      return nft;
    } catch (error) {
      // Handle mint failure
      nft.status = NFTStatus.FAILED;
      nft.updatedAt = new Date();
      throw error;
    }
  }

  /**
   * Get all NFTs for a user
   * @param userId User ID
   * @returns Array of NFTs owned by the user
   */
  async getNFTsByUser(userId: string): Promise<NFT[]> {
    return this.nfts.filter((nft) => nft.owner === userId);
  }

  /**
   * Get an NFT by ID
   * @param nftId NFT ID
   * @returns The NFT if found
   */
  async getNFTById(nftId: string): Promise<NFT | null> {
    return this.nfts.find((nft) => nft.id === nftId) || null;
  }
}
