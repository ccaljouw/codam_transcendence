import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { PrismaService } from '../../database/prisma.service';
import { UserProfileDto } from '../dto/user-profile.dto';
import { CreateUserDto } from '../dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(private db: PrismaService) {}

  private getUserProfile(user: CreateUserDto | UpdateUserDto ) : UserProfileDto {
    // creates a new object profile that excluded the attributs before  ...
    const { hash, ...profile } = user;
    return profile;
  }

  async create(createUserDto: CreateUserDto) {
    if (!createUserDto.userName)
      createUserDto.userName = createUserDto.loginName;
    console.log(createUserDto);
    const newUser = await this.db.user.create({ data: createUserDto });
    return newUser.id;
  }

  findAll() {
    return this.db.user.findMany({});
  }

  async findOne(id: number) {
    const user = await this.db.user.findUnique({ where: { id } });
    return this.getUserProfile(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const updatedUser = await this.db.user.update({
      where: { id },
      data: updateUserDto,
    });
    return this.getUserProfile(updatedUser);
  }

  async remove(id: number) {
    const deletedUser = await this.db.user.delete({ where: { id } });
    return this.getUserProfile(deletedUser);
  }
}
