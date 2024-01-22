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
exports.BookmarksController = void 0;
const common_1 = require("@nestjs/common");
const bookmarks_service_1 = require("./bookmarks.service");
const create_bookmark_dto_1 = require("./dto/create-bookmark.dto");
const update_bookmark_dto_1 = require("./dto/update-bookmark.dto");
const swagger_1 = require("@nestjs/swagger");
const bookmark_entity_1 = require("./dto/bookmark.entity");
let BookmarksController = class BookmarksController {
    constructor(bookmarksService) {
        this.bookmarksService = bookmarksService;
    }
    create(createBookmarkDto) {
        return this.bookmarksService.create(createBookmarkDto);
    }
    findAll() {
        return this.bookmarksService.findAll();
    }
    async findOne(id) {
        return this.bookmarksService.findOne(id);
    }
    update(id, updateBookmarkDto) {
        return this.bookmarksService.update(id, updateBookmarkDto);
    }
    remove(id) {
        return this.bookmarksService.remove(id);
    }
};
exports.BookmarksController = BookmarksController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiCreatedResponse)({ type: bookmark_entity_1.BookmarkEntity }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_bookmark_dto_1.CreateBookmarkDto]),
    __metadata("design:returntype", void 0)
], BookmarksController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOkResponse)({ type: bookmark_entity_1.BookmarkEntity, isArray: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BookmarksController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOkResponse)({ type: bookmark_entity_1.BookmarkEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], BookmarksController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, swagger_1.ApiOkResponse)({ type: bookmark_entity_1.BookmarkEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, update_bookmark_dto_1.UpdateBookmarkDto]),
    __metadata("design:returntype", void 0)
], BookmarksController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOkResponse)({ type: bookmark_entity_1.BookmarkEntity }),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], BookmarksController.prototype, "remove", null);
exports.BookmarksController = BookmarksController = __decorate([
    (0, common_1.Controller)('bookmarks'),
    (0, swagger_1.ApiTags)('bookmarks'),
    __metadata("design:paramtypes", [bookmarks_service_1.BookmarksService])
], BookmarksController);
//# sourceMappingURL=bookmarks.controller.js.map