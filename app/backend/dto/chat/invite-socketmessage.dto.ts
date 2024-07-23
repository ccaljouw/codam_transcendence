import { InviteType } from "@prisma/client";

export class InviteSocketMessageDto {
	userId: number = 0;
	senderId: number = 0;
	accept: boolean = false;
	type?: InviteType = InviteType.FRIEND;
	directMessageId: number = 0;
}