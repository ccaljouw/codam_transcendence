import { Body, Controller, Get, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserProfileDto } from '@ft_dto/users';
import { AuthService } from '../services/authentication.service';
import { LocalAuthGuard } from '../guard/login-auth.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { UpdatePwdDto } from '@ft_dto/authentication';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
		private readonly authService: AuthService,
	) { }

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth(@Req() req: Request) {}
  
  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthRedirect(@Req() req: Request | any, @Res() res: Response) {
    const { user, jwt }: { user: UserProfileDto; jwt: string } = req.user;
    console.log(`Auth callback for ${user.id} with jwt ${jwt}`);
    res.redirect(`http://localhost:3000?user=${user.id}&jwt=${jwt}`);
  }

  @Post('register')
  @ApiOperation({ summary: 'Adds user to database and returns id for this user' })
  @ApiCreatedResponse({ description: 'User successfully created', type: UserProfileDto })

  async register(@Req() req: Request ) : Promise<{ user: UserProfileDto, jwt: string}>  {
    return this.authService.registerUser(req.body.createUser, req.body.pwd);
  }
  
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request | any) : Promise<{ user: UserProfileDto, jwt: string}> {
    const { user, jwt }: { user: UserProfileDto; jwt: string } = req.user;
    console.log(`Logged in ${user.userName} with jwt ${jwt}`);
    return { user, jwt };
  }

  @Patch('change_pwd')
  // @UseGuards(JwtAuthGuard)
  async changePwd(@Body() updatePwdDto: UpdatePwdDto) {
    console.log(`in auth controler, userId: ${updatePwdDto.userId}, oldPwd: ${updatePwdDto.oldPwd}, newPwd: ${updatePwdDto.newPwd}`);
    return this.authService.changePwd(updatePwdDto.userId, updatePwdDto.oldPwd, updatePwdDto.newPwd);
  }
}