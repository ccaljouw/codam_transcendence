import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TwoFAService } from './2FA.service';

@Injectable()
export class AuthService {

  constructor (
    private readonly db: PrismaService,
    private readonly userService: UsersService, 
    private readonly jwtService: JwtService,
    private readonly twoFA: TwoFAService,

  ) {};

  async generateJwt(user: UserProfileDto) : Promise<string> {
    const payload = { loginName: user.loginName, id: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(username: string, password: string, token: string): Promise<UserProfileDto> {
    let user: UserProfileDto | any;
    try {
      user = await this.db.user.findUnique({
        where: { loginName: username },
        include: { auth: true }
      })
      // TODO: should be hashed password comparison
      if (user.auth?.pwd === password) {
        
        console.log("password correct");
        
        if (user.twoFactEnabled) {
          if (!token) {
            console.log('2FA token is required')
            throw new UnauthorizedException('2FA token is required');
          }

          const isValidTwoFactorToken = await this.twoFA.verify2FASecret(user.auth.twoFactSecret, token);
          if (!isValidTwoFactorToken) {
            throw new UnauthorizedException('Invalid 2FA token');
          }
        }
        delete user.auth;
        return user;
      } else
        console.log("incorrect password");
        throw new UnauthorizedException('Incorrect password');
    } catch (error) {
        if (error instanceof UnauthorizedException) {
          throw error;
        } else {
          throw new InternalServerErrorException('Unexpected error logging in');
        }
    }
  }

  async registerUser(createUser: CreateUserDto, pwd: string): Promise<{ user: UserProfileDto; jwt: string }> {
    let user: UserProfileDto;
    try {
      //TODO: hash password
      console.log("trying to register user: ");
      console.log(createUser);
      console.log(pwd);
      user = await this.userService.create(createUser, pwd);
      const payload = { loginName: user.loginName, id: user.id };
      const jwt: string = this.jwtService.sign(payload);
      console.log(`Registered ${user.userName} with jwt ${jwt}`);
      return { user, jwt };
    }
   catch (error) {
    throw error;
   }
  }

  async changePwd(id: number, oldPwd: string, newPwd: string) {
    console.log(`Trying to update pwd: ${id}, ${oldPwd}, ${newPwd}`);
    try {
      const user = await this.db.user.findUnique({
        where: { id },
        include: { auth: true }
      })

      if (user.auth?.pwd === oldPwd) {
        await this.db.auth.update({
          where: { id },	
            data: {pwd: newPwd },
          })
        console.log("Pwd updated");
      } else {
        console.log('Old pwd incorrect');
        throw new UnauthorizedException('Old password incorrect');
      }

    } catch (error) {
      throw error;
    }
  }
}
