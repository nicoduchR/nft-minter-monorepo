import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { NftModule } from './modules/nft/nft.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { ScraperModule } from './modules/scraper/scraper.module';
import { DatabaseModule } from './infrastructure/database/database.module';
import { CollectionModule } from './modules/collection/collection.module';
import { QueueModule } from './modules/queue/queue.module';

@Module({
  imports: [
    // Load environment variables
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // Enable scheduled tasks
    ScheduleModule.forRoot(),
    // Core modules
    DatabaseModule,
    QueueModule,
    AuthModule,
    UserModule,
    NftModule,
    WalletModule,
    ScraperModule,
    CollectionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
