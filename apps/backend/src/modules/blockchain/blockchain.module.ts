import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EtherscanService } from './services/etherscan.service';
import { NftService } from './services/nft.service';
import { OpenAiService } from './services/openai.service';
import { Nft } from '../../domain/entities/nft.entity';
import { Collection } from '../../domain/entities/collection.entity';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([Nft, Collection]),
    WalletModule,
  ],
  providers: [EtherscanService, NftService, OpenAiService],
  exports: [EtherscanService, NftService, OpenAiService],
})
export class BlockchainModule {}
