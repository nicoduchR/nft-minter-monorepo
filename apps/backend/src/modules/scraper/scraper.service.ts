import { Injectable, Inject } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { INftDropRepository } from '../../domain/repositories/nft-drop.repository.interface';
import { INftRepository } from '../../domain/repositories/nft.repository.interface';
import { Marketplace, NftStatus } from '../../domain/entities/nft.entity';
import { OpenseaService } from './services/opensea.service';
import { MagicEdenService } from './services/magic-eden.service';
import { BlurService } from './services/blur.service';

@Injectable()
export class ScraperService {
  constructor(
    @Inject('INftDropRepository')
    private readonly nftDropRepository: INftDropRepository,
    @Inject('INftRepository')
    private readonly nftRepository: INftRepository,
    private readonly openseaService: OpenseaService,
    private readonly magicEdenService: MagicEdenService,
    private readonly blurService: BlurService,
  ) {}

  // Run every 6 hours
  @Cron('0 */6 * * *')
  async scrapeMarketplaces() {
    console.log('Scraping marketplaces for NFT drops...');

    try {
      // Scrape OpenSea
      const openseaDrops = await this.openseaService.scrapeUpcomingDrops();
      await this.saveNftDrops(openseaDrops, Marketplace.OPENSEA);

      // // Scrape Magic Eden
      // const magicEdenDrops = await this.magicEdenService.scrapeUpcomingDrops();
      // await this.saveNftDrops(magicEdenDrops, Marketplace.MAGIC_EDEN);

      // // Scrape Rarible
      // const raribleDrops = await this.raribleService.scrapeUpcomingDrops();
      // await this.saveNftDrops(raribleDrops, Marketplace.RARIBLE);

      console.log('Scraping completed successfully');
    } catch (error) {
      console.error('Error scraping marketplaces:', error);
    }
  }

  // Run every day at midnight
  @Cron('0 0 * * *')
  async scrapeAvailableNfts() {
    console.log('Scraping marketplaces for available NFTs...');

    try {
      // Scrape OpenSea with a callback that saves NFTs for each collection
      await this.openseaService.scrapeAvailableNfts(
        async (nfts, collectionName) => {
          console.log(
            `Saving ${nfts.length} NFTs for collection: ${collectionName}`,
          );
          await this.saveNfts(nfts, Marketplace.OPENSEA);
        },
      );

      console.log('Scraping completed successfully');
    } catch (error) {
      console.error('Error scraping marketplaces:', error);
    }
  }

  async getUpcomingDrops() {
    return this.nftDropRepository.findUpcoming();
  }

  async getDropsByMarketplace(marketplace: Marketplace) {
    return this.nftDropRepository.findByMarketplace(marketplace);
  }

  async getAvailableNfts() {
    return this.nftRepository.findAvailable();
  }

  async getCollection(slug: string, marketplace: Marketplace): Promise<any> {
    switch (marketplace) {
      case Marketplace.OPENSEA:
        return this.openseaService.getCollection(slug, true);
      default:
        throw new Error(`Marketplace ${marketplace} not supported`);
    }
  }

  async scrapeAvailableNftsForCollection(
    slug: string,
    marketplace: Marketplace,
  ): Promise<any> {
    switch (marketplace) {
      case Marketplace.OPENSEA:
        return this.openseaService.scrapeAvailableNftsForCollection(slug);
      default:
        throw new Error(`Marketplace ${marketplace} not supported`);
    }
  }

  // Public method to save collection NFTs to the database
  async saveCollectionNfts(nfts: any[], marketplace: Marketplace) {
    return this.saveNfts(nfts, marketplace);
  }

  private async saveNftDrops(drops: any[], marketplace: Marketplace) {
    for (const drop of drops) {
      // Check if the drop already exists
      const existingDrop = await this.nftDropRepository.findById(drop.id);

      if (existingDrop) {
        // Update the existing drop
        await this.nftDropRepository.update(existingDrop.id, {
          ...drop,
          marketplace,
        });
      } else {
        // Create a new drop
        await this.nftDropRepository.create({
          ...drop,
          marketplace,
        });
      }
    }
  }

  private async saveNfts(nfts: any[], marketplace: Marketplace) {
    for (const nft of nfts) {
      // Check if the NFT already exists
      const existingNft = await this.nftRepository.findByTokenId(
        nft.tokenId,
        nft.contractAddress,
      );

      if (existingNft) {
        // Update the existing NFT
        await this.nftRepository.update(existingNft.id, {
          ...nft,
          marketplace,
          status: NftStatus.AVAILABLE,
        });
      } else {
        // Create a new NFT
        await this.nftRepository.create({
          ...nft,
          marketplace,
          status: NftStatus.AVAILABLE,
        });
      }
    }
  }
}
