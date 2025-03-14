import {
  Transaction,
  TransactionStatus,
  TransactionType,
} from '../entities/transaction.entity';

export interface ITransactionRepository {
  findById(id: string): Promise<Transaction | null>;
  findByTxHash(txHash: string): Promise<Transaction | null>;
  findByUserId(userId: string): Promise<Transaction[]>;
  findByUserIdAndType(
    userId: string,
    type: TransactionType,
  ): Promise<Transaction[]>;
  findByStatus(status: TransactionStatus): Promise<Transaction[]>;
  findPending(): Promise<Transaction[]>;
  create(transactionData: Partial<Transaction>): Promise<Transaction>;
  update(
    id: string,
    transactionData: Partial<Transaction>,
  ): Promise<Transaction>;
  updateStatus(id: string, status: TransactionStatus): Promise<Transaction>;
  save(transaction: Transaction): Promise<Transaction>;
}
