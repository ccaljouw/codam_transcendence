import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/authentication.service';
import { UserProfileDto } from '@ft_dto/users';
import { Request } from 'express';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'loginName',
      passReqToCallback: true,
    });
  }

  async validate(
    req: Request,
    loginName: string,
    password: string,
  ): Promise<{ user: UserProfileDto; jwt: string }> {
    let user: UserProfileDto;
    const { token } = req.body;

    try {
      user = await this.authService.validateUser(loginName, password, token);
    } catch (error) {
      if (!user)
        throw new UnauthorizedException('Invallid user-password combination');
      throw error;
    }
    const jwt: string = await this.authService.generateJwt(user);
    return { user, jwt };
  }
}
