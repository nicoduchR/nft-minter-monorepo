import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsEthereumAddress,
} from 'class-validator';

export class TransferNftDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  nftId: string;

  @ApiProperty({ example: '0x123...' })
  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  toAddress: string;
}
