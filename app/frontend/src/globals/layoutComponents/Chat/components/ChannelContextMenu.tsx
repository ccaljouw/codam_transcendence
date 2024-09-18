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

	useEffect(() => {
		chatUserFetcher({ url: constants.CHAT_GET_CHATUSER + currentChatRoom.id + '/' + user.id, fetchMethod: 'GET' });
	}, []);

	return (
		<>
			<span>🔇</span>
			<span>🦵</span> 
			<span>🚷</span>
			{currentChatUser?.role == ChatUserRole.OWNER ? 
			(chatUser?.role == ChatUserRole.DEFAULT ? <span>👑</span> : <span>X👑</span>)
			: <></>
			}
			{/*{chatUser?.id, chatUser?.role} || {currentChatUser?.id, currentChatUser?.role} */}
		</>
	);
}