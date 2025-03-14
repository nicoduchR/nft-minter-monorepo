import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEthereumAddress } from 'class-validator';

export class AddExternalWalletDto {
  @ApiProperty({ example: 'My MetaMask Wallet' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '0x123...' })
  @IsString()
  @IsNotEmpty()
  @IsEthereumAddress()
  address: string;
}
