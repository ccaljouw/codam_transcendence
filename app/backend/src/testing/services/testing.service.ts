import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';
import { SeedService } from './seed.service';

@Injectable()
export class TestingService {
  constructor(private readonly seedService: SeedService) {}
  async runTests(): Promise<string> {
    const seed = await this.seedService.runSeed();
    
    if (seed) {
        return new Promise<string>((resolve, reject) => {
          const jestProcess = exec('npm run test:cov', (error, stdout, stderror) => {
            if (error) {
              console.error(`Error while running tests: ${error.message}`);
              reject(error.message);
            } else {
              const outputMessage = `Tests executed successfully.\n\n${stderror}`;
              console.log(stdout);
              resolve(outputMessage);
            }
          });
          
          jestProcess.stdin?.end();

          jestProcess.stdout.pipe(process.stdout);
          jestProcess.stderr.pipe(process.stderr);
        });
    } else {
      return ('seed failed');
    }
  }
}
