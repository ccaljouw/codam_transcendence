import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, HttpServer } from '@nestjs/common';
import { PrismaClientInitializationError, PrismaClientKnownRequestError, PrismaClientUnknownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
export type ErrorCodesStatusMapping = {
    [key: string]: number;
};
export declare class PrismaClientExceptionFilter extends BaseExceptionFilter {
    private errorCodesStatusMapping;
    constructor(applicationRef?: HttpServer, errorCodesStatusMapping?: ErrorCodesStatusMapping);
    catch(exception: PrismaClientInitializationError | PrismaClientKnownRequestError | PrismaClientUnknownRequestError | PrismaClientValidationError, host: ArgumentsHost): void;
    private catchClientInitializationError;
    private catchClientKnownRequestError;
    private catchClientUnknownRequestError;
    private catchClientValidationError;
    private exceptionShortMessage;
}
