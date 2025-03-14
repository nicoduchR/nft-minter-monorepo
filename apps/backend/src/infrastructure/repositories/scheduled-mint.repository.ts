import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import {
  ScheduledMint,
  ScheduledMintStatus,
} from '../../domain/entities/scheduled-mint.entity';
import { IScheduledMintRepository } from '../../domain/repositories/scheduled-mint.repository.interface';

@Injectable()
export class ScheduledMintRepository implements IScheduledMintRepository {
  constructor(
    @InjectRepository(ScheduledMint)
    private scheduledMintRepository: Repository<ScheduledMint>,
  ) {}

  async findById(id: string): Promise<ScheduledMint | null> {
    return this.scheduledMintRepository.findOne({
      where: { id },
      relations: ['user', 'nft'],
    });
  }

  async findByUserId(userId: string): Promise<ScheduledMint[]> {
    return this.scheduledMintRepository.find({
      where: { user: { id: userId } },
      relations: ['nft'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByNftId(nftId: string): Promise<ScheduledMint[]> {
    return this.scheduledMintRepository.find({
      where: { nft: { id: nftId } },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: ScheduledMintStatus): Promise<ScheduledMint[]> {
    return this.scheduledMintRepository.find({
      where: { status },
      relations: ['user', 'nft'],
      order: { createdAt: 'ASC' },
    });
  }

  async findPendingAndReady(): Promise<ScheduledMint[]> {
    const now = new Date();
    return this.scheduledMintRepository.find({
      where: {
        status: ScheduledMintStatus.PENDING,
        scheduledFor: LessThanOrEqual(now),
      },
      relations: ['user', 'nft'],
      order: { scheduledFor: 'ASC' },
    });
  }

  async create(data: Partial<ScheduledMint>): Promise<ScheduledMint> {
    const scheduledMint = this.scheduledMintRepository.create(data);
    return this.scheduledMintRepository.save(scheduledMint);
  }

  async update(
    id: string,
    data: Partial<ScheduledMint>,
  ): Promise<ScheduledMint> {
    await this.scheduledMintRepository.update(id, data);
    return this.findById(id);
  }

  async updateStatus(
    id: string,
    status: ScheduledMintStatus,
    reason?: string,
  ): Promise<ScheduledMint> {
    const updateData: Partial<ScheduledMint> = { status };

    if (status === ScheduledMintStatus.COMPLETED) {
      updateData.completedAt = new Date();
    } else if (status === ScheduledMintStatus.FAILED && reason) {
      updateData.failureReason = reason;
    }

    await this.scheduledMintRepository.update(id, updateData);
    return this.findById(id);
  }

  async save(scheduledMint: ScheduledMint): Promise<ScheduledMint> {
    return this.scheduledMintRepository.save(scheduledMint);
  }

  async delete(id: string): Promise<void> {
    await this.scheduledMintRepository.delete(id);
  }
}
