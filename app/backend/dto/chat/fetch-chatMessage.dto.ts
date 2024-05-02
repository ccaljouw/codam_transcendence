import { Invite } from "@prisma/client";

export class FetchChatMessageDto {
	chatId: number = 0;
	userId: number = 0;
	userName: string = ''; // this is where this dto differs from update-chatMessage, it fetches the userName from user table
	message: string = '';
	inviteId?: number;
	invite?: Invite;
}