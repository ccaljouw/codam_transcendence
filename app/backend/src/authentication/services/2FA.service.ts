import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as QRCode from 'qrcode';
import * as speakeasy from 'speakeasy';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TwoFAService {
  constructor(private readonly db: PrismaService) {}

  async enable2FA(userId: number): Promise<{ res: string }> {
    try {
      const user = await this.db.user.findUnique({
        where: { id: userId },
      });
      if (!user) throw new UnauthorizedException();

      if (user.twoFactEnabled == true) {
        console.log('2FA already enabled');
        throw new ConflictException({
          message: 'Two factor authentication already enabled',
        });
      } else {
        const secret: speakeasy.GeneratedSecret = await this.generate2FASecret(
          user.loginName,
        );
        await this.store2FASecret(secret.base32, userId);
        console.log('succesfully enabled 2FA and stored token');
        const qr = await this.generateQRCode(secret.otpauth_url);
        return { res: qr };
      }
    } catch (error) {
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
        where: { id: userId },
        data: { twoFactSecret: null },
      });
      return true;
    } catch (error) {
      throw error;
    }
  }

  async generateQRCode(otpauthUrl: string): Promise<string> {
    try {
      const qr = await QRCode.toDataURL(otpauthUrl);
      return qr;
    } catch (error) {
      throw error;
    }
  }

  async store2FASecret(secret: string, userId: number) {
    try {
      await this.db.user.update({
        where: { id: userId },
        data: { twoFactEnabled: true },
      });
      await this.db.auth.update({
        where: { id: userId },
        data: { twoFactSecret: secret },
      });
    } catch (error) {
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
      return verified;
    } catch (error) {
      console.error('Error during 2FA verification:', error);
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
        throw new UnauthorizedException();
      }
      return await this.verify2FASecret(user.auth.twoFactSecret, token);
    } catch (error) {
      console.error('Error during 2FA initial token verification:', error);
    }

    return true;
  }
}
