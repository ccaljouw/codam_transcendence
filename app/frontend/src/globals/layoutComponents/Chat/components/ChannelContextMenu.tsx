import { UserProfileDto } from "@ft_dto/users";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import useFetch from "src/globals/functionComponents/useFetch";
import { UpdateChatUserDto } from "@ft_dto/chat";
import { constants } from "src/globals/constants.globalvar";
import { useEffect, useContext } from "react";
import { ChatUserRole } from "@prisma/client";

export default function ChannelContextMenu({ user, currentChatUser }: { user: UserProfileDto, currentChatUser: UpdateChatUserDto | null }): JSX.Element {
	const { currentUser, currentChatRoom } = useContext(TranscendenceContext);
	const { data: chatUser, isLoading: chatUserLoading, error: chatUserError, fetcher: chatUserFetcher } = useFetch<null, UpdateChatUserDto>();
	const { data: fetchBanKick, isLoading: fetchBanKickLoading, error: fetchBanKickError, fetcher: fetchBanKickFetcher } = useFetch<null, boolean>();

	useEffect(() => {
		chatUserFetcher({ url: constants.CHAT_GET_CHATUSER + currentChatRoom.id + '/' + user.id, fetchMethod: 'GET' });
	}, []);

	const handleAdminClick = (makeAdmin: boolean) => {
		const newRole = makeAdmin ? ChatUserRole.ADMIN : ChatUserRole.DEFAULT;
		chatUserFetcher({ url: constants.CHAT_CHANGE_USER_ROLE + currentChatRoom.id + '/' + user.id + '/' + newRole + '/' + currentUser.id, fetchMethod: 'PATCH' });
	}

	const handleKickClick = () => {
		fetchBanKickFetcher({ url: constants.CHAT_KICK_USER + user.id + '/' + user.userName + '/' + currentChatRoom.id + '/'  + currentUser.id, fetchMethod: 'GET' });
	}

	const handleMuteClick = () => {
		chatUserFetcher({ url: constants.CHAT_MUTE_USER + currentChatRoom.id + '/' + user.id + '/' + user.userName + '/' + currentUser.id, fetchMethod: 'GET' });
	}

	const handleBanClick = () => {
		fetchBanKickFetcher({ url: constants.CHAT_BAN_USER + currentChatRoom.id + '/' + user.id + '/' + user.userName + '/'  + currentUser.id, fetchMethod: 'GET' });
	}

	return (
		<>
		  {chatUser?.role !== ChatUserRole.OWNER && (
			<>
			  <span onClick={() => handleMuteClick()} title="Mute user for 30 seconds">🔇</span>
			  <span onClick={() => handleKickClick()} title="Kick user from channel">🦵</span>
			  <span onClick={() => handleBanClick()} title="Ban user from channel">🚷</span>
			  {currentChatUser?.role === ChatUserRole.OWNER ? (
				chatUser?.role === ChatUserRole.DEFAULT ? (
				  <span onClick={() => handleAdminClick(true)} title="Make user admin of this channel">👑</span>
				) : (
				  <span 
					onClick={() => handleAdminClick(false)} 
					style={{ display: "inline-block", transform: 'rotate(180deg)' }}
				  title="Remove admin priviliges for this user">
					👑
				  </span>
				)
			  ) : null}
			</>
		  )}
		</>
	  );
}