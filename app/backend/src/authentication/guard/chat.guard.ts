import { CanActivate, ExecutionContext, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatType } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class JwtChatGuard implements CanActivate {
	constructor(
		private db: PrismaService,
		private jwtService: JwtService,
	) { }

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const unAuthError = "Unauthorized access to chat"; // I check this string in frontend, please don't change it
		const req: Request = context.switchToHttp().getRequest();
		console.log("checking chat guard", req.params);
		const chatId = parseInt(req.params.chatId);
		if (!chatId)
			throw new NotFoundException('No chatId found');
		const chat = await this.db.chat.findUnique({
			where: { id: chatId },
			include: { chatAuth: true },
		})
		if (!chat)
			throw new NotFoundException("Chat not found");
		const bannedUser = await this.db.bannedUsersForChat.findFirst({
			where: {
				AND: [
					{ chatId: chatId },
					{ userId: parseInt(req.params.userId) }
				]
			}
		});
		if (bannedUser)
			throw new UnauthorizedException("User is banned from chat");
		if (chat.visibility != ChatType.PROTECTED) {
			console.log("fetching unprotected chat");
			return true;
		}
		console.log("checking chat owner", chat.ownerId, req.params.userId);
		if (chat.ownerId === parseInt(req.params.userId))
			return true; // owner can access chat
		try {
			console.log("checking chat token");
			const token = req.cookies[`chatToken_${chatId}`];
			if (!token)
				throw new UnauthorizedException(unAuthError);
			const payload = await this.jwtService.verifyAsync(
				token, {
				secret: process.env.JWT_SECRET,
			})
			if (payload.id != chat.id)
				throw new UnauthorizedException(unAuthError)
			return true;
		} catch (error) {
			throw new UnauthorizedException(unAuthError);
		}
	}
}