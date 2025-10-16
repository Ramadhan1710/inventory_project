-- ============================================
-- DATABASE SCHEMA - INVENTORY MANAGEMENT SYSTEM
-- ============================================
-- Created: October 16, 2025
-- Database: PostgreSQL
-- ============================================

-- Drop existing tables (for clean installation)
DROP TABLE IF EXISTS stock_log CASCADE;
DROP TABLE IF EXISTS price CASCADE;
DROP TABLE IF EXISTS barang CASCADE;
DROP TABLE IF EXISTS "user" CASCADE;

-- ============================================
-- TABLE: user
-- Description: Stores user accounts for authentication
-- ============================================
CREATE TABLE "user" (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster username lookup
CREATE INDEX idx_user_username ON "user"(username);

-- ============================================
-- TABLE: barang
-- Description: Stores inventory items (products)
-- ============================================
CREATE TABLE barang (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nama VARCHAR(255) NOT NULL,
    kode VARCHAR(50) UNIQUE NOT NULL,
    stok INTEGER NOT NULL DEFAULT 0,
    "hargaText" VARCHAR(100),
    "fotoPath" VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Index for faster kode lookup
CREATE INDEX idx_barang_kode ON barang(kode);

-- ============================================
-- TABLE: price
-- Description: Stores price history for each barang
-- ============================================
CREATE TABLE price (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    harga VARCHAR(100) NOT NULL,
    "tanggalBerlaku" DATE NOT NULL,
    "barangId" UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    CONSTRAINT fk_price_barang 
        FOREIGN KEY ("barangId") 
        REFERENCES barang(id) 
        ON DELETE CASCADE
);

-- Index for faster date queries
CREATE INDEX idx_price_tanggal ON price("tanggalBerlaku");
CREATE INDEX idx_price_barang ON price("barangId");

-- ============================================
-- TABLE: stock_log
-- Description: Stores stock movement history
-- ============================================
CREATE TABLE stock_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    delta INTEGER NOT NULL,
    "stokAfter" INTEGER NOT NULL,
    "createdAt" TIMESTAMP DEFAULT NOW(),
    "barangId" UUID,
    CONSTRAINT fk_stocklog_barang 
        FOREIGN KEY ("barangId") 
        REFERENCES barang(id) 
        ON DELETE CASCADE
);

-- Index for faster date queries and barang lookups
CREATE INDEX idx_stocklog_created ON stock_log("createdAt");
CREATE INDEX idx_stocklog_barang ON stock_log("barangId");

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE "user" IS 'User accounts for system authentication';
COMMENT ON TABLE barang IS 'Inventory items/products';
COMMENT ON TABLE price IS 'Price history with effective dates';
COMMENT ON TABLE stock_log IS 'Stock movement history (additions/reductions)';

COMMENT ON COLUMN barang.kode IS 'Auto-generated code format: BRG/YY/MM/00001';
COMMENT ON COLUMN stock_log.delta IS 'Stock change: positive for addition, negative for reduction';
COMMENT ON COLUMN stock_log."stokAfter" IS 'Stock amount after the change';

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Sample user (password: admin123 - hashed with bcrypt)
-- INSERT INTO "user" (username, password) VALUES 
-- ('admin', '$2b$10$hashedpasswordhere');

-- ============================================
-- END OF SCHEMA
-- ============================================
