import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto, UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { PrismaService } from '../database/prisma.service';
import { InviteStatus } from '@prisma/client';
import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { StatsService } from 'src/stats/stats.service';

@Injectable()
export class UsersService {

	constructor(
		private db: PrismaService,
	private stats: StatsService,
	) { }

	// USER CRUD OPERATIONS
	async create(createUserDto: CreateUserDto): Promise<UserProfileDto> {
		try {
	  if (!createUserDto.userName)
		createUserDto.userName = createUserDto.loginName;
	  const user = await this.db.user.create({ data: createUserDto });
	  console.log(`create stats for ${user.id}`)
	  await this.stats.create(user.id);
	  return user;
	} catch (error) {
	  if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
		throw error;
	  }
	  throw new Error(`Error creating user: ${error.message}`);
	}
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<UserProfileDto> {
    console.log(updateUserDto);
		try {
			const user = await this.db.user.update({
			where: { id },	
				data: updateUserDto,
				include: {
					friends: true,
					blocked: true,
				}
			});

			user.friends.sort((a, b) => {
				if (a.online !== b.online)
					return b.online > a.online ? 1 : -1;
				return a.userName.localeCompare(b.userName)
			});
			for (const friend of user.friends as UserProfileDto[]) {
				delete friend.friends;
				delete friend.blocked;
				delete friend.hash;
			}
			for (const blocked of user.blocked as UserProfileDto[]) {
				delete blocked.friends;
				delete blocked.blocked;
				delete blocked.hash;
			}
			return user;
		}


		catch (error) {
	  if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
		throw error;
	  }
	  throw new Error(`Error updating user with id ${id}: ${error.message}`);
	}
	}

	async remove(id: number): Promise<UserProfileDto> {
		try {
			const user = await this.db.user.delete({ where: { id } });
			delete user.hash;
			return user;
		}
		catch (error) {
	  if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
		throw error;
	  }
			throw new NotFoundException(`User with id ${id} does not exist.`);
		}
	}

	// USER QUERY OPERATIONS
	async findAllButMe(id: number): Promise<UserProfileDto[]> {
		try {
			const users = await this.db.user.findMany(
				{
					where: { id: { not: id } },
					orderBy: [
						{ online: 'desc' },
						{ userName: 'asc' },
					]
				}
			);
			for (const element of users)
				delete element.hash;
			return users;
		}
		catch (error) {
	  if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
		throw error;
	  }
			throw new NotFoundException(`No other users in the database.`);
		}
	}

	async findFriendsFrom(id: number): Promise<UserProfileDto[]> {
		const friends = await this.db.user.findUnique({ where: { id } }).friends();
		console.log("Friends from database: " + friends);
		if (!friends)
			throw new NotFoundException(`No friends in the database.`);
		for (const element of friends)
			delete element.hash;
		return friends;
	}

	async findAll(): Promise<UserProfileDto[]> {
		try {
			const users = await this.db.user.findMany({
				orderBy: { userName: 'asc' },
			});
			for (const element of users)
				delete element.hash;
			return users;
		}
		catch (error) {
	  if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
		throw error;
	  }
			throw new NotFoundException(`No users in the database.`);
		}
	}

	async findOne(id: number): Promise<UserProfileDto> {
		try {
			const user = await this.db.user.findUnique({
				where: { id },
				include: {
					friends: true,
					blocked: true,
				}

			});
			for (const friend of user.friends as UserProfileDto[]) {
				delete friend.friends;
				delete friend.blocked;
				delete friend.hash;
			}
			for (const blocked of user.blocked as UserProfileDto[]) {
				delete blocked.friends;
				delete blocked.blocked;
				delete blocked.hash;
			}
			return user;
		}
		catch (error) {
	  if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
		throw error;
	  }
			throw new NotFoundException(`User with id ${id} does not exist.`);
		}
	}

	async findUserName(userName: string): Promise<UserProfileDto> {
		try {
			const user = await this.db.user.findUnique({ 
				where: { userName: userName },
				include: {
					friends: true,
					blocked: true,
				}
				
			});
      delete user.hash;
			for (const friend of user.friends as UserProfileDto[]) {
				delete friend.friends;
				delete friend.blocked;
				delete friend.hash;
			}
			for (const blocked of user.blocked as UserProfileDto[]) {
				delete blocked.friends;
				delete blocked.blocked;
				delete blocked.hash;
			}
			return user;
		}
		catch (error) {
			if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
				throw error;
			}
			throw new NotFoundException(`User with name ${userName} does not exist.`);
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
				}
				
			});
      if (!user)
        throw new NotFoundException(`User with name ${loginName} does not exist.`);
			for (const friend of user.friends as UserProfileDto[])
				{
					delete friend.friends;
					delete friend.blocked;
					delete friend.hash;
				}
			for (const blocked of user.blocked as UserProfileDto[])
			{
				delete blocked.friends;
				delete blocked.blocked;
				delete blocked.hash;
			}
			return user;
		}
		catch (error) {
      if (error instanceof PrismaClientKnownRequestError || PrismaClientValidationError || PrismaClientUnknownRequestError) {
        throw error;
      }
			throw new NotFoundException(`User with name ${loginName} does not exist.`);
		}
	}

	async getFriendCount(userId: number): Promise<number> {
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
	}

	async blockUser(id: number, blockId: number): Promise<UserProfileDto> {

		try {
			const user = await this.db.user.update({
				where: { id },
				data: {
					blocked: {
						connect: { id: blockId }
					}
				},
				include: {
					friends: true,
					blocked: true,
				}
			});
			delete user.hash;
			for (const friend of user.friends as UserProfileDto[])
			{
				delete friend.friends;
				delete friend.blocked;
				delete friend.hash;
			}
			for (const blocked of user.blocked as UserProfileDto[])
			{
				delete blocked.friends;
				delete blocked.blocked;
				delete blocked.hash;
			}

			// Expire any open invites sent to the blocked user
			const openInvites = await this.db.invite.findMany({
				where: {
					AND: [
						{ senderId: id },
						{ recipientId: blockId },
						{ state: InviteStatus.SENT }
					]
				}
			});
			for (const invite of openInvites) {
				await this.db.invite.update({
					where: { id: invite.id },
					data: { state: InviteStatus.EXPIRED }
				});
			}

			// Reject invites from the blocked user
			const invites = await this.db.invite.findMany({
				where: {
					AND: [
						{ senderId: blockId },
						{ recipientId: id },
						{ state: InviteStatus.SENT }
					]
				}
			});
			for (const invite of invites) {
				await this.db.invite.update({
					where: { id: invite.id },
					data: { state: InviteStatus.REJECTED }
				});
			}

			if (user.friends.find(friend => friend.id === blockId))
				return this.unFriend(id, blockId);
			return user;
		}
		catch (error) {
			throw new NotFoundException(`Error blocking user with id ${id}: ${error}`);
		}
	}
			
	async unFriend(id: number, friendId: number): Promise<UserProfileDto> {
		try {
			await this.db.user.update({
				where: { id: friendId },
				data: {
					friends: {
						disconnect: { id }
					}
				}
			});
			return this.db.user.update({
				where: { id },
				data: {
					friends: {
						disconnect: { id: friendId }
					}
				},
				include: {
					friends: true,
					blocked: true,
				}
			});
		} catch (error) {
			throw new NotFoundException(`Error unfriending user with id ${id}: ${error}`);
		}
	}

	async unBlockUser(id: number, unBlockId: number): Promise<UserProfileDto> {
		try {
			return this.db.user.update({
				where: { id },
				data: {
					blocked: {
						disconnect: { id: unBlockId }
					}
				},
				include: {
					friends: true,
					blocked: true,
				}
			});
		} catch (error) {
			throw new NotFoundException(`Error unblocking user with id ${id}: ${error}`);
		}
	}
}
