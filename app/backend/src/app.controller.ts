import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('healthcheck')
  returnHealth() {
    return { status: 'ok' };
  }
}
