import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class TwoFAService {
	constructor(private readonly db: PrismaService) {}

	async enable2FA(userId: number): Promise<{ res: string }> {
		try {
			const user = await this.db.user.findUnique({
				where: { id: userId },
			});
			if (!user) {
				throw new UnauthorizedException(`User with id ${userId} not found`);
			}
			if (user.twoFactEnabled == true) {
				console.log('2FA already enabled');
				throw new ConflictException({
					message: 'Two factor authentication already enabled',
				});
			} else {
				const secret: speakeasy.GeneratedSecret = await this.generate2FASecret(
					user.loginName,
				);
				if (!secret) throw new Error('Error generating 2FA secret');
				await this.store2FASecret(secret.base32, userId);
				console.log('succesfully enabled 2FA and stored token');
				const qr = await this.generateQRCode(secret.otpauth_url);
				if (!qr) throw new Error('Error generating QR code');
				return { res: qr };
			}
		} catch (error) {
			console.error('Error enabling 2FA:', error);
			throw error;
		}
	}

	async disable2FA(userId: number): Promise<boolean> {
		try {
			await this.db.user.update({
				where: { id: userId },
				data: { twoFactEnabled: false },
			});
			await this.db.auth.update({
				where: { userId: userId },
				data: { twoFactSecret: null },
			});
			return true;
		} catch (error) {
			console.log('Error disabling 2FA:', error);
			throw error;
		}
	}

	async generateQRCode(otpauthUrl: string): Promise<string> {
		try {
			const qr = await QRCode.toDataURL(otpauthUrl);
			return qr;
		} catch (error) {
			console.log('Error generating QR code:', error);
			throw error;
		}
	}

	async store2FASecret(secret: string, userId: number) {
		try {
			await this.db.auth.update({
				where: { userId: userId },
				data: { twoFactSecret: secret },
			});
		} catch (error) {
			console.log('Error storing 2FA secret:', error);
			throw error;
		}
	}

	async generate2FASecret(
		loginName: string,
	): Promise<speakeasy.GeneratedSecret> {
		const secret: speakeasy.GeneratedSecret = speakeasy.generateSecret({
			name: `Strong Pong: ${loginName}`,
		});
		console.log(secret);
		return secret;
	}

	async verify2FASecret(secret: string, token: string): Promise<boolean> {
		try {
			console.log(
				`in verify2FASecret: secret: ***${secret}***, token: ***${token}***`,
			);
			const verified = speakeasy.totp.verify({
				secret: secret,
				encoding: 'base32',
				token: token,
			});
			
			console.log('Verification Result:', verified);
			if (verified == false)
				throw new UnauthorizedException('Token verification failed: invalid token');
			return verified;
		} catch (error) {
			console.log('Error during 2FA verification:', error);
			throw error;
		}
	}

	async checkFAToken(id: number, token: string): Promise<boolean> {
		try {
			const user = await this.db.user.findUnique({
				where: { id },
				select: { auth: { select: { twoFactSecret: true } } },
			});
			if (!user || !user.auth.twoFactSecret) {
				console.log('Error during 2FA token verification:');
				throw new UnauthorizedException(`User with id ${id} not found`);
			}
			await this.verify2FASecret(user.auth.twoFactSecret, token);
			await this.db.user.update({
				where: { id },
				data: { twoFactEnabled: true },
			});
			return true;
		} catch (error) {
			console.log('Error during 2FA initial token verification:', error);
			throw error;
		}
	}
}
