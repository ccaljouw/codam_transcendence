import { Controller, Get, Param, Req } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserProfileDto } from '@ft_dto/users';

@Controller('auth42')
@ApiTags('auth42')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login/:api42_code')
  callback(@Param('api42_code') code: string): Promise<UserProfileDto> {
    console.log('in controller callback: ', code);
    return this.authService.callback(code)
  }

  @Get('login') //moved to frontend
  @ApiOperation({ summary: 'Redirects the user to the 42 authorization URL'})
  login(@Req() req):  { url: string }  {
    const authUrl = this.authService.getAuthorizationUrl();
    return { url: authUrl };
  }

  // @Get('callback') moved to frontend
  // callback(@Req() req): Promise<UserProfileDto> {
  //   console.log("Callback controller called");
  //   return this.authService.handleCallback(req.query.code);
  // }

}
