import { ApiProperty } from "@nestjs/swagger";
import { OnlineStatus, Token42, Tokens, User } from "@prisma/client";
import { Exclude } from "class-transformer";

export class UserProfileDto implements User {

	@ApiProperty({ required: false })
	id: number;

	@ApiProperty({ required: false })
	loginName: string;

	@ApiProperty({ required: false })
	userName: string;

	@ApiProperty({ required: false })
	email: string;

	@ApiProperty({ required: false })
	firstName: string;

	@ApiProperty({ required: false })
	lastName: string;

	@ApiProperty({ required: false })
	avatarId: number;

	@ApiProperty({ required: false })
	theme: number;

	@ApiProperty({ required: false })
	online: OnlineStatus;

	@ApiProperty({ required: false })
	createdAt: Date;

	@ApiProperty({ required: false })
	updatedAt: Date;

  // dmId: number;
	@ApiProperty({ required: false })
	friends?: UserProfileDto[];

	@ApiProperty({ required: false })
	blocked?: UserProfileDto[];
  
  @Exclude()
	hash: string;
}
