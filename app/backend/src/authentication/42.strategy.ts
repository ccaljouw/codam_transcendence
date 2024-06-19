import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UserProfileDto } from '@ft_dto/users';

@Injectable()
export class StrategyFortyTwo extends PassportStrategy(Strategy, '42') {
  constructor( private configService: ConfigService ) {
    super({
      authorizationURL: `https://api.intra.42.fr/oauth/authorize`,
      tokenURL: 'https://api.intra.42.fr/oauth/token',
      clientID: 'u-s4t2ud-66c50cf4e54a51062bc5f0c110035ff12e1b0427cc1066c11d6e5c220a2ed1dc',
      clientSecret: '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',
      callbackURL: 'http://localhost:3001/auth/42/callback',
    });
  }
  
  async validate(accessToken: string, refreshToken: string, profile: any) {
    // let user : UserProfileDto;

    console.log(accessToken);
    console.log(profile);

    // user.userName = profile.username;

  }
}
