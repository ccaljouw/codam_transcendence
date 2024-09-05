import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, Catch, HttpServer, HttpStatus } from '@nestjs/common';
import {
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from '@prisma/client/runtime/library';

@Catch(
  PrismaClientKnownRequestError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
)
export class PrismaClientExceptionFilter extends BaseExceptionFilter {
  constructor(applicationRef?: HttpServer) {
    super(applicationRef);
  }

  catch(
    exception:
      | PrismaClientKnownRequestError
      | PrismaClientUnknownRequestError
      | PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
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

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private catchClientUnknownRequestError(
    exception: PrismaClientUnknownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = HttpStatus.NOT_FOUND;
    const message = exception.message;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private catchClientValidationError(
    exception: PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status = HttpStatus.BAD_REQUEST;
    const message = `Validation error: ${this.extractValidationErrorMessage(exception)}`;

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message,
    });
  }

  private extractValidationErrorMessage(
    exception: PrismaClientValidationError,
  ): string {
    let errorMessage: string;
    let match: RegExpMatchArray;

    // Extract the part of the error message containing the field and expected type
    match = exception.message.match(
      /Invalid value for argument `([^`]+)`.+?Expected (.+?)\./,
    );
    if (match && match[1] && match[2]) {
      errorMessage = `'${match[1]}'. Expected ${match[2]}.`;
    } else {
      match = exception.message.match(/Argument `([^`]+)`.+?Expected (.+?)\./);
      if (match && match[1] && match[2]) {
        errorMessage = `'${match[1]}'. Expected ${match[2]}.`;
      }
    }
    return errorMessage;
  }
}
