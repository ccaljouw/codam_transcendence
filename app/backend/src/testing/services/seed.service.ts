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
          console.error(`ERROR RUNNING PRISMA SEED: ${error.message}`);
          reject(`ERROR RUNNING PRISMA SEED: ${error.message}\n\n`);
        } else {
          const outputMessage = `DATABASE SEEDED\n\n${stdout}\n\n`;
          console.log(stdout);
          resolve(outputMessage);
        }
      })
    })
  }
}
