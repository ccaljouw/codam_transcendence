import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}
  create(createUserDto: CreateUserDto) {
    console.log(createUserDto);
    return this.db.user.create({ data: createUserDto });
  }

  findAll() {
    return this.db.user.findMany({});
  }

  findOne(id: number) {
    return this.db.user.findUnique({ where: { id } });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.db.user.update({
      where: { id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.db.user.delete({ where: { id } });
  }
}
