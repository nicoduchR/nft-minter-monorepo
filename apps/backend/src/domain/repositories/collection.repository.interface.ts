import { Collection } from '../entities/collection.entity';

export interface ICollectionRepository {
  findById(id: string): Promise<Collection | null>;
  findBySlug(slug: string): Promise<Collection | null>;
  findAll(): Promise<Collection[]>;
  findByOwner(owner: string): Promise<Collection[]>;
  findWithNfts(id: string): Promise<Collection | null>;
  create(collectionData: Partial<Collection>): Promise<Collection>;
  update(id: string, collectionData: Partial<Collection>): Promise<Collection>;
  save(collection: Collection): Promise<Collection>;
  delete(id: string): Promise<void>;
}
