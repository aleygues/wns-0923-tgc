import { DataSource } from "typeorm";
import { Category } from "./entities/Category";
import { Ad } from "./entities/Ad";
import { Tag } from "./entities/Tag";

export const dataSource = new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Category, Ad, Tag],
  synchronize: true,
  logging: true,
});
