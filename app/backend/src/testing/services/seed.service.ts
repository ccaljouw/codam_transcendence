import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { exec } from 'child_process';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async runSeed(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const child = exec('npx prisma db seed', (error, stdout, stderr) => {
        if (error) {
          console.error(`${error.message}`);
          reject(`${error.message}\n\n`);
        } else {
          const outputMessage = `${stdout}`;
          console.log(stdout);
          resolve(outputMessage);
        }
      })
    })
  }
}
