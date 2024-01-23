import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './services/testing.service';
import { SeedService } from './services/seed.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [TestingController],
  providers: [SeedService, TestingService, PrismaService],
})

export class TestingModule {
}
