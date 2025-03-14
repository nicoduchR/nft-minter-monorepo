import { NftDrop } from '../entities/nft-drop.entity';
import { Marketplace } from '../entities/nft.entity';

export interface INftDropRepository {
  findById(id: string): Promise<NftDrop | null>;
  findUpcoming(): Promise<NftDrop[]>;
  findByMarketplace(marketplace: Marketplace): Promise<NftDrop[]>;
  findByDate(date: Date): Promise<NftDrop[]>;
  findNotNotified(): Promise<NftDrop[]>;
  create(nftDropData: Partial<NftDrop>): Promise<NftDrop>;
  update(id: string, nftDropData: Partial<NftDrop>): Promise<NftDrop>;
  markAsNotified(id: string): Promise<NftDrop>;
  save(nftDrop: NftDrop): Promise<NftDrop>;
}
