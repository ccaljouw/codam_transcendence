import { ChatMessageToRoomDto, InviteSocketMessageDto } from "@ft_dto/chat"
import { UserProfileDto } from "@ft_dto/users"
import { inviteCallbackProps } from "./inviteFunctions"
import { InviteStatus } from "@prisma/client";
import DataFetcher from "src/globals/functionComponents/DataFetcher";
import { constants } from "src/globals/constants.globalvar";
import ChatLoader from "../components/ChatLoader";

export const gameResponseReceivedHandler = ( // This function triggers the actions that need to be taken when a game response is received.
	inviteSocketMessage: InviteSocketMessageDto
) => {
	// CHAT INVITE RESPONSE HANDLER FOR THE ONE WHO SENT THE INVITE
}

export const chatInviteParser = ( // This function parses the game invite message and returns the appropriate JSX element as message for the chat.
	message: ChatMessageToRoomDto,
	currentUser: UserProfileDto,
	inviteCallback: (props: inviteCallbackProps) => void,
	inviteCallbackProps: inviteCallbackProps
): JSX.Element => {
	if (!message.invite)
		return <></>;
	if (message.invite.senderId == currentUser.id) {
		switch (message.invite.state) {
			case InviteStatus.SENT:
				return <>You invited {message.message} to channel <DataFetcher<null,any> url={constants.CHAT_GET_CHAT_NAME + message.invite.chatId} showData={(data: any) => <>{data.name} <ChatLoader invite={message.invite}/></>} /></>
			case InviteStatus.ACCEPTED:
				return <>{message.message} accepted your request to join channel <DataFetcher<null,any> url={constants.CHAT_GET_CHAT_NAME + message.invite.chatId} showData={(data: any) => <>{data.name}</>} /></>
			case InviteStatus.REJECTED:
				return <>{message.message} rejected your request to join channel <DataFetcher<null,any> url={constants.CHAT_GET_CHAT_NAME + message.invite.chatId} showData={(data: any) => <>{data.name}</>} /></>
		}
	}
	else {
		switch (message.invite.state) {
			case InviteStatus.SENT:
				return (<>{message.userName} invited you to join channel <DataFetcher<null,any> url={constants.CHAT_GET_CHAT_NAME + message.invite.chatId} showData={(data: any) => <>{data.name}</>} />&nbsp;
					<span className={'invite-area'}>
						<span className={'invite-button'} onClick={() => inviteCallback({ ...inviteCallbackProps, accept: true })}>Accept</span>&nbsp;|&nbsp;
						<span className={'invite-button'} onClick={() => inviteCallback(inviteCallbackProps)}>Reject</span>
					</span>
				</>)
			case InviteStatus.ACCEPTED:
				return <>You accepted {message.userName}'s invite to channel <DataFetcher<null,any> url={constants.CHAT_GET_CHAT_NAME + message.invite.chatId} showData={(data: any) => <>{data.name}</>} /></>
			case InviteStatus.REJECTED:
				return <>You rejected {message.userName}'s invite to channel <DataFetcher<null,any> url={constants.CHAT_GET_CHAT_NAME + message.invite.chatId} showData={(data: any) => <>{data.name}</>} /></>
		}
	}
	return <></>;
}