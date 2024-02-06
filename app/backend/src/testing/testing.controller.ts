import { Controller, Get } from '@nestjs/common';
import { TestingService } from './services/testing.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('test')
@ApiTags('testing')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Get()
  @ApiOperation({ summary: '(Runs seed and all tests)'})
  async runTests() {
    const seedMessage = await this.testingService.runSeed()
    const outputBackend = await this.testingService.runBackendTests();
    const outputFrontend = await this.testingService.runFrontendTests();
    return outputBackend + outputFrontend + seedMessage;
  }

  @Get('seed')
  @ApiOperation({ summary: '(Runs seed)'})
  async runSeed() {
    try {
      const outputMessage = await this.testingService.runSeed();
      return { msg: outputMessage };
    } catch (error) {
        return { msg: 'Error running seed' }
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
