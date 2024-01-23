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
          console.error(`ERROR WHILE RUNNING TESTS: ${error.message}`);
          reject(`ERROR WHILE RUNNING TESTS: ${error.message}`);
        } else {
          const outputMessage = `BACKEND TESTS PASSED\n\n${stderr}\n\n`;
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
    return 'NO FRONTEND TESTS YET\n\n';
  }

}
