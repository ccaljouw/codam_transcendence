import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { SeedService } from './seed.service';

@Injectable()
export class TestingService {
  constructor(private readonly seedService: SeedService) {}
  
  async runSeed(): Promise<string> {
    return await this.seedService.runSeed();
  }

  async runBackendTests(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const jestProcess = exec('npm run test:cov', (error, stdout, stderr) => {
        if (error) {
          console.error(`${error.message}`);
          reject(`${error.message}`);
        } else {
          const outputMessage = `${stderr}`;
          console.log(stdout);
          resolve(outputMessage);
        }
      });
      
      jestProcess.stdin?.end();

      jestProcess.stdout.pipe(process.stdout);
      jestProcess.stderr.pipe(process.stderr);
    });
  }

  async runFrontendTests(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const jestProcess = exec('npm run test:cov', (error, stdout, stderr) => { //change test
        if (error) {
          console.error(`${error.message}`);
          reject(`${error.message}`);
        } else {
          const outputMessage = `${stderr}`;
          console.log(stdout);
          resolve(outputMessage);
        }
      });
      
      jestProcess.stdin?.end();

      jestProcess.stdout.pipe(process.stdout);
      jestProcess.stderr.pipe(process.stderr);
    });
  }

}
