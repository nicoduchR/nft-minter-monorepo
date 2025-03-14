import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';
import { Collection } from '../../domain/entities/collection.entity';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionWithNftImageDto } from './dto/collection-with-nft-image.dto';

@Injectable()
export class CollectionService {
  constructor(
    @Inject('ICollectionRepository')
    private readonly collectionRepository: ICollectionRepository,
  ) {}

  async findAll(): Promise<Collection[]> {
    return this.collectionRepository.findAll();
  }

  async findAllWithNftImage(): Promise<CollectionWithNftImageDto[]> {
    return this.collectionRepository.findAllWithNftImage();
  }

  async findById(id: string): Promise<Collection> {
    const collection = await this.collectionRepository.findById(id);
    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }
    return collection;
  }

  async findBySlug(slug: string): Promise<Collection> {
    const collection = await this.collectionRepository.findBySlug(slug);
    if (!collection) {
      throw new NotFoundException(`Collection with slug ${slug} not found`);
    }
    return collection;
  }

  async findByOwner(owner: string): Promise<Collection[]> {
    return this.collectionRepository.findByOwner(owner);
  }

  async findWithNfts(id: string): Promise<Collection> {
    const collection = await this.collectionRepository.findWithNfts(id);
    if (!collection) {
      throw new NotFoundException(`Collection with ID ${id} not found`);
    }
    return collection;
  }

  async create(createCollectionDto: CreateCollectionDto): Promise<Collection> {
    // Check if slug is already used
    const existingCollection = await this.collectionRepository.findBySlug(
      createCollectionDto.slug,
    );
    if (existingCollection) {
      throw new ConflictException(
        `Collection with slug ${createCollectionDto.slug} already exists`,
      );
    }

    return this.collectionRepository.create(createCollectionDto);
  }

  async update(
    id: string,
    updateCollectionDto: UpdateCollectionDto,
  ): Promise<Collection> {
    const collection = await this.findById(id);

    // If slug is being updated, check if it's already used
    if (
      updateCollectionDto.slug &&
      updateCollectionDto.slug !== collection.slug
    ) {
      const existingCollection = await this.collectionRepository.findBySlug(
        updateCollectionDto.slug,
      );
      if (existingCollection && existingCollection.id !== id) {
        throw new ConflictException(
          `Collection with slug ${updateCollectionDto.slug} already exists`,
        );
      }
    }

    return this.collectionRepository.update(id, updateCollectionDto);
  }

  async delete(id: string): Promise<void> {
    const collection = await this.findById(id);
    return this.collectionRepository.delete(id);
  }
}
