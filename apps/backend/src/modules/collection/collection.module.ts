import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Collection } from '../../domain/entities/collection.entity';
import { CollectionService } from './collection.service';
import { CollectionController } from './collection.controller';
import { CollectionRepository } from '../../infrastructure/repositories/collection.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Collection])],
  controllers: [CollectionController],
  providers: [
    CollectionService,
    {
      provide: 'ICollectionRepository',
      useClass: CollectionRepository,
    },
  ],
  exports: [CollectionService],
})
export class CollectionModule {}
