import { AppDataSource } from "../config/data-source";
import { Barang } from "../entities/Barang";

/**
 * Generate kode barang in format BRG/YY/MM/00001
 */
export async function generateKodeBarang(): Promise<string> {
  const now = new Date();
  const year = now.getFullYear().toString().slice(-2); // YY
  const month = (now.getMonth() + 1).toString().padStart(2, "0"); // MM

  const prefix = `BRG/${year}/${month}/`;

  const repo = AppDataSource.getRepository(Barang);
  const existing = await repo
    .createQueryBuilder("b")
    .where("b.kode LIKE :prefix", { prefix: `${prefix}%` })
    .orderBy("b.kode", "DESC")
    .getOne();

  let counter = 1;
  if (existing) {
    const lastPart = existing.kode.split("/").pop();
    if (lastPart) {
      counter = parseInt(lastPart, 10) + 1;
    }
  }

  return `${prefix}${counter.toString().padStart(5, "0")}`;
}
