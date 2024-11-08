import { IsInt, IsNotEmpty } from "class-validator";

export class CreateDMDto {
	@IsInt()
	@IsNotEmpty()
	user1Id: number = 0;
	
	@IsInt()
	@IsNotEmpty()
	user2Id: number = 0;
}
