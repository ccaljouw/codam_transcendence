import { ChatType } from "@prisma/client";

export class FetchChatDto {
	id: number;
	ownerId: number;
	visibility: ChatType;
}