import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Collection } from '../../../domain/entities/collection.entity';
import { Nft } from 'src/domain/entities/nft.entity';

// Define interfaces for the API responses
interface OpenSeaCollection {
  collection: string;
  name: string;
  description: string;
  image_url: string;
  banner_image_url: string;
  owner: string;
  safelist_status: any;
  category: string;
  is_disabled: boolean;
  is_nsfw: boolean;
  trait_offers_enabled: boolean;
  collection_offers_enabled: boolean;
  opensea_url: string;
  project_url: string;
  wiki_url: string;
  discord_url: string;
  telegram_url: string;
  twitter_username: string;
  instagram_username: string;
  contracts: { address: string }[];
}

interface OpenSeaCollectionsResponse {
  collections: OpenSeaCollection[];
  next: string;
}

interface OpenSeaNft {
  identifier: string;
  collection: string;
  contract: string;
  token_standard: string;
  name: string;
  description: string;
  image_url: string;
  display_image_url: string;
  display_animation_url: string;
  metadata_url: string;
  opensea_url: string;
  updated_at: string;
  is_disabled: boolean;
  is_nsfw: boolean;
}

interface OpenSeaNftsResponse {
  nfts: OpenSeaNft[];
  next: string;
}

@Injectable()
export class OpenseaService {
  private readonly apiKey: string;
  private readonly baseUrl: string = 'https://api.opensea.io/api/v2';
  private readonly logger = new Logger(OpenseaService.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectRepository(Collection)
    private readonly collectionRepository: Repository<Collection>,
    @InjectRepository(Nft)
    private readonly nftRepository: Repository<Nft>,
  ) {
    this.apiKey = this.configService.get<string>('OPENSEA_API_KEY');
  }

