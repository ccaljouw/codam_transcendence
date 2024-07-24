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
import { JwtAuthGuard } from 'src/authentication/guard/jwt-auth.guard';

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

  @Get('getGame/:userId/:clientId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary:
      'Checks if there is a player waiting and if so returns new game id',
  })
  async getGame(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('clientId') clientId: string,
  ): Promise<UpdateGameDto> {
    console.log('in get game');
    console.log('userId: ', userId);
    console.log('clientId', clientId);
    const game = await this.gameService.getGame(userId, clientId);
    console.log(game.GameUsers[0]);
    console.log(game.GameUsers[1]);
    return game;
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns game with specified id' })
  @ApiOkResponse({ type: UpdateGameDto })
  @ApiNotFoundResponse({ description: 'Game with #${id} does not exist' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gameService.findOne(id);
  }

  @Get(':clientId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns gameId of game that contains clientId' })
  @ApiNotFoundResponse({
    description: `No games with this clientId in the database`,
  })
  findMany(@Param('clientId') clientId: string) {
    return this.gameService.findGameForClientId(clientId);
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
