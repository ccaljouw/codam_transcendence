import { OnlineStatus } from "@prisma/client";

export class WebsocketStatusChangeDto {
	userId: number = 0;
	userName: string = '';
	token: string = '';
	status: OnlineStatus = OnlineStatus.OFFLINE;
}