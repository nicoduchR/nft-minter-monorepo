import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Marketplace } from './nft.entity';

@Entity('nft_drops')
export class NftDrop {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  imageUrl: string;

  @Column({ type: 'decimal', precision: 18, scale: 8, nullable: true })
  price: number;

  @Column({ nullable: true })
  supply: number;

  @Column({
    type: 'enum',
    enum: Marketplace,
  })
  marketplace: Marketplace;

  @Column()
  mintDate: Date;

  @Column({ nullable: true })
  endDate: Date;

  @Column({ nullable: true })
  blockchain: string;

  @Column({ nullable: true })
  collectionName: string;

  @Column({ nullable: true })
  projectUrl: string;

  @Column({ type: 'jsonb', default: {} })
  metadata: Record<string, any>;

  @Column({ default: false })
  isNotified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
