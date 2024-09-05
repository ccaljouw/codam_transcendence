import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpErrorFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.message;

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
      });
    }
  }
}
