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
    const testSuccessfull = await this.testingService.runTests();
    if (testSuccessfull) {
      return { message: 'Tests executed successfully'}
    } else {
      return { message: 'Tests failed'}
    }
  } catch (error) {
    return { message: 'Error running tests'}
  }
  }
}
