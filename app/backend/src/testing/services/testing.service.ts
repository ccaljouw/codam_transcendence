import { Injectable } from '@nestjs/common';
import { exec } from 'child_process';

@Injectable()
export class TestingService {
  private runnungTests: boolean = false;

  async runBackendTests(): Promise<string> {
    
    const command: string = 'npm run test:cov_backend';
    
    return new Promise<string>((resolve, reject) => {
      
      if (this.runnungTests == true) {
        reject('allready running tests');
        return;
      }
      
      this.runnungTests = true;
      const jestProcess = exec(command, (error, stdout, stderr) => {
        this.runnungTests = false;
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
    
    const command: string = 'npm run test:cov_frontend';

    return new Promise<string>((resolve, reject) => {
      
      if (this.runnungTests == true) {
        reject('allready running tests');
        return;
      }
      
      this.runnungTests = true;
      const jestProcess = exec(command, (error, stdout, stderr) => {
        this.runnungTests = false;
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
