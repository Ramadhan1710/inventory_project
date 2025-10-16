import { Router } from "express";
import userRoutes from "./user";
import barangRoutes from "./barang";

const router = Router();

router.use("/api/users", userRoutes);
router.use("/api/barang", barangRoutes);

export { router };
