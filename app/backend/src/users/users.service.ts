import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto, UserProfileDto } from '@ft_dto/users';
import { PrismaService } from '../database/prisma.service';
import { InviteStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

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
          friends: { orderBy: [{ online: 'desc' }, { userName: 'asc' }] },
          blocked: true,
        },
      });
      return user;
    } catch (error) {
      console.log('error updating user', error);
      throw error;
    }
  }

  async findAllButMe(id: number): Promise<UserProfileDto[]> {
    console.log('In findAllButMe');
    try {
      const users = await this.db.user.findMany({
        where: { id: { not: id }, loginName: { not: 'AI' } },
        orderBy: [{ online: 'desc' }, { userName: 'asc' }],
      });
      return users;
    } catch (error) {
      console.log('error getting all users', error);
      throw error;
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
      console.log('error getting friends', error);
      throw error;
    }
  }

  async findAll(): Promise<UserProfileDto[]> {
    try {
      const users = await this.db.user.findMany({
        where: { loginName: { not: 'AI' } },
        orderBy: { userName: 'asc' },
      });
      return users;
    } catch (error) {
      console.log('error getting all users', error);
      throw error;
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
      console.log(user);
      return user;
    } catch (error) {
      console.log('error getting user', error);
      throw error;
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
      return user;
    } catch (error) {
      console.log('error getting user by username', error);
      throw error;
    }
  }

  async findUserLogin(loginName: string): Promise<UserProfileDto> {
    try {
      const user = await this.db.user.findUnique({
        where: { loginName: loginName },
        include: {
          friends: true,
          blocked: true,
        },
      });
      if (!user) throw new NotFoundException(`User ${loginName} not found.`);
      return user;
    } catch (error) {
      console.log('error getting user by login', error);
      throw error;
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
      console.log('error getting friend count', error);
      throw error;
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
      console.log('Error expiring invites:', error);
      throw error;
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
      console.log('Error rejecting invites:', error);
      throw error;
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

      await this.expireInvites(id, blockId);
      await this.rejectInvites(id, blockId);
      if (user.friends.find((friend) => friend.id === blockId))
        return this.unFriend(id, blockId);

      return user;
    } catch (error) {
      console.log('error blocking user', error);
      throw error;
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
      return user;
    } catch (error) {
      console.log('error unfriending user', error);
      throw error;
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
      return user;
    } catch (error) {
      console.log('error unblocking user', error);
      throw error;
    }
  }
}