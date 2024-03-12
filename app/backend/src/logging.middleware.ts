import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Log headers to the console
    console.log('Request Headers:', req.headers);

    // Pass the request to the next middleware or route handler
    next();
  }
}