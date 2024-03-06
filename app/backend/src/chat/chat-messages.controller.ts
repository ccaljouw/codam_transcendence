import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ChatSocketService } from './chatsocket.service';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatMessageDto } from './dto/update-chatMessage.dto';
import { CreateChatSocketDto } from './dto/create-chatSocket.dto';
import { CreateChatMessageDto } from './dto/create-chatMessage.dto';


@Controller('chat-messages')
@ApiTags('chat messages')
export class ChatMessagesController {
  constructor( private readonly chatService : ChatSocketService) {}

  @Get(':chatId')
  @ApiOperation({ summary: 'Returns chat messages with specified chatId'})
  @ApiOkResponse({ type: [UpdateChatMessageDto] }) 
  @ApiNotFoundResponse({ description: 'No messages with #${chatId}' })
  findMessagesInChat(@Param('chatId', ParseIntPipe) chatId: number) {
    return this.chatService.findMessagesInChat(chatId);
  }

  @Get(':chatId/:start')
  @ApiOperation({ summary: 'Returns chat messages with specified chatId that are created after specified start time'})
  @ApiOkResponse({ type: [UpdateChatMessageDto] }) 
  @ApiNotFoundResponse({ description: 'Not messages with #${chatId} after #${start}' })
  findMessagesInChatAfter(@Param('chatId', ParseIntPipe) chatId: number, @Param('start') start : Date) {
    return this.chatService.findMessagesInChatAfter( chatId, start);
  }

  @Post('createDM')
  @ApiOperation({ summary: 'Returns chat id of created of existing chat'})
  @ApiOkResponse({ type: Number }) 
  async createDM(@Body() payload: CreateChatSocketDto) {
	const chat = await this.chatService.createDM(payload);
		return chat;
	}

  @Post('messageToDB')
  @ApiOperation({ summary: 'Returns id of message that is has added to the database'})
  @ApiOkResponse({ type: Number }) 
  async messageToDB(@Body() createChatMessageDto: CreateChatMessageDto) {
		const chatId = await this.chatService.messageToDB(createChatMessageDto);
		return;
	}
}
