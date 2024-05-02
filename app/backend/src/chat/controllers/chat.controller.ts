import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateChatMessageDto, CreateDMDto, CreateChatMessageDto, FetchChatMessageDto, UpdateInviteDto, UpdateChatDto } from '@ft_dto/chat';
import { ChatMessageService } from '../services/chat-messages.service';
import { ChatService } from '../services/chat.service';
import { ChatSocketService } from '../services/chatsocket.service';


@Controller('chat')
@ApiTags('chat')
export class ChatMessagesController {
	constructor(
		private readonly chatMessageService: ChatMessageService,
		private readonly chatSocketService: ChatSocketService,
		private readonly chatService: ChatService,
	) { }

	@Get(':id')
	@ApiOperation({ summary: 'Returns chat with specified id' })
	@ApiOkResponse({ type: UpdateInviteDto })
	@ApiNotFoundResponse({ description: 'Chat with #${id} does not exist' })
	async findOne(@Param('id', ParseIntPipe) id: number): Promise<UpdateChatDto> {
		const chat = await this.chatService.findOne(id);
		return chat;
	}

	@Get('messages/:chatId')
	@ApiOperation({ summary: 'Returns chat messages with specified chatId' })
	@ApiOkResponse({ type: [UpdateChatMessageDto] })
	@ApiNotFoundResponse({ description: 'No messages with #${chatId}' })
	findMessagesInChat(@Param('chatId', ParseIntPipe) chatId: number): Promise<FetchChatMessageDto[]> {
		return this.chatMessageService.findMessagesInChat(chatId);
	}

	@Get('messages/unreadsforuser/:userId')
	@ApiOperation({ summary: 'Returns chat unread messages for specific user' })
	@ApiOkResponse({ type: [UpdateChatMessageDto] })
	@ApiNotFoundResponse({ description: 'No unread messages for user #${userId}' })
	findUnreadMessagesForUser(@Param('userId', ParseIntPipe) userId: number) {
		return this.chatMessageService.unreadMessagesForUser(userId);
	}

	@Get('unreadMessagesFromFriends/:userId')
	@ApiOperation({ summary: 'Returns chat unread messages from friends' })
	@ApiOkResponse({ type: [UpdateChatMessageDto] })
	@ApiNotFoundResponse({ description: 'No unread messages from friends for user #${userId}' })
	findUnreadMessagesFromFriends(@Param('userId', ParseIntPipe) userId: number) {
		return this.chatMessageService.unreadMessagesFromFriends(userId);
	}

	@Get(':chatId/:start')
	@ApiOperation({ summary: 'Returns chat messages with specified chatId that are created after specified start time' })
	@ApiOkResponse({ type: [UpdateChatMessageDto] })
	@ApiNotFoundResponse({ description: 'No messages with #${chatId} after #${start}' })
	findMessagesInChatAfter(@Param('chatId', ParseIntPipe) chatId: number, @Param('start') start: Date) {
		return this.chatMessageService.findMessagesInChatAfter(chatId, start);
	}

	@Get('checkIfDMExists/:user1_id/:user2_id')
	@ApiOperation({ summary: 'Returns chat id of existing chat' })
	@ApiOkResponse({ type: Number })
	@ApiNotFoundResponse({ description: 'No chat between #${user1_id} and #${user2_id}' })
	async findDMChat(@Param('user1_id', ParseIntPipe) user1_id: number, @Param('user2_id', ParseIntPipe) user2_id: number) {
		const DM = await this.chatService.findDMChat(user1_id, user2_id);
		if (DM)
			return DM.id;
		return -1;
	}

	@Get('getUnreads/:chatId/:userId')
	@ApiOperation({ summary: 'Returns number of unread messages in chat' })
	@ApiOkResponse({ type: Number })
	@ApiNotFoundResponse({ description: 'No chat with #${chatId}' })
	async getUnreads(@Param('chatId', ParseIntPipe) chatId: number, @Param('userId', ParseIntPipe) userId: number) {
		const unreads = await this.chatMessageService.getUnreadMessages(chatId, userId);
		return unreads;
	}

	@Get('joinRoomInDb/:chatId/:userId/:token')
	@ApiOperation({ summary: 'Returns room id if status was succesfully set' })
	@ApiOkResponse({ type: Number })
	@ApiNotFoundResponse({ description: 'No chat with #${chatId}' })
	async joinRoomInDb(@Param('chatId', ParseIntPipe) chatId: number, @Param('userId', ParseIntPipe) userId: number, @Param('token') token: string) {

		const socketUpdate = await this.chatSocketService.changeChatUserStatus({ token: token, userId: userId, chatId: chatId, isInChatRoom: true });
		const unreadUpdate = await this.chatMessageService.resetUnreadMessages({ userId: userId, chatId: chatId });
		if (socketUpdate && unreadUpdate)
			return chatId;
		return -1;
	}

	@Post('createDM')
	@ApiOperation({ summary: 'Returns chat id of created of existing chat' })
	@ApiOkResponse({ type: Number })
	async createDM(@Body() payload: CreateDMDto) {
		const chat = await this.chatService.createDM(payload);
		return chat;
	}

	@Post('messageToDB')
	@ApiOperation({ summary: 'Returns id of message that is has added to the database' })
	@ApiOkResponse({ type: Number })
	messageToDB(@Body() createChatMessageDto: CreateChatMessageDto) {
		return this.chatMessageService.messageToDB(createChatMessageDto);
	}
}
