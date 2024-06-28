import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth(@Req() req) {}
  
  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthRedirect(@Req() req, @Res() res) {
    console.log(`Auth callback for ${req.user.id} with jwt ${req.user.hash}`);
    res.redirect(`http://localhost:3000?user=${req.user.id}&jwt=${req.user.hash}`);
  }
}
