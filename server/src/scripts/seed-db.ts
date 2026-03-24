import fs from 'node:fs/promises';
import path from 'node:path';
import { db } from '../db/pool.js';

async function runSqlFile(filePath: string) {
  console.log(`Executing ${path.basename(filePath)}...`);
  const sql = await fs.readFile(filePath, 'utf-8');
  await db.query(sql);
}

async function main() {
  const dbName = 'slopax_saas';
  
  try {
    // 1. First connect to default 'postgres' db to ensure our target db exists
    console.log(`Checking if database "${dbName}" exists...`);
    const adminUrl = process.env.DATABASE_URL!.replace(`/${dbName}`, '/postgres');
    const adminPool = new (await import('pg')).Pool({ connectionString: adminUrl });
    
    const dbExists = await adminPool.query('SELECT 1 FROM pg_database WHERE datname = $1', [dbName]);
    if (dbExists.rowCount === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      await adminPool.query(`CREATE DATABASE ${dbName}`);
    }
    await adminPool.end();

    const sqlDir = path.join(process.cwd(), 'sql');
    
    // 2. Run Schema
    await runSqlFile(path.join(sqlDir, 'schema.sql'));
    
    // 3. Run Seed
    await runSqlFile(path.join(sqlDir, 'seed.sql'));
    
    // 4. Create Root User (if exists)
    const rootUserFile = path.join(sqlDir, 'create-root-user.sql');
    try {
      await fs.access(rootUserFile);
      await runSqlFile(rootUserFile);
    } catch {
      console.log('No standalone root-user script found, skipping.');
    }

    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error initializing database:', err);
    process.exit(1);
  }
}

main();
