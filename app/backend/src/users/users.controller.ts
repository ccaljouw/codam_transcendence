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
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // TODO: update endpoints to include access token
  
  @Post('register')
  @ApiOperation({ summary: 'Adds user to database and returns id for this user'})
  @ApiCreatedResponse({ description: 'User successfully created', type: Number }) // change type!!
  async register(@Body() CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }

  @Get('all')
  @ApiOperation({ summary: 'Returns all users currently in the database'})
  @ApiOkResponse({ type: [CreateUserDto] })
  @ApiNotFoundResponse({ description: "No users in the database" })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns user with specified id'})
  @ApiOkResponse({ type: CreateUserDto }) // change type!!
  @ApiNotFoundResponse({ description: 'User with #${id} does not exist' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with #${id} does not exist.`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates user with specified id'})
  @ApiOkResponse({ type: CreateUserDto }) // change type!!
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes user with specified id'})
  @ApiOkResponse({ description: 'User successfully deleted', type: CreateUserDto }) // change type!!
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  // TODO: update password?
}
