import { ChatMessageToRoomDto, InviteSocketMessageDto } from "@ft_dto/chat"
import { UserProfileDto } from "@ft_dto/users"
import { inviteCallbackProps } from "./inviteFunctions"
import { InviteStatus } from "@prisma/client";

export const gameResponseReceivedHandler = ( // This function triggers the actions that need to be taken when a game response is received.
	inviteSocketMessage: InviteSocketMessageDto
) => {
	// ********** CARLO YOU WANT TO HANDLE THE GAME RESPONSE BY THE ONE WHO SENT THE INVITE HERE **********

	console.log(`Got invite response from ${inviteSocketMessage.userId} to ${inviteSocketMessage.senderId} -> ${inviteSocketMessage.accept} for chat ${inviteSocketMessage.directMessageId}`);
	console.log("HANDLE GAME RESPONSE BY THE ONE WHO SENT THE INVITE HERE");
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
				return <>You invited {message.message} to a channel</>
			case InviteStatus.ACCEPTED:
				return <>{message.message} accepted your request to join a channel</>
			case InviteStatus.REJECTED:
				return <>{message.message} rejected your request to join a channel</>
		}
	}
	else {
		switch (message.invite.state) {
			case InviteStatus.SENT:
				return (<>{message.userName} invited you join a channel&nbsp;
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