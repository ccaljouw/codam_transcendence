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
exports.CreateBookmarkDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateBookmarkDto {
}
exports.CreateBookmarkDto = CreateBookmarkDto;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ uniqueItems: true, nullable: false }),
    __metadata("design:type", String)
], CreateBookmarkDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(100),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({ required: false }),
    __metadata("design:type", String)
], CreateBookmarkDto.prototype, "descritpion", void 0);
__decorate([
    (0, class_validator_1.MaxLength)(100),
    (0, swagger_1.ApiProperty)({ nullable: false }),
    __metadata("design:type", String)
], CreateBookmarkDto.prototype, "link", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({ nullable: false }),
    __metadata("design:type", Number)
], CreateBookmarkDto.prototype, "ownerId", void 0);
//# sourceMappingURL=create-bookmark.dto.js.map