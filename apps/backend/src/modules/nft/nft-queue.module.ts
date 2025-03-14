import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueModule } from '../queue/queue.module';

export const SCHEDULED_MINT_QUEUE = 'scheduled-mint-queue';

@Module({
  imports: [
    QueueModule,
    BullModule.registerQueue({
      name: SCHEDULED_MINT_QUEUE,
    }),
  ],
  exports: [BullModule],
})
export class NftQueueModule {}
