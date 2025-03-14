import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { NftDrop } from '../../domain/entities/nft-drop.entity';
import { Marketplace } from '../../domain/entities/nft.entity';
import { INftDropRepository } from '../../domain/repositories/nft-drop.repository.interface';

@Injectable()
export class NftDropRepository implements INftDropRepository {
  constructor(
    @InjectRepository(NftDrop)
    private readonly nftDropRepository: Repository<NftDrop>,
  ) {}

  async findById(id: string): Promise<NftDrop | null> {
    return this.nftDropRepository.findOne({
      where: { id },
    });
  }

  async findUpcoming(): Promise<NftDrop[]> {
    const today = new Date();
    return this.nftDropRepository.find({
      where: {
        mintDate: MoreThan(today),
      },
      order: {
        mintDate: 'ASC',
      },
    });
  }

  async findByMarketplace(marketplace: Marketplace): Promise<NftDrop[]> {
    return this.nftDropRepository.find({
      where: { marketplace },
      order: {
        mintDate: 'ASC',
      },
    });
  }

  async findByDate(date: Date): Promise<NftDrop[]> {
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);

    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);

    return this.nftDropRepository.find({
      where: {
        mintDate: MoreThan(startDate),
        endDate: MoreThan(endDate),
      },
    });
  }

  async findNotNotified(): Promise<NftDrop[]> {
    return this.nftDropRepository.find({
      where: { isNotified: false },
    });
  }

  async create(nftDropData: Partial<NftDrop>): Promise<NftDrop> {
    const nftDrop = this.nftDropRepository.create(nftDropData);
    return this.nftDropRepository.save(nftDrop);
  }

  async update(id: string, nftDropData: Partial<NftDrop>): Promise<NftDrop> {
    await this.nftDropRepository.update(id, nftDropData);
    return this.findById(id);
  }

  async markAsNotified(id: string): Promise<NftDrop> {
    await this.nftDropRepository.update(id, { isNotified: true });
    return this.findById(id);
  }

  async save(nftDrop: NftDrop): Promise<NftDrop> {
    return this.nftDropRepository.save(nftDrop);
  }
}
