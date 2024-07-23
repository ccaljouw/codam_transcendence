import { IsBoolean, IsInt, IsNumber, IsOptional, IsString } from "class-validator";
import { UpdateInviteDto } from "./update-invite.dto";
import { ChatType } from "@prisma/client";

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
	chatType?: ChatType;
	@IsOptional()
	@IsNumber()
	inviteId?: number;
	invite?: UpdateInviteDto;
}