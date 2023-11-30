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
exports.AdsWhere = exports.AdUpdateInput = exports.AdCreateInput = exports.Ad = void 0;
const typeorm_1 = require("typeorm");
const class_validator_1 = require("class-validator");
const Category_1 = require("./Category");
const Tag_1 = require("./Tag");
const type_graphql_1 = require("type-graphql");
const ObjectId_1 = require("./ObjectId");
let Ad = class Ad extends typeorm_1.BaseEntity {
};
exports.Ad = Ad;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", Number)
], Ad.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.Length)(3, 100),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Ad.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, class_validator_1.IsInt)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], Ad.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Ad.prototype, "imgUrl", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    (0, class_validator_1.Length)(0, 5000),
    (0, class_validator_1.ValidateIf)((object, value) => !!value),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Ad.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Category_1.Category, (category) => category.ads),
    (0, type_graphql_1.Field)(() => Category_1.Category, { nullable: true }),
    __metadata("design:type", Category_1.Category)
], Ad.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => Tag_1.Tag, (tag) => tag.ads, { cascade: ["remove"] })
    // check with SQLite extension! If you forget this following line, the
    // pivot table won't be generated
    ,
    (0, typeorm_1.JoinTable)(),
    (0, type_graphql_1.Field)(() => [Tag_1.Tag]),
    __metadata("design:type", Array)
], Ad.prototype, "tags", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], Ad.prototype, "createdAt", void 0);
exports.Ad = Ad = __decorate([
    (0, typeorm_1.Entity)(),
    (0, type_graphql_1.ObjectType)()
], Ad);
let AdCreateInput = class AdCreateInput {
};
exports.AdCreateInput = AdCreateInput;
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdCreateInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], AdCreateInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdCreateInput.prototype, "imgUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdCreateInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", ObjectId_1.ObjectId)
], AdCreateInput.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ObjectId_1.ObjectId]),
    __metadata("design:type", Array)
], AdCreateInput.prototype, "tags", void 0);
exports.AdCreateInput = AdCreateInput = __decorate([
    (0, type_graphql_1.InputType)()
], AdCreateInput);
let AdUpdateInput = class AdUpdateInput {
};
exports.AdUpdateInput = AdUpdateInput;
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AdUpdateInput.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], AdUpdateInput.prototype, "price", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AdUpdateInput.prototype, "imgUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AdUpdateInput.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", ObjectId_1.ObjectId)
], AdUpdateInput.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [ObjectId_1.ObjectId], { nullable: true }),
    __metadata("design:type", Array)
], AdUpdateInput.prototype, "tags", void 0);
exports.AdUpdateInput = AdUpdateInput = __decorate([
    (0, type_graphql_1.InputType)()
], AdUpdateInput);
let AdsWhere = class AdsWhere {
};
exports.AdsWhere = AdsWhere;
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], AdsWhere.prototype, "categoryIn", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => String, { nullable: true }),
    __metadata("design:type", String)
], AdsWhere.prototype, "searchTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], AdsWhere.prototype, "priceGte", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], AdsWhere.prototype, "priceLte", void 0);
exports.AdsWhere = AdsWhere = __decorate([
    (0, type_graphql_1.InputType)()
], AdsWhere);
