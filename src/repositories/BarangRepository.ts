import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { Barang } from "../entities/Barang";
import { StockLog } from "../entities/StockLog";
import { Price } from "../entities/Price";
import { generateKodeBarang } from "../utils/kode";
import { UploadedFile } from "express-fileupload";
import path from "path";
import fs from "fs";

export interface CreateBarangDto {
  nama: string;
  stok?: number;
  harga?: string;
  foto?: UploadedFile;
}

export interface UpdateBarangDto {
  nama?: string;
  stok?: number;
  harga?: string;
  foto?: UploadedFile;
}

export interface StockByDateResult {
  nama: string;
  total_stok: number;
}

export interface PriceByDateResult {
  nama: string;
  harga: number;
}

export class BarangRepository {
  private barangRepo: Repository<Barang>;
  private stockLogRepo: Repository<StockLog>;
  private priceRepo: Repository<Price>;

  constructor() {
    this.barangRepo = AppDataSource.getRepository(Barang);
    this.stockLogRepo = AppDataSource.getRepository(StockLog);
    this.priceRepo = AppDataSource.getRepository(Price);
  }

  /**
   * Create barang baru
   */
  async create(data: CreateBarangDto): Promise<Barang> {
    // Generate kode barang
    const kode = await generateKodeBarang();

    // Handle foto upload
    let fotoPath: string | undefined;
    if (data.foto) {
      const uploadDir = process.env.UPLOAD_DIR || "uploads";
      const filename = `${Date.now()}_${data.foto.name}`;
      const savePath = path.join(process.cwd(), uploadDir, filename);
      await data.foto.mv(savePath);
      fotoPath = `/${uploadDir}/${filename}`;
    }

    // Create barang
    const barang = this.barangRepo.create({
      nama: data.nama,
      stok: data.stok || 0,
      kode,
      hargaText: data.harga,
      fotoPath,
    });
    await this.barangRepo.save(barang);

    // Create initial stock log
    const stockLog = this.stockLogRepo.create({
      barang: barang,
      delta: barang.stok,
      stokAfter: barang.stok,
    });
    await this.stockLogRepo.save(stockLog);

    return barang;
  }

  /**
   * Get all barang
   */
  async findAll(): Promise<Barang[]> {
    return await this.barangRepo.find();
  }

  /**
   * Get barang by ID
   */
  async findById(id: string): Promise<Barang | null> {
    return await this.barangRepo.findOne({ where: { id } });
  }

  /**
   * Update barang
   */
  async update(id: string, data: UpdateBarangDto): Promise<Barang> {
    const barang = await this.barangRepo.findOne({ where: { id } });
    if (!barang) {
      throw new Error("Barang not found");
    }

    // Update fields
    if (data.nama) barang.nama = data.nama;
    if (typeof data.stok !== "undefined") barang.stok = data.stok;
    if (data.harga) barang.hargaText = data.harga;

    // Handle foto upload
    if (data.foto) {
      // Remove old foto
      if (barang.fotoPath) {
        const fullPath = path.join(process.cwd(), barang.fotoPath);
        try {
          fs.unlinkSync(fullPath);
        } catch (e) {
          // ignore if file not found
        }
      }

      // Upload new foto
      const uploadDir = process.env.UPLOAD_DIR || "uploads";
      const filename = `${Date.now()}_${data.foto.name}`;
      const savePath = path.join(process.cwd(), uploadDir, filename);
      await data.foto.mv(savePath);
      barang.fotoPath = `/${uploadDir}/${filename}`;
    }

    await this.barangRepo.save(barang);
    return barang;
  }

  /**
   * Delete barang
   */
  async delete(id: string): Promise<void> {
    const barang = await this.barangRepo.findOne({ where: { id } });
    if (!barang) {
      throw new Error("Barang not found");
    }

    // Remove foto file if exists
    if (barang.fotoPath) {
      const fullPath = path.join(process.cwd(), barang.fotoPath);
      try {
        fs.unlinkSync(fullPath);
      } catch (e) {
        // ignore if file not found
      }
    }

    await this.barangRepo.remove(barang);
  }

  /**
   * Change stock (tambah/kurangi)
   */
  async changeStock(id: string, delta: number): Promise<Barang> {
    const barang = await this.barangRepo.findOne({ where: { id } });
    if (!barang) {
      throw new Error("Barang not found");
    }

    // Update stock
    barang.stok = barang.stok + delta;
    await this.barangRepo.save(barang);

    // Create stock log
    const stockLog = this.stockLogRepo.create({
      barang: barang,
      delta: delta,
      stokAfter: barang.stok,
    });
    await this.stockLogRepo.save(stockLog);

    return barang;
  }

  /**
   * Add new price
   */
  async addPrice(id: string, harga: string, tanggalBerlaku: string): Promise<Price> {
    const barang = await this.barangRepo.findOne({ where: { id } });
    if (!barang) {
      throw new Error("Barang not found");
    }

    const price = this.priceRepo.create({
      barang: barang,
      harga: harga,
      tanggalBerlaku: tanggalBerlaku,
    });
    await this.priceRepo.save(price);

    return price;
  }

  /**
   * Get stock by date for all barang
   */
  async getStockByDate(date: string): Promise<StockByDateResult[]> {
    const rows: any[] = await AppDataSource.manager.query(
      `
      SELECT b.nama, SUM(s.delta) as total_stock
      FROM barang b
      LEFT JOIN stock_log s ON s."barangId" = b.id AND DATE(s."createdAt") <= $1
      GROUP BY b.nama
      `,
      [date]
    );

    return rows.map((r) => ({
      nama: r.nama,
      total_stok: parseInt(r.total_stock || 0, 10),
    }));
  }

  /**
   * Get price by date for all barang
   */
  async getPriceByDate(date: string): Promise<PriceByDateResult[]> {
    const rows: any[] = await AppDataSource.manager.query(
      `
      SELECT b.nama, p.harga as harga
      FROM barang b
      JOIN price p ON p."barangId" = b.id
      WHERE p."tanggalBerlaku" = $1
      `,
      [date]
    );

    return rows.map((r) => ({
      nama: r.nama,
      harga: parseFloat(r.harga),
    }));
  }
}
