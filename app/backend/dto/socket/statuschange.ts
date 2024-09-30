import { ApiProperty } from '@nestjs/swagger';
import { OnlineStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class WebsocketStatusChangeDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  userId: number = 0;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(15)
  userName: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(20)
  token: string = '';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(OnlineStatus)
  status: OnlineStatus = OnlineStatus.OFFLINE;
}
