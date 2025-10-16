-- ============================================
-- QUERIES - INVENTORY MANAGEMENT SYSTEM
-- ============================================
-- Created: October 16, 2025
-- Database: PostgreSQL
-- ============================================

-- ============================================
-- 1. USER QUERIES
-- ============================================

-- 1.1 Get all users (without password)
SELECT id, username, created_at
FROM "user"
ORDER BY created_at DESC;

-- 1.2 Get user by ID
SELECT id, username, created_at
FROM "user"
WHERE id = 'user-uuid-here';

-- 1.3 Check if username exists
SELECT COUNT(*) as count
FROM "user"
WHERE username = 'admin';

-- ============================================
-- 2. BARANG (INVENTORY) QUERIES
-- ============================================

-- 2.1 Get all barang
SELECT 
    id,
    nama,
    kode,
    stok,
    "hargaText",
    "fotoPath",
    created_at
FROM barang
ORDER BY created_at DESC;

-- 2.2 Get barang by ID
SELECT 
    id,
    nama,
    kode,
    stok,
    "hargaText",
    "fotoPath",
    created_at
FROM barang
WHERE id = 'barang-uuid-here';

-- 2.3 Get barang by kode
SELECT *
FROM barang
WHERE kode = 'BRG/25/10/00001';

-- 2.4 Search barang by name
SELECT *
FROM barang
WHERE nama ILIKE '%laptop%'
ORDER BY nama;

-- 2.5 Get barang with low stock (stok < 10)
SELECT 
    nama,
    kode,
    stok,
    "hargaText"
FROM barang
WHERE stok < 10
ORDER BY stok ASC;

-- 2.6 Generate next kode barang for current month
SELECT kode
FROM barang
WHERE kode LIKE 'BRG/25/10/%'
ORDER BY kode DESC
LIMIT 1;

-- ============================================
-- 3. STOCK MANAGEMENT QUERIES
-- ============================================

-- 3.1 Get stock history for specific barang
SELECT 
    sl.id,
    sl.delta,
    sl."stokAfter",
    sl."createdAt",
    b.nama as barang_nama,
    b.kode as barang_kode
FROM stock_log sl
JOIN barang b ON sl."barangId" = b.id
WHERE sl."barangId" = 'barang-uuid-here'
ORDER BY sl."createdAt" DESC;

-- 3.2 Get all stock movements today
SELECT 
    b.nama,
    b.kode,
    sl.delta,
    sl."stokAfter",
    sl."createdAt"
FROM stock_log sl
JOIN barang b ON sl."barangId" = b.id
WHERE DATE(sl."createdAt") = CURRENT_DATE
ORDER BY sl."createdAt" DESC;

-- 3.3 ⭐ Get stock by date for all barang (IMPORTANT QUERY)
-- This query calculates total stock up to a specific date
SELECT 
    b.nama,
    COALESCE(SUM(s.delta), 0) as total_stok
FROM barang b
LEFT JOIN stock_log s 
    ON s."barangId" = b.id 
    AND DATE(s."createdAt") <= '2025-10-16'  -- Change date here
GROUP BY b.nama, b.id
ORDER BY b.nama;

-- 3.4 Get stock movements summary (total additions and reductions)
SELECT 
    b.nama,
    b.kode,
    b.stok as current_stok,
    SUM(CASE WHEN sl.delta > 0 THEN sl.delta ELSE 0 END) as total_additions,
    SUM(CASE WHEN sl.delta < 0 THEN ABS(sl.delta) ELSE 0 END) as total_reductions,
    COUNT(sl.id) as total_movements
FROM barang b
LEFT JOIN stock_log sl ON sl."barangId" = b.id
GROUP BY b.id, b.nama, b.kode, b.stok
ORDER BY b.nama;

-- ============================================
-- 4. PRICE MANAGEMENT QUERIES
-- ============================================

-- 4.1 Get price history for specific barang
SELECT 
    p.id,
    p.harga,
    p."tanggalBerlaku",
    p.created_at,
    b.nama as barang_nama,
    b.kode as barang_kode
