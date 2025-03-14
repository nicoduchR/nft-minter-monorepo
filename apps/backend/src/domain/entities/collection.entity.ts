import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Nft } from './nft.entity';

@Entity('collections')
export class Collection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  slug: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ nullable: true })
  bannerImageUrl: string;

  @Column({ nullable: true })
  owner: string;

  @Column({ nullable: true })
  safelistStatus: string;

  @Column({ nullable: true })
  category: string;

  @Column({ default: false })
  isDisabled: boolean;

  @Column({ default: false })
  isNsfw: boolean;

  @Column({ default: false })
  traitOffersEnabled: boolean;

  @Column({ default: false })
  collectionOffersEnabled: boolean;

  @Column({ nullable: true })
  openseaUrl: string;

  @Column({ nullable: true })
  projectUrl: string;

  @Column({ nullable: true })
  wikiUrl: string;

  @Column({ nullable: true })
  discordUrl: string;

  @Column({ nullable: true })
  telegramUrl: string;

  @Column({ nullable: true })
  twitterUsername: string;

  @Column({ nullable: true })
  instagramUsername: string;

  @Column({ type: 'jsonb', default: [] })
  contracts: { address: string }[];

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @OneToMany(() => Nft, (nft) => nft.collection)
  nfts: Nft[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
