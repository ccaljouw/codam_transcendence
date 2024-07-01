import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { UserProfileDto } from '@ft_dto/users';
import { AuthService } from './authentication.service';

@Injectable()
export class StrategyFortyTwo extends PassportStrategy(Strategy, '42') {
  constructor( 
    private configService: ConfigService,
    private userService: UsersService,
    private authService: AuthService,
  ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: configService.get('CLIENT_ID'),
      clientSecret: configService.get('SECRET'),
      callbackURL: configService.get('HOST')+':3001/auth/42/callback',
    });
  }
  
  async validate(accessToken: string, refreshToken: string, profile: any): Promise<UserProfileDto> {
    let user : UserProfileDto;
    let jwt: { access_token: string };

    console.log( `Logged in: ${profile.username}`);
    try {
      user = await this.userService.findUserLogin(profile.username);
      jwt = await this.authService.generateJwt(accessToken);
      user = await this.userService.update(user.id, { hash: jwt.access_token })
    } catch (error) {
      if (error instanceof NotFoundException ) {
        user = await this.userService.create({ 
          loginName: profile.username, 
          userName: profile.username, 
          hash: jwt.access_token })
      } else {
        throw error;
      }
    }
    return user;
  }
}
