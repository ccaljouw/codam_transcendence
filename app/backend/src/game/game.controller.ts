import { Controller, ParseIntPipe, Param, Get, Delete, Patch, Body } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateGameDto } from 'dto/game/update-game.dto';
import { GameService } from './game.service';
import { UpdateGameStateDto } from 'dto/game/update-game-state.dto';

@Controller('game')
@ApiTags('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Get('getGame/:userId')
  @ApiOperation({ summary: 'Checks if there is a player waiting and if so returns new game id'})
  async getGame(@Param('userId', ParseIntPipe) userId: number) : Promise<UpdateGameDto> {
    const game = await this.gameService.getGame(userId);
    console.log(game.GameUsers[0]);
    console.log(game.GameUsers[1]);
    return game;
  }

  @Get('all')
  @ApiOperation({ summary: 'Returns all games currently in the database'})
  @ApiOkResponse({ type: [UpdateGameDto] })
  @ApiNotFoundResponse({ description: "No games in the database" })

  findAll() : Promise<UpdateGameDto[]> {
    return this.gameService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Returns game with specified id'})
  @ApiOkResponse({ type: UpdateGameDto }) 
  @ApiNotFoundResponse({ description: 'Game with #${id} does not exist' })

  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.gameService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Updates user with specified id'})
  @ApiOkResponse({ type: UpdateGameStateDto })

  update(@Param('id', ParseIntPipe) id: number, @Body() updateGameStateDto: UpdateGameStateDto) : Promise<number> {
    return this.gameService.update(updateGameStateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deletes game with specified id'})
  @ApiOkResponse({ description: 'Game successfully deleted', type: UpdateGameDto })

  remove(@Param('id', ParseIntPipe) id: number) : Promise<UpdateGameDto> {
    return this.gameService.remove(id);
  }
}
