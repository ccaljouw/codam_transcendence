import { ChatMessageToRoomDto } from "@ft_dto/chat"
import { UserProfileDto } from "@ft_dto/users"
import { InviteStatus } from "@prisma/client"
import { inviteCallbackProps } from "./inviteFunctions"

export const friendInviteParser = (
	message: ChatMessageToRoomDto,
	currentUser: UserProfileDto,
	inviteCallback: (props: inviteCallbackProps) => void,
	inviteCallbackProps: inviteCallbackProps
): JSX.Element => {
	if (message.invite !== undefined) {
		if (message.invite.senderId == currentUser.id) {
			switch (message.invite.state) {
				case InviteStatus.SENT:
					return <>You invited {message.message} to become friends</>
				case InviteStatus.ACCEPTED:
					return <>You are now friends with {message.userName}</>
				case InviteStatus.REJECTED:
					return <>{message.message} rejected your friend request</>
			}
		}
		else {
			switch (message.invite.state) {
				case InviteStatus.SENT:
					return (<>{message.userName} invited you to become friends&nbsp;
						<span className={'invite-area'}>
							<span className={'invite-button'} onClick={() => inviteCallback({ ...inviteCallbackProps, accept: true })}>Accept</span>&nbsp;|&nbsp;
							<span className={'invite-button'} onClick={() => inviteCallback(inviteCallbackProps)}>Reject</span>
						</span>
					</>)
				case InviteStatus.ACCEPTED:
					return <>You accepted {message.userName}'s friend request</>
				case InviteStatus.REJECTED:
					return <>You rejected {message.userName}'s friend request</>
			}
		}
	}
	return <>Something went wrong with a friend invite</>
}