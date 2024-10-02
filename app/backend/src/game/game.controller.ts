import {
  Controller,
  ParseIntPipe,
  Param,
  Get,
  Delete,
  Patch,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateGameDto } from 'dto/game/update-game.dto';
import { GameService } from './game.service';
import { UpdateGameStateDto } from 'dto/game/update-game-state.dto';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';
import { GetGameDto } from '@ft_dto/game';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns all games currently in the database' })
  @ApiOkResponse({ type: [UpdateGameDto] })
  @ApiNotFoundResponse({ description: `No games in the database` })
  findAll(): Promise<UpdateGameDto[]> {
    return this.gameService.findAll();
  }

  @Patch('getGame')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'returns game for inviteId game id' })
  async getGameInvite(@Body() getGameDto: GetGameDto): Promise<UpdateGameDto> {
    console.log('Patch getGame:', getGameDto);
    if (getGameDto.inviteId === 0)
      return this.gameService.findRandomGame(
        getGameDto.userId,
        getGameDto.clientId,
      );
    else if (getGameDto.inviteId === -1)
      return this.gameService.createAiGame(
        getGameDto.userId,
        getGameDto.clientId,
      );
    else
      return this.gameService.findInviteGame(
        getGameDto.inviteId,
        getGameDto.userId,
        getGameDto.clientId,
      );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns game with specified id' })
  @ApiOkResponse({ type: UpdateGameDto })
  @ApiNotFoundResponse({ description: 'Game with #${id} does not exist' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gameService.findOne(id);
  }

  @Get('invite/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns gameId for specified inviteId' })
  @ApiOkResponse({ type: Number })
  @ApiNotFoundResponse({ description: 'Game with #${id} does not exist' })
  findInviteGameId(@Param('id', ParseIntPipe) id: number) {
    return this.gameService.findInviteGameId(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Updates user with specified id' })
  @ApiOkResponse({ type: UpdateGameStateDto })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateGameStateDto: UpdateGameStateDto,
  ): Promise<boolean> {
    return this.gameService.update(updateGameStateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Deletes game with specified id' })
  @ApiOkResponse({
    description: 'Game successfully deleted',
    type: UpdateGameDto,
  })
  remove(@Param('id', ParseIntPipe) id: number): Promise<UpdateGameDto> {
    return this.gameService.remove(id);
  }
}
