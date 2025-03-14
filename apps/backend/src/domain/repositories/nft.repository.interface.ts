import { Nft, NftStatus, Marketplace } from '../entities/nft.entity';

export interface INftRepository {
  findById(id: string): Promise<Nft | null>;
  findByTokenId(tokenId: string, contractAddress: string): Promise<Nft | null>;
  findByUserId(userId: string): Promise<Nft[]>;
  findAvailable(): Promise<Nft[]>;
  findByStatus(status: NftStatus): Promise<Nft[]>;
  findByMarketplace(marketplace: Marketplace): Promise<Nft[]>;
  create(nftData: Partial<Nft>): Promise<Nft>;
  update(id: string, nftData: Partial<Nft>): Promise<Nft>;
  updateOwner(id: string, userId: string): Promise<Nft>;
  updateStatus(id: string, status: NftStatus): Promise<Nft>;
  save(nft: Nft): Promise<Nft>;
}
