import { ApiProperty } from "@nestjs/swagger";

export class UserProfileDto {

  @ApiProperty({ required: false})
  loginName?: string;

  @ApiProperty({ required: false})
  userName?: string;

  @ApiProperty({ required: false})
  email?: string;

  @ApiProperty({ required: false})
  firstName?: string;

  @ApiProperty({ required: false})
  lastName?: string;

  @ApiProperty({ required: false})
  avatarId?: number;

  @ApiProperty({ required: false})
  online?: number;

  @ApiProperty({ required: false})
  rank?: number;
}