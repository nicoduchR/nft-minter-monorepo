import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Nft, NftStatus } from '../../../domain/entities/nft.entity';
import { User } from '../../../domain/entities/user.entity';
import { Collection } from '../../../domain/entities/collection.entity';
import { EtherscanService } from './etherscan.service';
import { WalletService } from '../../wallet/wallet.service';
import { OpenAiService } from './openai.service';

interface MintOptions {
  contractAddress: string;
  tokenId?: string;
  recipient: string;
  uri: string;
  price?: string;
}

@Injectable()
export class NftService {
  private readonly logger = new Logger(NftService.name);
  private provider: ethers.JsonRpcProvider;

  constructor(
    private configService: ConfigService,
    private etherscanService: EtherscanService,
    private walletService: WalletService,
    private openAiService: OpenAiService,
    @InjectRepository(Nft)
    private nftRepository: Repository<Nft>,
    @InjectRepository(Collection)
    private collectionRepository: Repository<Collection>,
  ) {
    const ethRpcUrl = this.configService.get<string>('ETH_RPC_URL');
    if (!ethRpcUrl) {
      this.logger.warn('ETH_RPC_URL is not defined in environment variables');
    } else {
      this.provider = new ethers.JsonRpcProvider(ethRpcUrl);
    }
  }

  async mint(
    options: MintOptions,
    user: User,
    collectionId: string,
  ): Promise<Nft> {
    try {
      // Get the ABI from Etherscan
      const contractInfo = await this.etherscanService.getContractInfo(
        options.contractAddress,
      );
      if (!contractInfo || !contractInfo.abi) {
        throw new Error(
          `Failed to get ABI for contract ${options.contractAddress}`,
        );
      }

      // Get the user's wallet to retrieve private key
      const userWallet = await this.walletService.getWallet(user.id);
      if (!userWallet) {
        throw new Error(`User wallet not found for user ${user.id}`);
      }

      // Get the wallet entity directly to access the encrypted private key
      const walletEntity = await this.walletService.getWalletEntity(user.id);
      if (!walletEntity || !walletEntity.encryptedPrivateKey) {
        throw new Error(`Cannot access wallet private key for user ${user.id}`);
      }

      // Decrypt the private key from the user's wallet
      const privateKey = this.walletService.decryptPrivateKey(
        walletEntity.encryptedPrivateKey,
      );
      if (!privateKey) {
        throw new Error(
          `Failed to decrypt wallet private key for user ${user.id}`,
        );
      }

      // Create wallet instance with user's private key
      const wallet = new ethers.Wallet(privateKey, this.provider);

      // Create contract instance
      const contract = new ethers.Contract(
        options.contractAddress,
        contractInfo.abi,
        wallet,
      );

      // Find the appropriate mint function in the ABI
      const mintFunction = this.findMintFunction(contractInfo.abi);
      if (!mintFunction) {
        throw new Error(
          'Could not find a suitable mint function in the contract ABI',
        );
      }

      // Log the identified mint function
      this.logger.log(`Using mint function: ${mintFunction.name}`);

      // Prepare arguments based on the mint function
      const mintArgs = this.prepareMintArguments(mintFunction, options);

      // Execute the mint transaction
      // If function is payable, include ETH value
      const txOptions =
        mintFunction.stateMutability === 'payable'
          ? { value: ethers.parseEther('0.01') }
          : {};
      const tx = await contract[mintFunction.name](...mintArgs, txOptions);
      const receipt = await tx.wait();

      // Get transaction hash
      const transactionHash = receipt.hash;

      // Get token ID from logs if not provided
      const tokenId =
        options.tokenId || this.extractTokenIdFromReceipt(receipt);
      if (!tokenId) {
        throw new Error('Failed to extract token ID from transaction receipt');
      }

      // Get the collection
      const collection = await this.collectionRepository.findOneBy({
        id: collectionId,
      });
      if (!collection) {
        throw new Error(`Collection with ID ${collectionId} not found`);
      }

      // Create and save NFT record
      const nft = this.nftRepository.create({
        name: options.uri.split('/').pop() || 'Untitled NFT',
        tokenId,
        contractAddress: options.contractAddress,
        price: parseFloat(options.price || '0'),
        owner: user,
        collection,
        status: NftStatus.MINTED,
        mintDate: new Date(),
        blockchain: 'ethereum',
        metadata: {
          uri: options.uri,
          transactionHash,
        },
      });

      return this.nftRepository.save(nft);
    } catch (error) {
      this.logger.error(`Mint error: ${error.message}`);
      throw new Error(`Failed to mint NFT: ${error.message}`);
    }
  }

