import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import { User } from "./entities/User";
import { Barang } from "./entities/Barang";
import { Price } from "./entities/Price";
import { StockLog } from "./entities/StockLog";

async function seed() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // Initialize database connection
    await AppDataSource.initialize();
    console.log("✅ Database connected\n");

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log("🗑️  Clearing existing data...");
    
    // Delete in correct order (child tables first, then parent tables) using query builder
    await AppDataSource.createQueryBuilder().delete().from(StockLog).execute();
    await AppDataSource.createQueryBuilder().delete().from(Price).execute();
    await AppDataSource.createQueryBuilder().delete().from(Barang).execute();
    await AppDataSource.createQueryBuilder().delete().from(User).execute();
    
    console.log("✅ Data cleared\n");

    // Seed Users
    console.log("👤 Seeding users...");
    const userRepo = AppDataSource.getRepository(User);
    
    const users = [
      { username: "admin", password: "admin123" },
      { username: "user1", password: "password123" },
      { username: "manager", password: "manager123" },
    ];

    const createdUsers = [];
    for (const userData of users) {
      // Don't hash manually - let @BeforeInsert() decorator handle it
      const user = userRepo.create({
        username: userData.username,
        password: userData.password, // Plain password, will be hashed by @BeforeInsert
      });
      await userRepo.save(user);
      createdUsers.push(user);
      console.log(`   ✓ Created user: ${userData.username}`);
    }
    console.log(`✅ ${createdUsers.length} users created\n`);

    // Seed Barang
    console.log("📦 Seeding barang...");
    const barangRepo = AppDataSource.getRepository(Barang);
    const stockLogRepo = AppDataSource.getRepository(StockLog);
    const priceRepo = AppDataSource.getRepository(Price);

    const barangData = [
      {
        nama: "Laptop Asus ROG Strix G15",
        kode: "BRG/25/10/00001",
        stok: 15,
        hargaText: "18500000",
      },
      {
        nama: "Mouse Logitech G502",
        kode: "BRG/25/10/00002",
        stok: 50,
        hargaText: "850000",
      },
      {
        nama: "Keyboard Mechanical Keychron K2",
        kode: "BRG/25/10/00003",
        stok: 30,
        hargaText: "1250000",
      },
      {
        nama: "Monitor LG UltraGear 27 inch",
        kode: "BRG/25/10/00004",
        stok: 20,
        hargaText: "4500000",
      },
      {
        nama: "Headset HyperX Cloud II",
        kode: "BRG/25/10/00005",
        stok: 40,
        hargaText: "1100000",
      },
      {
        nama: "Webcam Logitech C920",
        kode: "BRG/25/10/00006",
        stok: 25,
        hargaText: "1350000",
      },
      {
        nama: "SSD Samsung 970 EVO Plus 1TB",
        kode: "BRG/25/10/00007",
        stok: 60,
        hargaText: "2200000",
      },
      {
        nama: "RAM Corsair Vengeance 16GB DDR4",
        kode: "BRG/25/10/00008",
        stok: 45,
        hargaText: "1450000",
      },
    ];

    const createdBarang = [];
    for (const barang of barangData) {
      const item = barangRepo.create(barang);
      await barangRepo.save(item);
      createdBarang.push(item);

      // Create initial stock log
      const stockLog = stockLogRepo.create({
        barang: item,
        delta: item.stok,
        stokAfter: item.stok,
      });
      await stockLogRepo.save(stockLog);

      console.log(`   ✓ Created: ${barang.nama} (Stok: ${barang.stok})`);
    }
    console.log(`✅ ${createdBarang.length} barang created\n`);

    // Seed Price History
    console.log("💰 Seeding price history...");
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const lastWeek = new Date(today);
    lastWeek.setDate(lastWeek.getDate() - 7);

    let priceCount = 0;

    // Add price history for some items
    for (let i = 0; i < 4; i++) {
      const barang = createdBarang[i];
      
      // Old price (last week)
      const oldPrice = priceRepo.create({
        barang: barang,
        harga: (parseInt(barang.hargaText || "0") * 0.9).toString(), // 10% cheaper
        tanggalBerlaku: lastWeek.toISOString().split("T")[0],
      });
      await priceRepo.save(oldPrice);
      priceCount++;

      // Yesterday price
      const yesterdayPrice = priceRepo.create({
        barang: barang,
        harga: (parseInt(barang.hargaText || "0") * 0.95).toString(), // 5% cheaper
        tanggalBerlaku: yesterday.toISOString().split("T")[0],
      });
      await priceRepo.save(yesterdayPrice);
      priceCount++;

      // Current price
      const currentPrice = priceRepo.create({
        barang: barang,
        harga: barang.hargaText || "0",
        tanggalBerlaku: today.toISOString().split("T")[0],
      });
      await priceRepo.save(currentPrice);
      priceCount++;

      console.log(`   ✓ Added price history for: ${barang.nama}`);
    }
    console.log(`✅ ${priceCount} price records created\n`);

    // Add some stock movements
    console.log("📊 Seeding stock movements...");
    let stockMovements = 0;

    // Add stock to first item
    const item1 = createdBarang[0];
    item1.stok += 10;
    await barangRepo.save(item1);
    const log1 = stockLogRepo.create({
      barang: item1,
      delta: 10,
      stokAfter: item1.stok,
    });
    await stockLogRepo.save(log1);
    stockMovements++;
    console.log(`   ✓ Added +10 stock to ${item1.nama}`);

    // Reduce stock from second item
    const item2 = createdBarang[1];
    item2.stok -= 5;
    await barangRepo.save(item2);
    const log2 = stockLogRepo.create({
      barang: item2,
      delta: -5,
      stokAfter: item2.stok,
    });
    await stockLogRepo.save(log2);
    stockMovements++;
    console.log(`   ✓ Reduced -5 stock from ${item2.nama}`);

    console.log(`✅ ${stockMovements} stock movements created\n`);

    // Summary
    console.log("=" .repeat(60));
    console.log("🎉 SEEDING COMPLETED SUCCESSFULLY!");
    console.log("=" .repeat(60));
    console.log(`👤 Users created: ${createdUsers.length}`);
    console.log(`📦 Barang created: ${createdBarang.length}`);
    console.log(`💰 Price records: ${priceCount}`);
    console.log(`📊 Stock movements: ${stockMovements}`);
    console.log("=" .repeat(60));
    console.log("\n📝 Login Credentials:");
    console.log("   Username: admin    Password: admin123");
    console.log("   Username: user1    Password: password123");
    console.log("   Username: manager  Password: manager123");
    console.log("\n🚀 You can now test the API at http://localhost:4000");
    console.log("📖 API Docs: http://localhost:4000/api-docs\n");

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seed();
