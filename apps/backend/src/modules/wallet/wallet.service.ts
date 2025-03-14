import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import * as CryptoJS from 'crypto-js';
import { IWalletRepository } from '../../domain/repositories/wallet.repository.interface';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import {
  TransactionType,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { AddExternalWalletDto } from './dto/add-external-wallet.dto';

@Injectable()
export class WalletService {
  private readonly encryptionKey: string;
  private readonly provider: ethers.JsonRpcProvider;

  constructor(
    @Inject('IWalletRepository')
    private readonly walletRepository: IWalletRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    private readonly configService: ConfigService,
  ) {
    this.encryptionKey = this.configService.get<string>(
      'ETH_PRIVATE_KEY_ENCRYPTION_KEY',
    );
    this.provider = new ethers.JsonRpcProvider(
      this.configService.get<string>('ETH_RPC_URL'),
    );
  }

  async createWallet(userId: string): Promise<any> {
    // Generate a new Ethereum wallet
    const wallet = ethers.Wallet.createRandom();

    // Encrypt the private key
    const encryptedPrivateKey = this.encryptPrivateKey(wallet.privateKey);

    // Save the wallet to the database
    const newWallet = await this.walletRepository.create({
      address: wallet.address,
      encryptedPrivateKey,
      user: { id: userId } as any,
      balance: 0,
      externalWallets: [],
    });

    return {
      id: newWallet.id,
      address: newWallet.address,
      balance: newWallet.balance,
    };
  }

  async getWallet(userId: string): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    return {
      id: wallet.id,
      address: wallet.address,
      balance: wallet.balance,
      externalWallets: wallet.externalWallets,
    };
  }

  async deposit(userId: string, depositDto: DepositDto): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // In a real application, you would verify the deposit transaction on the blockchain
    // For this PoC, we'll just update the balance directly

    const updatedWallet = await this.walletRepository.updateBalance(
      wallet.id,
      depositDto.amount,
    );

    // Create a transaction record
    const transaction = await this.transactionRepository.create({
      type: TransactionType.DEPOSIT,
      status: TransactionStatus.COMPLETED,
      amount: depositDto.amount,
      txHash: depositDto.txHash,
      fromAddress: depositDto.fromAddress,
      toAddress: wallet.address,
      user: { id: userId } as any,
      metadata: {
        note: depositDto.note,
      },
    });

    return {
      wallet: {
        id: updatedWallet.id,
        address: updatedWallet.address,
        balance: updatedWallet.balance,
      },
      transaction: {
        id: transaction.id,
        type: transaction.type,
        status: transaction.status,
        amount: transaction.amount,
        txHash: transaction.txHash,
      },
    };
  }

  async withdraw(userId: string, withdrawDto: WithdrawDto): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    if (wallet.balance < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create a pending transaction
    const transaction = await this.transactionRepository.create({
      type: TransactionType.WITHDRAWAL,
      status: TransactionStatus.PENDING,
      amount: withdrawDto.amount,
      fromAddress: wallet.address,
      toAddress: withdrawDto.toAddress,
      user: { id: userId } as any,
      metadata: {
        note: withdrawDto.note,
      },
    });

    // Decrypt the private key
    const privateKey = this.decryptPrivateKey(wallet.encryptedPrivateKey);

    try {
      // Create a wallet instance with the private key
      const ethWallet = new ethers.Wallet(privateKey, this.provider);

      // Perform the blockchain transaction
      const tx = await ethWallet.sendTransaction({
        to: withdrawDto.toAddress,
        value: ethers.parseEther(withdrawDto.amount.toString()),
      });
      
      // Wait for the transaction to be mined
      const receipt = await tx.wait();

      // Update the wallet balance
      const updatedWallet = await this.walletRepository.updateBalance(
        wallet.id,
        -withdrawDto.amount,
      );

      // Update the transaction status and add the transaction hash
      const updatedTransaction = await this.transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.COMPLETED,
      );
      
      await this.transactionRepository.update(transaction.id, {
        txHash: receipt.hash,
      });

      return {
        wallet: {
          id: updatedWallet.id,
          address: updatedWallet.address,
          balance: updatedWallet.balance,
        },
        transaction: {
          id: updatedTransaction.id,
          type: updatedTransaction.type,
          status: updatedTransaction.status,
          amount: updatedTransaction.amount,
          txHash: receipt.hash,
        },
      };
    } catch (error) {
      // Update the transaction status to failed
      const failedTransaction = await this.transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.FAILED,
      );

      throw new BadRequestException(`Withdrawal failed: ${error.message}`);
    }
  }

  async addExternalWallet(
    userId: string,
    externalWalletDto: AddExternalWalletDto,
  ): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }

    // Check if the external wallet already exists
    const existingWallet = wallet.externalWallets.find(
      (w) => w.address === externalWalletDto.address,
    );

    if (existingWallet) {
      throw new BadRequestException('External wallet already exists');
    }

    // Add the external wallet
    wallet.externalWallets.push({
      name: externalWalletDto.name,
      address: externalWalletDto.address,
    });

    // Save the updated wallet
    const updatedWallet = await this.walletRepository.save(wallet);

    return {
      id: updatedWallet.id,
      address: updatedWallet.address,
      balance: updatedWallet.balance,
      externalWallets: updatedWallet.externalWallets,
    };
  }

  async getTransactions(userId: string): Promise<any> {
    const transactions = await this.transactionRepository.findByUserId(userId);

    return transactions.map((transaction) => ({
      id: transaction.id,
      type: transaction.type,
      status: transaction.status,
      amount: transaction.amount,
      txHash: transaction.txHash,
      fromAddress: transaction.fromAddress,
      toAddress: transaction.toAddress,
      createdAt: transaction.createdAt,
    }));
  }

  /**
   * Get the wallet entity with full details including encrypted private key
   * @param userId User ID
   * @returns Full wallet entity
   */
  async getWalletEntity(userId: string): Promise<any> {
    const wallet = await this.walletRepository.findByUserId(userId);
    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  /**
   * Encrypt a private key using AES encryption
   * @param privateKey The private key to encrypt
   * @returns Encrypted private key
   */
  encryptPrivateKey(privateKey: string): string {
    return CryptoJS.AES.encrypt(privateKey, this.encryptionKey).toString();
  }

  /**
   * Decrypt an encrypted private key
   * @param encryptedPrivateKey The encrypted private key
   * @returns Decrypted private key
   */
  decryptPrivateKey(encryptedPrivateKey: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedPrivateKey, this.encryptionKey);
    return bytes.toString(CryptoJS.enc.Utf8);
  }
}
