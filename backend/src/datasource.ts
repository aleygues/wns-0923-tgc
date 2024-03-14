import { DataSource } from "typeorm";
import { Category } from "./entities/Category";
import { Ad } from "./entities/Ad";
import { Tag } from "./entities/Tag";
import { User } from "./entities/User";
import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";
import { Image } from "./entities/Image";

export const dataSourceOptions: PostgresConnectionOptions = {
  type: "postgres",
  entities: [Category, Ad, Tag, User, Image],
  synchronize: true,
  logging: true,
  host: process.env.DB_HOST ?? "db",
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

export const dataSource = new DataSource({
  ...dataSourceOptions,
});
