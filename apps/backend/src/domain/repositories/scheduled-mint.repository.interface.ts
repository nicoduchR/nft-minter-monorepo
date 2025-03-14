import {
  ScheduledMint,
  ScheduledMintStatus,
} from '../entities/scheduled-mint.entity';

export interface IScheduledMintRepository {
  findById(id: string): Promise<ScheduledMint | null>;
  findByUserId(userId: string): Promise<ScheduledMint[]>;
  findByNftId(nftId: string): Promise<ScheduledMint[]>;
  findByStatus(status: ScheduledMintStatus): Promise<ScheduledMint[]>;
  findPendingAndReady(): Promise<ScheduledMint[]>;
  create(data: Partial<ScheduledMint>): Promise<ScheduledMint>;
  update(id: string, data: Partial<ScheduledMint>): Promise<ScheduledMint>;
  updateStatus(
    id: string,
    status: ScheduledMintStatus,
    reason?: string,
  ): Promise<ScheduledMint>;
  save(scheduledMint: ScheduledMint): Promise<ScheduledMint>;
  delete(id: string): Promise<void>;
}
