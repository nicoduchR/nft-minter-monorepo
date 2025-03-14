import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  IsOptional,
  Min,
  IsEthereumAddress,
} from 'class-validator';

export class WithdrawDto {
  @ApiProperty({ example: 0.1 })
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  amount: number;

  @ApiProperty({ example: '0x123...' })
  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  toAddress: string;

  @ApiProperty({ example: 'Withdrawal to exchange', required: false })
  @IsString()
  @IsOptional()
  note?: string;
}
