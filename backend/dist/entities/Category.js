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
exports.CategoryUpdateInput = exports.CategoryCreateInput = exports.Category = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Ad_1 = require("./Ad");
const type_graphql_1 = require("type-graphql");
let Category = class Category extends typeorm_1.BaseEntity {
};
exports.Category = Category;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100 }),
    (0, class_validator_1.Length)(10, 100),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Ad_1.Ad, (ad) => ad.category),
    (0, type_graphql_1.Field)(() => [Ad_1.Ad]),
    __metadata("design:type", Array)
], Category.prototype, "ads", void 0);
exports.Category = Category = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], Category);
let CategoryCreateInput = class CategoryCreateInput {
};
exports.CategoryCreateInput = CategoryCreateInput;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CategoryCreateInput.prototype, "name", void 0);
exports.CategoryCreateInput = CategoryCreateInput = __decorate([
    (0, type_graphql_1.InputType)()
], CategoryCreateInput);
let CategoryUpdateInput = class CategoryUpdateInput {
};
exports.CategoryUpdateInput = CategoryUpdateInput;
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CategoryUpdateInput.prototype, "name", void 0);
exports.CategoryUpdateInput = CategoryUpdateInput = __decorate([
    (0, type_graphql_1.InputType)()
], CategoryUpdateInput);
