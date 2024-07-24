import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { AuthService } from '../services/authentication.service';

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
      callbackURL: `${configService.get('BACKEND_URL')}/auth/42/callback`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<{ user: UserProfileDto; jwt: string }> {
    let user: UserProfileDto;
    const updatefields = new UpdateUserDto();

    console.log(`Logged in: ${profile.username}`);
    try {
      user = await this.userService.findUserLogin(profile.username);

      updatefields.email =
        user.email == null ? profile._json.email : user.email;
      updatefields.loginName =
        user.loginName == null ? profile._json.login : user.loginName;
      updatefields.firstName =
        user.firstName == null ? profile._json.first_name : user.firstName;
      updatefields.lastName =
        user.lastName == null ? profile._json.last_name : user.lastName;
      updatefields.avatarUrl =
        user.avatarUrl == null ? profile._json.image.link : user.avatarUrl;

      user = await this.userService.update(user.id, updatefields);
    } catch (error) {
      console.log(`error in validate: ${error.message}`);
      if (!user) {
        console.log('creating new user');
        user = await this.authService.createUser(
          {
            loginName: profile._json.login,
            userName: profile._json.username,
            firstName: profile._json.first_name,
            lastName: profile._json.last_name,
            email: profile._json.email,
            avatarUrl: profile._json.image.link,
          },
          null,
        );
        const jwt: string = await this.authService.generateJwt(user);
        return { user, jwt };
      } else {
        throw error;
      }
    }
    const jwt: string = await this.authService.generateJwt(user);
    return { user, jwt };
  }
}
