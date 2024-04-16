import { BadRequestException, Body, Controller, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
import { ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateInviteDto, UpdateInviteDto } from '@ft_dto/chat';
import { InviteService } from '../services/invite.service';
import { InviteStatus, InviteType } from '@prisma/client';

@Controller('invite')
@ApiTags('invite')
export class InviteController {
	constructor(
    private readonly inviteService: InviteService,
		) { }

      
  @Post('create')
  @ApiOperation({ summary: 'Returns created invite'})
  @ApiOkResponse({ type: UpdateInviteDto })
  createInvite(@Body() createInviteDto: CreateInviteDto ) {
      return this.inviteService.createInvite(createInviteDto);
  }
  
  @Get('all')
  @ApiOperation({ summary: 'Returns all invites currently in the database'})
  @ApiOkResponse({ type: [UpdateInviteDto] })
  @ApiNotFoundResponse({ description: "No invites in the database" })
  
  findAll() : Promise<UpdateInviteDto[]> {
    console.log("in findAllInvites");
    return this.inviteService.findAll();
  }
  
  @Get(':id')
  @ApiOperation({ summary: 'Returns invite with specified id'})
  @ApiOkResponse({ type: UpdateInviteDto }) 
  @ApiNotFoundResponse({ description: 'Invite with #${id} does not exist' })
  
  findOne(@Param('id', ParseIntPipe) id: number) : Promise<UpdateInviteDto> {
    return this.inviteService.findOne(id);
  }
  
  @Get('state/:state')
  @ApiOperation({ summary: 'Returns all invites with specified state currently in the database'})
  @ApiOkResponse({ type: [UpdateInviteDto] })
  @ApiNotFoundResponse({ description: 'No invites with #${state} in the database' })
  
  findInvitesWithState(@Param('state') inviteState: string) : Promise<UpdateInviteDto[]> {
    if (!(inviteState in InviteStatus)) {
      throw new BadRequestException('Invalid state parameter');
    }
    return this.inviteService.findInvitesWithState(inviteState as InviteStatus);
  }

  @Get('type/:type')
  @ApiOperation({ summary: 'Returns all invites with specified type currently in the database'})
  @ApiOkResponse({ type: [UpdateInviteDto] })
  @ApiNotFoundResponse({ description: 'No invites with #${state} in the database' })
  
  findInvitesWithType(@Param('type') type: string) : Promise<UpdateInviteDto[]> {
    if (!(type in InviteType)) {
      throw new BadRequestException('Invalid type parameter');
    }
    return this.inviteService.findInvitesWithType(type as InviteType);
  }

  @Get('senderId_state/:senderId/:state')
  @ApiOperation({ summary: 'Returns all invites with specified senderId and state currently in the database'})
  @ApiOkResponse({ type: [UpdateInviteDto] })
  @ApiNotFoundResponse({ description: 'No invites in the database for #${senderId} with #${state}' })
  
  findInvitesWithStateForSender(@Param('senderId', ParseIntPipe) senderId: number, @Param('state') inviteState: string) : Promise<UpdateInviteDto[]> {
    if (!(inviteState in InviteStatus)) {
      throw new BadRequestException('Invalid state parameter');
    }
    return this.inviteService.findInvitesWithStateForSender(senderId, inviteState as InviteStatus);
  }

  @Get('senderId_type:senderId/:type')
  @ApiOperation({ summary: 'Returns all invites for specified senderId and type currently in the database'})
  @ApiOkResponse({ type: [UpdateInviteDto] })
  @ApiNotFoundResponse({ description: 'No invites in the database for #${senderId} with #${type}' })
  
  findInvitesWithTypeForSender(@Param('senderId', ParseIntPipe) senderId: number, @Param('type') type: string) : Promise<UpdateInviteDto[]> {
    if (!(type in InviteType)) {
      throw new BadRequestException('Invalid type parameter');
    }
    return this.inviteService.findInvitesWithTypeForSender(senderId, type as InviteType);
  }

  @Get('recipientId_state/:recipientId/:state')
  @ApiOperation({ summary: 'Returns all invites with specified recipientId and state currently in the database'})
  @ApiOkResponse({ type: [UpdateInviteDto] })
  @ApiNotFoundResponse({ description: 'No invites in the database for #${recipientId} with #${state}' })
  
  findInvitesWithStateForRecipient(@Param('recipientId', ParseIntPipe) recipientId: number, @Param('state') inviteState: string) : Promise<UpdateInviteDto[]> {
    if (!(inviteState in InviteStatus)) {
      throw new BadRequestException('Invalid state parameter');
    }
    return this.inviteService.findInvitesWithStateForRecipient(recipientId, inviteState as InviteStatus);
  }

  @Get('recipientId_type:recipientId/:type')
  @ApiOperation({ summary: 'Returns all invites for specified recipientId and type currently in the database'})
  @ApiOkResponse({ type: [UpdateInviteDto] })
  @ApiNotFoundResponse({ description: 'No invites in the database for #${recipientId} with #${type}' })
  
  findInvitesWithTypeForRecipient(@Param('recipientId', ParseIntPipe) recipientId: number, @Param('type') type: string) : Promise<UpdateInviteDto[]> {
    if (!(type in InviteType)) {
      throw new BadRequestException('Invalid type parameter');
    }
    return this.inviteService.findInvitesWithTypeForRecipient(recipientId, type as InviteType);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Returns updated invite'})
  @ApiOkResponse({ type: UpdateInviteDto })
  updateIvite(@Body() updateInviteDto: UpdateInviteDto) {
    return this.inviteService.updateIvite(updateInviteDto);
  }
}