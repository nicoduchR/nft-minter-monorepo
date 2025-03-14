import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NftService } from './nft.service';
import { SCHEDULED_MINT_QUEUE } from './nft-queue.module';
import { ScheduledMintStatus } from '../../domain/entities/scheduled-mint.entity';
import { IScheduledMintRepository } from '../../domain/repositories/scheduled-mint.repository.interface';
import { Inject } from '@nestjs/common';

interface ScheduledMintJobData {
  scheduledMintId: string;
  userId: string;
  nftId: string;
}

@Processor(SCHEDULED_MINT_QUEUE)
export class ScheduledMintProcessor extends WorkerHost {
  private readonly logger = new Logger(ScheduledMintProcessor.name);

  constructor(
    private readonly nftService: NftService,
    @Inject('IScheduledMintRepository')
    private readonly scheduledMintRepository: IScheduledMintRepository,
  ) {
    super();
  }

  async process(job: Job<ScheduledMintJobData>): Promise<any> {
    const { scheduledMintId, userId, nftId } = job.data;
    this.logger.log(
      `Processing scheduled mint ${scheduledMintId} for NFT ${nftId}`,
    );

    try {
      // Attempt to mint the NFT
      const result = await this.nftService.mintNft(userId, { nftId });

      // Update the scheduled mint record with successful result
      await this.scheduledMintRepository.updateStatus(
        scheduledMintId,
        ScheduledMintStatus.COMPLETED,
      );

      // Add transaction hash if available
      if (result.transaction?.txHash) {
        await this.scheduledMintRepository.update(scheduledMintId, {
          txHash: result.transaction.txHash,
        });
      }

      this.logger.log(
        `Successfully processed scheduled mint ${scheduledMintId} for NFT ${nftId}`,
      );

      return result;
    } catch (error) {
      this.logger.error(
        `Failed to process scheduled mint ${scheduledMintId}: ${error.message}`,
      );

      // Update the scheduled mint status to failed
      await this.scheduledMintRepository.updateStatus(
        scheduledMintId,
        ScheduledMintStatus.FAILED,
        error.message,
      );

      throw error;
    }
  }
}
