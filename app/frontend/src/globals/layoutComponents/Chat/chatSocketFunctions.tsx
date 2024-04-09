import { ChatMessageToRoomDto, UpdateChatDto } from "@ft_dto/chat";
import { UserProfileDto } from "@ft_dto/users";
import { Socket } from "socket.io-client";
import { transcendenceSocket } from "src/globals/socket.globalvar";

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
	console.log(`sending [${message}] to room ${currentChat.id}]`)
	setMessage('');
};

	// This function is used to join the room.
	export const joinRoom = (
		currentUserId: number,
		currentChat: UpdateChatDto,
		currentUser: UserProfileDto,
		currentChatRoom: number,
		setCurrentChatRoom: Function,
		handleMessageFromRoom: Function,
	) => {
		if (currentChatRoom == currentChat?.id || !currentChat) { //To avoid double joins, especially in strict mode. 
			return;
		}
		const statusChangeMsg: ChatMessageToRoomDto = {
			userId: currentUserId,
			userName: currentUser.userName,
			room: currentChat.id.toString(),
			message: `<< ${currentUser.userName} has joined the chat >>`,
			action: true
		};
		transcendenceSocket.emit('chat/joinRoom', statusChangeMsg);
		setCurrentChatRoom(currentChat.id);
		transcendenceSocket.on('chat/messageFromRoom', (payload: ChatMessageToRoomDto) => {
				handleMessageFromRoom(payload);
		});
	}

	export const leaveRoom = (
		currentUserId: number,
		currentChat: UpdateChatDto,
		currentUser: UserProfileDto,
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
		transcendenceSocket.emit('chat/leaveRoom', leaveMessage);
		transcendenceSocket.off('chat/messageFromRoom');
	}