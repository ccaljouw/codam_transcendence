import { Controller, Get } from '@nestjs/common';
import { TestingService } from './services/testing.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('test')
@ApiTags('testing')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Get('all')
  @ApiOperation({ summary: '(Runs all tests)'})
  async runAllTests() {
  try {
    const outputMessage = await this.testingService.runAllTests();
    return { msg: outputMessage };
  } catch (error) {
    return { msg: 'Error running tests' }
  }
  }
  
  @Get('backend')
  @ApiOperation({ summary: '(Runs backend tests)'})
  async runBackendTests() {
  try {
    const outputMessage = await this.testingService.runBackendTests();
    return { msg: outputMessage };
  } catch (error) {
    return { msg: 'Error running backend tests' }
  }
  }

  @Get('frontend')
  @ApiOperation({ summary: '(Runs frontend tests)'})
  async runfrontendTests() {
    try {
      const outputMessage = await this.testingService.runFrontendTests();
      return { msg: outputMessage };
    } catch (error) {
      return { msg: 'Error running frontend tests' }
    }
  }
}
