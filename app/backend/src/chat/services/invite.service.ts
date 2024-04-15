import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "src/database/prisma.service";
import { CreateInviteDto, UpdateInviteDto } from "@ft_dto/chat";
import { InviteStatus, InviteType } from "@prisma/client";

@Injectable()
export class InviteService {
	constructor(
		private db: PrismaService
	) { }

  async createInvite(createInviteDto: CreateInviteDto) : Promise<UpdateInviteDto> {
    return await this.db.invite.create({ data: createInviteDto });
  }

  async updateIvite(updateInviteDto: UpdateInviteDto) : Promise<UpdateInviteDto> {
    return await this.db.invite.update({ 
      where: { id: updateInviteDto.id },
      data: updateInviteDto });
  }

  async findAll(): Promise<UpdateInviteDto[]> {
		try {
			const invites = await this.db.invite.findMany();
			return invites;
		}
		catch {
			throw new NotFoundException(`No invites in the database.`);
		}
	}

	async findOne(id: number): Promise<UpdateInviteDto> {
		try {
			const invite = await this.db.invite.findUnique({ where: { id } });
			return invite;
		}
		catch (error) {
			throw new NotFoundException(`Invite with id ${id} does not exist.`);
		}
	}

  async findInvitesWithState(inviteState: InviteStatus): Promise<UpdateInviteDto[]> {
		try {
			const invites = await this.db.invite.findMany({ where: { state: inviteState } });
			return invites;
		}
		catch (error) {
			throw new NotFoundException(`No invites with state ${inviteState} does not exist.`);
		}
	}

  async findInvitesWithType(type: InviteType): Promise<UpdateInviteDto[]> {
		try {
			const invites = await this.db.invite.findMany({ where: { type } });
			return invites;
		}
		catch (error) {
			throw new NotFoundException(`No invites with state ${type} does not exist.`);
		}
	}

  async findInvitesWithStateForSender(senderId: number, state: InviteStatus): Promise<UpdateInviteDto[]> {
		try {
			const invites = await this.db.invite.findMany({ where: { senderId, state } });
			return invites;
		}
		catch (error) {
			throw new NotFoundException(`No invites with id ${senderId} and  state ${state} does not exist.`);
		}
	}

  async findInvitesWithTypeForSender(senderId: number, type: InviteType): Promise<UpdateInviteDto[]> {
		try {
			const invites = await this.db.invite.findMany({ where: { senderId, type } });
			return invites;
		}
		catch (error) {
			throw new NotFoundException(`No invites with id ${senderId} and  state ${type} does not exist.`);
		}
	}

  async findInvitesWithStateForRecipient(recipientId: number, state: InviteStatus): Promise<UpdateInviteDto[]> {
		try {
			const invites = await this.db.invite.findMany({ where: { recipientId, state } });
			return invites;
		}
		catch (error) {
			throw new NotFoundException(`No invites with id ${recipientId} and  state ${state} does not exist.`);
		}
	}

  async findInvitesWithTypeForRecipient(recipientId: number, type: InviteType): Promise<UpdateInviteDto[]> {
		try {
			const invites = await this.db.invite.findMany({ where: { recipientId, type } });
			return invites;
		}
		catch (error) {
			throw new NotFoundException(`No invites with id ${recipientId} and  state ${type} does not exist.`);
		}
	}
}