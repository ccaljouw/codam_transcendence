import { InviteType } from "@prisma/client";
import { constants } from "src/globals/constants.globalvar";
import { UpdateChatDto, InviteSocketMessageDto } from "@ft_dto/chat";
import { UserProfileDto } from "@ft_dto/users";
import { Socket } from "socket.io-client";
import { fetchProps } from "src/globals/functionComponents/useFetch";
import { fetchMessages } from "./chatFetchFunctions";
import { gameResponseReceivedHandler } from "./gameInvite";

export interface inviteCallbackProps {
	inviteId: number | undefined,
	accept: boolean,
	senderId: number | undefined,
	inviteType: InviteType
	currentChatRoom: UpdateChatDto,
	currentUser: UserProfileDto,
	chatSocket: Socket,
	friendInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>
	gameInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>
	chatInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>
}

export const inviteCallback = (
	props: inviteCallbackProps,
) => {
	switch (props.inviteType) {
		case InviteType.FRIEND:
			props.friendInviteFetcher({ url: constants.INVITE_RESPOND_TO_FRIEND_REQUEST + props.inviteId + "/" + (props.accept ? "true" : "false") });
			break;
		case InviteType.GAME:
			props.gameInviteFetcher({ url: constants.INVITE_RESPOND_TO_GAME_REQUEST + props.inviteId + "/" + (props.accept ? "true" : "false") });
			break;
	}
	if (!props.accept) {
		const inviteResponsePayload: InviteSocketMessageDto = {
			userId: props.currentUser.id,
			senderId: props.senderId ? props.senderId : 0,
			accept: false,
			type: props.inviteType,
			directMessageId: props.currentChatRoom.id
		}
		props.chatSocket.emit('invite/inviteResponse', inviteResponsePayload);
	}
}
export const inviteResponseHandler = async ( // This function triggers the actions that need to be taken when an invite response is received.
	payload: InviteSocketMessageDto,
	currentUser: UserProfileDto,
	currentChatRoom: UpdateChatDto,
	chatMessagesFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>,
	friendInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>,
) => {
	if (payload.senderId != currentUser.id)
		return;
	if (currentChatRoom.id == payload.directMessageId) // If the chat is open, we need to fetch the messages to update the invite.
		fetchMessages(currentChatRoom, chatMessagesFetcher, currentUser.id);
	switch (payload.type) {
		case InviteType.FRIEND:
			if (payload.accept) // If the invite was accepted, we need to fetch the user's friends list.
				friendInviteFetcher({ url: constants.API_USERS + currentUser.id })
			break;
		case InviteType.GAME:
			gameResponseReceivedHandler(payload);
			break;
	}
}