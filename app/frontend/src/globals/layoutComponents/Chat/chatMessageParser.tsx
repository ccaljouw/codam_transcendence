import { ChatMessageToRoomDto, FetchChatDto } from "@ft_dto/chat";
import { fetchProps } from "src/globals/functionComponents/useFetch";
import { UserProfileDto } from "@ft_dto/users";
import { Socket } from "socket.io-client";

import { IsBlocked } from "src/globals/functionComponents/FriendOrBlocked";
import { gameInviteParser } from "./inviteFunctions/gameInvite";
import { inviteCallbackProps } from "./inviteFunctions/inviteFunctions";
import { friendInviteParser } from "./inviteFunctions/friendInvite";
import { chatInviteParser } from "./inviteFunctions/chatInvite";


export interface parserProps {
	inviteCallback: (props: inviteCallbackProps) => void,
	currentChatRoom: FetchChatDto,
	currentUser: UserProfileDto,
	chatSocket: Socket,
	friendInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>,
	gameInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>,
	chatInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>,
	changeRoomStatusCallback: (userId: number, status: boolean) => void
	userKickedCallback: (channel: number) => void
}

export const messageParser = (
	message: ChatMessageToRoomDto, context: parserProps
): JSX.Element | null => {
	const { inviteCallback, currentChatRoom, currentUser, chatSocket, friendInviteFetcher, gameInviteFetcher, chatInviteFetcher, changeRoomStatusCallback, userKickedCallback } = context;
	if (IsBlocked(message.userId, currentUser))
		return null;
	console.log(message);
	console.log("message.userId: ", message.userId, "currentUser.id: ", currentUser.id);
	if (message.action) {
		if (message.userId != currentUser.id) // Don't show own actions
		{
			switch (message.message) { // 
				case "JOIN":
					changeRoomStatusCallback(message.userId, true);
					return <>{'<<'} {message.userName} has joined the chat {'>>'}</>
				case "LEAVE":
					changeRoomStatusCallback(message.userId, false);
					return <>{'<<'} {message.userName} has left the chat {'>>'}</>
				case "KICK":
					return <>{'<<'} {message.userName} was kicked from the chat {'>>'}</>
				case "MUTE":
					return <>{'<<'} {message.userName} was muted {'>>'}</>
				case "BAN":
					return <>{'<<'} {message.userName} was banned from the chat {'>>'}</>
				default:
					if (!message.inviteId)
						return <>{message.message}</>
			}
		}
		switch (message.message) {
			case "KICK":
				console.log("I was kicked");
				userKickedCallback(-2);
				return <>{'<<'} You were kicked from the chat {'>>'}</>
			case "MUTE":
				return <>{'<<'} You were muted {'>>'}</>
			case "BAN":
				console.log("I was banned");
				userKickedCallback(-3);
				return <>{'<<'} You were banned from the chat {'>>'}</>
			case "LEAVE":
				return null;
			case "JOIN":
				return null;
		}
	}
	if (message.inviteId) {
		console.log("Parsing invite");
		return inviteParser(message, currentChatRoom, currentUser, chatSocket, inviteCallback, friendInviteFetcher, gameInviteFetcher, chatInviteFetcher);
	}
	else {
		if (message.action)
			return <>{message.message}</>
		else
			return <>{message.userName}: {message.message}</>
	}
}

const inviteParser = (
	message: ChatMessageToRoomDto,
	currentChatRoom: FetchChatDto,
	currentUser: UserProfileDto,
	chatSocket: Socket,
	inviteCallback: (props: inviteCallbackProps) => void,
	friendInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>,
	gameInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>,
	chatInviteFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>
): JSX.Element => {
	if (!message.invite)
		return <></>;

	const inviteCallbackProps: inviteCallbackProps = {
		inviteId: message.invite.id,
		accept: false,
		senderId: message.invite.senderId,
		inviteType: message.invite.type,
		currentChatRoom: currentChatRoom,
		currentUser: currentUser,
		chatSocket: chatSocket,
		friendInviteFetcher: friendInviteFetcher,
		gameInviteFetcher: gameInviteFetcher,
		chatInviteFetcher: chatInviteFetcher
	}
	console.log("Parsing invite");
	switch (message.invite.type) {
		case "FRIEND":
			return friendInviteParser(message, currentUser, inviteCallback, inviteCallbackProps);
		case "GAME":
			return gameInviteParser(message, currentUser, inviteCallback, inviteCallbackProps);
		case "CHAT":
			return chatInviteParser(message, currentUser, inviteCallback, inviteCallbackProps);;
	}
	return <>Error parsing invite</>;
}