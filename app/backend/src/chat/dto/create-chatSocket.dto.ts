import { IsInt, IsNotEmpty } from "class-validator";

export class CreateChatSocketDto {
	@IsNotEmpty()
	@IsInt()
	user1_id: number;

	@IsNotEmpty()
	@IsInt()
  	user2_id: number;
}
