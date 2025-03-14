import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Collection } from '../../domain/entities/collection.entity';
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';
import { CollectionWithNftImageDto } from '../../modules/collection/dto/collection-with-nft-image.dto';

@Injectable()
export class CollectionRepository implements ICollectionRepository {
  constructor(
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
  ) {}

  async findById(id: string): Promise<Collection | null> {
    return this.collectionRepository.findOne({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Collection | null> {
    return this.collectionRepository.findOne({
      where: { slug },
    });
  }

  async findAll(): Promise<Collection[]> {
    return this.collectionRepository.find();
  }

  async findAllWithNftImage(): Promise<CollectionWithNftImageDto[]> {
    const collections = await this.collectionRepository.find({
      relations: ['nfts'],
    });
    
    return collections.map(collection => {
      const dto = new CollectionWithNftImageDto();
      Object.assign(dto, collection);
      
      // Find the first NFT with an image URL, if any
      const nftWithImage = collection.nfts?.find(nft => nft.imageUrl);
      if (nftWithImage) {
        dto.representativeNftImageUrl = nftWithImage.imageUrl;
      }
      
      // Remove the nfts array to avoid sending all NFTs in the response
      delete dto.nfts;
      
      return dto;
    });
  }

  async findByOwner(owner: string): Promise<Collection[]> {
    return this.collectionRepository.find({
      where: { owner },
    });
  }

  async findWithNfts(id: string): Promise<Collection | null> {
    return this.collectionRepository.findOne({
      where: { id },
      relations: ['nfts'],
    });
  }

  async create(collectionData: Partial<Collection>): Promise<Collection> {
    const collection = this.collectionRepository.create(collectionData);
    return this.collectionRepository.save(collection);
  }

  async update(
    id: string,
    collectionData: Partial<Collection>,
  ): Promise<Collection> {
    await this.collectionRepository.update(id, collectionData);
    return this.findById(id);
  }

  async save(collection: Collection): Promise<Collection> {
    return this.collectionRepository.save(collection);
  }

  async delete(id: string): Promise<void> {
    await this.collectionRepository.delete(id);
  }
}
