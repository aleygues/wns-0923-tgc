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
exports.AdsResolver = void 0;
const type_graphql_1 = require("type-graphql");
const Ad_1 = require("../entities/Ad");
const class_validator_1 = require("class-validator");
const typeorm_1 = require("typeorm");
const utils_1 = require("../utils");
let AdsResolver = class AdsResolver {
    allAds(where, take, skip) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryWhere = {};
            if (where === null || where === void 0 ? void 0 : where.categoryIn) {
                queryWhere.category = { id: (0, typeorm_1.In)(where.categoryIn) };
            }
            if (where === null || where === void 0 ? void 0 : where.searchTitle) {
                queryWhere.title = (0, typeorm_1.Like)(`%${where.searchTitle}%`);
            }
            if (where === null || where === void 0 ? void 0 : where.priceGte) {
                queryWhere.price = (0, typeorm_1.MoreThanOrEqual)(Number(where.priceGte));
            }
            if (where === null || where === void 0 ? void 0 : where.priceLte) {
                queryWhere.price = (0, typeorm_1.LessThanOrEqual)(Number(where.priceLte));
            }
            /* const order: any = {};
            if (
              typeof req.query.orderByTitle === "string" &&
              ["ASC", "DESC"].includes(req.query.orderByTitle)
            ) {
              order.title = req.query.orderByTitle; // req.query.orderByTitle = ASC | DESC
            }
        
            if (
              typeof req.query.orderByPrice === "string" &&
              ["ASC", "DESC"].includes(req.query.orderByPrice)
            ) {
              order.price = req.query.orderByPrice; // req.query.orderByTitle = ASC | DESC
            } */
            const ads = yield Ad_1.Ad.find({
                take: take !== null && take !== void 0 ? take : 50,
                skip,
                where: queryWhere,
                //order,
                relations: {
                    category: true,
                    tags: true,
                },
            });
            return ads;
        });
    }
    allAdsCount(where) {
        return __awaiter(this, void 0, void 0, function* () {
            const queryWhere = {};
            if (where === null || where === void 0 ? void 0 : where.categoryIn) {
                queryWhere.category = { id: (0, typeorm_1.In)(where.categoryIn) };
            }
            if (where === null || where === void 0 ? void 0 : where.searchTitle) {
                queryWhere.title = (0, typeorm_1.Like)(`%${where.searchTitle}%`);
            }
            if (where === null || where === void 0 ? void 0 : where.priceGte) {
                queryWhere.price = (0, typeorm_1.MoreThanOrEqual)(Number(where.priceGte));
            }
            if (where === null || where === void 0 ? void 0 : where.priceLte) {
                queryWhere.price = (0, typeorm_1.LessThanOrEqual)(Number(where.priceLte));
            }
            const count = yield Ad_1.Ad.count({
                where: queryWhere,
            });
            return count;
        });
    }
    ad(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ad = yield Ad_1.Ad.findOne({
                where: { id: id },
                relations: { category: true, tags: true },
            });
            return ad;
        });
    }
    createAd(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAd = new Ad_1.Ad();
            Object.assign(newAd, data);
            const errors = yield (0, class_validator_1.validate)(newAd);
            if (errors.length === 0) {
                yield newAd.save();
                return newAd;
            }
            else {
                throw new Error(`Error occured: ${JSON.stringify(errors)}`);
            }
        });
    }
    updateAd(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ad = yield Ad_1.Ad.findOne({
                where: { id: id },
                relations: { tags: true },
            });
            if (ad) {
                (0, utils_1.merge)(ad, data);
                const errors = yield (0, class_validator_1.validate)(ad);
                if (errors.length === 0) {
                    yield Ad_1.Ad.save(ad);
                    return yield Ad_1.Ad.findOne({
                        where: { id: id },
                        relations: {
                            category: true,
                            tags: true,
                        },
                    });
                }
                else {
                    throw new Error(`Error occured: ${JSON.stringify(errors)}`);
                }
            }
            return ad;
        });
    }
    deleteAd(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const ad = yield Ad_1.Ad.findOne({
                where: { id: id },
            });
            if (ad) {
                yield ad.remove();
                ad.id = id;
            }
            return ad;
        });
    }
};
exports.AdsResolver = AdsResolver;
__decorate([
    (0, type_graphql_1.Query)(() => [Ad_1.Ad]),
    __param(0, (0, type_graphql_1.Arg)("where", { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)("take", () => type_graphql_1.Int, { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)("skip", () => type_graphql_1.Int, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Ad_1.AdsWhere, Number, Number]),
    __metadata("design:returntype", Promise)
], AdsResolver.prototype, "allAds", null);
__decorate([
    (0, type_graphql_1.Query)(() => type_graphql_1.Int),
    __param(0, (0, type_graphql_1.Arg)("where", { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Ad_1.AdsWhere]),
    __metadata("design:returntype", Promise)
], AdsResolver.prototype, "allAdsCount", null);
__decorate([
    (0, type_graphql_1.Query)(() => Ad_1.Ad, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdsResolver.prototype, "ad", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Ad_1.Ad),
    __param(0, (0, type_graphql_1.Arg)("data", () => Ad_1.AdCreateInput)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Ad_1.AdCreateInput]),
    __metadata("design:returntype", Promise)
], AdsResolver.prototype, "createAd", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Ad_1.Ad, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Arg)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Ad_1.AdUpdateInput]),
    __metadata("design:returntype", Promise)
], AdsResolver.prototype, "updateAd", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Ad_1.Ad, { nullable: true }),
    __param(0, (0, type_graphql_1.Arg)("id", () => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], AdsResolver.prototype, "deleteAd", null);
exports.AdsResolver = AdsResolver = __decorate([
    (0, type_graphql_1.Resolver)(Ad_1.Ad)
], AdsResolver);
