import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ChatSocketService } from './chatsocket.service';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateChatMessageDto } from '../../dto/chat/update-chatMessage.dto';
import { CreateChatSocketDto } from '../../dto/chat/create-chatSocket.dto';
import { CreateChatMessageDto } from '../../dto/chat/create-chatMessage.dto';
import { ChatMessageService } from './chat-messages.service';
import { ChatService } from './chat.service';


@Controller('chat')
@ApiTags('chat')
export class ChatMessagesController {
	constructor(
		private readonly chatMessageService: ChatMessageService,
		private readonly chatService: ChatService,
		) { }

	@Get('messages/:chatId')
	@ApiOperation({ summary: 'Returns chat messages with specified chatId' })
	@ApiOkResponse({ type: [UpdateChatMessageDto] })
	@ApiNotFoundResponse({ description: 'No messages with #${chatId}' })
	findMessagesInChat(@Param('chatId', ParseIntPipe) chatId: number) {
		return this.chatMessageService.findMessagesInChat(chatId);
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
		// console.log('findDMChat', user1_id, user2_id);
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
		console.log('getUnreads', chatId, userId);
		const unreads = await this.chatMessageService.getUnreadMessages(chatId, userId);
		return unreads;
	}

	@Post('createDM')
	@ApiOperation({ summary: 'Returns chat id of created of existing chat' })
	@ApiOkResponse({ type: Number })
	async createDM(@Body() payload: CreateChatSocketDto) {
		const chat = await this.chatService.createDM(payload);
		return chat;
	}

	@Post('messageToDB')
	@ApiOperation({ summary: 'Returns id of message that is has added to the database' })
	@ApiOkResponse({ type: Number })
	async messageToDB(@Body() createChatMessageDto: CreateChatMessageDto) {
		await this.chatMessageService.messageToDB(createChatMessageDto);
		return;
	}
}
