import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ScraperService } from './scraper.service';
import { Marketplace } from '../../domain/entities/nft.entity';

@ApiTags('scraper')
@Controller('scraper')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ScraperController {
  constructor(private readonly scraperService: ScraperService) {}

  @ApiOperation({ summary: 'Get upcoming NFT drops' })
  @ApiResponse({ status: 200, description: 'List of upcoming NFT drops' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('drops')
  async getUpcomingDrops() {
    return this.scraperService.getUpcomingDrops();
  }

  @ApiOperation({ summary: 'Get NFT drops by marketplace' })
  @ApiResponse({ status: 200, description: 'List of NFT drops by marketplace' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('drops/:marketplace')
  async getDropsByMarketplace(@Param('marketplace') marketplace: Marketplace) {
    return this.scraperService.getDropsByMarketplace(marketplace);
  }

  @ApiOperation({ summary: 'Get available NFTs' })
  @ApiResponse({ status: 200, description: 'List of available NFTs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('nfts')
  async getAvailableNfts() {
    return this.scraperService.getAvailableNfts();
  }

  @ApiOperation({ summary: 'Get available NFTs' })
  @ApiResponse({ status: 200, description: 'List of available NFTs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('collections/:slug')
  async getCollection(
    @Param('slug') slug: string,
    @Body() body: { marketplace: Marketplace },
  ): Promise<any> {
    const collection = await this.scraperService.getCollection(
      slug,
      body.marketplace,
    );
    const nfts = await this.scraperService.scrapeAvailableNftsForCollection(
      slug,
      body.marketplace,
    );
    // Save the NFTs to the database
    await this.scraperService.saveCollectionNfts(nfts, body.marketplace);
    return { collection, nfts };
  }

  @ApiOperation({ summary: 'Trigger marketplace scraping' })
  @ApiResponse({ status: 200, description: 'Scraping triggered successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('trigger')
  async triggerScraping() {
    // await this.scraperService.scrapeMarketplaces();
    // This will scrape NFTs from marketplaces and save them to the database
    await this.scraperService.scrapeAvailableNfts();
    return { message: 'Scraping triggered successfully' };
  }
}
