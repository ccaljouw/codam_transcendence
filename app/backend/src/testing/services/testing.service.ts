import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class TestingService {
  async runAllTests(): Promise<string> {
    const command: string = 'npm run test:all';
    
    return new Promise<string>((resolve, reject) => {
      
      const jestProcess = exec(command, (error, stdout) => {
        if (error) {
          console.error(`${error.message}`);
          reject(`${error.message}`);
        } else {
          const outputMessage = `Test finished, check Test Output for overview of test results`;
          console.log(stdout);
          resolve(outputMessage);
        }
      });
      
      jestProcess.stdin?.end();

      jestProcess.stdout.pipe(process.stdout);
      jestProcess.stderr.pipe(process.stderr);
    });
  }

  async runBackendTests(): Promise<string> {
    const command: string = 'npm run test:backend';
    
    return new Promise<string>((resolve, reject) => {
      
      const jestProcess = exec(command, (error, stdout) => {
        if (error) {
          console.error(`${error.message}`);
          reject(`${error.message}`);
        } else {
          const outputMessage = `Test finished, check Test Output for overview of test results`;
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
    
    const command: string = 'npm run test:frontend';

    return new Promise<string>((resolve, reject) => {
      
      const jestProcess = exec(command, (error, stdout) => {
        if (error) {
          console.error(`${error.message}`);
          reject(`${error.message}`);
        } else {
          const outputMessage = `Test finished, check Test Output for overview of test results`;
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
