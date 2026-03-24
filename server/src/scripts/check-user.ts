import { db } from '../db/pool.js';

async function main() {
  try {
    const res = await db.query('SELECT id, email, full_name, role, password_hash FROM users WHERE email = $1', ['root@silownia26.pl']);
    if (res.rowCount === 0) {
      console.log('User root@silownia26.pl NOT FOUND');
    } else {
      console.log('User found:', JSON.stringify(res.rows[0], null, 2));
    }
    process.exit(0);
  } catch (err) {
    console.error('Error querying database:', err);
    process.exit(1);
  }
}

main();
