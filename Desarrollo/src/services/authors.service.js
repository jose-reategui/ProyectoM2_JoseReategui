module.exports = function createAuthorsService(db) {
  return {
    async list() {
      const { rows } = await db.query('SELECT * FROM authors ORDER BY id');
      return rows;
    },

    async findById(id) {
      const { rows } = await db.query('SELECT * FROM authors WHERE id = $1', [id]);
      return rows[0] || null;
    },

    async create({ name, email, bio = null }) {
      const { rows } = await db.query(
        `INSERT INTO authors (name, email, bio)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [name.trim(), email.trim().toLowerCase(), bio]
      );
      return rows[0];
    },

    async update(id, { name, email, bio = null }) {
      const { rows } = await db.query(
        `UPDATE authors
         SET name = $1, email = $2, bio = $3
         WHERE id = $4
         RETURNING *`,
        [name.trim(), email.trim().toLowerCase(), bio, id]
      );
      return rows[0] || null;
    },

    async remove(id) {
      const result = await db.query('DELETE FROM authors WHERE id = $1', [id]);
      return result.rowCount > 0;
    },
  };
};
