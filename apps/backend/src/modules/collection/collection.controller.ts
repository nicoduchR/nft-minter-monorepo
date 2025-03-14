import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CollectionService } from './collection.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { CollectionWithNftImageDto } from './dto/collection-with-nft-image.dto';

@ApiTags('collections')
@Controller('collections')
export class CollectionController {
  constructor(private readonly collectionService: CollectionService) {}

  @ApiOperation({ summary: 'Get all collections' })
  @ApiResponse({ status: 200, description: 'List of collections' })
  @Get()
  async findAll() {
    return this.collectionService.findAll();
  }

  @ApiOperation({ summary: 'Get all collections with a representative NFT image' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of collections with NFT images',
    type: [CollectionWithNftImageDto],
  })
  @Get('with-nft-image')
  async findAllWithNftImage() {
    return this.collectionService.findAllWithNftImage();
  }

  @ApiOperation({ summary: 'Get collection by ID' })
  @ApiResponse({ status: 200, description: 'Collection details' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.collectionService.findById(id);
  }

  @ApiOperation({ summary: 'Get collection by slug' })
  @ApiResponse({ status: 200, description: 'Collection details' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @Get('slug/:slug')
  async findBySlug(@Param('slug') slug: string) {
    return this.collectionService.findBySlug(slug);
  }

  @ApiOperation({ summary: 'Get collections by owner' })
  @ApiResponse({ status: 200, description: 'List of collections' })
  @Get('owner/:owner')
  async findByOwner(@Param('owner') owner: string) {
    return this.collectionService.findByOwner(owner);
  }

  @ApiOperation({ summary: 'Get collection with its NFTs' })
  @ApiResponse({ status: 200, description: 'Collection with NFTs' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @Get(':id/nfts')
  async findWithNfts(@Param('id') id: string) {
    return this.collectionService.findWithNfts(id);
  }

  @ApiOperation({ summary: 'Create a new collection' })
  @ApiResponse({ status: 201, description: 'Collection created' })
  @ApiResponse({ status: 409, description: 'Collection slug already exists' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createCollectionDto: CreateCollectionDto) {
    return this.collectionService.create(createCollectionDto);
  }

  @ApiOperation({ summary: 'Update a collection' })
  @ApiResponse({ status: 200, description: 'Collection updated' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @ApiResponse({ status: 409, description: 'Collection slug already exists' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCollectionDto: UpdateCollectionDto,
  ) {
    return this.collectionService.update(id, updateCollectionDto);
  }

  @ApiOperation({ summary: 'Delete a collection' })
  @ApiResponse({ status: 200, description: 'Collection deleted' })
  @ApiResponse({ status: 404, description: 'Collection not found' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.collectionService.delete(id);
  }
}
