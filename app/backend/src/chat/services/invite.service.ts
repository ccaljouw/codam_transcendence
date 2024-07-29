import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateInviteDto, UpdateInviteDto } from '@ft_dto/chat';
import { InviteStatus, InviteType } from '@prisma/client';
import { UserProfileDto } from '@ft_dto/users';

@Injectable()
export class InviteService {
  constructor(private db: PrismaService) {}

  async createInvite(
    createInviteDto: CreateInviteDto,
  ): Promise<UpdateInviteDto> {
    return await this.db.invite.create({ data: createInviteDto });
  }

  async updateIvite(
    updateInviteDto: UpdateInviteDto,
  ): Promise<UpdateInviteDto> {
    return await this.db.invite.update({
      where: { id: updateInviteDto.id },
      data: updateInviteDto,
    });
  }

  async findAll(): Promise<UpdateInviteDto[]> {
    try {
      const invites = await this.db.invite.findMany();
      return invites;
    } catch {
      throw new NotFoundException(`No invites in the database.`);
    }
  }

  async findOne(id: number): Promise<UpdateInviteDto> {
    try {
      const invite = await this.db.invite.findUnique({ where: { id } });
      return invite;
    } catch (error) {
      throw new NotFoundException(`Invite with id ${id} does not exist.`);
    }
  }

  async findInvitesWithState(
    inviteState: InviteStatus,
  ): Promise<UpdateInviteDto[]> {
    try {
      const invites = await this.db.invite.findMany({
        where: { state: inviteState },
      });
      return invites;
    } catch (error) {
      throw new NotFoundException(
        `No invites with state ${inviteState} does not exist.`,
      );
    }
  }

  async findInvitesWithType(type: InviteType): Promise<UpdateInviteDto[]> {
    try {
      const invites = await this.db.invite.findMany({ where: { type } });
      return invites;
    } catch (error) {
      throw new NotFoundException(
        `No invites with state ${type} does not exist.`,
      );
    }
  }

  async findInvitesWithStateForSender(
    senderId: number,
    state: InviteStatus,
  ): Promise<UpdateInviteDto[]> {
    try {
      const invites = await this.db.invite.findMany({
        where: { senderId, state },
      });
      return invites;
    } catch (error) {
      throw new NotFoundException(
        `No invites with id ${senderId} and  state ${state} does not exist.`,
      );
    }
  }

  async findInvitesWithTypeForSender(
    senderId: number,
    type: InviteType,
  ): Promise<UpdateInviteDto[]> {
    try {
      const invites = await this.db.invite.findMany({
        where: { senderId, type },
      });
      return invites;
    } catch (error) {
      throw new NotFoundException(
        `No invites with id ${senderId} and  state ${type} does not exist.`,
      );
    }
  }

  async findInvitesWithStateForRecipient(
    recipientId: number,
    state: InviteStatus,
  ): Promise<UpdateInviteDto[]> {
    try {
      const invites = await this.db.invite.findMany({
        where: { recipientId, state },
      });
      return invites;
    } catch (error) {
      throw new NotFoundException(
        `No invites with id ${recipientId} and  state ${state} does not exist.`,
      );
    }
  }

  async findInvitesWithTypeForRecipient(
    recipientId: number,
    type: InviteType,
  ): Promise<UpdateInviteDto[]> {
    try {
      const invites = await this.db.invite.findMany({
        where: { recipientId, type },
      });
      return invites;
    } catch (error) {
      throw new NotFoundException(
        `No invites with id ${recipientId} and  state ${type} does not exist.`,
      );
    }
  }

  async respondToFriendRequest(
    inviteId: number,
    accept: boolean,
  ): Promise<UserProfileDto> {
    const invite = await this.db.invite.findUnique({ where: { id: inviteId } });
    if (!invite)
      throw new NotFoundException(`Invite with id ${inviteId} does not exist.`);
    if (invite.type != InviteType.FRIEND)
      throw new NotFoundException(
        `Invite with id ${inviteId} is not a friend request.`,
      );
    if (invite.state == InviteStatus.EXPIRED) return {} as UserProfileDto;
    if (accept === true) {
      const connectedRecipient = await this.db.user.update({
        where: { id: invite.recipientId },
        data: { friends: { connect: { id: invite.senderId } } },
        include: { friends: true },
      });
      const connectedSender = await this.db.user.update({
        where: { id: invite.senderId },
        data: { friends: { connect: { id: invite.recipientId } } },
      });
      const updatedInvite = await this.db.invite.update({
        where: { id: inviteId },
        data: { state: InviteStatus.ACCEPTED },
      });
      if (!connectedSender || !connectedRecipient || !updatedInvite)
        throw new NotFoundException(`Could not accept friend request.`);
      return connectedRecipient;
    } else {
      const updatedInvite = await this.db.invite.update({
        where: { id: inviteId },
        data: { state: InviteStatus.REJECTED },
      });
      if (!updatedInvite)
        throw new NotFoundException(`Could not reject friend request.`);
      return {} as UserProfileDto;
    }
  }
}
