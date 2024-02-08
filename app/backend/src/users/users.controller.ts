import {
  Controller,
  ParseIntPipe,
  NotFoundException,
  Body,
  Param,
  Get,
  Post,
  Patch,
  Delete,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO: update endpoints to include access token

  @Get('all')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UsersController }) // change type!!
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with #${id} does not exist.`);
    }
    return user;
  }

  @Post('register')
  @ApiCreatedResponse({ description: 'User successfully created', type: Number }) // change type!!
  async register(@Body() CreateUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(CreateUserDto);
    return newUser.id;
  }

  @Patch(':id')
  @ApiOkResponse({ type: CreateUserDto }) // change type!!
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ description: 'User successfully deleted', type: CreateUserDto }) // change type!!
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // TODO: update password?
}
