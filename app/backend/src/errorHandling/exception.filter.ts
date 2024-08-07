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
      `In http error filter. Status: ${status}, Message: ${message}, response: ${response}`,
    );
    console.log('ctx:', ctx);
    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      //TODO: Implement redirect to error page here? Handle other status codes?
      const redirectUrl = new URL(
        `${process.env.FRONTEND_URL}/error/${status}`,
      );
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
