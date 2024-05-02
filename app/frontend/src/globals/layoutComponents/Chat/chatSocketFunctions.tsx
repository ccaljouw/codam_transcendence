import { ChatMessageToRoomDto, UpdateChatDto } from "@ft_dto/chat";
import { UserProfileDto } from "@ft_dto/users";
import { Socket } from "socket.io-client";
import { fetchProps } from "src/globals/functionComponents/useFetch";
import { transcendenceSocket } from "src/globals/socket.globalvar";
import { constants } from "src/globals/constants.globalvar";

// This function is used to send a message.
export const sendMessage = (
	currentUserId: number,
	otherUserForDm: number,
	currentChat: UpdateChatDto,
	currentUser: UserProfileDto,
	message: string,
	chatSocket: Socket,
	setMessage: Function
) => {
	if (!currentUserId || !otherUserForDm || !currentChat)
		return;
	const payload: ChatMessageToRoomDto = {
		userId: currentUserId,
		userName: currentUser.userName,
		room: currentChat.id.toString(),
		message: message, action: false
	};
	chatSocket.emit("chat/msgToRoom", payload);
	setMessage('');
};

// This function is used to join the room.
export const joinRoom = (
	currentUserId: number,
	chatToJoin: UpdateChatDto,
	currentUser: UserProfileDto,
	currentChatRoom: UpdateChatDto,
	chatRoomFetcher: ({ url, fetchMethod, payload }: fetchProps<null>) => Promise<void>,
	inviteResponseHandler: Function,
) => {
	if (currentChatRoom.id == chatToJoin?.id || !chatToJoin) { //To avoid double joins, especially in strict mode. 
		return;
	}
	const statusChangeMsg: ChatMessageToRoomDto = {
		userId: currentUserId,
		userName: currentUser.userName,
		room: chatToJoin.id.toString(),
		message: `<< ${currentUser.userName} has joined the chat >>`,
		action: true
	};
	transcendenceSocket.emit('chat/joinRoom', statusChangeMsg);

	// this function sets the user online in the database
	chatRoomFetcher({ url: constants.CHAT_JOIN_ROOM_IN_DB + chatToJoin.id + '/' + currentUserId + '/' + transcendenceSocket.id });
}

export const leaveRoom = (
	currentUserId: number,
	currentChat: UpdateChatDto,
	currentUser: UserProfileDto,
	setCurrentChatRoom: Function,
) => {
	if (!currentChat?.id)
		return;
	const leaveMessage: ChatMessageToRoomDto = {
		userId: currentUserId,
		userName: currentUser.userName,
		room: currentChat.id.toString(),
		message: `<< ${currentUser.userName} has left the chat >>`,
		action: true
	};
	setCurrentChatRoom({ id: -1 } as UpdateChatDto);
	transcendenceSocket.emit('chat/leaveRoom', leaveMessage);
	transcendenceSocket.off('chat/messageFromRoom');
}