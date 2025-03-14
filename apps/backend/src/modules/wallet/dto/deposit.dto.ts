import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
} from 'class-validator';

export class DepositDto {
  @ApiProperty({ example: 0.1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @ApiProperty({ example: '0x123...', required: false })
  @IsString()
  @IsOptional()
  txHash?: string;

  @ApiProperty({ example: '0x456...', required: false })
  @IsString()
  @IsOptional()
  fromAddress?: string;

  @ApiProperty({ example: 'Deposit from exchange', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
