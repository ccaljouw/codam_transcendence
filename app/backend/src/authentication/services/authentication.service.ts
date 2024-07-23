import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { PrismaService } from 'src/database/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { TwoFAService } from './2FA.service';
import * as bcrypt from 'bcrypt';
import { StatsService } from 'src/stats/stats.service';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private readonly db: PrismaService,
    private readonly jwtService: JwtService,
    private readonly twoFA: TwoFAService,
    private readonly stats: StatsService,
  ) {}

  private throwError(error: any, message: string): any {
    if (
      error instanceof PrismaClientKnownRequestError ||
      PrismaClientValidationError ||
      PrismaClientUnknownRequestError
    )
      return error;
    return new Error(`${message}: ${error.message}`);
  }

  async createUser(
    createUserDto: CreateUserDto,
    pwd: string,
  ): Promise<UserProfileDto> {
    try {
      if (!createUserDto.userName)
        createUserDto.userName = createUserDto.loginName;
      const user = await this.db.user.create({
        data: createUserDto,
      });
      console.log(`create authentication info for ${user.id}`);
      if (pwd) {
        await this.db.auth.create({ data: { userId: user.id, pwd: pwd } });
      } else {
        await this.db.auth.create({ data: { userId: user.id } });
      }
      await this.stats.create(user.id);
      return user;
    } catch (error) {
      throw this.throwError(error, 'Error creating user');
    }
  }
  async generateJwt(user: UserProfileDto): Promise<string> {
    const payload = { loginName: user.loginName, id: user.id };
    return this.jwtService.sign(payload);
  }

  async validateUser(
    username: string,
    password: string,
    token: string,
  ): Promise<UserProfileDto> {
    let user: UserProfileDto | any;
    try {
      user = await this.db.user.findUnique({
        where: { loginName: username },
        include: { auth: true },
      });
      const validPwd = await bcrypt.compare(password, user.auth?.pwd);
      console.log('Valid pwd', validPwd);
      if (validPwd) {
        console.log('password correct');

        if (user.twoFactEnabled) {
          if (!token) {
            console.log('2FA token is required');
            throw new UnauthorizedException('2FA token is required');
          }

          const isValidTwoFactorToken = await this.twoFA.verify2FASecret(
            user.auth.twoFactSecret,
            token,
          );
          if (!isValidTwoFactorToken) {
            throw new UnauthorizedException('Invalid 2FA token');
          }
        }
        delete user.auth;
        return user;
      } else {
        console.log('incorrect password');
        throw new UnauthorizedException('Invallid user-password combination');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      } else {
        throw new InternalServerErrorException('Unexpected error logging in');
      }
    }
  }

  async registerUser(
    createUser: CreateUserDto,
    pwd: string,
  ): Promise<{ user: UserProfileDto; jwt: string }> {
    let user: UserProfileDto;
    try {
      console.log('trying to register user: ');
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(pwd, salt);

      user = await this.createUser(createUser, hash);

      const payload = { loginName: user.loginName, id: user.id };
      const jwt: string = this.jwtService.sign(payload);
      console.log(`Registered ${user.userName} with jwt ${jwt}`);

      return { user, jwt };
    } catch (error) {
      throw error;
    }
  }

  async changePwd(id: number, oldPwd: string, newPwd: string) {
    console.log(`Trying to update pwd: ${id}, ${oldPwd}, ${newPwd}`);
    try {
      const user = await this.db.user.findUnique({
        where: { id },
        include: { auth: true },
      });

      if (user.auth?.pwd === oldPwd) {
        await this.db.auth.update({
          where: { id },
          data: { pwd: newPwd },
        });
        console.log('Pwd updated');
      } else {
        console.log('Old pwd incorrect');
        throw new UnauthorizedException('Old password incorrect');
      }
    } catch (error) {
      throw error;
    }
  }
}
