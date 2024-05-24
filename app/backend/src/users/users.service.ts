import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto, UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class UsersService {

	constructor(
		private db: PrismaService,
	) { }

	// USER CRUD OPERATIONS
	async create(createUserDto: CreateUserDto): Promise<UserProfileDto> {
		if (!createUserDto.userName)
			createUserDto.userName = createUserDto.loginName;
		const user = await this.db.user.create({ data: createUserDto });
		return user;
		// trhow exception? what kind of exception? or is this caught by the prisma filter?
	}

	async update(id: number, updateUserDto: UpdateUserDto): Promise<UserProfileDto> {
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
			return user;
		}

		catch (error) {
			throw new NotFoundException(`Error updating user with id ${id}: ${error}`);
		}
	}

	async remove(id: number): Promise<UserProfileDto> {
		try {
			const user = await this.db.user.delete({ where: { id } });
			delete user.hash;
			return user;
		}
		catch (error) {
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
		catch {
			throw new NotFoundException(`No users in the database.`);
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
		catch {
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
			return user;
		}
		catch (error) {
			throw new NotFoundException(`User with id ${id} does not exist.`);
		}
	}

}
