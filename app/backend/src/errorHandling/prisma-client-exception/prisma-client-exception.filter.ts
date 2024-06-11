import { BaseExceptionFilter } from '@nestjs/core';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

// TODO: should this be here or on a more central place in the code?
export type ErrorCodesStatusMapping = {
  [key: string]: number;
};

@Catch(
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  // TODO: check for other relevant codes
  private readonly logger = new Logger(PrismaClientExceptionFilter.name);
  private errorCodesStatusMapping: ErrorCodesStatusMapping = {
    P2000: HttpStatus.BAD_REQUEST,
    P2002: HttpStatus.CONFLICT,
    P2025: HttpStatus.NOT_FOUND,
  };

  // TODO: better understand what is happening here
  constructor(
    applicationRef?: HttpServer,
    errorCodesStatusMapping?: ErrorCodesStatusMapping,
  ) {
    super(applicationRef);

    if (errorCodesStatusMapping) {
      this.errorCodesStatusMapping = Object.assign(
        this.errorCodesStatusMapping,
        errorCodesStatusMapping,
      );
    }
  }

  catch(
    exception:
      | PrismaClientInitializationError
      | PrismaClientKnownRequestError
      | PrismaClientUnknownRequestError
      | PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    if (exception instanceof PrismaClientInitializationError) {
      return this.catchClientInitializationError(exception, host);
    }
    if (exception instanceof PrismaClientKnownRequestError) {
      return this.catchClientKnownRequestError(exception, host);
    }
    if (exception instanceof PrismaClientUnknownRequestError) {
      return this.catchClientUnknownRequestError(exception, host);
    }
    if (exception instanceof PrismaClientValidationError) {
      return this.catchClientValidationError(exception, host);
    }
  }

  private catchClientInitializationError(
    exception: PrismaClientInitializationError,
    host: ArgumentsHost,
  ) {
    const statusCode = this.errorCodesStatusMapping[exception.errorCode];
    const message = `[${exception.errorCode}]: ${this.exceptionShortMessage(exception.message)}`;

    console.error(message);

    if (
      !Object.keys(this.errorCodesStatusMapping).includes(exception.errorCode)
    ) {
      return super.catch(exception, host);
    }

    super.catch(new HttpException({ statusCode, message }, statusCode), host);
  }

  private catchClientKnownRequestError(
    exception: PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;

    if (exception.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = `Unique constraint failed on the fields: ${exception.meta.target}`;
    } else if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = `Record not found`;
    }

    this.logger.error(`Known Request Error - Code: ${exception.code}, Status: ${status}, Message: ${message}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });

  }

  private catchClientUnknownRequestError(
    { message }: PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ) {
    const statusCode = HttpStatus.NOT_FOUND;

    console.error(message);

    super.catch(new HttpException({ statusCode, message }, statusCode), host);
  }

  private catchClientValidationError(
    exception: PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = this.extractValidationErrorMessage(exception);
  
    status = HttpStatus.BAD_REQUEST;
    message = `Validation error: ${message}`;
   
    this.logger.error(`Validation Error - Exception: ${exception}, Status: ${status}, Message: ${message}`);

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));

    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }

  private extractValidationErrorMessage(exception: PrismaClientValidationError): string {
    let errorMessage: string;

    // Extract the part of the error message containing the field and expected type
    const match = exception.message.match(/Invalid value for argument `([^`]+)`.+?Expected (.+?)\./);
    if (match && match[1] && match[2]) {
        errorMessage = `'${match[1]}'. Expected ${match[2]}.`;
    }

    return errorMessage;
  }
}
