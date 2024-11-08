import { UserProfileDto } from '@ft_dto/users';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req.cookies['jwt'] || null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(payload: any): Promise<UserProfileDto> {
    try {
      const user: UserProfileDto = await this.userService.findUserLogin(
        payload.loginName,
      );
      return user;
    } catch (error) {
      console.log('Error validating jwt for user:', error.message);
      throw new UnauthorizedException('Not passed jwt guard');
    }
  }
}
