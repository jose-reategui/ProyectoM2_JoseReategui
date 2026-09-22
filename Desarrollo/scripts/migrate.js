require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../src/db/pool');

async function migrate() {
  const schema = fs.readFileSync(path.join(__dirname, '..', 'sql', 'setup.sql'), 'utf8');
  await pool.query(schema);
  console.log('Migración completada correctamente.');
}

migrate()
  .catch((error) => {
    console.error('No se pudo ejecutar la migración:', error.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
