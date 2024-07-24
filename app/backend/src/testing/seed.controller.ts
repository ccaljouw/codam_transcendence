import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SeedService } from './services/seed.service';

@Controller('seed')
@ApiTags('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Get()
  @ApiOperation({ summary: '(Runs seed)' })
  async runSeed() {
    try {
      const outputMessage = await this.seedService.runSeed();
      return { msg: outputMessage };
    } catch (error) {
      return { msg: 'Error running seed' };
    }
  }
}
