import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IScheduledMintRepository } from '../../domain/repositories/scheduled-mint.repository.interface';
import { INftRepository } from '../../domain/repositories/nft.repository.interface';
import { ScheduleMintDto } from './dto/schedule-mint.dto';
import { NftService } from './nft.service';
import {
  ScheduledMint,
  ScheduledMintStatus,
} from '../../domain/entities/scheduled-mint.entity';
import { NftStatus } from '../../domain/entities/nft.entity';
import { SCHEDULED_MINT_QUEUE } from './nft-queue.module';

@Injectable()
export class ScheduledMintService {
  private readonly logger = new Logger(ScheduledMintService.name);

  constructor(
    @Inject('IScheduledMintRepository')
    private readonly scheduledMintRepository: IScheduledMintRepository,
    @Inject('INftRepository')
    private readonly nftRepository: INftRepository,
    private readonly nftService: NftService,
    @InjectQueue(SCHEDULED_MINT_QUEUE)
    private readonly scheduledMintQueue: Queue,
  ) {}

  async scheduleNftMint(
    userId: string,
    scheduleMintDto: ScheduleMintDto,
  ): Promise<ScheduledMint> {
    // Check if NFT exists and is available
    const nft = await this.nftRepository.findById(scheduleMintDto.nftId);
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }

    if (nft.status !== NftStatus.AVAILABLE) {
      throw new BadRequestException('NFT is not available for minting');
    }

    // Parse scheduled date if provided
    let scheduledFor: Date | undefined;
    let delay: number | undefined;

    if (scheduleMintDto.scheduledFor) {
      scheduledFor = new Date(scheduleMintDto.scheduledFor);

      // Validate the date is in the future
      const now = new Date();
      if (scheduledFor < now) {
        throw new BadRequestException('Scheduled date must be in the future');
      }

      // Calculate delay in milliseconds
      delay = scheduledFor.getTime() - now.getTime();
    }

    // Create the scheduled mint record
    const scheduledMint = await this.scheduledMintRepository.create({
      user: { id: userId } as any,
      nft: { id: nft.id } as any,
      price: nft.price,
      scheduledFor,
      metadata: scheduleMintDto.metadata || {},
    });

    // Add the job to the queue with the calculated delay
    await this.scheduledMintQueue.add(
      'process-scheduled-mint',
      {
        scheduledMintId: scheduledMint.id,
        userId,
        nftId: nft.id,
      },
      {
        delay,
        jobId: scheduledMint.id,
      },
    );

    this.logger.log(
      `Scheduled mint ${scheduledMint.id} for NFT ${nft.id} ${
        delay ? `with delay of ${delay}ms` : 'for immediate processing'
      }`,
    );

    return scheduledMint;
  }

  async getUserScheduledMints(userId: string): Promise<ScheduledMint[]> {
    return this.scheduledMintRepository.findByUserId(userId);
  }

  async getScheduledMintById(id: string): Promise<ScheduledMint> {
    const scheduledMint = await this.scheduledMintRepository.findById(id);
    if (!scheduledMint) {
      throw new NotFoundException('Scheduled mint not found');
    }
    return scheduledMint;
  }

  async cancelScheduledMint(
    userId: string,
    id: string,
  ): Promise<ScheduledMint> {
    const scheduledMint = await this.scheduledMintRepository.findById(id);

    if (!scheduledMint) {
      throw new NotFoundException('Scheduled mint not found');
    }

    if (scheduledMint.user.id !== userId) {
      throw new BadRequestException(
        'You can only cancel your own scheduled mints',
      );
    }

    if (scheduledMint.status !== ScheduledMintStatus.PENDING) {
      throw new BadRequestException(
        'Only pending scheduled mints can be cancelled',
      );
    }

    // Remove the job from the queue
    await this.scheduledMintQueue.remove(id);

    // Update the status in the database
    return this.scheduledMintRepository.updateStatus(
      id,
      ScheduledMintStatus.CANCELLED,
    );
  }
}
