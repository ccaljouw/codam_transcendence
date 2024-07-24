import {
  Body,
  Controller,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TwoFAService } from '../services/2FA.service';
import { CheckTokenDto } from '@ft_dto/authentication';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';

@Controller('auth/2FA')
@ApiTags('auth/2FA')
export class TwoFAController {
  constructor(private readonly twoFA: TwoFAService) {}

  @Post('check')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Checks token after scenning QR code' })
  async checkFAToken(@Body() checkToken: CheckTokenDto) {
    console.log('checking token');
    console.log(checkToken);
    return this.twoFA.checkFAToken(checkToken.userId, checkToken.token);
  }

  @Patch('enable/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Turns on 2FA and generates and stores token' })
  async enable2FA(@Param('id', ParseIntPipe) id: number) {
    return this.twoFA.enable2FA(id);
  }

  @Patch('disable/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Turns off 2FA' })
  async disable2FA(@Param('id', ParseIntPipe) id: number) {
    return this.twoFA.disable2FA(id);
  }
}