  private findMintFunction(abi: any[]): any {
    // Common mint function names and patterns
    const mintFunctionPatterns = [
      /^mint$/i,
      /^safeMint$/i,
      /^mintNFT$/i,
      /^createToken$/i,
      /^createCollectible$/i,
      /^mintToken$/i,
      /^purchase$/i,
    ];

    // Find functions that match our mint patterns and are potentially payable
    const candidates = abi.filter((item) => {
      if (item.type !== 'function') return false;

      // Check if function name matches any pattern
      const nameMatches = mintFunctionPatterns.some((pattern) =>
        pattern.test(item.name),
      );

      if (!nameMatches) return false;

      // Check if the function has recipient/URI parameters or is payable
      const hasRecipientParam = item.inputs?.some(
        (input) =>
          /address|recipient|to/i.test(input.name) && input.type === 'address',
      );

      const hasUriParam = item.inputs?.some(
        (input) =>
          /uri|url|tokenURI|metadata/i.test(input.name) &&
          /string/i.test(input.type),
      );

      const isPayable = item.stateMutability === 'payable';

      return hasRecipientParam || hasUriParam || isPayable;
    });

    // Prioritize payable functions
    const payableFunctions = candidates.filter(
      (func) => func.stateMutability === 'payable',
    );

    // Return a payable function if available, otherwise return the first candidate
    return payableFunctions.length > 0 ? payableFunctions[0] : candidates[0];
  }

  private prepareMintArguments(mintFunction: any, options: MintOptions): any[] {
    const args: any[] = [];

    mintFunction.inputs.forEach((input) => {
      if (
        /address|recipient|to/i.test(input.name) &&
        input.type === 'address'
      ) {
        args.push(options.recipient);
      } else if (
        /uri|url|tokenURI|metadata/i.test(input.name) &&
        /string/i.test(input.type)
      ) {
        args.push(options.uri);
      } else if (
        /tokenId|token[_-]?id/i.test(input.name) &&
        /uint/i.test(input.type)
      ) {
        args.push(options.tokenId || '0');
      } else if (
        /price|value|amount/i.test(input.name) &&
        /uint/i.test(input.type)
      ) {
        args.push(options.price || '0');
      } else if (
        /qty|quantity|amount/i.test(input.name) &&
        /uint/i.test(input.type)
      ) {
        args.push('1'); // Default to minting 1 token
      } else {
        // Default values for unknown parameters
        switch (input.type) {
          case 'address':
            args.push(options.recipient);
            break;
          case 'string':
            args.push('');
            break;
          case 'bool':
            args.push(false);
            break;
          default:
            if (input.type.startsWith('uint')) {
              args.push('0');
            } else {
              args.push(null);
            }
        }
      }
    });

    return args;
  }

  private extractTokenIdFromReceipt(
    receipt: ethers.TransactionReceipt,
  ): string | null {
    // Common ERC721/ERC1155 Transfer event signatures
    const transferEventSignatures = [
      // ERC721: Transfer(address,address,uint256)
      ethers.id('Transfer(address,address,uint256)'),
      // ERC1155: TransferSingle(address,address,address,uint256,uint256)
      ethers.id('TransferSingle(address,address,address,uint256,uint256)'),
    ];

    // Look for Transfer or TransferSingle events in logs
    for (const log of receipt.logs) {
      if (transferEventSignatures.includes(log.topics[0])) {
        // ERC721 Transfer event
        if (log.topics.length === 4) {
          // TokenId is in topics[3]
          return ethers.toBigInt(log.topics[3]).toString();
        }
        // ERC1155 TransferSingle event
        else if (log.data) {
          // TokenId is in data
          const decodedData = ethers.AbiCoder.defaultAbiCoder().decode(
            ['uint256', 'uint256'],
            log.data,
          );
          return decodedData[0].toString();
        }
      }
    }

    return null;
  }
}
