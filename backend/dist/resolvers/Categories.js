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
exports.CategoriesResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Category_1 = require("../entities/Category");
const class_validator_1 = require("class-validator");
let CategoriesResolver = class CategoriesResolver {
    allCategories() {
        return __awaiter(this, void 0, void 0, function* () {
            const categories = yield Category_1.Category.find({ relations: { ads: true } });
            return categories;
        });
    }
    category(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category_1.Category.findOne({
                where: { id: id },
                relations: { ads: true },
            });
            return category;
        });
    }
    createCategory(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCategory = new Category_1.Category();
            Object.assign(newCategory, data);
            const errors = yield (0, class_validator_1.validate)(newCategory);
            if (errors.length === 0) {
                yield newCategory.save();
                return newCategory;
            }
            else {
                throw new Error(`Error occured: ${JSON.stringify(errors)}`);
            }
        });
    }
    updateCategory(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category_1.Category.findOne({
                where: { id: id },
            });
            if (category) {
                Object.assign(category, data);
                const errors = yield (0, class_validator_1.validate)(category);
                if (errors.length === 0) {
                    yield category.save();
                }
                else {
                    throw new Error(`Error occured: ${JSON.stringify(errors)}`);
                }
            }
            return category;
        });
    }
    deleteCategory(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield Category_1.Category.findOne({
                where: { id: id },
            });
            if (category) {
                yield category.remove();
                category.id = id;
            }
            return category;
        });
    }
};
exports.CategoriesResolver = CategoriesResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Category_1.Category]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "allCategories", null);
__decorate([
    (0, type_graphql_1.Query)(() => Category_1.Category, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "category", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Category_1.Category),
    __param(0, (0, type_graphql_1.Arg)("data", () => Category_1.CategoryCreateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Category_1.CategoryCreateInput]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "createCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Category_1.Category, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Category_1.CategoryUpdateInput]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "updateCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Category_1.Category, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], CategoriesResolver.prototype, "deleteCategory", null);
exports.CategoriesResolver = CategoriesResolver = __decorate([
    (0, type_graphql_1.Resolver)(Category_1.Category)
], CategoriesResolver);
