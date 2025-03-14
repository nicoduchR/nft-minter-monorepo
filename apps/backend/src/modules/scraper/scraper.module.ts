import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftDrop } from '../../domain/entities/nft-drop.entity';
import { Nft } from '../../domain/entities/nft.entity';
import { Collection } from '../../domain/entities/collection.entity';
import { ScraperService } from './scraper.service';
import { ScraperController } from './scraper.controller';
import { NftDropRepository } from '../../infrastructure/repositories/nft-drop.repository';
import { NftRepository } from '../../infrastructure/repositories/nft.repository';
import { OpenseaService } from './services/opensea.service';
import { MagicEdenService } from './services/magic-eden.service';
import { BlurService } from './services/blur.service';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([NftDrop, Nft, Collection]),
    ScheduleModule.forRoot(),
  ],
  controllers: [ScraperController],
  providers: [
    ScraperService,
    OpenseaService,
    MagicEdenService,
    BlurService,
    {
      provide: 'INftDropRepository',
      useClass: NftDropRepository,
    },
    {
      provide: 'INftRepository',
      useClass: NftRepository,
    },
  ],
  exports: [ScraperService, OpenseaService],
})
export class ScraperModule {}
