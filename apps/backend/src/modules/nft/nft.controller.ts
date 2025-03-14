import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { NftService } from './nft.service';
import { MintNftDto } from './dto/mint-nft.dto';
import { TransferNftDto } from './dto/transfer-nft.dto';
import { ScheduleMintDto } from './dto/schedule-mint.dto';
import { ScheduledMintService } from './scheduled-mint.service';

@ApiTags('nfts')
@Controller('nfts')
export class NftController {
  constructor(
    private readonly nftService: NftService,
    private readonly scheduledMintService: ScheduledMintService,
  ) {}

  @ApiOperation({ summary: 'Get all available NFTs' })
  @ApiResponse({ status: 200, description: 'List of available NFTs' })
  @Get()
  async findAll() {
    return this.nftService.findAll();
  }

  @ApiOperation({ summary: 'Get NFT by ID' })
  @ApiResponse({ status: 200, description: 'NFT details' })
  @ApiResponse({ status: 404, description: 'NFT not found' })
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.nftService.findById(id);
  }

  @ApiOperation({ summary: 'Get user NFTs' })
  @ApiResponse({ status: 200, description: 'List of user NFTs' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('user/me')
  async findByUser(@Request() req) {
    return this.nftService.findByUser(req.user.userId);
  }

  @ApiOperation({ summary: 'Mint an NFT' })
  @ApiResponse({ status: 200, description: 'NFT minted successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'NFT not found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('mint')
  async mintNft(@Request() req, @Body() mintNftDto: MintNftDto) {
    return this.nftService.mintNft(req.user.userId, mintNftDto);
  }

  @ApiOperation({ summary: 'Transfer an NFT' })
  @ApiResponse({ status: 200, description: 'NFT transferred successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'NFT not found' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('transfer')
  async transferNft(@Request() req, @Body() transferNftDto: TransferNftDto) {
    return this.nftService.transferNft(req.user.userId, transferNftDto);
  }

  @Post('schedule-mint')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Schedule a mint for future execution' })
  @ApiResponse({
    status: 201,
    description: 'The mint has been scheduled successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  @ApiResponse({ status: 404, description: 'NFT not found' })
  async scheduleMint(@Request() req, @Body() scheduleMintDto: ScheduleMintDto) {
    return this.scheduledMintService.scheduleNftMint(
      req.user.id,
      scheduleMintDto,
    );
  }

  @Get('scheduled-mints')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get all scheduled mints for the current user' })
  @ApiResponse({
    status: 200,
    description: 'Returns all scheduled mints for the user',
  })
  async getScheduledMints(@Request() req) {
    return this.scheduledMintService.getUserScheduledMints(req.user.id);
  }

  @Get('scheduled-mints/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get a specific scheduled mint by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the scheduled mint details',
  })
  @ApiResponse({ status: 404, description: 'Scheduled mint not found' })
  async getScheduledMint(@Param('id') id: string) {
    return this.scheduledMintService.getScheduledMintById(id);
  }

  @Delete('scheduled-mints/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Cancel a scheduled mint' })
  @ApiResponse({
    status: 200,
    description: 'The mint has been cancelled successfully',
  })
  @ApiResponse({ status: 400, description: 'Invalid request' })
  @ApiResponse({ status: 404, description: 'Scheduled mint not found' })
  async cancelScheduledMint(@Request() req, @Param('id') id: string) {
    return this.scheduledMintService.cancelScheduledMint(req.user.id, id);
  }
}
