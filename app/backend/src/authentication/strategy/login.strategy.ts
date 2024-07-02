import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../authentication.service';
import { UserProfileDto } from '@ft_dto/users';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginName' });
  }

  async validate(loginName: string, password: string): Promise<{user: UserProfileDto; jwt: string}> {
      let user : UserProfileDto;
      
      console.log( `Logging in: ${loginName}`);
      try {
        user = await this.authService.validateUser(loginName, password);
      } catch (error) {
        throw error;
    }
    const jwt: string = await this.authService.generateJwt(user);
    return { user, jwt } ;
  }
}