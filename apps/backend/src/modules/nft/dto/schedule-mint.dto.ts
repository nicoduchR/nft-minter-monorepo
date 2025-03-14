import { IsNotEmpty, IsUUID, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScheduleMintDto {
  @ApiProperty({
    description: 'The ID of the NFT to be minted',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsNotEmpty()
  @IsUUID()
  nftId: string;

  @ApiPropertyOptional({
    description:
      'When to schedule the mint (ISO date string). If not provided, will be scheduled for immediate execution when possible.',
    example: '2023-06-15T14:30:00Z',
  })
  @IsOptional()
  @IsDateString()
  scheduledFor?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata for the scheduled mint',
    example: { reason: 'Waiting for gas prices to drop' },
  })
  @IsOptional()
  metadata?: Record<string, any>;
}
