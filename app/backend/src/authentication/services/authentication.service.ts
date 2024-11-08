import {
	BadRequestException,
	Injectable,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ChatType } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { TwoFAService } from './2FA.service';
import { StatsService } from '../../stats/stats.service';
import { UserProfileDto, CreateUserDto } from '@ft_dto/users';
import { FetchChatDto } from '@ft_dto/chat';

@Injectable()
export class AuthService {
	constructor(
		private readonly db: PrismaService,
		private readonly jwtService: JwtService,
		private readonly twoFA: TwoFAService,
		private readonly stats: StatsService,
	) { }

	async createUser(
		createUserDto: CreateUserDto,
		pwd: string,
	): Promise<UserProfileDto> {
		try {
			if (!createUserDto.userName)
				createUserDto.userName = createUserDto.loginName;
			const user = await this.db.user.create({
				data: createUserDto,
			});
			console.log(`create authentication info for ${user.id}`);
			if (pwd) {
				await this.db.auth.create({ data: { userId: user.id, pwd: pwd } });
			} else {
				await this.db.auth.create({ data: { userId: user.id } });
			}
			await this.stats.create(user.id);
			return user;
		} catch (error) {
			console.log('Error creating user:', error.message);
			throw error;
		}
	}
	async generateJwt(user: UserProfileDto): Promise<string> {
		const payload = { loginName: user.loginName, id: user.id };
		return this.jwtService.sign(payload);
	}

	async validateUser(
		username: string,
		password: string,
		token: string,
	): Promise<UserProfileDto> {
		let user: UserProfileDto | any;
		try {
			console.log('In validateUser in auth service');
			user = await this.db.user.findUnique({
				where: { loginName: username },
				include: { auth: true },
			});
			if (!user)
				throw new UnauthorizedException('Invallid user-password combination');
			const validPwd = await bcrypt.compare(password, user.auth?.pwd);
			if (validPwd) {
				console.log('password correct');

				if (user.twoFactEnabled) {
					if (token == '') {
						console.log('2FA token is required');
						throw new UnauthorizedException('2FA token is required');
					}

					const isValidTwoFactorToken = await this.twoFA.verify2FASecret(
						user.auth.twoFactSecret,
						token,
					);
					if (!isValidTwoFactorToken) {
						throw new UnauthorizedException('Invalid 2FA token');
					}
				}
				delete user.auth;
				return user;
			} else {
				console.log('incorrect password');
				throw new UnauthorizedException('Invalid user-password combination');
			}
		} catch (error) {
			console.log('Error validating user:', error.message);
			throw error;
		}
	}

	async registerUser(
		createUser: CreateUserDto,
		pwd: string,
	): Promise<UserProfileDto> {
		let user: UserProfileDto;
		try {
			console.log('trying to register user: ');
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(pwd, salt);

			user = await this.createUser(createUser, hash);
			console.log(`Registered ${user.userName}`);
			return user;
		} catch (error) {
			console.log('Error registering user:', error.message);
			throw error;
		}
	}

	async changePwd(
		id: number,
		oldPwd: string,
		newPwd: string,
	): Promise<boolean> {
		if (!id || !oldPwd || !newPwd) {
			throw new BadRequestException('Missing data');
		}
		console.log(`Trying to update pwd: ${id}, ${oldPwd}, ${newPwd}`);
		try {
			const user = await this.db.user.findUnique({
				where: { id },
				include: { auth: true },
			});
			if (!user) {
				throw new NotFoundException(`User with id ${id} not found`);
			}
			const validPwd = await bcrypt.compare(oldPwd, user.auth?.pwd);
			if (validPwd) {
				const salt = await bcrypt.genSalt(10);
				const hash = await bcrypt.hash(newPwd, salt);
				await this.db.auth.update({
					where: { userId: id },
					data: { pwd: hash },
				});
				console.log('Pwd updated');
				return true;
			} else {
				throw new UnauthorizedException('Incorrect password');
			}
		} catch (error) {
			console.log('Error changing password:', error.message);
			throw error;
		}
	}

