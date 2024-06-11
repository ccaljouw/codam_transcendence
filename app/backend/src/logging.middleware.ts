// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';

// @Injectable()
// export class LoggingMiddleware implements NestMiddleware {
//   use(req: Request, res: Response, next: NextFunction) {
//     // Log headers to the console
//     console.log("****MIDDLEWHERE****");
//     console.log('Request Headers:', req.headers);
//     console.log("*******************");

//     // Pass the request to the next middleware or route handler
//     next();
//   }
// }

import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body, query, params } = req;
    const userAgent = req.get('user-agent') || '';

    try {
      // Log incoming request
      this.logger.log(`*************Incoming request ${method} ${url} from ${userAgent}**********`);
      this.logger.debug(`Request body: ${JSON.stringify(body)}`);
      this.logger.debug(`Query parameters: ${JSON.stringify(query)}`);
      this.logger.debug(`Route parameters: ${JSON.stringify(params)}`);

      // Log outgoing response
      res.on('finish', () => {
        const { statusCode } = res;
        this.logger.log(`Outgoing response ${method} ${url} ${statusCode}`);
      });
    } catch (error) {
      this.logger.error(`LoggerMiddleware error: ${error.message}`, error.stack);
    }

    next();
  }
}
