import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../guard/jwt-auth.guard";
import { TwoFAService } from "../services/2FA.service";
import { LocalAuthGuard } from "../guard/login-auth.guard";
import { UserProfileDto } from "@ft_dto/users";

@Controller('auth/2FA')
@ApiTags('auth/2FA')
export class TwoFAController {

  constructor(
		private readonly twoFA: TwoFAService,
	) { }
  
  @Get('generate')
  @UseGuards(LocalAuthGuard)
  async generate(@Req() req) {
    const { user, jwt }: { user: UserProfileDto; jwt: string } = req.user;
    console.log(`generate qr for: `);
    console.log(user);
    const secret = await this.twoFA.generate2FASecret(user.loginName);
    await this.twoFA.store2FASecret(secret.base32, user.id);
    return this.twoFA.generateQRCode(secret.otpauth_url, user.loginName, secret.base32);
  }

  @Patch('enable/:id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Turns on 2FA and generates and stores token' })

  async enable2FA(@Param('id', ParseIntPipe) id: number) {
    return this.twoFA.enable2FA(id);
  }

  @Patch('disable/:id')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Turns off 2FA' })

  async disable2FA(@Param('id', ParseIntPipe) id: number)  {
    return this.twoFA.disable2FA(id);
  }
}