	async setJwtCookie(user: UserProfileDto, req: Request): Promise<void> {
		try {
			const jwt: string = await this.generateJwt(user);
			(req.res as Response).cookie('jwt', jwt, {
				httpOnly: true,
				maxAge: 11800000,
				sameSite: 'strict',
			});
		} catch (error) {
			console.log('Error setting jwt cookie:', error.message);
			throw error;
		}
	}

	async deleteJwtCookie(req: Request): Promise<boolean> {
		try {
			(req.res as Response).cookie('jwt', null, {
				httpOnly: true,
				sameSite: 'strict',
			});
			return true;
		} catch (error) {
			console.log('Error setting jwt cookie:', error.message);
			throw error;
		}
	}

	async deleteChatCookie(chatId: number, req: Request): Promise<boolean> {
		try {
			(req.res as Response).cookie(`chatToken_${chatId}`, null, {
				httpOnly: true,
				sameSite: 'strict',
			});
			return true;
		} catch (error) {
			console.log('Error deleting chat cookie:', error.message);
			throw error;
		}
	}

	async deleteAllChatCookies(req: Request): Promise<boolean> {
		try {
			// Get all cookies from the request
			const cookies = req.cookies;

			// Loop through each cookie and delete those containing 'chatToken'
			Object.keys(cookies).forEach((cookieName) => {
				if (cookieName.includes('chatToken')) {
					// Clear the cookie by setting it to expire in the past
					(req.res as Response).clearCookie(cookieName, {
						httpOnly: true,
						sameSite: 'strict',
					});
				}
			});
			return true;
		} catch (error) {
			console.log('Error deleting chat cookies:', error.message);
			throw error;
		}
	}

	async generateChatToken(chat: FetchChatDto): Promise<string> {
		const payload = { id: chat.id, visibility: chat.visibility };
		return this.jwtService.sign(payload);
	}

	async setChatCookie(chat: FetchChatDto, req: Request): Promise<void> {
		try {
			const token: string = await this.generateChatToken(chat);
			(req.res as Response).cookie(`chatToken_${chat.id}`, token, {
				httpOnly: true,
				maxAge: 11800000,
				sameSite: 'strict',
			});
		} catch (error) {
			console.log('Error setting chat cookie:', error.message);
			throw error;
		}
	}


	async validateChatLogin(id: number, password: string): Promise<FetchChatDto> {
		const chat = await this.db.chat.findUnique({
			where: { id },
			include: { users: true, chatAuth: true }
		});
		if (!chat)
			throw new UnauthorizedException("chat not found");
		if (chat.visibility == ChatType.PROTECTED) {
			if (!chat.chatAuth)
				throw new UnauthorizedException("No password found for protected chat")
			const validPwd = await bcrypt.compare(password, chat.chatAuth?.pwd);
			if (!validPwd)
				throw new UnauthorizedException(`Incorrect password for chat : ${id}`);
		} else {
			throw new BadRequestException("Trying to login to unprotected chat");
		}
		delete chat.chatAuth;
		return chat;
	}

	async setChatPassword(chatId: number, password: string): Promise<boolean> {
		try {
			const salt = await bcrypt.genSalt(10);
			const hash = await bcrypt.hash(password, salt);
			await this.db.chatAuth.upsert({ // upsert will update if exists, create if not, saves a query/route
				where: { chatId }, 
				update: { pwd: hash },
				create: { chatId, pwd: hash }
			});
			return true;
		} catch (error) {
			console.log('Error setting chat password:', error.message);
			throw error;
		}
	}

	async checkAuth(userId: number) : Promise<boolean> {
		const user = await this.db.user.findUnique({
			where: { id: userId },
			include: { auth: true },
		});
		if (!user) {
			throw new NotFoundException(`User with id ${userId} not found`);
		}
		console.log(user.auth);
		if (!user.auth?.pwd) {
			return true;
		}
		return false;
	}
}
