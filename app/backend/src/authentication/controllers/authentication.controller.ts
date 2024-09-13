import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
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
import { AuthGuard42 } from '../guard/42-auth.guard';
import { ConfigService } from '@nestjs/config';
import { FetchChatDto } from '@ft_dto/chat';
import { ChatAuthDto, UpdatePwdDto } from '@ft_dto/authentication';

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
  @UseGuards(AuthGuard42)
  async fortyTwoAuthRedirect(@Req() req: Request | any, @Res() res: Response) {
    try {
      const user: UserProfileDto = req.user;
      if (!user) throw new UnauthorizedException();
      await this.authService.setJwtCookie(user, req);
      console.log(`Auth callback for ${user.id}`);
      res.redirect(`${this.configService.get('FRONTEND_URL')}/auth?user=${user.id}`);
    } catch (error) {
      console.log('Error in 42 callback:', error.message);
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

  @Post('logout')
  async logout(@Req() req: Request): Promise<boolean> {
    console.log('Logging out');
    return await this.authService.deleteJwtCookie(req);
  }

  @Patch('change_pwd')
  @UseGuards(JwtAuthGuard)
  async changePwd(@Body() updatePwdDto: UpdatePwdDto): Promise<boolean> {
    return this.authService.changePwd(
      updatePwdDto.userId,
      updatePwdDto.oldPwd,
      updatePwdDto.newPwd,
    );
  }

  @Get('check_id/:id')
  @UseGuards(JwtAuthGuard)
  async checkId(@Req() req: Request | any): Promise<UserProfileDto> {
    const user: UserProfileDto = req.user;
    const valid: boolean = user.id === parseInt(req.params.id);
    if (valid) return user;
    throw new UnauthorizedException();
  }

  @Get('is42User/:id')
  // @UseGuards(JwtAuthGuard)
  async checkAuth(@Param('id', ParseIntPipe) id: number) {
    return await this.authService.checkAuth(id);
  }

  @Post('loginChat')
  async loginChat(@Req() req: Request, @Body() chatAuthDto: ChatAuthDto): Promise<FetchChatDto> {
    try {
      const chat: FetchChatDto = await this.authService.validateChatLogin(chatAuthDto.chatId, chatAuthDto.pwd);
      console.log(`Logged in for ${chat.id}`);
      await this.authService.setChatCookie(chat, req);
      return chat;
    } catch (error) {
      throw error;
    }
  }

  @Post('setChatPwd')
  async setChatPassword(@Body()chatAuth: ChatAuthDto) : Promise<boolean> {
    return await this.authService.setChatPassword(chatAuth.chatId, chatAuth.pwd);
  }

}
