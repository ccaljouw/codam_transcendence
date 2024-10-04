import { CreateTokenDto } from '@ft_dto/socket';
import { UserProfileDto } from '@ft_dto/users';
import { UpdateTokenDto } from '@ft_dto/users/update-token.dto';
import {
  Inject,
  Injectable,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { OnlineStatus } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { SocketServerProvider } from '../socket/socketserver.gateway';

@Injectable()
export class TokenService {
  constructor(
    private db: PrismaService,
    @Inject(forwardRef(() => SocketServerProvider))
    private readonly commonServer: SocketServerProvider,
  ) {}

  async findUserIdByToken(token: string): Promise<number | null> {
    try {
      const user = await this.db.tokens.findFirst({
        where: {
          token: token,
        },
        select: {
          userId: true,
        },
      });
      return user?.userId || null;
    } catch (error) {
      console.error('Error finding user by token:', error);
      throw error;
    }
  }

  async findUserByToken(token: string): Promise<UserProfileDto | null> {
    try {
      const userIdFromToken = await this.findUserIdByToken(token);
      if (!userIdFromToken) return null;
      const user = await this.db.user.findUnique({
        where: {
          id: userIdFromToken,
        },
      });
      if (user) {
        return user;
      }
      return null;
    } catch (error) {
      console.error('Error finding user by token:', error);
      throw error;
    }
  }

  async findAllTokensAsStringForUser(userId: number): Promise<string[]> {
    try {
      const tokens = await this.db.tokens.findMany({
        where: {
          userId: userId,
        },
        select: {
          token: true,
        },
      });
      return tokens.map((token) => token.token);
    } catch (error) {
      console.error('Error finding tokens for user:', error);
      throw error;
    }
  }

  async findAllTokensForUser(userId: number): Promise<CreateTokenDto[]> {
    try {
      const tokens = await this.db.tokens.findMany({
        where: {
          userId: userId,
        },
      });
      return tokens;
    } catch (error) {
      console.error('Error finding tokens for user:', error);
      throw error;
    }
  }

  async findChatIdByToken(token: string): Promise<number | null> {
    try {
      const user = await this.db.tokens.findUnique({
        where: {
          token: token,
        },
        select: {
          chatId: true,
        },
      });
      return user?.chatId || null;
    } catch (error) {
      console.error('Error finding chatId by token:', error);
    }
  }

	async getTokenEntry(token: string): Promise<CreateTokenDto | null> {
		try {
			const tokenUser = await this.db.tokens.findUnique({
				where: {
					token: token,
				},
			});
			return tokenUser || null;
		} catch (error) {
			console.error('Error getting token entry:', error);
		}
	}


  async addToken(createToken: CreateTokenDto): Promise<CreateTokenDto> {
    try {
      const tokenUser: CreateTokenDto = await this.db.tokens.create({
        data: {
          token: createToken.token,
          userId: createToken.userId,
        },
      });
      if (!tokenUser)
        throw new NotFoundException(`User with token ${tokenUser} not found.`);
      return tokenUser;
    } catch (error) {
      console.error('Error adding token:', error);
      throw new NotFoundException(`User with token ${createToken.token} not added.`, error.message);
    }
  }

  async updateToken(updateTokenDto: UpdateTokenDto): Promise<CreateTokenDto> {
    try {
      const tokenUser: CreateTokenDto = await this.db.tokens.update({
        where: {
          token: updateTokenDto.token,
        },
        data: updateTokenDto,
      });
      if (!tokenUser)
        throw new NotFoundException(
          `User with token ${updateTokenDto.token} not found.`,
        );
      return tokenUser;
    } catch (error) {
      console.error('Error updating token:', error);
      throw error;
    }
  }

  // returns true if all tokens for user are removed
  async removeToken(token: string): Promise<boolean> {
    try {
      const tokenUserToDelete = await this.db.tokens.findUnique({
        where: {
          token: token,
        },
      });
      if (tokenUserToDelete) {
        await this.db.tokens.delete({
          where: {
            id: tokenUserToDelete.id,
          },
        });
        const tokensLeftForUser = await this.db.tokens.findMany({
          where: {
            userId: tokenUserToDelete.userId,
          },
        });
        if (tokensLeftForUser.length === 0) {
          await this.db.user.update({
            where: {
              id: tokenUserToDelete.userId,
            },
            data: {
              online: OnlineStatus.OFFLINE,
            },
          });
          return true;
        }
        return false;
      }
    } catch (error) {
      console.error('Error removing token:', error);
      throw error;
    }
  }

  // check if user has any stale connections and remove them
  async addTokenWithStaleCheck(createToken: CreateTokenDto): Promise<boolean> {
    try {
      console.log(
        `Set user ${createToken.userId} to online, finding stale connections...`,
      );
      const tokensForUser = await this.findAllTokensAsStringForUser(
        createToken.userId,
      );
      console.log(
        `Found ${tokensForUser.length} connections for user ${createToken.userId}`,
      );
      for (const token of tokensForUser) {
        // if token is not connected
        if (!this.commonServer.socketIO.sockets.sockets.has(token)) {
          console.log(
            `Removing stale token ${token} for user ${createToken.userId}`,
          );
          await this.removeToken(token); // remove stale token from db
          tokensForUser.splice(tokensForUser.indexOf(token), 1); // remove stale token from list
        }
      }
      await this.addToken(createToken); // add new token
      // only set user to online if no other active connections
      if (tokensForUser.length == 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(
        `Error setting user ${createToken.userId} to online: `,
        error,
      );
      throw error;
    }
  }
}
