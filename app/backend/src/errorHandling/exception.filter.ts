import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();

      let status: number;
      let message: string;

      if (exception instanceof HttpException) {
        status = exception.getStatus();
        message = exception.message;
      } else {
        // unhandeled non-HTTP exceptions
        status = HttpStatus.INTERNAL_SERVER_ERROR;
        message = 'Unhandeled backend Error';
        console.error('Unhandeled error: ', exception);
      }
  
      console.log(
        `In http error filter. Status: ${status}, Message: ${message}`,
      );
      if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        const redirectUrl = new URL(
          `${process.env.FRONTEND_URL}/auth`,
        );
        redirectUrl.searchParams.append('status', status.toString());
        redirectUrl.searchParams.append('message', message);
  
        response.redirect(`${redirectUrl}`);
      } else {
        response.status(status).json({
          statusCode: status,
          message: message,
          path: request.url,
        });
      }
  }
}
