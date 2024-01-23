import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { WebsiteController } from './website.controller';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'coverage', 'backend', 'lcov-report'),
      serveRoot: '/tests/backend',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../../../..', 'coverage', 'frontend', 'lcov-report'),
      serveRoot: '/tests/frontend',
    })
  ],
  controllers: [WebsiteController],
})
export class WebsiteModule {}
