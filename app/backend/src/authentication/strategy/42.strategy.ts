import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import Strategy from 'passport-42';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto, UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { AuthService } from '../services/authentication.service';
import { v4 as uuidv4 } from 'uuid';

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
      clientSecret: process.env.SECRET,
      callbackURL: `${configService.get('BACKEND_URL')}/auth/42/callback`,
    });
  }

  async createNewUserFromProfile(
    profile: any,
    changeUserName: boolean,
  ): Promise<UserProfileDto> {
    const userData: CreateUserDto = {
      loginName: profile._json.login,
      userName: profile._json.login,
      firstName: profile._json.first_name,
      lastName: profile._json.last_name,
      email: profile._json.email,
      avatarUrl: profile._json.image.link,
    };
    if (changeUserName == true) {
      userData.userName = `${profile._json.login}${uuidv4()}`;
    }
    // Default password for 42 users is set to strongpong
    console.log('Creating new user', userData);
    const user = await this.authService.createUser(userData, 'strongpong');
    return user;
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
  ): Promise<UserProfileDto> {
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
        try {
          user = await this.createNewUserFromProfile(profile, false);
          return user;
        } catch (error) {
          if (error.code == 'P2002') {
            console.log('Username already exists');
            return this.createNewUserFromProfile(profile, true);
          }
        }
      } else {
        console.log(`error validating 42user`, error.message);
        throw error;
      }
    }
    return user;
  }
}
