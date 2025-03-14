import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wallet } from '../../domain/entities/wallet.entity';
import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';

@Injectable()
export class WalletRepository implements IWalletRepository {
  constructor(
    @InjectRepository(Wallet)
    private readonly walletRepository: Repository<Wallet>,
  ) {}

  async findById(id: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { user: { id: userId } },
    });
  }

  async findByAddress(address: string): Promise<Wallet | null> {
    return this.walletRepository.findOne({
      where: { address },
      relations: ['user'],
    });
  }

  async create(walletData: Partial<Wallet>): Promise<Wallet> {
    const wallet = this.walletRepository.create(walletData);
    return this.walletRepository.save(wallet);
  }

  async update(id: string, walletData: Partial<Wallet>): Promise<Wallet> {
    await this.walletRepository.update(id, walletData);
    return this.findById(id);
  }

  async updateBalance(id: string, amount: number): Promise<Wallet> {
    const wallet = await this.findById(id);
    wallet.balance = +wallet.balance + amount;
    return this.save(wallet);
  }

  async save(wallet: Wallet): Promise<Wallet> {
    return this.walletRepository.save(wallet);
  }
}
