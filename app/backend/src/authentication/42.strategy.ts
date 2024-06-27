import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { UserProfileDto } from '@ft_dto/users';

@Injectable()
export class StrategyFortyTwo extends PassportStrategy(Strategy, '42') {
  constructor( 
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: configService.get('CLIENT_ID'),
      clientSecret: configService.get('SECRET'),
      callbackURL: 'http://localhost:3001/auth/42/callback',
    });
  }
  
  async validate(accessToken: string, refreshToken: string, profile: any): Promise<Number> {
    let user : UserProfileDto;

    console.log( `Logged in: ${profile.username}`);

    try {
      user = await this.userService.findUserLogin(profile.username);

    } catch (error) {
      if (error instanceof NotFoundException ) {
        // todo: Carien: remove hash
        await this.userService.create({ 
          loginName: profile.username, 
          userName: profile.username, 
          hash: "sdkghks" })
      } else {
        throw error;
      }
    }
    return user.id;
  }
}
