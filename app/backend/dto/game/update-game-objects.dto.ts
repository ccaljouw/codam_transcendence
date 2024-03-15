import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateGameObjectsDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsInt()
  roomId: number;

  @ApiProperty({ required: false })
  @IsInt()
  ballX?: number;

  @ApiProperty({ required: false })
  @IsInt()
  ballY?: number;

  @ApiProperty({ required: false })
  @IsInt()
  ballDirection?: number;

  @ApiProperty({ required: false })
  @IsInt()
  ballSpeed?: number;

  @ApiProperty({ required: false })
  @IsInt()
  ballDX?: number;

  @ApiProperty({ required: false })
  @IsInt()
  ballDY?: number;

  @ApiProperty({ required: false })
  @IsInt()
  paddle1Y?: number;

  @ApiProperty({ required: false })
  @IsInt()
  paddle2Y?: number;

  @ApiProperty({ required: false })
  @IsInt()
  score1?: number;

  @ApiProperty({ required: false })
  @IsInt()
  score2?: number;

  @ApiProperty({ required: false })
  @IsInt()
  resetGame?: number;

  @ApiProperty({ required: false })
  @IsInt()
  resetMatch?: number;

  @ApiProperty({ required: false })
  @IsInt()
  finish?: number;

  @ApiProperty({ required: false })
  @IsInt()
  winner?: number;
}
