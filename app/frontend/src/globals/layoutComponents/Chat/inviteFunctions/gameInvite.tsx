import { ChatMessageToRoomDto, InviteSocketMessageDto } from "@ft_dto/chat"
import { UserProfileDto } from "@ft_dto/users"
import { inviteCallbackProps } from "./inviteFunctions"
import { InviteStatus } from "@prisma/client";

export const gameResponseReceivedHandler = ( // This function triggers the actions that need to be taken when a game response is received.
	inviteSocketMessage: InviteSocketMessageDto
) => {
	console.log(`Got invite response from ${inviteSocketMessage.userId} to ${inviteSocketMessage.senderId} -> ${inviteSocketMessage.accept} for chat ${inviteSocketMessage.directMessageId}`);
	console.log("HANDLE GAME RESPONSE BY THE ONE WHO SENT THE INVITE HERE");
}

export const gameInviteParser = ( // This function parses the game invite message and returns the appropriate JSX element as message for the chat.
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
				return <>You invited {message.message} to play a game</>
			case InviteStatus.ACCEPTED:
				return <>You are now playing a game with {message.message}</>
			case InviteStatus.REJECTED:
				return <>{message.message} rejected your game request</>
		}
	}
	else {
		switch (message.invite.state) {
			case InviteStatus.SENT:
				return (<>{message.userName} invited you to play a game&nbsp;
					<span className={'invite-area'}>
						<span className={'invite-button'} onClick={() => inviteCallback({ ...inviteCallbackProps, accept: true })}>Accept</span>&nbsp;|&nbsp;
						<span className={'invite-button'} onClick={() => inviteCallback(inviteCallbackProps)}>Reject</span>
					</span>
				</>)
			case InviteStatus.ACCEPTED:
				return <>You accepted {message.userName}'s game request</>
			case InviteStatus.REJECTED:
				return <>You rejected {message.userName}'s game request</>
		}
	}
	return <></>;
}