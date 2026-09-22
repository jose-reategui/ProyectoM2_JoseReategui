module.exports = function createCommentsService(db) {
  const commentWithDetails = `
    SELECT c.id, c.post_id, c.author_id, c.content, c.created_at,
           a.name AS author_name, a.email AS author_email,
           p.title AS post_title
    FROM comments c
    JOIN authors a ON a.id = c.author_id
    JOIN posts p ON p.id = c.post_id`;

  return {
    mapRows(rows) {
      return rows.map((row) => ({
        id: row.id,
        post_id: row.post_id,
        author_id: row.author_id,
        content: row.content,
        created_at: row.created_at,
        author: { id: row.author_id, name: row.author_name, email: row.author_email },
        post: { id: row.post_id, title: row.post_title },
      }));
    },

    async list() {
      const { rows } = await db.query(`${commentWithDetails} ORDER BY c.id`);
      return this.mapRows(rows);
    },

    async findByPost(postId) {
      const { rows } = await db.query(
        `${commentWithDetails} WHERE c.post_id = $1 ORDER BY c.id`,
        [postId]
      );
      return this.mapRows(rows);
    },

    async create({ post_id, author_id, content }) {
      const { rows } = await db.query(
        `INSERT INTO comments (post_id, author_id, content)
         VALUES ($1, $2, $3)
         RETURNING *`,
        [post_id, author_id, content.trim()]
      );
      return rows[0];
    },
  };
};
