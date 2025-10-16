import { Request, Response } from "express";
import { BarangRepository } from "../repositories/BarangRepository";
import { UploadedFile } from "express-fileupload";

export class BarangController {
  private static barangRepository = new BarangRepository();

  static async create(req: Request, res: Response) {
    try {
      const { nama, stok, harga } = req.body;
      if (!nama) {
        return res.status(400).json({ message: "nama required" });
      }

      const foto = req.files?.foto as UploadedFile | undefined;
      const barang = await BarangController.barangRepository.create({
        nama,
        stok: stok ? parseInt(stok, 10) : undefined,
        harga,
        foto,
      });

      res.json(barang);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async list(req: Request, res: Response) {
    try {
      const items = await BarangController.barangRepository.findAll();
      res.json(items);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getOne(req: Request, res: Response) {
    try {
      const item = await BarangController.barangRepository.findById(req.params.id);
      if (!item) {
        return res.status(404).json({ message: "Not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const { nama, stok, harga } = req.body;
      const foto = req.files?.foto as UploadedFile | undefined;

      const barang = await BarangController.barangRepository.update(req.params.id, {
        nama,
        stok: stok ? parseInt(stok, 10) : undefined,
        harga,
        foto,
      });

      res.json(barang);
    } catch (error: any) {
      if (error.message === "Barang not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async remove(req: Request, res: Response) {
    try {
      await BarangController.barangRepository.delete(req.params.id);
      res.json({ message: "deleted" });
    } catch (error: any) {
      if (error.message === "Barang not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async changeStock(req: Request, res: Response) {
    try {
      const { delta } = req.body;
      const d = parseInt(delta, 10);
      
      if (isNaN(d)) {
        return res.status(400).json({ message: "delta numeric required" });
      }

      const barang = await BarangController.barangRepository.changeStock(req.params.id, d);
      res.json({ id: barang.id, stok: barang.stok });
    } catch (error: any) {
      if (error.message === "Barang not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async addPrice(req: Request, res: Response) {
    try {
      const { harga, tanggalBerlaku } = req.body;
      
      if (!harga || !tanggalBerlaku) {
        return res.status(400).json({ message: "harga and tanggalBerlaku required" });
      }

      const price = await BarangController.barangRepository.addPrice(
        req.params.id,
        harga,
        tanggalBerlaku
      );
      
      res.json(price);
    } catch (error: any) {
      if (error.message === "Barang not found") {
        return res.status(404).json({ message: error.message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getStockByDate(req: Request, res: Response) {
    try {
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ message: "date query required e.g. ?date=2023-08-01" });
      }

      const result = await BarangController.barangRepository.getStockByDate(date as string);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  static async getPriceByDate(req: Request, res: Response) {
    try {
      const { date } = req.query;
      
      if (!date) {
        return res.status(400).json({ message: "date query required e.g. ?date=2023-08-01" });
      }

      const result = await BarangController.barangRepository.getPriceByDate(date as string);
      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
}
