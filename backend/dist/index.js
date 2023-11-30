"use strict";
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
require("reflect-metadata");
const datasource_1 = require("./datasource");
const type_graphql_1 = require("type-graphql");
const server_1 = require("@apollo/server");
const standalone_1 = require("@apollo/server/standalone");
const Ads_1 = require("./resolvers/Ads");
const Tags_1 = require("./resolvers/Tags");
const Categories_1 = require("./resolvers/Categories");
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        const schema = yield (0, type_graphql_1.buildSchema)({
            resolvers: [Tags_1.TagsResolver, Categories_1.CategoriesResolver, Ads_1.AdsResolver],
        });
        const server = new server_1.ApolloServer({
            schema,
        });
        yield datasource_1.dataSource.initialize();
        yield (0, standalone_1.startStandaloneServer)(server, {
            listen: {
                port: 5000,
            },
        });
        console.log("🚀 Server started!");
    });
}
start();
