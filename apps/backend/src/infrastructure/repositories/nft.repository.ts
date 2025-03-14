import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Nft, NftStatus, Marketplace } from '../../domain/entities/nft.entity';
import { INftRepository } from '../../domain/repositories/nft.repository.interface';

@Injectable()
export class NftRepository implements INftRepository {
  constructor(
    @InjectRepository(Nft)
    private readonly nftRepository: Repository<Nft>,
  ) {}

  async findById(id: string): Promise<Nft | null> {
    return this.nftRepository.findOne({
      where: { id },
      relations: ['owner', 'collection'],
    });
  }

  async findByTokenId(
    tokenId: string,
    contractAddress: string,
  ): Promise<Nft | null> {
    return this.nftRepository.findOne({
      where: { tokenId, contractAddress },
      relations: ['owner'],
    });
  }

  async findByUserId(userId: string): Promise<Nft[]> {
    return this.nftRepository.find({
      where: { owner: { id: userId } },
    });
  }

  async findAvailable(): Promise<Nft[]> {
    return this.nftRepository.find({
      where: { status: NftStatus.AVAILABLE },
    });
  }

  async findByStatus(status: NftStatus): Promise<Nft[]> {
    return this.nftRepository.find({
      where: { status },
      relations: ['owner'],
    });
  }

  async findByMarketplace(marketplace: Marketplace): Promise<Nft[]> {
    return this.nftRepository.find({
      where: { marketplace },
      relations: ['owner'],
    });
  }

  async create(nftData: Partial<Nft>): Promise<Nft> {
    const nft = this.nftRepository.create(nftData);
    return this.nftRepository.save(nft);
  }

  async update(id: string, nftData: Partial<Nft>): Promise<Nft> {
    await this.nftRepository.update(id, nftData);
    return this.findById(id);
  }

  async updateOwner(id: string, userId: string): Promise<Nft> {
    const nft = await this.findById(id);
    nft.owner = { id: userId } as any;
    nft.status = NftStatus.OWNED;
    return this.save(nft);
  }

  async updateStatus(id: string, status: NftStatus): Promise<Nft> {
    await this.nftRepository.update(id, { status });
    return this.findById(id);
  }

  async save(nft: Nft): Promise<Nft> {
    return this.nftRepository.save(nft);
  }
}
