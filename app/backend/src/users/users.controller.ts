import { Controller, ParseIntPipe, Body, Param, Get, Post, Patch, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserProfileDto } from './dto/user-profile.dto';


@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  
  // TODO: update endpoints to include access token
  @Post('register')
  @ApiOperation({ summary: 'Adds user to database and returns id for this user'})
  @ApiCreatedResponse({ description: 'User successfully created', type: Number })

  register(@Body() createUser: CreateUserDto) : Promise<Number> {
    return this.usersService.create(createUser);
  }

  @Get('all')
  @ApiOperation({ summary: 'Returns all users currently in the database'})
  @ApiOkResponse({ type: [UserProfileDto] })
  @ApiNotFoundResponse({ description: "No users in the database" })

  findAll() : Promise<UserProfileDto[]> {
    return this.usersService.findAll();
  }

  @Get('allButMe/:id')
  @ApiOperation({ summary: 'Returns all users currently in the database except the one with the specified id'})
  @ApiOkResponse({ type: [UserProfileDto] })
  @ApiNotFoundResponse({ description: "No users in the database" })

  findAllButMe(@Param('id', ParseIntPipe) id: number) : Promise<UserProfileDto[]> {
	return this.usersService.findAllButMe(id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns user with specified id'})
  @ApiOkResponse({ type: UserProfileDto }) 
  @ApiNotFoundResponse({ description: 'User with #${id} does not exist' })

  findOne(@Param('id', ParseIntPipe) id: number) : Promise<UserProfileDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates user with specified id'})
  @ApiOkResponse({ type: UserProfileDto })

  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) : Promise<UserProfileDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes user with specified id'})
  @ApiOkResponse({ description: 'User successfully deleted', type: UserProfileDto })

  remove(@Param('id', ParseIntPipe) id: number) : Promise<UserProfileDto> {
    return this.usersService.remove(id);
  }
}
