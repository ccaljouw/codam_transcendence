import { Invite } from "@prisma/client";

export class ChatMessageToRoomDto {
	
	userId: number = 0;
	userName: string = "";
	room: string = "";
	message: string = "";
	action: boolean = false;
	inviteId?: number;
	invite?: Invite;
}