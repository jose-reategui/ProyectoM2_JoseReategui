require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../src/db/pool');

async function seed() {
  const seedSql = fs.readFileSync(path.join(__dirname, '..', 'sql', 'seed.sql'), 'utf8');
  await pool.query(seedSql);
  console.log('Datos de ejemplo insertados correctamente.');
}

seed()
  .catch((error) => {
    console.error('No se pudo ejecutar el seed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
