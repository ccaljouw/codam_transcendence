import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { CreateInviteDto } from "./create-invite.dto";

export class ChatMessageToRoomDto {
	
	@IsInt()
	userId: number = 0;
	@IsString()
	userName: string = "";
	@IsString()
	room: string = "";
	@IsString()
	message: string = "";
	@IsBoolean()
	action: boolean = false;
	@IsOptional()
	@IsNumber()
	inviteId?: number;
	invite?: CreateInviteDto;
}