import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UpdateChatMessageDto, CreateDMDto, CreateChatMessageDto, FetchChatMessageDto, UpdateInviteDto, FetchChatDto, ChatMessageToRoomDto, UpdateChatDto, UpdateChatUserDto } from '@ft_dto/chat';
import { ChatMessageService } from '../services/chat-messages.service';
import { ChatService } from '../services/chat.service';
import { ChatSocketService } from '../services/chatsocket.service';
import { UserProfileDto } from '@ft_dto/users';
import { JwtAuthGuard } from 'src/authentication/guard/jwt-auth.guard';


@Controller('chat')
@ApiTags('chat')
export class ChatMessagesController {
	constructor(
		private readonly chatMessageService: ChatMessageService,
		private readonly chatSocketService: ChatSocketService,
		private readonly chatService: ChatService,
	) { }

	@Get('messages/unreadsforuser/:userId')
  @UseGuards(JwtAuthGuard)

	@ApiOperation({ summary: 'Returns chat unread messages for specific user' })
	@ApiOkResponse({ type: [UpdateChatMessageDto] })
	@ApiNotFoundResponse({ description: 'No unread messages for user #${userId}' })
	findUnreadMessagesForUser(@Param('userId', ParseIntPipe) userId: number) {
		return this.chatMessageService.unreadMessagesForUser(userId);
	}

	@Get('usersInChat/:chatId')
	@ApiOperation({ summary: 'Returns users in chat' })
	@ApiOkResponse({ type: [UserProfileDto] })
	@ApiNotFoundResponse({ description: 'No chat with #${chatId}' })
	async getUsersInChat(@Param('chatId', ParseIntPipe) chatId: number) {
		const users = await this.chatService.getUsersInChat(chatId);
		return users;
	}

	@Get('newChannel/:userId')
  @UseGuards(JwtAuthGuard)

	@ApiOperation({ summary: 'Returns new channel' })
	@ApiOkResponse({ type: FetchChatDto })
	@ApiNotFoundResponse({ description: 'No new channel for user #${userId}' })
	async newChannel(@Param('userId', ParseIntPipe) userId: number) {
		const channel = await this.chatService.createChannel(userId);
		return channel;
	}

	@Get('channelsForUser/:userId')
  @UseGuards(JwtAuthGuard)

	@ApiOperation({ summary: 'Returns channels for user' })
	@ApiOkResponse({ type: [FetchChatDto] })
	@ApiNotFoundResponse({ description: 'No channels for user #${userId}' })
	async getChannelsForUser(@Param('userId', ParseIntPipe) userId: number) {
		const channels = await this.chatService.getChannelsForUser(userId);
		return channels;
	}

	@Get('channelWithUser/:channelId/:userId')
	@ApiOperation({ summary: 'Returns channel with user' })
	@ApiOkResponse({ type: FetchChatDto })
	@ApiNotFoundResponse({ description: 'No channel with #${channelId} and #${userId}' })
	async getChannelWithUser(@Param('channelId', ParseIntPipe) channelId: number, @Param('userId', ParseIntPipe) userId: number) {
		const channel = await this.chatService.getSingleChannelForUser(userId, channelId);
		return channel;
	}

	@Get('messages/:chatId/:userID')
  @UseGuards(JwtAuthGuard)

	@ApiOperation({ summary: 'Returns chat messages with specified chatId and userId' })
	@ApiOkResponse({ type: [UpdateChatMessageDto] })
	@ApiNotFoundResponse({ description: 'No messages with #${chatId}' })
	findMessagesInChat(@Param('chatId', ParseIntPipe) chatId: number, @Param('userID', ParseIntPipe) userId: number) {
		return this.chatMessageService.findMessagesInChat(chatId, userId);
	}

	@Get('chatUser/:chatId/:userId')
	@ApiOperation({ summary: 'Returns chat user' })
	@ApiOkResponse({ type: UpdateChatUserDto })
	@ApiNotFoundResponse({ description: 'No chat user with #${chatId}' })
	async getChatUser(@Param('chatId', ParseIntPipe) chatId: number, @Param('userId', ParseIntPipe) userId: number) {
		const chatUser = await this.chatService.getChatUser(chatId, userId);
		return chatUser;
	}

	@Delete('chatUser/:chatId/:userId')
	@ApiOperation({ summary: 'Deletes chat user' })
	@ApiOkResponse({ type: Boolean })
	@ApiNotFoundResponse({ description: 'No chat user with #${chatId}' })
	async deleteChatUser(@Param('chatId', ParseIntPipe) chatId: number, @Param('userId', ParseIntPipe) userId: number) {
		const chatUserResult = await this.chatService.deleteChatUser(chatId, userId);
		return chatUserResult;
	}


	@Get('unreadMessagesFromFriends/:userId')
  @UseGuards(JwtAuthGuard)

	@ApiOperation({ summary: 'Returns chat unread messages from friends' })
	@ApiOkResponse({ type: [UpdateChatMessageDto] })
	@ApiNotFoundResponse({ description: 'No unread messages from friends for user #${userId}' })
	findUnreadMessagesFromFriends(@Param('userId', ParseIntPipe) userId: number) {
		return this.chatMessageService.unreadMessagesFromFriends(userId);
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
  @UseGuards(JwtAuthGuard)

	@ApiOperation({ summary: 'Returns number of unread messages in chat' })
	@ApiOkResponse({ type: Number })
	@ApiNotFoundResponse({ description: 'No chat with #${chatId}' })
	async getUnreads(@Param('chatId', ParseIntPipe) chatId: number, @Param('userId', ParseIntPipe) userId: number) {
		const unreads = await this.chatMessageService.getUnreadMessages(chatId, userId);
		return unreads;
	}

	@Get('joinRoomInDb/:chatId/:userId/:token')
  @UseGuards(JwtAuthGuard)
  
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
	messageToDB(@Body() payload: ChatMessageToRoomDto) {
		console.log("Sending message to db");
		return this.chatMessageService.messageToDB({ chatId: parseInt(payload.room), userId: payload.userId, content: payload.message, inviteId: payload.inviteId }); //replace with api call in frontend?
	}

	@Patch(':id')
	@ApiOperation({ summary: 'Updates chat with specified id' })
	@UseGuards(JwtAuthGuard)
	@ApiOkResponse({ type: FetchChatDto })
	@ApiNotFoundResponse({ description: 'Chat with #${id} does not exist' })
	async update(@Param('id', ParseIntPipe) id: number, @Body() updateChatDto: UpdateChatDto) {
		console.log("Updating chat");
		const chat = await this.chatService.update(id, updateChatDto);
		return chat;
	}

	@Get(':id')
	@ApiOperation({ summary: 'Returns chat with specified id' })
	@ApiOkResponse({ type: UpdateInviteDto })
	@ApiNotFoundResponse({ description: 'Chat with #${id} does not exist' })
	async findOne(@Param('id', ParseIntPipe) id: number): Promise<FetchChatDto> {
		const chat = await this.chatService.findOne(id);
		return chat;
	}



	//todo: Albert: Create patch and delete method for UpdateChatDto. Return boolean if it worked or not
	// @Patch(':id')
	// @Delete(':id')
}