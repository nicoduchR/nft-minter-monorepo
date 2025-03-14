import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Nft } from '../../domain/entities/nft.entity';
import { Transaction } from '../../domain/entities/transaction.entity';
import { ScheduledMint } from '../../domain/entities/scheduled-mint.entity';
import { NftService } from './nft.service';
import { NftController } from './nft.controller';
import { NftRepository } from '../../infrastructure/repositories/nft.repository';
import { TransactionRepository } from '../../infrastructure/repositories/transaction.repository';
import { ScheduledMintRepository } from '../../infrastructure/repositories/scheduled-mint.repository';
import { WalletModule } from '../wallet/wallet.module';
import { BlockchainModule } from '../blockchain/blockchain.module';
import { ScheduledMintService } from './scheduled-mint.service';
import { NftQueueModule } from './nft-queue.module';
import { ScheduledMintProcessor } from './scheduled-mint.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Nft, Transaction, ScheduledMint]),
    WalletModule,
    BlockchainModule,
    NftQueueModule,
  ],
  controllers: [NftController],
  providers: [
    NftService,
    ScheduledMintService,
    ScheduledMintProcessor,
    {
      provide: 'INftRepository',
      useClass: NftRepository,
    },
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
    {
      provide: 'IScheduledMintRepository',
      useClass: ScheduledMintRepository,
    },
  ],
  exports: [NftService],
})
export class NftModule {}
