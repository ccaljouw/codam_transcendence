import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body, query, params } = req;

    try {
      // Log incoming request
      this.logger.log(
        `${method} ${url},route: ${JSON.stringify(params)}, body: ${JSON.stringify(body)}, query: ${JSON.stringify(query)}`,
      );
    } catch (error) {
      this.logger.error(`Logger error: ${error.message}`, error.stack);
    }
    next();
  }
}
