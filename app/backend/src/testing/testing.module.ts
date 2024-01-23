import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './services/testing.service';
import { SeedService } from './services/seed.service';
import { PrismaService } from 'src/database/prisma.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'coverage', 'backend', 'lcov-report'),
      serveRoot: '/test/backend/report',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'coverage', 'frontend', 'lcov-report'),
      serveRoot: '/test/frontend/report',
    })
  ],
  controllers: [TestingController],
  providers: [SeedService, TestingService, PrismaService],
})

export class TestingModule {
}
