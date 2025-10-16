## Project: Inventory Management API
**Dibuat oleh:** M. Ainur Ramadhan  
**Tanggal:** 16 Oktober 2025

---

## 🚀 CARA INSTALL & MENJALANKAN PROJECT

### Prerequisites:
- Node.js >= 18
- PostgreSQL >= 12
- npm atau yarn

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Setup Database
1. Buat database PostgreSQL bernama `inventory_db`
2. Jalankan script `database-schema.sql` untuk create tables:
   ```bash
   psql -U postgres -d inventory_db -f database-schema.sql
   ```

### Step 3: Setup Environment
1. Copy file `.env.example` menjadi `.env`
2. Edit file `.env` sesuai konfigurasi database Anda:
   ```env
   DATABASE_HOST=localhost
   DATABASE_PORT=5432
   DATABASE_USER=postgres
   DATABASE_PASSWORD=your_password
   DATABASE_NAME=inventory_db
   ```

### Step 4: Run Seeder (Opsional)
Untuk mengisi data dummy:
```bash
npm run seed
```

### Step 5: Jalankan Server
```bash
npm run dev
```

Server akan berjalan di: **http://localhost:4000**

---

## 📖 CARA TESTING API

### Opsi 1: Swagger UI (Recommended)
1. Buka browser: **http://localhost:4000/api-docs**
2. Login untuk mendapatkan token
3. Klik tombol "Authorize" dan masukkan token
4. Test semua endpoint

### Opsi 2: Postman / Thunder Client
Import collection dari dokumentasi Swagger

### Login Credentials (setelah run seeder):
- Username: `admin` | Password: `admin123`
- Username: `user1` | Password: `password123`
- Username: `manager` | Password: `manager123`

---

## 🏗️ ARSITEKTUR PROJECT

```
inventory_project/
├── src/
│   ├── config/           # Database & app configuration
│   ├── controllers/      # HTTP request handlers
│   ├── entities/         # TypeORM entities (models)
│   ├── repositories/     # Business logic & data access (Repository Pattern)
│   ├── routes/           # API routing
│   ├── middleware/       # Authentication middleware
│   ├── utils/            # Helper functions
│   └── index.ts          # App entry point
├── database-schema.sql   # DDL untuk create tables
├── queries.sql           # Query-query yang digunakan
├── package.json
└── README.md
```

---

## 🎯 FITUR YANG SUDAH DIIMPLEMENTASI

### ✅ Requirements:
1. ✅ **Node.js + PostgreSQL Project**
2. ✅ **User Table + CRUD + Login dengan JWT**
3. ✅ **Token/Signature Required** untuk semua endpoint (kecuali login & register)
4. ✅ **Barang Table + CRUD + Kode Auto Generate** (Format: BRG/YY/MM/00001)
5. ✅ **Stock Add/Reduce Endpoint** dengan tracking history
6. ✅ **Price Endpoint** dengan tanggal berlaku
7. ✅ **Stock by Date Query** - Get stok per tanggal
8. ✅ **Price by Date Query** - Get harga per tanggal

### 🎨 Bonus Features:
- ✅ **Repository Pattern** - Clean architecture
- ✅ **Swagger UI Documentation** - Interactive API docs
- ✅ **File Upload** - Upload foto barang
- ✅ **Seeder** - Auto populate data dummy
- ✅ **Error Handling** - Proper error responses
- ✅ **TypeScript** - Type-safe code

---

## 📊 DATABASE SCHEMA

### Tables:
1. **user** - User accounts & authentication
2. **barang** - Inventory items
3. **price** - Price history dengan tanggal berlaku
4. **stock_log** - Stock movement history

Lihat detail di file: `database-schema.sql`

---

## 🔗 API ENDPOINTS

### Authentication:
- POST `/api/users/register` - Register user baru
- POST `/api/users/login` - Login & get JWT token

### User Management (Protected):
- GET `/api/users` - List all users
- GET `/api/users/:id` - Get user by ID
- PUT `/api/users/:id` - Update user
- DELETE `/api/users/:id` - Delete user

### Barang Management (Protected):
- POST `/api/barang` - Create barang (dengan upload foto)
- GET `/api/barang` - List all barang
- GET `/api/barang/:id` - Get barang by ID
- PUT `/api/barang/:id` - Update barang
- DELETE `/api/barang/:id` - Delete barang

### Stock Management (Protected):
- POST `/api/barang/:id/stock` - Tambah/kurangi stok
- GET `/api/barang/stock-by-date?date=YYYY-MM-DD` - Get stok per tanggal

### Price Management (Protected):
- POST `/api/barang/:id/price` - Tambah harga baru
- GET `/api/barang/price-by-date?date=YYYY-MM-DD` - Get harga per tanggal

---

## 📝 QUERY PENTING

### 1. Get Stock by Date
```sql
SELECT 
    b.nama,
    COALESCE(SUM(s.delta), 0) as total_stok
FROM barang b
LEFT JOIN stock_log s 
    ON s."barangId" = b.id 
    AND DATE(s."createdAt") <= '2025-10-16'
GROUP BY b.nama, b.id
ORDER BY b.nama;
```

### 2. Get Price by Date
```sql
SELECT 
    b.nama,
    p.harga::NUMERIC as harga
FROM barang b
JOIN price p ON p."barangId" = b.id
WHERE p."tanggalBerlaku" = '2025-10-16'
ORDER BY b.nama;
```

Lihat semua query di file: `queries.sql`

---

## 🛠️ TEKNOLOGI YANG DIGUNAKAN

- **Runtime:** Node.js v18+
- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** TypeORM
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Documentation:** Swagger UI (swagger-ui-express, swagger-jsdoc)
- **File Upload:** express-fileupload
- **Dev Tools:** ts-node-dev (hot reload)

---

## 📞 KONTAK

Jika ada pertanyaan atau kesulitan saat install/run project, silakan hubungi:

**Email:** mainurramadhan7@gmail.com
**Phone:** 081917926409

---

**Terima kasih! 🙏**
