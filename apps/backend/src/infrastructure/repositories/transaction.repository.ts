import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../../domain/entities/transaction.entity';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepository: Repository<Transaction>,
  ) {}

  async findById(id: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  async findByTxHash(txHash: string): Promise<Transaction | null> {
    return this.transactionRepository.findOne({
      where: { txHash },
      relations: ['user'],
    });
  }

  async findByUserId(userId: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
    });
  }

  async findByUserIdAndType(
    userId: string,
    type: TransactionType,
  ): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { user: { id: userId }, type },
      order: { createdAt: 'DESC' },
    });
  }

  async findByStatus(status: TransactionStatus): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { status },
      relations: ['user'],
    });
  }

  async findPending(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { status: TransactionStatus.PENDING },
      relations: ['user'],
    });
  }

  async create(transactionData: Partial<Transaction>): Promise<Transaction> {
    const transaction = this.transactionRepository.create(transactionData);
    return this.transactionRepository.save(transaction);
  }

  async update(
    id: string,
    transactionData: Partial<Transaction>,
  ): Promise<Transaction> {
    await this.transactionRepository.update(id, transactionData);
    return this.findById(id);
  }

  async updateStatus(
    id: string,
    status: TransactionStatus,
  ): Promise<Transaction> {
    await this.transactionRepository.update(id, { status });
    return this.findById(id);
  }

  async save(transaction: Transaction): Promise<Transaction> {
    return this.transactionRepository.save(transaction);
  }
}
