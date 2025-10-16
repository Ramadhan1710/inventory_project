const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
  host: process.env.DATABASE_HOST,
  port: process.env.DATABASE_PORT,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
});

async function checkTables() {
  try {
    await client.connect();
    console.log('✅ Connected to database successfully!\n');

    // Get all tables
    const result = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `);

    if (result.rows.length === 0) {
      console.log('❌ No tables found in database.');
      console.log('\n📋 TypeORM should create tables automatically when server starts.');
      console.log('   Make sure the server is running (npm run dev)');
    } else {
      console.log('📊 Tables in database:');
      console.log('━'.repeat(50));
      result.rows.forEach((row, idx) => {
        console.log(`${idx + 1}. ${row.table_name}`);
      });
      console.log('━'.repeat(50));

      // Get column details for each table
      console.log('\n📝 Table Structures:\n');
      for (const row of result.rows) {
        const columns = await client.query(`
          SELECT column_name, data_type, is_nullable, column_default
          FROM information_schema.columns
          WHERE table_name = $1
          ORDER BY ordinal_position;
        `, [row.table_name]);

        console.log(`\n🗂️  Table: ${row.table_name}`);
        console.log('   ' + '─'.repeat(70));
        columns.rows.forEach(col => {
          const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
          const def = col.column_default ? ` DEFAULT ${col.column_default}` : '';
          console.log(`   ${col.column_name.padEnd(20)} ${col.data_type.padEnd(20)} ${nullable}${def}`);
        });
      }
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkTables();
