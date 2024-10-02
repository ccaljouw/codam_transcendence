import {
  Controller,
  ParseIntPipe,
  Body,
  Param,
  Get,
  Post,
  Patch,
  UseGuards,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { TokenService } from './token.service';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { CreateTokenDto } from '@ft_dto/socket';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Adds token with user id to database' })
  @ApiCreatedResponse({
    description: 'Token successfully created',
    type: Boolean,
  })
  addToken(@Body() createToken: CreateTokenDto): Promise<boolean> {
    console.log(
      `Adding token ${createToken.token} for user ${createToken.userId}`,
    );
    return this.tokenService.addTokenWithStaleCheck(createToken);
  }

  @Get('all')
  // @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns all users currently in the database' })
  @ApiOkResponse({ type: [UserProfileDto] })
  @ApiNotFoundResponse({ description: 'No users in the database' })
  findAll(): Promise<UserProfileDto[]> {
    return this.usersService.findAll();
  }

  @Get('username/:userName')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns user with specified userName' })
  @ApiOkResponse({ type: UserProfileDto })
  @ApiNotFoundResponse({
    description: 'User with this userName does not exist',
  })
  findUserName(@Param('userName') userName: string): Promise<UserProfileDto> {
    return this.usersService.findUserName(userName);
  }

  @Get('allButMe/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Returns all users currently in the database except the one with the specified id',
  })
  @ApiOkResponse({ type: [UserProfileDto] })
  @ApiNotFoundResponse({ description: 'No users in the database' })
  findAllButMe(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserProfileDto[]> {
    return this.usersService.findAllButMe(id);
  }

  @Get('friendsFrom/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Returns all friends of the user with the specified id',
  })
  @ApiOkResponse({ type: [UserProfileDto] })
  @ApiNotFoundResponse({ description: 'No friends in the database' })
  findFriendsFrom(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<UserProfileDto[]> {
    console.log('Finding friends for user: ' + id);
    return this.usersService.findFriendsFrom(id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns user with specified id' })
  @ApiOkResponse({ type: UserProfileDto })
  @ApiNotFoundResponse({ description: 'User with #${id} does not exist' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<UserProfileDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Updates user with specified id' })
  @ApiOkResponse({ type: UserProfileDto })
  @ApiConflictResponse({
    description: `Conflict: Unique constraint failed on the field: []`,
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserProfileDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Get('block/:id/:blockId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Blocks user with specified id' })
  @ApiOkResponse({ description: 'User successfully blocked' })
  blockUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('blockId', ParseIntPipe) blockId: number,
  ): Promise<UserProfileDto> {
    return this.usersService.blockUser(id, blockId);
  }

  @Get('unblock/:id/:blockId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Unblocks user with specified id' })
  @ApiOkResponse({ description: 'User successfully unblocked' })
  unblockUser(
    @Param('id', ParseIntPipe) id: number,
    @Param('blockId', ParseIntPipe) blockId: number,
  ): Promise<UserProfileDto> {
    return this.usersService.unBlockUser(id, blockId);
  }
}
