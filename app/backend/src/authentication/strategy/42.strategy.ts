import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { UserProfileDto } from '@ft_dto/users';
import { AuthService } from '../authentication.service';

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
  
  async validate(accessToken: string, refreshToken: string, profile: any): Promise<{user: UserProfileDto; jwt: string}> {
    let user : UserProfileDto;

    console.log( `Logged in: ${profile.username}`);
    try {
      user = await this.userService.findUserLogin(profile.username);
      if (!user) {
        user = await this.userService.create({ 
          loginName: profile.username, 
          userName: profile.username,
        }, null)
      }
    } catch (error) {
      throw error;
    }
    const jwt: string = await this.authService.generateJwt(user);
    return { user, jwt } ;
  }
}
