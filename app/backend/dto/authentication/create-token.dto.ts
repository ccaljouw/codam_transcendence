import { IsInt, IsNotEmpty } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class Create42TokenDto {

  @IsNotEmpty()
  @IsInt()
  @ApiProperty({ required: true, type: Number })
  userId: number;

  @IsNotEmpty()
  @ApiProperty({ required: true, type: String })
  access_token: string;

  @ApiProperty({ required: false, type: String })
  token_type: string;

  @ApiProperty({ required: false, type: String })
  refresh_token: string;

  @ApiProperty({ required: false, type: String })
  scope: string;

  @ApiProperty({ required: false, type: Date })
  createdAt: Date;

  @ApiProperty({ required: false, type: Date })
  expiredAt: Date;

  @ApiProperty({ required: false, type: Date })
  secret_valid_until: Date;
}