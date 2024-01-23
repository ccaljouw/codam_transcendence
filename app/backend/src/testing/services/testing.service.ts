import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { SeedService } from './seed.service';

@Injectable()
export class TestingService {
  constructor(private readonly seedService: SeedService) {}
  async runTests(): Promise<boolean> {
    const seed = await this.seedService.runSeed();
    
    if (seed) {
        return new Promise<boolean>((resolve, reject) => {
          const jestProcess = exec('npm test', (error, stdout, stderror) => {
            if (error) {
              console.error(`Error while running tests: ${error.message}`);
              reject(error);
            } else {
              console.log(stdout);
              resolve(true);
            }
          });
          
          jestProcess.stdout.pipe(process.stdout);
          jestProcess.stderr.pipe(process.stderr);
        });
    } else {
      return (false);
    }
  }
}
