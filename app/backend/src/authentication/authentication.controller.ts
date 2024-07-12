import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { CreateUserDto, UserProfileDto } from '@ft_dto/users';
import { AuthService } from './authentication.service';
import { LocalAuthGuard } from './guard/login-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
		private readonly authService: AuthService,
	) { }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth(@Req() req) {}
  
  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthRedirect(@Req() req, @Res() res) {
    const { jwt, user }: { jwt: string; user: UserProfileDto } = req.user;
    console.log(`Auth callback for ${user.id} with jwt ${jwt}`);
    res.redirect(`http://localhost:3000?user=${user.id}&jwt=${jwt}`);
  }

  @Post('register')
  @ApiOperation({ summary: 'Adds user to database and returns id for this user' })
  @ApiCreatedResponse({ description: 'User successfully created', type: UserProfileDto })

  async register(@Body() createUser: CreateUserDto) : Promise<{ user: UserProfileDto; jwt: string }> {
    return this.authService.registerUser(createUser);
  }
  
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req) : Promise<{ user: UserProfileDto, jwt: string}> {
    const { jwt, user }: { jwt: string; user: UserProfileDto } = req.user;
    console.log(`Logged in ${user.userName} with jwt ${jwt}`);
    return { user, jwt };
  }
}