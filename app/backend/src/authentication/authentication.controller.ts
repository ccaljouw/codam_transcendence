import { Controller, Get, InternalServerErrorException, Param, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserProfileDto } from '@ft_dto/users';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth(@Req() req) {}
  
  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthRedirect(@Req() req, @Res() res) {
    console.log(req.user);
    try {
      const jwt = await this.authService.generateJwt(req.user);
      console.log(`JWT: ${jwt}`);
      res.redirect(`http://localhost:3000?user=${req.user}`);
    } catch (error) {
      console.error('Error generating JWT:', error);
    }
  }
}
