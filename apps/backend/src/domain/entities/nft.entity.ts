import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';
import { Collection } from './collection.entity';

export enum NftStatus {
  AVAILABLE = 'available',
  MINTED = 'minted',
  OWNED = 'owned',
  SOLD = 'sold',
}

export enum Marketplace {
  OPENSEA = 'opensea',
  MAGIC_EDEN = 'magic_eden',
  BLUR = 'blur',
}

@Entity('nfts')
export class Nft {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 18, scale: 8 })
  price: number;

  @Column()
  tokenId: string;

  @Column({ nullable: true })
  contractAddress: string;

  @Column({
    type: 'enum',
    enum: NftStatus,
    default: NftStatus.AVAILABLE,
  })
  status: NftStatus;

  @Column({
    type: 'enum',
    enum: Marketplace,
  })
  marketplace: Marketplace;

  @Column({ nullable: true })
  mintDate: Date;

  @Column({ nullable: true })
  blockchain: string;

  @Column({ nullable: true })
  collectionName: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @ManyToOne(() => User, (user) => user.nfts, { nullable: true })
  owner: User;

  @ManyToOne(() => Collection, (collection) => collection.nfts, {
    nullable: true,
  })
  collection: Collection;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
