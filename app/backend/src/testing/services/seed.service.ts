import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { exec } from 'child_process';

@Injectable()
export class SeedService {
  constructor(private prisma: PrismaService) {}

  async runSeed(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const child = exec('npx prisma db seed', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error running Prisma seed: ${error.message}`);
          reject(error);
        } else {
          console.log(stdout);
          resolve(true);
        }
      })
    })
  }
}
