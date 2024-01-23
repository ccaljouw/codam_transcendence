import { Controller, Get } from '@nestjs/common';
import { TestingService } from './services/testing.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('testing')
@ApiTags('test')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Get()
  @ApiOperation({ summary: '(Runs all tests)'})
  async runTests() {
    const seedMessage = await this.testingService.runSeed()
    const outputBackend = await this.testingService.runBackendTests();
    const outputFrontend = await this.testingService.runFrontendTests();
    return outputBackend.replace(/\n/g, '<br>') + outputFrontend.replace(/\n/g, '<br>') + seedMessage.replace(/\n/g, '<br>');
  }

  @Get('seed')
  @ApiOperation({ summary: '(Runs seed)'})
  async runSeed() {
    try {
      const outputMessage = await this.testingService.runSeed();
      const returnMessage = outputMessage.replace(/\n/g, '<br>');
      return returnMessage;
    } catch (error) {
      return 'Error running seed'
    }
  }

  @Get('backend')
  @ApiOperation({ summary: '(Runs backend tests)'})
  async runBackendTests() {
  try {
    const outputMessage = await this.testingService.runBackendTests();
    const returnMessage = outputMessage.replace(/\n/g, '<br>');
    return returnMessage;
  } catch (error) {
    return 'Error running backend tests'
  }
  }

  @Get('frontend')
  @ApiOperation({ summary: '(Runs frontend tests)'})
  async runfrontendTests() {
    try {
      const outputMessage = await this.testingService.runFrontendTests();
      const returnMessage = outputMessage.replace(/\n/g, '<br>');
      return returnMessage;
    } catch (error) {
      return 'Error running backend tests'
    }
  }
}
