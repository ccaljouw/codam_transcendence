import { ChatMessageToRoomDto, CreateDMDto, FetchChatDto } from "@ft_dto/chat";
import { constants } from "src/globals/constants.globalvar";

// This function is used to fetch the messages for the current chat.
export const fetchMessages = async (
	currentChat: FetchChatDto,
	chatMessagesFetcher: Function,
	userId: number
) => {
	if (!currentChat)
		return;
	if (currentChat.id == -1)
		return;
	await chatMessagesFetcher({ url: constants.CHAT_GET_MESSAGES_FROM_CHAT + currentChat.id + '/' + userId });
}

// This function is used to create a chat between two users.
export const fetchDM = async (
	chatFetcher: Function,
	user1?: number,
	user2?: number,
) => {
	if (!user1 || !user2)
		return;
	console.log('Fetching DM:', user1, user2);
	const payload: CreateDMDto = { user1Id: user1, user2Id: user2 };
	await chatFetcher({ url: constants.CHAT_CREATE_DM, fetchMethod: "POST", payload })
}

export const fetchChat = async (
	chatFechter: Function,
	chatId: number,
	userId: number
) => {
	console.log('Fetching chat:', chatId, userId);
	if (chatId == -1)
		return;
	await chatFechter({ url: constants.CHAT_GET_CHANNEL_WITH_USER + chatId + '/' + userId });
}
