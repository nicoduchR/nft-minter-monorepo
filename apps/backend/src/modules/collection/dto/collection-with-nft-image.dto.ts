import { ApiProperty } from '@nestjs/swagger';
import { Collection } from '../../../domain/entities/collection.entity';

export class CollectionWithNftImageDto extends Collection {
  @ApiProperty({
    description: 'URL of a representative NFT image from this collection',
    required: false,
    example: 'https://example.com/nft-image.png',
  })
  representativeNftImageUrl?: string;
} 