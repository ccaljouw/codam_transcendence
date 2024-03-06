import { OnlineStatus } from "@prisma/client";

export class WebsocketStatusChangeDto {
	userid: number;
	username: string;
	token: string;
	status: OnlineStatus;
}