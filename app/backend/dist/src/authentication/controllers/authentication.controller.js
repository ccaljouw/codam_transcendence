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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationController = void 0;
const common_1 = require("@nestjs/common");
const authentication_service_1 = require("../services/authentication.service");
const create_authentication_dto_1 = require("../dto/create-authentication.dto");
const swagger_1 = require("@nestjs/swagger");
const authentication_entity_1 = require("../dto/authentication.entity");
let AuthenticationController = class AuthenticationController {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
    }
    register(createAuthenticationDto) {
        return this.authenticationService.register(createAuthenticationDto);
    }
};
exports.AuthenticationController = AuthenticationController;
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiCreatedResponse)({ type: authentication_entity_1.AuthenticationEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_authentication_dto_1.CreateAuthenticationDto]),
    __metadata("design:returntype", void 0)
], AuthenticationController.prototype, "register", null);
exports.AuthenticationController = AuthenticationController = __decorate([
    (0, common_1.Controller)('authentication'),
    (0, swagger_1.ApiTags)('authentication'),
    __metadata("design:paramtypes", [authentication_service_1.AuthenticationService])
], AuthenticationController);
//# sourceMappingURL=authentication.controller.js.map