import { Controller, Get, UseGuards } from '@nestjs/common';
import { TestingService } from './services/testing.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';

@Controller('test')
@ApiTags('testing')
export class TestingController {
  constructor(private readonly testingService: TestingService) {}

  @Get('all')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '(Runs all tests)' })
  async runAllTests(): Promise<{ msg: string }> {
    try {
      const outputMessage = await this.testingService.runAllTests();
      return { msg: outputMessage };
    } catch (error) {
      return { msg: 'Error running tests' };
    }
  }

  @Get('backend')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '(Runs backend tests)' })
  async runBackendTests(): Promise<{ msg: string }> {
    try {
      const outputMessage = await this.testingService.runBackendTests();
      return { msg: outputMessage };
    } catch (error) {
      return { msg: 'Error running backend tests' };
    }
  }

  @Get('frontend')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: '(Runs frontend tests)' })
  async runfrontendTests(): Promise<{ msg: string }> {
    try {
      const outputMessage = await this.testingService.runFrontendTests();
      return { msg: outputMessage };
    } catch (error) {
      return { msg: 'Error running frontend tests' };
    }
  }
}