  /**
   * Fetches collections from the OpenSea API and saves them to the database
   * @param limit Optional limit parameter (default: 50)
   * @param next Optional cursor for pagination
   * @param save Whether to save collections to database (default: false)
   * @returns Promise with the collections response
   */
  async getCollections(
    limit?: number,
    next?: string,
    save = false,
  ): Promise<OpenSeaCollectionsResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/collections`, {
        headers: {
          'X-API-KEY': this.apiKey,
          Accept: 'application/json',
        },
        params: {
          limit,
          next,
        },
      });

      if (save) {
        await this.saveCollectionsToDatabase(response.data.collections);
      }

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching OpenSea collections:', error.message);
      throw error;
    }
  }

  /**
   * Fetches collections from the OpenSea API and saves them to the database
   * @param slug The slug of the collection
   * @param limit Optional limit parameter (default: 50)
   * @param next Optional cursor for pagination
   * @param save Whether to save collections to database (default: false)
   * @returns Promise with the collections response
   */
  async getCollection(
    slug: string,
    save = false,
  ): Promise<OpenSeaCollectionsResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/collections/${slug}`, {
        headers: {
          'X-API-KEY': this.apiKey,
          Accept: 'application/json',
        },
      });

      if (save) {
        await this.saveCollectionsToDatabase([response.data]);
      }

      return response.data;
    } catch (error) {
      this.logger.error('Error fetching OpenSea collections:', error.message);
      throw error;
    }
  }

  /**
   * Saves OpenSea collections to the database
   * @param collections Array of OpenSea collections
   */
  async saveCollectionsToDatabase(
    collections: OpenSeaCollection[],
  ): Promise<void> {
    try {
      this.logger.log(`Saving ${collections.length} collections to database`);

      for (const openseaCollection of collections) {
        // Check if collection already exists by slug
        const existingCollection = await this.collectionRepository.findOne({
          where: { slug: openseaCollection.collection },
        });

        if (existingCollection) {
          // Update existing collection
          await this.collectionRepository.update(
            { id: existingCollection.id },
            this.mapOpenSeaCollectionToEntity(openseaCollection),
          );
        } else {
          // Create new collection
          const collection = this.collectionRepository.create(
            this.mapOpenSeaCollectionToEntity(openseaCollection),
          );
          await this.collectionRepository.save(collection);
        }
      }

      this.logger.log('Collections saved successfully');
    } catch (error) {
      this.logger.error('Error saving collections to database:', error.message);
      throw error;
    }
  }

  /**
   * Maps an OpenSea collection to our Collection entity
   * @param openseaCollection The OpenSea collection
   * @returns Collection entity object
   */
  private mapOpenSeaCollectionToEntity(
    openseaCollection: OpenSeaCollection,
  ): Partial<Collection> {
    return {
      slug: openseaCollection.collection,
      name: openseaCollection.name,
      description: openseaCollection.description,
      imageUrl: openseaCollection.image_url,
      bannerImageUrl: openseaCollection.banner_image_url,
      owner: openseaCollection.owner,
      safelistStatus: openseaCollection.safelist_status,
      category: openseaCollection.category,
      isDisabled: openseaCollection.is_disabled,
      isNsfw: openseaCollection.is_nsfw,
      traitOffersEnabled: openseaCollection.trait_offers_enabled,
      collectionOffersEnabled: openseaCollection.collection_offers_enabled,
      openseaUrl: openseaCollection.opensea_url,
      projectUrl: openseaCollection.project_url,
      wikiUrl: openseaCollection.wiki_url,
      discordUrl: openseaCollection.discord_url,
      telegramUrl: openseaCollection.telegram_url,
      twitterUsername: openseaCollection.twitter_username,
      instagramUsername: openseaCollection.instagram_username,
      contracts: openseaCollection.contracts || [],
      metadata: {
        // Add any additional metadata here
      },
    };
  }

  /**
   * Fetches NFTs for a specific collection from the OpenSea API
   * @param collectionSlug The collection slug identifier
   * @param limit Optional limit parameter (default: 50)
   * @param next Optional cursor for pagination
   * @returns Promise with the NFTs response
   */
  async getNftsFromCollection(
    collectionSlug: string,
    limit = 50,
    next?: string,
  ): Promise<OpenSeaNftsResponse> {
    try {
      const response = await axios.get(
        `${this.baseUrl}/collection/${collectionSlug}/nfts`,
        {
          headers: {
            'X-API-KEY': this.apiKey,
            Accept: 'application/json',
          },
          params: {
            limit,
            next,
          },
        },
      );

      return response.data;
    } catch (error) {
      console.error(
        `Error fetching NFTs for collection ${collectionSlug}:`,
        error,
      );
      throw error;
    }
  }

  async scrapeUpcomingDrops(): Promise<any[]> {
    try {
      // Fetch collections from OpenSea
      const collectionsResponse = await this.getCollections();

      // Transform the data to match the expected format
      return collectionsResponse.collections.map((collection) => ({
        name: collection.name,
        description: collection.description,
        imageUrl: collection.image_url,
        // Set default price instead of null
        price: 0.0,
        supply: 0, // Default supply
        // Use current time plus 7 days as a placeholder for mint date
        mintDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        blockchain: collection.contracts?.length > 0 ? 'Ethereum' : 'Unknown',
        collectionName: collection.name,
        projectUrl: collection.project_url || collection.opensea_url,
        metadata: {
          // Extract any relevant metadata
          traits: [],
          creator: collection.owner,
          discord: collection.discord_url,
          twitter: collection.twitter_username,
          instagram: collection.instagram_username,
        },
      }));
    } catch (error) {
      console.error('Error scraping OpenSea drops:', error);
      return [];
    }
  }

  async scrapeAvailableNfts(
    saveCollectionCallback?: (
      nfts: any[],
      collectionName: string,
    ) => Promise<void>,
  ): Promise<any[]> {
    try {
      // Get all collections (using pagination if needed)
      let allNfts: any[] = [];
      let next: string | undefined = undefined;
      let collectionsProcessed = 0;
      let collectionsSkipped = 0;

      // Fetch collections with pagination
      do {
        const collectionsResponse = await this.getCollections(
          undefined,
          next,
          true,
        );
        next = collectionsResponse.next;

        // Process each collection to get its NFTs
        for (const collection of collectionsResponse.collections) {
          try {
            // Check if the collection already exists in the database and has NFTs
            const existingCollection = await this.collectionRepository.findOne({
              where: { slug: collection.collection },
              relations: ['nfts'],
            });

            if (
              existingCollection &&
              existingCollection.nfts &&
              existingCollection.nfts.length > 0
            ) {
              console.log(
                `Skipping collection ${collection.name} as it already exists with ${existingCollection.nfts.length} NFTs`,
              );
              collectionsSkipped++;
              collectionsProcessed++;
              continue; // Skip to the next collection
            }

            console.log(
              `Fetching NFTs for collection: ${collection.name} (${collection.collection})`,
            );
            const nftsResponse = await this.getNftsFromCollection(
              collection.collection,
            );

            // Transform and add NFTs from this collection to our result array
            // Filter out NFTs with null or empty names
            const collectionNfts = nftsResponse.nfts
              .filter(
                (nft) =>
                  nft.name !== null &&
                  nft.name !== undefined &&
                  nft.name.trim() !== '',
              )
              .map((nft) => ({
                name: nft.name,
                description: nft.description || '', // Provide a default empty string for description
                imageUrl: nft.image_url || nft.display_image_url || '', // Provide a default for image URL
                price: 0.0, // Set a default price of 0.0 to avoid database constraint violations
                tokenId: nft.identifier || '0',
                contractAddress: nft.contract || '',
                blockchain: 'Ethereum', // Assuming Ethereum for now
                collectionName: nft.collection || 'Unknown Collection',
                metadata: {
                  traits: [],
                  creator: null, // This might need to be fetched from a different endpoint
                },
                collection: existingCollection,
              }));

            console.log(
              `Found ${nftsResponse.nfts.length} NFTs, kept ${collectionNfts.length} with valid names`,
            );

            // If we have a callback function, call it to save this collection's NFTs
            if (saveCollectionCallback && collectionNfts.length > 0) {
              await saveCollectionCallback(collectionNfts, collection.name);
              console.log(
                `Saved ${collectionNfts.length} NFTs for collection: ${collection.name}`,
              );
            } else {
              // If no callback, accumulate NFTs as before
              allNfts = [...allNfts, ...collectionNfts];
            }

            collectionsProcessed++;

            // Add a small delay to avoid rate limiting
            await new Promise((resolve) => setTimeout(resolve, 300));
          } catch (collectionError) {
            console.error(
              `Error fetching NFTs for collection ${collection.collection}:`,
              collectionError,
            );
            // Continue with next collection if one fails
            continue;
          }
        }

        // Add a delay between pagination requests to avoid rate limiting
        if (next) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      } while (next);

      console.log(
        `Processed ${collectionsProcessed} collections (skipped ${collectionsSkipped}), ${
          saveCollectionCallback
            ? 'saved immediately'
            : `found ${allNfts.length} NFTs in total`
        }`,
      );
      return allNfts;
    } catch (error) {
      console.error('Error scraping OpenSea NFTs:', error);
      return [];
    }
  }

  async scrapeAvailableNftsForCollection(
    collectionSlug: string,
  ): Promise<any[]> {
    try {
      console.log(`Checking collection with slug: ${collectionSlug}`);

      // Check if collection already exists in database with NFTs
      const existingCollection = await this.collectionRepository.findOne({
        where: { slug: collectionSlug },
        relations: ['nfts'],
      });

      if (!existingCollection) {
        throw new Error(
          `Collection ${collectionSlug} not found in the database`,
        );
      }

      // If the collection already has NFTs, return them instead of fetching again
      if (existingCollection.nfts && existingCollection.nfts.length > 0) {
        console.log(
          `Collection ${collectionSlug} already has ${existingCollection.nfts.length} NFTs in the database, skipping fetch`,
        );
        return existingCollection.nfts.map((nft) => ({
          name: nft.name,
          description: nft.description || '',
          imageUrl: nft.imageUrl || '',
          price: nft.price,
          tokenId: nft.tokenId || '0',
          contractAddress: nft.contractAddress || '',
          blockchain: nft.blockchain || 'Ethereum',
          collectionName: existingCollection.name || 'Unknown Collection',
          metadata: nft.metadata || {
            traits: [],
            creator: null,
          },
        }));
      }

      // Fetch NFTs for the specific collection
      console.log(`Fetching NFTs for collection with slug: ${collectionSlug}`);
      const nftsResponse = await this.getNftsFromCollection(collectionSlug);

      // Transform and filter the NFTs similar to the original method
      const collectionNfts = nftsResponse.nfts
        .filter(
          (nft) =>
            nft.name !== null &&
            nft.name !== undefined &&
            nft.name.trim() !== '',
        )
        .map((nft) => ({
          name: nft.name,
          description: nft.description || '',
          imageUrl: nft.image_url || nft.display_image_url || '',
          price: 0.0,
          tokenId: nft.identifier || '0',
          contractAddress: nft.contract || '',
          blockchain: 'Ethereum',
          collectionName: nft.collection || 'Unknown Collection',
          metadata: {
            traits: [],
            creator: null,
          },
          collection: existingCollection,
        }));

      console.log(
        `Found ${nftsResponse.nfts.length} NFTs, kept ${collectionNfts.length} with valid names for collection ${collectionSlug}`,
      );

      return collectionNfts;
    } catch (error) {
      console.error(
        `Error scraping NFTs for collection ${collectionSlug}:`,
        error,
      );
      return [];
    }
  }
}
