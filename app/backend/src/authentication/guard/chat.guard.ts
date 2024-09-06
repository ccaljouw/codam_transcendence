import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatType } from '@prisma/client';
import { Request } from 'express';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class JwtChatGuard implements CanActivate  {
  constructor ( 
    private db: PrismaService,
    private jwtService: JwtService,
 ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request = context.switchToHttp().getRequest();
    const chatId = parseInt(req.params.id);
    if (!chatId)
      throw new UnauthorizedException('No chatId found');
    const chat = await this.db.chat.findUnique({
      where: { id: chatId },
      include: { chatAuth: true },
    })
    if (!chat)
      throw new UnauthorizedException("Chat not found");
    if (chat.visibility != ChatType.PROTECTED) {
      console.log("fetching unprotected chat");
      return true;
    }
    try {
      console.log("checking chat token");
      const token = req.cookies[`chatToken_${chatId}`];
      if (!token)
        throw new UnauthorizedException("No valid token for protected chat");
      const payload = await this.jwtService.verifyAsync(
        token, {
        secret: process.env.JWT_SECRET,
      })
      if (payload.id != chat.id)
        throw new UnauthorizedException("No valid token for protected chat")
      return true;
    } catch (error) {
      throw new UnauthorizedException('Not passed chat guard');
    }
  }
}