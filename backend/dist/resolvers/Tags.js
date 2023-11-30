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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagsResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Tag_1 = require("../entities/Tag");
const class_validator_1 = require("class-validator");
let TagsResolver = class TagsResolver {
    allTags() {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield Tag_1.Tag.find({ relations: { ads: true } });
            return tags;
        });
    }
    tag(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield Tag_1.Tag.findOne({
                where: { id: id },
                relations: { ads: true },
            });
            return tag;
        });
    }
    createTag(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newTag = new Tag_1.Tag();
            Object.assign(newTag, data);
            const errors = yield (0, class_validator_1.validate)(newTag);
            if (errors.length === 0) {
                yield newTag.save();
                return newTag;
            }
            else {
                throw new Error(`Error occured: ${JSON.stringify(errors)}`);
            }
        });
    }
    updateTag(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield Tag_1.Tag.findOne({
                where: { id: id },
            });
            if (tag) {
                Object.assign(tag, data);
                const errors = yield (0, class_validator_1.validate)(tag);
                if (errors.length === 0) {
                    yield tag.save();
                }
                else {
                    throw new Error(`Error occured: ${JSON.stringify(errors)}`);
                }
            }
            return tag;
        });
    }
    deleteTag(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const tag = yield Tag_1.Tag.findOne({
                where: { id: id },
            });
            if (tag) {
                yield tag.remove();
                tag.id = id;
            }
            return tag;
        });
    }
};
exports.TagsResolver = TagsResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Tag_1.Tag]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "allTags", null);
__decorate([
    (0, type_graphql_1.Query)(() => Tag_1.Tag, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "tag", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Tag_1.Tag),
    __param(0, (0, type_graphql_1.Arg)("data", () => Tag_1.TagCreateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Tag_1.TagCreateInput]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "createTag", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Tag_1.Tag, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Tag_1.TagUpdateInput]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "updateTag", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Tag_1.Tag, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], TagsResolver.prototype, "deleteTag", null);
exports.TagsResolver = TagsResolver = __decorate([
    (0, type_graphql_1.Resolver)(Tag_1.Tag)
], TagsResolver);
