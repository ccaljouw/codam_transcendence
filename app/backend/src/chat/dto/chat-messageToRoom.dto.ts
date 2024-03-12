import { ApiProperty } from "@nestjs/swagger";

export class ChatMessageToRoomDto {
	
	// @ApiProperty({ required: false })
	userId: number = 0;
	userName: string = "";
	room: string = "";
	message: string = "";
	action: boolean = false;
}