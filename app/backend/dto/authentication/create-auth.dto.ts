import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty, IsOptional } from "class-validator";

export class CreateAuthDto {

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  userId: number;

  @IsOptional()
  @ApiProperty({ required: false })
  pwd?: string;
}
