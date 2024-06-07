import { Controller, ParseIntPipe, Body, Param, Get, Post, Patch, Delete } from '@nestjs/common';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto, UserProfileDto} from '@ft_dto/users';
import { CreateTokenDto } from '@ft_dto/users/create-token.dto';
import { TokenService } from './token.service';
import { StatsDto } from '@ft_dto/stats/stats.dto';
import { StatsService } from './stats.service';


@Controller('stats')
@ApiTags('stats')
export class StatsController {
	constructor(
    private readonly statsService: StatsService,
	) { }

  @Get(':userId')
	@ApiOperation({ summary: 'Returns stats for the user with the specified id' })
	@ApiOkResponse({ type: [StatsDto] })
	@ApiNotFoundResponse({ description: "No stats for this user in the database" })

	findStatsFor(@Param('userId', ParseIntPipe) userId: number): Promise<StatsDto> {
		console.log("Finding stats for user: " + userId);
		return this.statsService.findStatsFor(userId);
	}
}
