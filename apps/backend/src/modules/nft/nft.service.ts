import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { INftRepository } from '../../domain/repositories/nft.repository.interface';
import { ITransactionRepository } from '../../domain/repositories/transaction.repository.interface';
import { NftStatus } from '../../domain/entities/nft.entity';
import {
  TransactionType,
  TransactionStatus,
} from '../../domain/entities/transaction.entity';
import { WalletService } from '../wallet/wallet.service';
import { MintNftDto } from './dto/mint-nft.dto';
import { TransferNftDto } from './dto/transfer-nft.dto';
import { NftService as BlockchainNftService } from '../blockchain/services/nft.service';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class NftService {
  constructor(
    @Inject('INftRepository')
    private readonly nftRepository: INftRepository,
    @Inject('ITransactionRepository')
    private readonly transactionRepository: ITransactionRepository,
    private readonly walletService: WalletService,
    private readonly configService: ConfigService,
    private readonly blockchainNftService: BlockchainNftService,
  ) {}

  async findAll(): Promise<any> {
    const nfts = await this.nftRepository.findAvailable();
    return nfts.map((nft) => ({
      id: nft.id,
      name: nft.name,
      description: nft.description,
      imageUrl: nft.imageUrl,
      price: nft.price,
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      status: nft.status,
      marketplace: nft.marketplace,
      mintDate: nft.mintDate,
      blockchain: nft.blockchain,
      collectionName: nft.collectionName,
    }));
  }

  async findByUser(userId: string): Promise<any> {
    const nfts = await this.nftRepository.findByUserId(userId);
    return nfts.map((nft) => ({
      id: nft.id,
      name: nft.name,
      description: nft.description,
      imageUrl: nft.imageUrl,
      price: nft.price,
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      status: nft.status,
      marketplace: nft.marketplace,
      mintDate: nft.mintDate,
      blockchain: nft.blockchain,
      collectionName: nft.collectionName,
    }));
  }

  async findById(id: string): Promise<any> {
    const nft = await this.nftRepository.findById(id);
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }

    return {
      id: nft.id,
      name: nft.name,
      description: nft.description,
      imageUrl: nft.imageUrl,
      price: nft.price,
      tokenId: nft.tokenId,
      contractAddress: nft.contractAddress,
      status: nft.status,
      marketplace: nft.marketplace,
      mintDate: nft.mintDate,
      blockchain: nft.blockchain,
      collectionName: nft.collectionName,
      owner: nft.owner
        ? {
            id: nft.owner.id,
            email: nft.owner.email,
          }
        : null,
    };
  }

  async mintNft(userId: string, mintNftDto: MintNftDto): Promise<any> {
    const nft = await this.nftRepository.findById(mintNftDto.nftId);
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }

    if (nft.status !== NftStatus.AVAILABLE) {
      throw new BadRequestException('NFT is not available for minting');
    }

    // Get user wallet and user entity
    const wallet = await this.walletService.getWallet(userId);
    const user = { id: userId, wallet: { address: wallet.address } } as User;

    console.log('wallet', wallet);
    // Check if user has enough balance
    if (wallet.balance < nft.price) {
      throw new BadRequestException('Insufficient balance');
    }

    // Create a pending transaction
    const transaction = await this.transactionRepository.create({
      type: TransactionType.MINT,
      status: TransactionStatus.PENDING,
      amount: nft.price,
      fromAddress: wallet.address,
      nftId: nft.id,
      user: { id: userId } as any,
      metadata: {
        nftName: nft.name,
        marketplace: nft.marketplace,
      },
    });

    try {
      // Prepare the mint options based on the NFT data
      const mintOptions = {
        contractAddress: nft.contractAddress,
        tokenId: nft.tokenId,
        recipient: wallet.address, // Set the recipient to the user's wallet address
        uri: nft.metadata?.uri || `ipfs://${nft.id}`, // Use the URI from metadata or create a default one
        price: nft.price.toString(),
      };

      // Get the collection ID - if not available, use a default
      const collectionId =
        nft.collection?.id || '00000000-0000-0000-0000-000000000000';

      // Perform the actual blockchain mint operation
      const mintedNft = await this.blockchainNftService.mint(
        mintOptions,
        user,
        collectionId,
      );

      // Update the NFT status and owner in our database
      const updatedNft = await this.nftRepository.updateOwner(nft.id, userId);
      await this.nftRepository.update(nft.id, {
        status: NftStatus.MINTED,
        tokenId: mintedNft.tokenId || nft.tokenId, // Use the token ID from the blockchain if available
        contractAddress: mintedNft.contractAddress,
        mintDate: new Date(),
      });

      // Update the transaction status
      const updatedTransaction = await this.transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.COMPLETED,
      );

      // Add the transaction hash if available
      if (mintedNft.metadata?.transactionHash) {
        await this.transactionRepository.update(transaction.id, {
          txHash: mintedNft.metadata.transactionHash,
        });
      }

      // Deduct the price from the user's balance
      await this.walletService.withdraw(userId, {
        amount: nft.price,
        toAddress: wallet.address, // Send it to the user's wallet address
        note: `Minting NFT: ${nft.name}`,
      });

      return {
        nft: {
          id: updatedNft.id,
          name: updatedNft.name,
          status: updatedNft.status,
          tokenId: mintedNft.tokenId || nft.tokenId,
          contractAddress: mintedNft.contractAddress,
        },
        transaction: {
          id: updatedTransaction.id,
          type: updatedTransaction.type,
          status: updatedTransaction.status,
          amount: updatedTransaction.amount,
          txHash: mintedNft.metadata?.transactionHash,
        },
      };
    } catch (error) {
      // Update the transaction status to failed
      await this.transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.FAILED,
      );

      throw new BadRequestException(`Minting failed: ${error.message}`);
    }
  }

  async transferNft(
    userId: string,
    transferNftDto: TransferNftDto,
  ): Promise<any> {
    const nft = await this.nftRepository.findById(transferNftDto.nftId);
    if (!nft) {
      throw new NotFoundException('NFT not found');
    }

    if (!nft.owner || nft.owner.id !== userId) {
      throw new BadRequestException('You do not own this NFT');
    }

    // Create a pending transaction
    const transaction = await this.transactionRepository.create({
      type: TransactionType.TRANSFER,
      status: TransactionStatus.PENDING,
      amount: 0, // No cost for transfer
      fromAddress: nft.owner.wallet?.address,
      toAddress: transferNftDto.toAddress,
      nftId: nft.id,
      user: { id: userId } as any,
      metadata: {
        nftName: nft.name,
        toAddress: transferNftDto.toAddress,
      },
    });

    try {
      // In a real application, you would interact with the blockchain to transfer the NFT
      // For this PoC, we'll just update the NFT status

      // Update the NFT status
      const updatedNft = await this.nftRepository.updateStatus(
        nft.id,
        NftStatus.SOLD,
      );

      // Update the transaction status
      const updatedTransaction = await this.transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.COMPLETED,
      );

      return {
        nft: {
          id: updatedNft.id,
          name: updatedNft.name,
          status: updatedNft.status,
        },
        transaction: {
          id: updatedTransaction.id,
          type: updatedTransaction.type,
          status: updatedTransaction.status,
        },
      };
    } catch (error) {
      // Update the transaction status to failed
      await this.transactionRepository.updateStatus(
        transaction.id,
        TransactionStatus.FAILED,
      );

      throw new BadRequestException(`Transfer failed: ${error.message}`);
    }
  }
}
