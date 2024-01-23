import { Controller, Get } from '@nestjs/common';
import { TestingService } from './services/testing.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SeedService } from './services/seed.service';

@Controller('test')
@ApiTags('test')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Get('backend')
  @ApiOperation({ summary: '(Runs backend tests)'})
  async runTests() {
  try {
    const outputMessage = await this.testingService.runTests();
    const returnMessage = outputMessage.replace(/\n/g, '<br>');
    return returnMessage;
  } catch (error) {
    return 'Error running tests'
  }
  }
}
