import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {

  constructor(private db: PrismaService) {}

  private removeHash(userToModify: CreateUserDto | UpdateUserDto) {
    const modifiedUser = { ...userToModify };

    delete modifiedUser.hash;
    return modifiedUser;
  }

  async create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.db.user.create({ data: createUserDto });
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
    const deletedUser = await this.db.user.delete({ where: { id } });
    return this.removeHash(deletedUser);
  }
}
