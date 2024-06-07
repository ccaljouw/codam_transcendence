import { ApiProperty } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
} from 'class-validator';

// todo: Carien: create database table, API endpoint
export class StatsDto {
  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  userId: number;
  
  @IsInt()
  @ApiProperty({ required: false, type: Number })
  rank: number;

  @ApiProperty({ required: false, type: Number })
  winLossRatio: number;

  @IsInt()
  @ApiProperty({ required: false, type: Number })
  friends: number;
  
  //achievementDto
  // achievements: achievementDto[];
  
  //gameResultDto
  // last10Games: gameResultDto[];
}
