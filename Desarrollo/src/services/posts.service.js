module.exports = function createPostsService(db) {
  const postWithAuthor = `
    SELECT p.id, p.author_id, p.title, p.content, p.published, p.created_at,
           a.name AS author_name, a.email AS author_email,
           a.bio AS author_bio, a.created_at AS author_created_at
    FROM posts p
    JOIN authors a ON a.id = p.author_id`;

  function mapPostsWithAuthor(rows) {
    return rows.map((row) => ({
      id: row.id,
      author_id: row.author_id,
      title: row.title,
      content: row.content,
      published: row.published,
      created_at: row.created_at,
      author: {
        id: row.author_id,
        name: row.author_name,
        email: row.author_email,
        bio: row.author_bio,
        created_at: row.author_created_at,
      },
    }));
  }

  return {
    async list() {
      const { rows } = await db.query('SELECT * FROM posts ORDER BY id');
      return rows;
    },

    async findById(id) {
      const { rows } = await db.query('SELECT * FROM posts WHERE id = $1', [id]);
      return rows[0] || null;
    },

    async findByAuthor(authorId) {
      const { rows } = await db.query(
        `${postWithAuthor} WHERE p.author_id = $1 ORDER BY p.id`,
        [authorId]
      );
      return mapPostsWithAuthor(rows);
    },

    async create({ author_id, title, content, published = false }) {
      const { rows } = await db.query(
        `INSERT INTO posts (author_id, title, content, published)
         VALUES ($1, $2, $3, $4)
         RETURNING *`,
        [author_id, title.trim(), content.trim(), published]
      );
      return rows[0];
    },

    async update(id, { author_id, title, content, published = false }) {
      const { rows } = await db.query(
        `UPDATE posts
         SET author_id = $1, title = $2, content = $3, published = $4
         WHERE id = $5
         RETURNING *`,
        [author_id, title.trim(), content.trim(), published, id]
      );
      return rows[0] || null;
    },

    async remove(id) {
      const result = await db.query('DELETE FROM posts WHERE id = $1', [id]);
      return result.rowCount > 0;
    },
  };
};
