import {
  Controller,
  Get,
  Post,
  Body,
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
import { WalletService } from './wallet.service';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { AddExternalWalletDto } from './dto/add-external-wallet.dto';

@ApiTags('wallet')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @ApiOperation({ summary: 'Get user wallet' })
  @ApiResponse({ status: 200, description: 'User wallet' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @Get()
  async getWallet(@Request() req) {
    return this.walletService.getWallet(req.user.userId);
  }

  @ApiOperation({ summary: 'Deposit funds to wallet' })
  @ApiResponse({ status: 200, description: 'Deposit successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @Post('deposit')
  async deposit(@Request() req, @Body() depositDto: DepositDto) {
    return this.walletService.deposit(req.user.userId, depositDto);
  }

  @ApiOperation({ summary: 'Withdraw funds from wallet' })
  @ApiResponse({ status: 200, description: 'Withdrawal successful' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @Post('withdraw')
  async withdraw(@Request() req, @Body() withdrawDto: WithdrawDto) {
    return this.walletService.withdraw(req.user.userId, withdrawDto);
  }

  @ApiOperation({ summary: 'Add external wallet' })
  @ApiResponse({ status: 200, description: 'External wallet added' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Wallet not found' })
  @Post('external')
  async addExternalWallet(
    @Request() req,
    @Body() externalWalletDto: AddExternalWalletDto,
  ) {
    return this.walletService.addExternalWallet(
      req.user.userId,
      externalWalletDto,
    );
  }

  @ApiOperation({ summary: 'Get user transactions' })
  @ApiResponse({ status: 200, description: 'User transactions' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Get('transactions')
  async getTransactions(@Request() req) {
    return this.walletService.getTransactions(req.user.userId);
  }
}
