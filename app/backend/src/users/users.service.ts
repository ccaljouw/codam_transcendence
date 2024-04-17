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

	async update(id: number, updateUserDto : UpdateUserDto): Promise<UserProfileDto> {
		try {
			const user = await this.db.user.update({
				where: { id },
				data: updateUserDto,
			});
			delete user.hash;
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
			const user = await this.db.user.findUnique({ where: { id } });
			delete user.hash;
			return user;
		}
		catch (error) {
			throw new NotFoundException(`User with id ${id} does not exist.`);
		}
	}
		
}
