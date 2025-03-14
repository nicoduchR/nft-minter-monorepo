import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Wallet } from '../../domain/entities/wallet.entity';
import { Transaction } from '../../domain/entities/transaction.entity';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletRepository } from '../../infrastructure/repositories/wallet.repository';
import { TransactionRepository } from '../../infrastructure/repositories/transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Wallet, Transaction])],
  controllers: [WalletController],
  providers: [
    WalletService,
    {
      provide: 'IWalletRepository',
      useClass: WalletRepository,
    },
    {
      provide: 'ITransactionRepository',
      useClass: TransactionRepository,
    },
  ],
  exports: [WalletService],
})
export class WalletModule {}
