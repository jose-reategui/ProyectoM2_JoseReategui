require('dotenv').config();
const pool = require('../src/db/pool');

async function seed() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const { rows: authors } = await client.query(
      `INSERT INTO authors (name, email, bio)
       VALUES ($1, $2, $3), ($4, $5, $6)
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id, email`,
      ['Ana Torres', 'ana@example.com', 'Autora de tecnología',
       'Luis Pérez', 'luis@example.com', 'Autor de viajes']
    );
    const ana = authors.find((author) => author.email === 'ana@example.com');
    await client.query(
      `INSERT INTO posts (author_id, title, content, published)
       SELECT $1, $2, $3, $4
       WHERE NOT EXISTS (SELECT 1 FROM posts WHERE title = $2)`,
      [ana.id, 'Mi primer post', 'Contenido de ejemplo para probar la API.', true]
    );
    await client.query('COMMIT');
    console.log('Datos de ejemplo insertados correctamente.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((error) => {
  console.error('No se pudo ejecutar el seed:', error.message);
  process.exitCode = 1;
});
