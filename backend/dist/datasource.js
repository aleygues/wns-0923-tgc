"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSource = void 0;
const typeorm_1 = require("typeorm");
const Category_1 = require("./entities/Category");
const Ad_1 = require("./entities/Ad");
const Tag_1 = require("./entities/Tag");
exports.dataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "db",
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [Category_1.Category, Ad_1.Ad, Tag_1.Tag],
    synchronize: true,
    logging: true,
});
