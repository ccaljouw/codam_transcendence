import { Controller, Get, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { StatsService } from './stats.service';
import { StatsDto } from '@ft_dto/stats';
import { ApiTags } from '@nestjs/swagger';

@Controller('stats')
@ApiTags('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  findAll() {
    return this.statsService.findAll();
  }

  @Get('top10')
  findRankTop10() {
    return this.statsService.findRankTop10();
  }

  @Get('rank/:userId')
  getRank(@Param('userId', ParseIntPipe) userId: number): Promise<number> {
    console.log("Finding stats for user: " + userId);
    return this.statsService.getRank(userId);
  }
  
  @Get('nrOfFriends/:userId')
  getFriendCount(@Param('userId', ParseIntPipe) userId: number): Promise<number> {
    console.log("Finding stats for user: " + userId);
    return this.statsService.getFriendCount(userId);
  }

  @Get(':userId')
  findOne(@Param('userId', ParseIntPipe) userId: number): Promise<StatsDto> {
		console.log("Finding stats for user: " + userId);
		return this.statsService.findOne(userId);
	}

  @Delete(':userId')
  remove(@Param('userId') id: string) {
    return this.statsService.remove(+id);
  }
}
