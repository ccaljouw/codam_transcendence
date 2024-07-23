import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { PrismaService } from '../database/prisma.service';
import { InviteStatus } from '@prisma/client';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

  // Utils
  private throwError(error: any, message: string): any {
    if (
      error instanceof PrismaClientKnownRequestError ||
      PrismaClientValidationError ||
      PrismaClientUnknownRequestError
    )
      return error;
    return new Error(`${message}: ${error.message}`);
  }

  private sortFriends(friends: UserProfileDto[]): UserProfileDto[] {
    if (friends.length === 0) {
      return friends.sort((a, b) => {
        if (a.online !== b.online) return b.online > a.online ? 1 : -1;
        return a.userName.localeCompare(b.userName);
      });
    }
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserProfileDto> {
    console.log(updateUserDto);
    try {
      const user = await this.db.user.update({
        where: { id },
        data: updateUserDto,
        include: {
          friends: true,
          blocked: true,
        },
      });
      if (!user) throw new NotFoundException(`User with id ${id} not found.`);
      user.friends = this.sortFriends(user.friends);
      return user;
    } catch (error) {
      throw this.throwError(error, `Error updating user with id ${id}`);
    }
  }

  async findAllButMe(id: number): Promise<UserProfileDto[]> {
    try {
      const users = await this.db.user.findMany({
        where: { id: { not: id } },
        orderBy: [{ online: 'desc' }, { userName: 'asc' }],
      });
      return users;
    } catch (error) {
      throw this.throwError(error, `Error getting users`);
    }
  }

  async findFriendsFrom(id: number): Promise<UserProfileDto[]> {
    try {
      const friends = await this.db.user
        .findUnique({ where: { id } })
        .friends();
      console.log('Friends from database: ' + friends);
      if (!friends)
        throw new NotFoundException(`User with id ${id} not found.`);
      return friends;
    } catch (error) {
      throw this.throwError(error, `Error getting friends`);
    }
  }

  async findAll(): Promise<UserProfileDto[]> {
    try {
      const users = await this.db.user.findMany({
        orderBy: { userName: 'asc' },
      });
      return users;
    } catch (error) {
      throw this.throwError(error, `Error getting users`);
    }
  }

  async findOne(id: number): Promise<UserProfileDto> {
    try {
      const user = await this.db.user.findUnique({
        where: { id },
        include: {
          friends: true,
          blocked: true,
        },
      });
      if (!user) throw new NotFoundException(`User with id ${id} not found.`);
      user.friends = this.sortFriends(user.friends);
      console.log(user);
      return user;
    } catch (error) {
      throw this.throwError(error, `Error getting user with id: ${id}`);
    }
  }

  async findUserName(userName: string): Promise<UserProfileDto> {
    try {
      const user = await this.db.user.findUnique({
        where: { userName: userName },
        include: {
          friends: true,
          blocked: true,
        },
      });
      if (!user) throw new NotFoundException(`User ${userName} not found.`);
      user.friends = this.sortFriends(user.friends);
      return user;
    } catch (error) {
      throw this.throwError(error, `Error getting ${userName}`);
    }
  }

  async findUserLogin(loginName: string): Promise<UserProfileDto> {
    try {
      console.log(`In findUserLogin, looking for: ${loginName}`);
      const user = await this.db.user.findUnique({
        where: { loginName: loginName },
        include: {
          friends: true,
          blocked: true,
        },
      });
      if (!user) throw new NotFoundException(`User ${loginName} not found.`);
      user.friends = this.sortFriends(user.friends);
      return user;
    } catch (error) {
      throw this.throwError(error, `Error getting ${loginName}`);
    }
  }

  async getFriendCount(userId: number): Promise<number> {
    try {
      const friendCount = await this.db.user.findUnique({
        where: { id: userId },
        select: {
          friends: true,
        },
      });
      if (!friendCount) {
        return 0;
      }
      return friendCount.friends.length;
    } catch (error) {
      throw this.throwError(error, `Error getting friends for ${userId}`);
    }
  }

  private async expireInvites(id: number, blockId: number): Promise<void> {
    try {
      const openInvites = await this.db.invite.findMany({
        where: {
          AND: [
            { senderId: id },
            { recipientId: blockId },
            { state: InviteStatus.SENT },
          ],
        },
      });
      for (const invite of openInvites) {
        await this.db.invite.update({
          where: { id: invite.id },
          data: { state: InviteStatus.EXPIRED },
        });
      }
    } catch (error) {
      throw this.throwError(error, `Error expiring invites`);
    }
  }

  private async rejectInvites(id: number, blockId: number): Promise<void> {
    try {
      const invites = await this.db.invite.findMany({
        where: {
          AND: [
            { senderId: blockId },
            { recipientId: id },
            { state: InviteStatus.SENT },
          ],
        },
      });
      for (const invite of invites) {
        await this.db.invite.update({
          where: { id: invite.id },
          data: { state: InviteStatus.REJECTED },
        });
      }
    } catch (error) {
      throw this.throwError(error, `Error rejecting invites`);
    }
  }

  async blockUser(id: number, blockId: number): Promise<UserProfileDto> {
    try {
      const user = await this.db.user.update({
        where: { id },
        data: {
          blocked: {
            connect: { id: blockId },
          },
        },
        include: {
          friends: true,
          blocked: true,
        },
      });
      if (!user) throw new NotFoundException(`User ${id} not found.`);
      user.friends = this.sortFriends(user.friends);

      await this.expireInvites(id, blockId);
      await this.rejectInvites(id, blockId);
      if (user.friends.find((friend) => friend.id === blockId))
        return this.unFriend(id, blockId);

      return user;
    } catch (error) {
      throw this.throwError(error, `Error blocking user ${blockId}`);
    }
  }

  async unFriend(id: number, friendId: number): Promise<UserProfileDto> {
    try {
      await this.db.user.update({
        where: { id: friendId },
        data: {
          friends: {
            disconnect: { id },
          },
        },
      });
      const user: UserProfileDto = await this.db.user.update({
        where: { id },
        data: {
          friends: {
            disconnect: { id: friendId },
          },
        },
        include: {
          friends: true,
          blocked: true,
        },
      });
      if (!user) throw new NotFoundException(`User ${id} not found.`);
      user.friends = this.sortFriends(user.friends);
      return user;
    } catch (error) {
      throw this.throwError(error, `Error unfriending: ${friendId}`);
    }
  }

  async unBlockUser(id: number, unBlockId: number): Promise<UserProfileDto> {
    try {
      const user = await this.db.user.update({
        where: { id },
        data: {
          blocked: {
            disconnect: { id: unBlockId },
          },
        },
        include: {
          friends: true,
          blocked: true,
        },
      });
      if (!user) throw new NotFoundException(`User ${id} not found.`);
      user.friends = this.sortFriends(user.friends);
      return user;
    } catch (error) {
      throw this.throwError(error, `Error unblocking: ${unBlockId}`);
    }
  }
}
