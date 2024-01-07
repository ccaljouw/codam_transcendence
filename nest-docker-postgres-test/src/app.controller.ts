import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { TestService } from './app.service';

@Controller()
export class AppController {
  constructor(
		private readonly appService: AppService,
		private readonly testService: TestService
	) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  @Get('test')
  async getAllTestItems() {
    return this.testService.findAll(); // Use a method from TestService
  }
}
