import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '../../../..',
        'coverage',
        'backend',
        'lcov-report',
      ),
      serveRoot: '/tests/backend',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(
        __dirname,
        '../../../..',
        'coverage',
        'frontend',
        'lcov-report',
      ),
      serveRoot: '/tests/frontend',
    }),
  ],
})
export class WebsiteModule {}
