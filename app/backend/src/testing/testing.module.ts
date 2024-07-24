import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { SeedService } from './services/seed.service';
import { PrismaService } from 'src/database/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { TestingService } from './services/testing.service';
import { SeedController } from './seed.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'coverage', 'lcov-report'),
      serveRoot: '/test/report',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'coverage', 'test_output.html'),
      serveRoot: '/test/output',
    }),
  ],
  controllers: [TestingController, SeedController],
  providers: [SeedService, TestingService, PrismaService],
})
export class TestingModule {}
