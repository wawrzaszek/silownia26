import bcrypt from 'bcryptjs';
import { db } from '../db/pool.js';

async function main() {
  const password = 'root123456';
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  
  console.log(`Password: ${password}`);
  console.log(`Generated Hash: ${hash}`);
  
  const res = await db.query('UPDATE users SET password_hash = $1 WHERE email = $2 RETURNING id', [hash, 'root@silownia26.pl']);
  
  if (res.rowCount === 0) {
    console.log('User root@silownia26.pl NOT FOUND during update');
  } else {
    console.log('Password hash updated successfully!');
  }
  process.exit(0);
}

main();
