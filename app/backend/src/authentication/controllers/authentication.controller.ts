import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { UserProfileDto } from '@ft_dto/users';
import { AuthService } from '../services/authentication.service';
import { LocalAuthGuard } from '../guard/login-auth.guard';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../guard/jwt-auth.guard';
import { UpdatePwdDto } from '@ft_dto/authentication';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {}

  @Get('42')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuth() {}

  @Get('42/callback')
  @UseGuards(AuthGuard('42'))
  async fortyTwoAuthRedirect(@Req() req: Request | any, @Res() res: Response) {
    try {
      const user: UserProfileDto = req.user;
      if (!user) throw new UnauthorizedException();
      await this.authService.setJwtCookie(user, req);
      console.log(`Auth callback for ${user.id}`);
      res.redirect(`${this.configService.get('FRONTEND_URL')}?user=${user.id}`);
    } catch (error) {
      throw error;
    }
  }

  @Post('register')
  @ApiOperation({
    summary: 'Adds user to database and returns id for this user',
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: UserProfileDto,
  })
  async register(@Req() req: Request): Promise<UserProfileDto> {
    try {
      const { createUser, pwd } = req.body;
      const user: UserProfileDto = await this.authService.registerUser(
        createUser,
        pwd,
      );
      if (!user) throw new UnauthorizedException();
      await this.authService.setJwtCookie(user, req);
      return user;
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Req() req: Request | any): Promise<UserProfileDto> {
    try {
      const user: UserProfileDto = req.user;
      if (!user) throw new UnauthorizedException();
      console.log(`Logged in ${user.userName}`);
      await this.authService.setJwtCookie(user, req);
      return user;
    } catch (error) {
      throw error;
    }
  }

  @Patch('change_pwd')
  @UseGuards(JwtAuthGuard)
  async changePwd(@Body() updatePwdDto: UpdatePwdDto): Promise<void> {
    return this.authService.changePwd(
      updatePwdDto.userId,
      updatePwdDto.oldPwd,
      updatePwdDto.newPwd,
    );
  }
}
