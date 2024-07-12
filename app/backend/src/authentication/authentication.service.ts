import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor (
    private readonly userService: UsersService, 
    private readonly jwtService: JwtService,
  ) {};

  async generateJwt(user: UserProfileDto) : Promise<string> {
    const payload = { loginName: user.loginName, id: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(username: string, password: string): Promise<UserProfileDto> {
    let user: UserProfileDto;
    try {
      user = await this.userService.findUserLogin(username)
      // TODO: should be hashed password comparison
      if (user.hash === password) { 
        return user;
      } else
        throw new UnauthorizedException;
    } catch (error) {
        throw error;
    }
  }

  async registerUser(createUser: CreateUserDto): Promise<{ user: UserProfileDto; jwt: string }> {
    let user: UserProfileDto;
    try {
      //TODO: hash password
      user = await this.userService.create(createUser);
      const payload = { loginName: user.loginName, id: user.id };
      const jwt: string = this.jwtService.sign(payload);
      console.log(`Registered ${user.userName} with jwt ${jwt}`);
      return { user, jwt };
    }
   catch (error) {
    throw error;
   }
  }
}
