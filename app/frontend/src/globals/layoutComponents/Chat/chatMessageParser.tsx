import { ChatMessageToRoomDto } from "@ft_dto/chat";

export const messageParser = (
	message: ChatMessageToRoomDto,
	currentUserId: number
	) : string  | null=> {
	if (message.action) {
		console.log(`Received action message: ${message.message} ${message.userId} ${message.userName} ${message.room}`);
		if (message.message == "JOIN" && message.userId == currentUserId) // If the user is the current user, we don't want to show the message.	
				return null;
		switch (message.message) {
			case "JOIN":
				return `<< ${message.userName} has joined the chat >>`;
				break;
			case "LEAVE":
				return `<< ${message.userName} has left the chat >>`;
				break;
		}
	} else {
		return `${message.userName}: ${message.message}`;
	}
	return null;
}