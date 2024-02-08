import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';
import { UserProfileDto } from './dto/user-profile.dto';

@Injectable()
export class UsersService {

  constructor(private db: PrismaService) {}

  private removeHash(userToModify: UserProfileDto) {

    delete userToModify.hash;
    return userToModify;
  }

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.userName)
      createUserDto.userName = createUserDto.loginName;
    console.log(createUserDto);
    const newUser = await this.db.user.create({ data: createUserDto });
    const initState = { userId: newUser.id, online: 1}; //add token to create user and userState?
    await this.db.userState.create({ data: initState })
    return newUser.id;
  }

  findAll() {
    return this.db.user.findMany({});
  }

  findOne(id: number) {
    return this.db.user.findUnique({ where: { id } });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.db.user.update({
      where: { id },
      data: updateUserDto,
    });
    return this.removeHash(updatedUser);
  }

  async remove(id: number) {
    // check return types
    return this.db.user.delete({ where: { id } });
  }

}
