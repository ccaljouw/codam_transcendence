import { Injectable } from '@nestjs/common';
import { CreateAuthenticationDto } from '../dto/create-authentication.dto';
import { UsersService } from '../../database/users/users.service';
import { AuthenticationEntity } from '../dto/authentication.entity';
import { UserEntity } from 'src/database/users/dto/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(private users: UsersService) {}

  // Allows users to create a new account by providing necessary registration information
  async register(createAuthenticationDto: CreateAuthenticationDto) {
    // TODO: create hash
    const hash = createAuthenticationDto.password;

    // save new user in the database
    const user: UserEntity = await this.users.create({
      email: createAuthenticationDto.email,
      hash: hash,
      firstName: createAuthenticationDto.firstName,
      lastName: createAuthenticationDto.lastName,
    });

    const AuthenticationEntity: AuthenticationEntity = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
    return AuthenticationEntity;
  }
}
