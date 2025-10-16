import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";
import { User } from "../entities/User";
import { Barang } from "../entities/Barang";
import { Price } from "../entities/Price";
import { StockLog } from "../entities/StockLog";

dotenv.config();

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "postgres",
  database: process.env.DATABASE_NAME || "inventory_db",
  synchronize: true, // set false for production and use migrations
  logging: false,
  entities: [User, Barang, Price, StockLog],
});
