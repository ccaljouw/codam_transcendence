import { BaseExceptionFilter } from '@nestjs/core';
import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpServer,
  HttpStatus,
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
    const statusCode = this.errorCodesStatusMapping[exception.code];
    const message = `[${exception.code}]: ${this.exceptionShortMessage(exception.message)}`;

    console.error(message);

    if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
      return super.catch(exception, host);
    }

    super.catch(new HttpException({ statusCode, message }, statusCode), host);
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
    { message }: PrismaClientValidationError,
    host: ArgumentsHost,
  ) {
    const statusCode = HttpStatus.BAD_REQUEST;

    console.error(message);

    super.catch(new HttpException({ statusCode, message }, statusCode), host);
  }

  private exceptionShortMessage(message: string): string {
    const shortMessage = message.substring(message.indexOf('→'));

    return shortMessage
      .substring(shortMessage.indexOf('\n'))
      .replace(/\n/g, '')
      .trim();
  }
}
