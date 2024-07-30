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
  ): Promise<UserProfileDto> {
    let user: UserProfileDto;
    const { token } = req.body;

    try {
      console.log(`In login strategy: ${loginName}`);
      user = await this.authService.validateUser(loginName, password, token);
      if (!user)
        throw new UnauthorizedException('Invallid user-password combination');
    } catch (error) {
      console.log('Error validating login for user:', error.message);
      throw error;
    }
    return user;
  }
}
