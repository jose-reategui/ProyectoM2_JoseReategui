BEGIN;

INSERT INTO authors (name, email, bio)
VALUES
  ('Ana Torres', 'ana@example.com', 'Autora de tecnología'),
  ('Luis Pérez', 'luis@example.com', 'Autor de viajes')
ON CONFLICT (email) DO UPDATE
SET name = EXCLUDED.name,
    bio = EXCLUDED.bio;

INSERT INTO posts (author_id, title, content, published)
SELECT a.id,
       'Mi primer post',
       'Contenido de ejemplo para probar la API.',
       TRUE
FROM authors a
WHERE a.email = 'ana@example.com'
  AND NOT EXISTS (
    SELECT 1 FROM posts p WHERE p.title = 'Mi primer post'
  );

INSERT INTO comments (post_id, author_id, content)
SELECT p.id,
       a.id,
       'Comentario de ejemplo.'
FROM posts p
JOIN authors a ON a.email = 'luis@example.com'
WHERE p.title = 'Mi primer post'
  AND NOT EXISTS (
    SELECT 1
    FROM comments c
    WHERE c.post_id = p.id
      AND c.author_id = a.id
      AND c.content = 'Comentario de ejemplo.'
  );

COMMIT;
