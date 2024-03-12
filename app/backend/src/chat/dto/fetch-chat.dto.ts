import { ChatType } from "@prisma/client";

export class FetchChatDto {
	id: number = 0;
	ownerId: number = 0;
	visibility: ChatType = ChatType.DM;
}