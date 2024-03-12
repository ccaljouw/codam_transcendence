import { Controller, Get, Redirect, Req } from '@nestjs/common';
import { AuthService } from './authentication.service';
import { ApiCreatedResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @ApiOperation({ summary: 'Redirects the user to the 42 authorization URL'})
  login(@Req() req):  { url: string }  {
    const authUrl = this.authService.getAuthorizationUrl();
    return { url: authUrl };
  }

  @Get('callback')
  @Redirect('/')
  callback(@Req() req): void {
    // Handle the OAuth callback and token exchange
    this.authService.handleCallback(req.query.code);
  }
}
