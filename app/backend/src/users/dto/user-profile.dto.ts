import { ApiProperty, PartialType } from "@nestjs/swagger";
import { User } from "@prisma/client";

export class UserProfileDto implements User {

  hash: string;

  @ApiProperty({ required: false})
  token: string;

  @ApiProperty({ required: false})
  id: number;

  @ApiProperty({ required: false})
  loginName: string;

  @ApiProperty({ required: false})
  userName: string;

  @ApiProperty({ required: false})
  email: string;

  @ApiProperty({ required: false})
  firstName: string;

  @ApiProperty({ required: false})
  lastName: string;

  @ApiProperty({ required: false})
  avatarId: number;

  @ApiProperty({ required: false})
  online: number;

  @ApiProperty({ required: false})
  rank: number;

  @ApiProperty({ required: false})
  createdAt: Date;

  @ApiProperty({ required: false})
  updatedAt: Date;

}
