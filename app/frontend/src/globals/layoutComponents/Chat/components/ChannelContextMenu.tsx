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
	const { data: isKicked, isLoading: isKickedLoading, error: isKickedError, fetcher: isKickedFetcher } = useFetch<null, boolean>();

	useEffect(() => {
		chatUserFetcher({ url: constants.CHAT_GET_CHATUSER + currentChatRoom.id + '/' + user.id, fetchMethod: 'GET' });
	}, []);

	const handleAdminClick = (makeAdmin: boolean) => {
		const newRole = makeAdmin ? ChatUserRole.ADMIN : ChatUserRole.DEFAULT;
		// changeChatUserRole/:chatId/:userId/:role/:requesterId
		chatUserFetcher({ url: constants.CHAT_CHANGE_USER_ROLE + currentChatRoom.id + '/' + user.id + '/' + newRole + '/' + currentUser.id, fetchMethod: 'PATCH' });
	}

	const handleKickClick = () => {
		// kickUser/:chatId/:userId/:requesterId
		isKickedFetcher({ url: constants.CHAT_KICK_USER + user.id + '/' + user.userName + '/' + currentChatRoom.id + '/'  + currentUser.id, fetchMethod: 'GET' });
	}


	return (
		<>
			<span>🔇</span>
			<span onClick={() => handleKickClick()}>🦵</span> 
			<span>🚷</span>
			{currentChatUser?.role == ChatUserRole.OWNER ? 
			(chatUser?.role == ChatUserRole.DEFAULT ? 
			<span onClick={() => handleAdminClick(true)}>👑</span> : 
			<span onClick={() => handleAdminClick(false)} style={{display: "inline-block", transform: 'rotate(180deg)'}}>👑</span>)
			: <></>
			}
			{/*{chatUser?.id, chatUser?.role} || {currentChatUser?.id, currentChatUser?.role} */}
		</>
	);
}