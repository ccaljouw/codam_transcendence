import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsNotEmpty } from "class-validator";

export class UpdatePwdDto {

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  userId: number;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  oldPwd: string;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  newPwd: string;
}