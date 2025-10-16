import { Router } from "express";
import { BarangController } from "../controllers/BarangController";
import { authMiddleware } from "../middleware/auth";

const router = Router();

router.use(authMiddleware);

/**
 * @swagger
 * /api/barang:
 *   post:
 *     tags:
 *       - Barang (Inventory)
 *     summary: Create barang baru
 *     description: Membuat barang baru dengan kode otomatis dan upload foto (memerlukan token)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - nama
 *             properties:
 *               nama:
 *                 type: string
 *                 description: Nama barang
 *                 example: Laptop Asus ROG
 *               stok:
 *                 type: integer
 *                 description: Jumlah stok awal
 *                 example: 10
 *               harga:
 *                 type: string
 *                 description: Harga barang
 *                 example: "15000000"
 *               foto:
 *                 type: string
 *                 format: binary
 *                 description: File foto barang
 *     responses:
 *       200:
 *         description: Barang berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barang'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/", BarangController.create);

/**
 * @swagger
 * /api/barang:
 *   get:
 *     tags:
 *       - Barang (Inventory)
 *     summary: List semua barang
 *     description: Mendapatkan daftar semua barang (memerlukan token)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daftar barang
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Barang'
 *       401:
 *         description: Unauthorized
 */
router.get("/", BarangController.list);

/**
 * @swagger
 * /api/barang/stock-by-date:
 *   get:
 *     tags:
 *       - Stock Management
 *     summary: Get stok per tanggal
 *     description: Mendapatkan total stok semua barang pada tanggal tertentu (memerlukan token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal untuk query stok (YYYY-MM-DD)
 *         example: "2025-10-16"
 *     responses:
 *       200:
 *         description: Daftar stok per tanggal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nama:
 *                     type: string
 *                   total_stok:
 *                     type: integer
 *       400:
 *         description: Bad request (tanggal tidak diberikan)
 *       401:
 *         description: Unauthorized
 */
router.get("/stock-by-date", BarangController.getStockByDate);

/**
 * @swagger
 * /api/barang/price-by-date:
 *   get:
 *     tags:
 *       - Price Management
 *     summary: Get harga per tanggal
 *     description: Mendapatkan harga semua barang yang berlaku pada tanggal tertentu (memerlukan token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Tanggal untuk query harga (YYYY-MM-DD)
 *         example: "2025-10-16"
 *     responses:
 *       200:
 *         description: Daftar harga per tanggal
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nama:
 *                     type: string
 *                   harga:
 *                     type: number
 *       400:
 *         description: Bad request (tanggal tidak diberikan)
 *       401:
 *         description: Unauthorized
 */
router.get("/price-by-date", BarangController.getPriceByDate);

/**
 * @swagger
 * /api/barang/{id}:
 *   get:
 *     tags:
 *       - Barang (Inventory)
 *     summary: Get barang by ID
 *     description: Mendapatkan detail barang berdasarkan ID (memerlukan token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Barang ID
 *     responses:
 *       200:
 *         description: Barang detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barang'
 *       404:
 *         description: Barang not found
 *       401:
 *         description: Unauthorized
 */
router.get("/:id", BarangController.getOne);

/**
 * @swagger
 * /api/barang/{id}:
 *   put:
 *     tags:
 *       - Barang (Inventory)
 *     summary: Update barang
 *     description: Mengupdate data barang (memerlukan token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Barang ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nama:
 *                 type: string
 *               stok:
 *                 type: integer
 *               harga:
 *                 type: string
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Barang updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Barang'
 *       404:
 *         description: Barang not found
 *       401:
 *         description: Unauthorized
 */
router.put("/:id", BarangController.update);

/**
 * @swagger
 * /api/barang/{id}:
 *   delete:
 *     tags:
 *       - Barang (Inventory)
 *     summary: Delete barang
 *     description: Menghapus barang (memerlukan token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Barang ID
 *     responses:
 *       200:
 *         description: Barang deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Barang not found
 *       401:
 *         description: Unauthorized
 */
router.delete("/:id", BarangController.remove);

/**
 * @swagger
 * /api/barang/{id}/stock:
 *   post:
 *     tags:
 *       - Stock Management
 *     summary: Tambah/Kurangi stok
 *     description: Menambah atau mengurangi stok barang. Delta positif untuk menambah, negatif untuk mengurangi (memerlukan token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Barang ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - delta
 *             properties:
 *               delta:
 *                 type: integer
 *                 description: Jumlah perubahan stok (positif untuk tambah, negatif untuk kurang)
 *                 example: 5
 *     responses:
 *       200:
 *         description: Stok berhasil diupdate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 stok:
 *                   type: integer
 *       404:
 *         description: Barang not found
 *       401:
 *         description: Unauthorized
 */
router.post("/:id/stock", BarangController.changeStock);

/**
 * @swagger
 * /api/barang/{id}/price:
 *   post:
 *     tags:
 *       - Price Management
 *     summary: Tambah harga baru
 *     description: Menambahkan harga baru dengan tanggal berlaku (memerlukan token)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Barang ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - harga
 *               - tanggalBerlaku
 *             properties:
 *               harga:
 *                 type: string
 *                 description: Harga baru
 *                 example: "18500000"
 *               tanggalBerlaku:
 *                 type: string
 *                 format: date
 *                 description: Tanggal berlaku harga
 *                 example: "2025-10-16"
 *     responses:
 *       200:
 *         description: Harga berhasil ditambahkan
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Price'
 *       404:
 *         description: Barang not found
 *       401:
 *         description: Unauthorized
 */
router.post("/:id/price", BarangController.addPrice);

export default router;
