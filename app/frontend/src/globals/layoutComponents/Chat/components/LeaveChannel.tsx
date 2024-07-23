import { ChatMessageToRoomDto, FetchChatDto } from "@ft_dto/chat";
import { useContext } from "react";
import { constants } from "src/globals/constants.globalvar";
import { TranscendenceContext } from "src/globals/contextprovider.globalvar";
import { transcendenceSocket } from "src/globals/socket.globalvar";
import useFetch from "src/globals/functionComponents/useFetch";

export default function LeaveChannel({ room }: { room: FetchChatDto }) : JSX.Element { 
	const { data: deletedUser, error: deletedUserError, isLoading: deletedUserLoading, fetcher: deletedUserFetcher } = useFetch<null, null>();
	const { currentUser, currentChatRoom, newChatRoom, setNewChatRoom } = useContext(TranscendenceContext);
	const leaveChannel = async () => {
		deletedUserFetcher({ url: constants.CHAT_GET_CHATUSER + room.id + '/' + currentUser.id, fetchMethod: 'DELETE' });
		const currentChatWithoutMe = { 
			...currentChatRoom,
			users: currentChatRoom.users.filter(user => user.userId !== currentUser.id)
		};
		currentChatWithoutMe.action = "delete_user";
		const leaveMessage: ChatMessageToRoomDto = {
			userId: currentUser.id,
			userName: currentUser.userName,
			room: currentChatRoom.id.toString(),
			message: `<< ${currentUser.userName} has left the channel >>`,
			action: true
		};
		transcendenceSocket.emit('chat/msgToRoom', leaveMessage);
		transcendenceSocket.emit('chat/patch', currentChatWithoutMe );
		setNewChatRoom({ room: -1, count: newChatRoom.count + 1 });
	}

	return (
		<>[ <span onClick={() => leaveChannel()}
		style={{ fontWeight: 'normal', cursor: 'pointer' }}
				onMouseOver={(e) => e.currentTarget.style.fontWeight = 'bold'}
				onMouseOut={(e) => e.currentTarget.style.fontWeight = 'normal'}>leave channel</span> ]</>
	)
}