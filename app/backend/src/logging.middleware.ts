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
        `*Incoming request ${method} ${url},route: ${JSON.stringify(params)}, query: ${JSON.stringify(query)}*`, //from ${userAgent}
      );
      this.logger.debug(`Request body: ${JSON.stringify(body)}`);

      // Log outgoing response
      res.on('finish', () => {
        const { statusCode } = res;
        this.logger.log(`Outgoing response ${method} ${url} ${statusCode}`);
      });
    } catch (error) {
      this.logger.error(`Logger error: ${error.message}`, error.stack);
    }
    next();
  }
}
