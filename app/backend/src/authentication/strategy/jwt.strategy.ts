import { UserProfileDto } from '@ft_dto/users';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
// TODO: get token from cookies in stead of headers?
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('payload');
    console.log(payload);
    try {
      const user: UserProfileDto = await this.userService.findUserLogin(
        payload.loginName,
      );
      return user;
    } catch (error) {
      console.log(error.message);
      throw new UnauthorizedException('Not passed jwt guard');
    }
  }
}
