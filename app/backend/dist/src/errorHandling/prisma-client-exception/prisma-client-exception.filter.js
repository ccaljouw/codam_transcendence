"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaClientExceptionFilter = void 0;
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const library_1 = require("@prisma/client/runtime/library");
let PrismaClientExceptionFilter = class PrismaClientExceptionFilter extends core_1.BaseExceptionFilter {
    constructor(applicationRef, errorCodesStatusMapping) {
        super(applicationRef);
        this.errorCodesStatusMapping = {
            P2000: common_1.HttpStatus.BAD_REQUEST,
            P2002: common_1.HttpStatus.CONFLICT,
            P2025: common_1.HttpStatus.NOT_FOUND,
        };
        if (errorCodesStatusMapping) {
            this.errorCodesStatusMapping = Object.assign(this.errorCodesStatusMapping, errorCodesStatusMapping);
        }
    }
    catch(exception, host) {
        if (exception instanceof library_1.PrismaClientInitializationError) {
            return this.catchClientInitializationError(exception, host);
        }
        if (exception instanceof library_1.PrismaClientKnownRequestError) {
            return this.catchClientKnownRequestError(exception, host);
        }
        if (exception instanceof library_1.PrismaClientUnknownRequestError) {
            return this.catchClientUnknownRequestError(exception, host);
        }
        if (exception instanceof library_1.PrismaClientValidationError) {
            return this.catchClientValidationError(exception, host);
        }
    }
    catchClientInitializationError(exception, host) {
        const statusCode = this.errorCodesStatusMapping[exception.errorCode];
        const message = `[${exception.errorCode}]: ${this.exceptionShortMessage(exception.message)}`;
        console.error(message);
        if (!Object.keys(this.errorCodesStatusMapping).includes(exception.errorCode)) {
            return super.catch(exception, host);
        }
        super.catch(new common_1.HttpException({ statusCode, message }, statusCode), host);
    }
    catchClientKnownRequestError(exception, host) {
        const statusCode = this.errorCodesStatusMapping[exception.code];
        const message = `[${exception.code}]: ${this.exceptionShortMessage(exception.message)}`;
        console.error(message);
        if (!Object.keys(this.errorCodesStatusMapping).includes(exception.code)) {
            return super.catch(exception, host);
        }
        super.catch(new common_1.HttpException({ statusCode, message }, statusCode), host);
    }
    catchClientUnknownRequestError({ message }, host) {
        const statusCode = common_1.HttpStatus.NOT_FOUND;
        console.error(message);
        super.catch(new common_1.HttpException({ statusCode, message }, statusCode), host);
    }
    catchClientValidationError({ message }, host) {
        const statusCode = common_1.HttpStatus.BAD_REQUEST;
        console.error(message);
        super.catch(new common_1.HttpException({ statusCode, message }, statusCode), host);
    }
    exceptionShortMessage(message) {
        const shortMessage = message.substring(message.indexOf('→'));
        return shortMessage
            .substring(shortMessage.indexOf('\n'))
            .replace(/\n/g, '')
            .trim();
    }
};
exports.PrismaClientExceptionFilter = PrismaClientExceptionFilter;
exports.PrismaClientExceptionFilter = PrismaClientExceptionFilter = __decorate([
    (0, common_1.Catch)(library_1.PrismaClientInitializationError, library_1.PrismaClientKnownRequestError, library_1.PrismaClientUnknownRequestError, library_1.PrismaClientValidationError),
    __metadata("design:paramtypes", [Object, Object])
], PrismaClientExceptionFilter);
//# sourceMappingURL=prisma-client-exception.filter.js.map