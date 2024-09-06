import { InviteType } from "@prisma/client";
import { constants } from "src/globals/constants.globalvar";
import { FetchChatDto, InviteSocketMessageDto } from "@ft_dto/chat";
import { UserProfileDto } from "@ft_dto/users";
import { Socket } from "socket.io-client";
import { fetchProps } from "src/globals/functionComponents/useFetch";
import { fetchMessages } from "../chatFetchFunctions";
import { gameResponseReceivedHandler } from "./gameInvite";
import { chatResponseReceivedHandler } from "./chatInvite";

export interface inviteCallbackProps {
	inviteId: number | undefined,
	accept: boolean,
	senderId: number | undefined,
	inviteType: InviteType | undefined,
	currentChatRoom: FetchChatDto,
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
		case InviteType.CHAT:
			props.chatInviteFetcher({ url: constants.INVITE_RESPOND_TO_CHAT_REQUEST + props.inviteId + "/" + (props.accept ? "true" : "false") });
			break	
	}
	if (!props.accept) { // If the invite was rejected, we need to send a response to the sender. If it was accepted, response will be handled bu the useEffect on the useFetch hook.
		const inviteResponsePayload: InviteSocketMessageDto = {
			userId: props.currentUser.id,
			senderId: props.senderId ? props.senderId : 0,
			accept: false,
			type: props.inviteType,
			directMessageId: props.currentChatRoom.id,
		}
		props.chatSocket.emit('invite/inviteResponse', inviteResponsePayload);
	}
}
export const inviteResponseHandler = async ( // This function triggers the actions that need to be taken when an invite response is received.
	payload: InviteSocketMessageDto,
	currentUser: UserProfileDto,
	currentChatRoom: FetchChatDto,
	chatMessagesFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>,
	friendInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>,
	newChatRoom: { room: number, count: number }, 
	setNewChatRoom: (newChatRoom: { room: number, count: number }) => void,
	switchToChannelCounter: { channel: number, count: number, invite: number },
	setSwitchToChannelCounter: (switchToChannelCounter: { channel: number, count: number, invite: number }) => void
) => {
	if (payload.senderId != currentUser.id) // If the sender is not the current user, we don't need to do anything.
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
		case InviteType.CHAT:
			chatResponseReceivedHandler(payload, currentChatRoom.id, newChatRoom, setNewChatRoom, switchToChannelCounter, setSwitchToChannelCounter);
			break;
	}
}