import {
  Controller,
  Get,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { StatsService } from './stats.service';
import { GameResultDto, StatsDto } from '@ft_dto/stats';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/authentication/guard/jwt-auth.guard';

@Controller('stats')
@ApiTags('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Returns all stats sorted by wins and win/loss ratio',
  })
  @ApiOkResponse({ type: [StatsDto] })
  findAll(): Promise<StatsDto[]> {
    return this.statsService.findAll();
  }

  @Get('top10')
  @ApiOperation({
    summary:
      'Returns top 10 players (usernames) sorted by wins and win/loss ratio',
  })
  @ApiOkResponse({ type: [String] })
  findRankTop10(): Promise<string[]> {
    return this.statsService.findRankTop10();
  }

  @Get('rank/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns the rank of player with provided userid' })
  @ApiOkResponse({ type: Number })
  getRank(@Param('userId', ParseIntPipe) userId: number): Promise<number> {
    return this.statsService.getRank(userId);
  }

  @Get('nrOfFriends/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Returns nr of friends of player with provided userid',
  })
  @ApiOkResponse({ type: Number })
  getFriendCount(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<number> {
    return this.statsService.getFriendCount(userId);
  }

  @Get('last10Games/:userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns last 10 games played by user' })
  @ApiOkResponse({ type: [GameResultDto] })
  getLast10Games(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<GameResultDto[]> {
    return this.statsService.getLast10Games(userId);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Returns the stats of player with provided userid' })
  @ApiOkResponse({ type: StatsDto })
  findOne(@Param('userId', ParseIntPipe) userId: number): Promise<StatsDto> {
    return this.statsService.findOne(userId);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard)
  @Get(':userId')
  @ApiOperation({ summary: 'Deletes the stats of player with provided userid' })
  @ApiOkResponse({ type: StatsDto })
  remove(@Param('userId') id: string): Promise<StatsDto> {
    return this.statsService.remove(+id);
  }
}