FROM price p
JOIN barang b ON p."barangId" = b.id
WHERE p."barangId" = 'barang-uuid-here'
ORDER BY p."tanggalBerlaku" DESC;

-- 4.2 ⭐ Get price by date for all barang (IMPORTANT QUERY)
-- This query gets prices effective on a specific date
SELECT 
    b.nama,
    p.harga::NUMERIC as harga
FROM barang b
JOIN price p ON p."barangId" = b.id
WHERE p."tanggalBerlaku" = '2025-10-16'  -- Change date here
ORDER BY b.nama;

-- 4.3 Get current (latest) price for each barang
SELECT 
    b.id,
    b.nama,
    b.kode,
    p.harga,
    p."tanggalBerlaku"
FROM barang b
LEFT JOIN LATERAL (
    SELECT harga, "tanggalBerlaku"
    FROM price
    WHERE "barangId" = b.id
    ORDER BY "tanggalBerlaku" DESC
    LIMIT 1
) p ON true
ORDER BY b.nama;

-- 4.4 Get price changes for all barang
SELECT 
    b.nama,
    b.kode,
    COUNT(p.id) as price_change_count,
    MIN(p.harga::NUMERIC) as lowest_price,
    MAX(p.harga::NUMERIC) as highest_price,
    (
        SELECT harga
        FROM price
        WHERE "barangId" = b.id
        ORDER BY "tanggalBerlaku" DESC
        LIMIT 1
    ) as current_price
FROM barang b
LEFT JOIN price p ON p."barangId" = b.id
GROUP BY b.id, b.nama, b.kode
ORDER BY b.nama;

-- ============================================
-- 5. COMBINED REPORTS
-- ============================================

-- 5.1 Inventory summary report
SELECT 
    b.id,
    b.nama,
    b.kode,
    b.stok,
    b."hargaText" as harga_tercatat,
    (
        SELECT harga
        FROM price
        WHERE "barangId" = b.id
        ORDER BY "tanggalBerlaku" DESC
        LIMIT 1
    ) as harga_terbaru,
    (
        SELECT COUNT(*)
        FROM stock_log
        WHERE "barangId" = b.id
    ) as jumlah_mutasi_stok,
    (
        SELECT COUNT(*)
        FROM price
        WHERE "barangId" = b.id
    ) as jumlah_perubahan_harga
FROM barang b
ORDER BY b.nama;

-- 5.2 Barang with most stock movements
SELECT 
    b.nama,
    b.kode,
    COUNT(sl.id) as movement_count,
    b.stok as current_stok
FROM barang b
LEFT JOIN stock_log sl ON sl."barangId" = b.id
GROUP BY b.id, b.nama, b.kode, b.stok
ORDER BY movement_count DESC
LIMIT 10;

-- 5.3 Daily stock movement summary
SELECT 
    DATE(sl."createdAt") as tanggal,
    COUNT(DISTINCT sl."barangId") as jumlah_barang,
    COUNT(sl.id) as total_transaksi,
    SUM(CASE WHEN sl.delta > 0 THEN sl.delta ELSE 0 END) as total_stock_in,
    SUM(CASE WHEN sl.delta < 0 THEN ABS(sl.delta) ELSE 0 END) as total_stock_out
FROM stock_log sl
GROUP BY DATE(sl."createdAt")
ORDER BY tanggal DESC;

-- ============================================
-- 6. UTILITY QUERIES
-- ============================================

-- 6.1 Check database size
SELECT 
    pg_size_pretty(pg_database_size('inventory_db')) as database_size;

-- 6.2 Count records in all tables
SELECT 
    'user' as table_name, 
    COUNT(*) as record_count 
FROM "user"
UNION ALL
SELECT 
    'barang' as table_name, 
    COUNT(*) as record_count 
FROM barang
UNION ALL
SELECT 
    'price' as table_name, 
    COUNT(*) as record_count 
FROM price
UNION ALL
SELECT 
    'stock_log' as table_name, 
    COUNT(*) as record_count 
FROM stock_log;

-- 6.3 Get table structures
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_schema = 'public'
ORDER BY table_name, ordinal_position;

-- ============================================
-- END OF QUERIES
-- ============================================
