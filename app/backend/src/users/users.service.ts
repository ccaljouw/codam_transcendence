import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';
import { UserProfileDto } from './dto/user-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(private db: PrismaService) {}

  async create(createUserDto: CreateUserDto) : Promise<Number> {
    if (!createUserDto.userName)
      createUserDto.userName = createUserDto.loginName;
    const user = await this.db.user.create({ data: createUserDto });
    return user.id;
    // trhow exception? what kind of exception? or is this caught by the prisma filter?
  }

  async findAll() : Promise<UserProfileDto[]>  {
    try {
      const users = await this.db.user.findMany({});
      for (const element of users)
        delete element.hash;
      return users;
    }
    catch {
      throw new NotFoundException(`No users in the database.`);
    }
  }

  async findOne(id: number) : Promise<UserProfileDto> {
    try {
      const user = await this.db.user.findUnique({ where: { id } });
      delete user.hash;
      return user;
    }
    catch (error) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) : Promise<UserProfileDto> {
    try {
      const user = await this.db.user.update({
        where: { id },
        data: updateUserDto,
      });
      delete user.hash;
      return user;
    }
    catch (error) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }
  
  }

  async remove(id: number) : Promise<UserProfileDto> {
    try {
      const user = await this.db.user.delete({ where: { id } });
      delete user.hash;
      return user;
    }
    catch (error) {
      throw new NotFoundException(`User with id ${id} does not exist.`);
    }
  }

  async findUserIdByToken(token: string): Promise<number | null> {
    try {
      const user = await this.db.user.findFirst({
        where: {
          token: token,
        },
        select: {
          id: true,
        },
      });
      return user?.id || null;
    } catch (error) {
      console.error('Error finding user by token:', error);
      throw error;
    }
  }
}
