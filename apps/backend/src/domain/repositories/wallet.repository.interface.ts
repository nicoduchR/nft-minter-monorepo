import { Wallet } from '../entities/wallet.entity';

export interface IWalletRepository {
  findById(id: string): Promise<Wallet | null>;
  findByUserId(userId: string): Promise<Wallet | null>;
  findByAddress(address: string): Promise<Wallet | null>;
  create(walletData: Partial<Wallet>): Promise<Wallet>;
  update(id: string, walletData: Partial<Wallet>): Promise<Wallet>;
  updateBalance(id: string, amount: number): Promise<Wallet>;
  save(wallet: Wallet): Promise<Wallet>;
}
