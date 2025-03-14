import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsUrl,
  IsBoolean,
  IsArray,
} from 'class-validator';

export class UpdateCollectionDto {
  @ApiProperty({ description: 'Slug for the collection', required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ description: 'Name of the collection', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Description of the collection',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'URL of the collection image', required: false })
  @IsUrl()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'URL of the collection banner image',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  bannerImageUrl?: string;

  @ApiProperty({ description: 'Owner of the collection', required: false })
  @IsString()
  @IsOptional()
  owner?: string;

  @ApiProperty({
    description: 'Safelist status of the collection',
    required: false,
  })
  @IsString()
  @IsOptional()
  safelistStatus?: string;

  @ApiProperty({ description: 'Category of the collection', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({
    description: 'Whether the collection is disabled',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isDisabled?: boolean;

  @ApiProperty({
    description: 'Whether the collection contains NSFW content',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isNsfw?: boolean;

  @ApiProperty({
    description: 'Whether trait offers are enabled',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  traitOffersEnabled?: boolean;

  @ApiProperty({
    description: 'Whether collection offers are enabled',
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  collectionOffersEnabled?: boolean;

  @ApiProperty({
    description: 'OpenSea URL for the collection',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  openseaUrl?: string;

  @ApiProperty({ description: 'Project URL', required: false })
  @IsUrl()
  @IsOptional()
  projectUrl?: string;

  @ApiProperty({ description: 'Wiki URL', required: false })
  @IsUrl()
  @IsOptional()
  wikiUrl?: string;

  @ApiProperty({ description: 'Discord URL', required: false })
  @IsUrl()
  @IsOptional()
  discordUrl?: string;

  @ApiProperty({ description: 'Telegram URL', required: false })
  @IsUrl()
  @IsOptional()
  telegramUrl?: string;

  @ApiProperty({ description: 'Twitter username', required: false })
  @IsString()
  @IsOptional()
  twitterUsername?: string;

  @ApiProperty({ description: 'Instagram username', required: false })
  @IsString()
  @IsOptional()
  instagramUsername?: string;

  @ApiProperty({
    description: 'Contract addresses associated with this collection',
    required: false,
  })
  @IsArray()
  @IsOptional()
  contracts?: { address: string }[];
}
