import { Injectable } from '@nestjs/common';
import { UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { UsersService } from 'src/users/users.service';
import { HttpService } from '@nestjs/axios'
import { AxiosResponse } from 'axios'
import { Observable, lastValueFrom, map } from 'rxjs';
import { PrismaService } from 'src/database/prisma.service';
import { Create42TokenDto } from '@ft_dto/authentication/create-token.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor (
    private readonly userService: UsersService, 
    private readonly db: PrismaService,
    private readonly jwtService: JwtService,
  ) {};

  async generateJwt(user: any) {
    const payload = { username: user.login, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
