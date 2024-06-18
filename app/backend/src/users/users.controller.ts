import { Controller, ParseIntPipe, Body, Param, Get, Post, Patch, Delete } from '@nestjs/common';
import { ApiBadRequestResponse, ApiConflictResponse, ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserProfileDto} from '@ft_dto/users';
import { CreateTokenDto } from '@ft_dto/users/create-token.dto';
import { TokenService } from './token.service';


@Controller('users')
@ApiTags('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly tokenService: TokenService,
	) { }

	// TODO: update endpoints to include access token
	@Post('register')
	@ApiOperation({ summary: 'Adds user to database and returns id for this user' })
	@ApiCreatedResponse({ description: 'User successfully created', type: UserProfileDto })

	register(@Body() createUser: CreateUserDto): Promise<UserProfileDto> {
		return this.usersService.create(createUser);
	}

	@Post('token')
	@ApiOperation({ summary: 'Adds token with user id to database' })
	@ApiCreatedResponse({ description: 'Token successfully created', type: Boolean })

	addToken(@Body() createToken: CreateTokenDto): Promise<boolean> {
		console.log(`Adding token ${createToken.token} for user ${createToken.userId}`);

		return this.tokenService.addTokenWithStaleCheck(createToken);
	}

	@Get('all')
	@ApiOperation({ summary: 'Returns all users currently in the database' })
	@ApiOkResponse({ type: [UserProfileDto] })
	@ApiNotFoundResponse({ description: "No users in the database" })

	findAll(): Promise<UserProfileDto[]> {
		return this.usersService.findAll();
	}

  @Get('username/:userName')
  @ApiOperation({ summary: 'Returns user with specified userName' })
  @ApiOkResponse({ type: UserProfileDto })
  @ApiNotFoundResponse({ description: 'User with this userName does not exist' })

  findUserName(@Param('userName') userName: string): Promise<UserProfileDto> {
    return this.usersService.findUserName(userName);
  }

	@Get('allButMe/:id')
	@ApiOperation({ summary: 'Returns all users currently in the database except the one with the specified id' })
	@ApiOkResponse({ type: [UserProfileDto] })
	@ApiNotFoundResponse({ description: "No users in the database" })

	findAllButMe(@Param('id', ParseIntPipe) id: number): Promise<UserProfileDto[]> {
		return this.usersService.findAllButMe(id);
	}

	@Get('friendsFrom/:id')
	@ApiOperation({ summary: 'Returns all friends of the user with the specified id' })
	@ApiOkResponse({ type: [UserProfileDto] })
	@ApiNotFoundResponse({ description: "No friends in the database" })

	findFriendsFrom(@Param('id', ParseIntPipe) id: number): Promise<UserProfileDto[]> {
		console.log("Finding friends for user: " + id);
		return this.usersService.findFriendsFrom(id);
	}

	@Get(':id')
	@ApiOperation({ summary: 'Returns user with specified id' })
	@ApiOkResponse({ type: UserProfileDto })
	@ApiNotFoundResponse({ description: 'User with #${id} does not exist' })

	findOne(@Param('id', ParseIntPipe) id: number): Promise<UserProfileDto> {
		return this.usersService.findOne(id);
	}

  
	@Patch(':id')
	@ApiOperation({ summary: 'Updates user with specified id' })
	@ApiOkResponse({ type: UserProfileDto })
  @ApiConflictResponse( {description: `Conflict: Unique constraint failed on the field: []`} )
  @ApiBadRequestResponse( {description: 'Bad request: description of validation error'})

	update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<UserProfileDto> {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	@ApiOperation({ summary: 'Deletes user with specified id' })
	@ApiOkResponse({ description: 'User successfully deleted', type: UserProfileDto })

	remove(@Param('id', ParseIntPipe) id: number): Promise<UserProfileDto> {
		return this.usersService.remove(id);
	}

	@Get('block/:id/:blockId')
	@ApiOperation({ summary: 'Blocks user with specified id' })
	@ApiOkResponse({ description: 'User successfully blocked' })
	blockUser(@Param('id', ParseIntPipe) id: number, @Param('blockId', ParseIntPipe) blockId: number): Promise<UserProfileDto> {
		return this.usersService.blockUser(id, blockId);
	}

	@Get('unblock/:id/:blockId')
	@ApiOperation({ summary: 'Unblocks user with specified id' })
	@ApiOkResponse({ description: 'User successfully unblocked' })
	unblockUser(@Param('id', ParseIntPipe) id: number, @Param('blockId', ParseIntPipe) blockId: number): Promise<UserProfileDto> {
		return this.usersService.unBlockUser(id, blockId);
	}
}
