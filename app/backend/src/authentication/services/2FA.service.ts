import { Injectable, UnauthorizedException } from "@nestjs/common";
import * as QRCode from "qrcode";
import * as speakeasy from "speakeasy";
import { PrismaService } from "src/database/prisma.service";
import { UsersService } from "src/users/users.service";


@Injectable()
export class TwoFAService {

  constructor (
    private readonly db: PrismaService,
    private readonly userService: UsersService,
  ) {};
  
  async enable2FA(userId: number)  : Promise<{res: string}> {
    try {
      const user = await this.db.user.findUnique({
        where: { id: userId },
      })
      if (!user)
        throw new UnauthorizedException;

      if (user.twoFactEnabled === true ) {
        console.log('2FA already enabled');
        return { res: '2FA already enabled' }; // what to return here?
      }

      const secret: speakeasy.GeneratedSecret  = await this.generate2FASecret(user.loginName);
      await this.store2FASecret(secret.base32, userId);
      console.log('succesfully enabled 2FA and stored token');

      const qr = await this.generateQRCode(secret.otpauth_url, user.loginName);
      return {res: qr};
      
    }  catch (error) {
      throw error;
    }
  }

  async disable2FA(userId: number) {
    try {
      await this.db.user.update({ where: {id: userId}, data: { twoFactEnabled: false }});
      await this.db.auth.update({
        where: { id: userId },	
          data: {twoFactSecret: null },
        })

    }  catch (error) {
      throw error;
    }
  }

  async generateQRCode( otpauthUrl: string, userLogin: string) : Promise<string> {
    try {
      // const otpauthUrl = speakeasy.otpauthURL({
      //   secret: secret,
      //   label: `${userLogin}`,
      //   issuer: `Strongpong`
      // });
      console.log(`otpauthUrl: ${otpauthUrl}`)

      QRCode.toDataURL(otpauthUrl, function (err, data_url) {
        console.log('---QRCODE IS ---/n'+ data_url);
      });

      const qr = await QRCode.toDataURL(otpauthUrl);
      return qr;
    } catch (error) {
      throw error;
    }
  }
  
  async store2FASecret( secret: string, userId: number ) {
    try {
      await this.db.user.update({ where: {id: userId}, data: { twoFactEnabled: true }});
      await this.db.auth.update({
        where: { id: userId },	
        data: {twoFactSecret: secret },
      })
    } catch (error) {
      throw error;
    }
  }
  
  async generate2FASecret (loginName: string) : Promise<speakeasy.GeneratedSecret> {
    const secret: speakeasy.GeneratedSecret = speakeasy.generateSecret({ name: `${loginName}` });
    console.log(secret);
    return secret;
  }

  async generate2FAToken(secret: string) : Promise<string> {
    const token: string = speakeasy.totp({
      secret: secret,
      encoding: "base32",
      // step: 30,
    });
    return token;
  }

  async verify2FASecret( secret: string, token: string ) : Promise<boolean> {
    try {
      console.log(`in verify2FASecret: secret: ***${secret}***, token: ***${token}***`)
      const verified = speakeasy.totp.verify({ 
        secret: secret,
        encoding: "base32",
        token: token,
        // step: 30,
      });
      
      console.log('Verification Result:', verified);

      if (verified) {
        console.log('2FA token verification successful!');
      } else {
        console.log('Invalid 2FA token provided.');
      }
      return verified;
    } catch (error) {
      console.error('Error during 2FA verification:', error);
      throw error;
    }
  } 
}