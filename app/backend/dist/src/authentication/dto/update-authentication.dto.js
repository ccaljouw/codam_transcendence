"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAuthenticationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_authentication_dto_1 = require("./create-authentication.dto");
class UpdateAuthenticationDto extends (0, swagger_1.PartialType)(create_authentication_dto_1.CreateAuthenticationDto) {
}
exports.UpdateAuthenticationDto = UpdateAuthenticationDto;
//# sourceMappingURL=update-authentication.dto.js.map