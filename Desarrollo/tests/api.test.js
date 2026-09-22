const fs = require('fs');
const path = require('path');
const request = require('supertest');
const { newDb } = require('pg-mem');
const createApp = require('../src/app');

describe('API REST Authors, Posts y Comments', () => {
  let pool;
  let app;

  beforeAll(async () => {
    const memoryDb = newDb();
    const adapter = memoryDb.adapters.createPg();
    pool = new adapter.Pool();
    const schema = fs.readFileSync(path.join(__dirname, '..', 'sql', 'setup.sql'), 'utf8');
    await pool.query(schema);
    app = createApp({ db: pool });
  });

  afterAll(async () => pool.end());

  test('GET /health responde correctamente', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  test('valida name y email al crear un author', async () => {
    const response = await request(app).post('/authors').send({ name: ' ', email: 'incorrecto' });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/name/);
  });

  test('realiza CRUD completo de authors', async () => {
    const created = await request(app)
      .post('/authors')
      .send({ name: 'Ana Torres', email: 'ANA@EXAMPLE.COM', bio: 'Bio inicial' });
    expect(created.status).toBe(201);
    expect(created.body.email).toBe('ana@example.com');

    const id = created.body.id;
    const listed = await request(app).get('/authors');
    expect(listed.status).toBe(200);
    expect(listed.body).toHaveLength(1);

    const detail = await request(app).get(`/authors/${id}`);
    expect(detail.status).toBe(200);
    expect(detail.body.name).toBe('Ana Torres');

    const updated = await request(app)
      .put(`/authors/${id}`)
      .send({ name: 'Ana Actualizada', email: 'ana@example.com', bio: 'Nueva bio' });
    expect(updated.status).toBe(200);
    expect(updated.body.name).toBe('Ana Actualizada');
  });

  test('rechaza emails duplicados', async () => {
    const response = await request(app)
      .post('/authors')
      .send({ name: 'Otra Ana', email: 'ana@example.com' });
    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/email/i);
  });

  test('realiza CRUD de posts y devuelve el detalle del author', async () => {
    const author = (await request(app).get('/authors')).body[0];
    const created = await request(app).post('/posts').send({
      author_id: author.id,
      title: 'Post de prueba',
      content: 'Contenido de prueba',
      published: true,
    });
    expect(created.status).toBe(201);
    const postId = created.body.id;

    const byAuthor = await request(app).get(`/posts/author/${author.id}`);
    expect(byAuthor.status).toBe(200);
    expect(byAuthor.body[0].author.email).toBe('ana@example.com');

    const updated = await request(app).put(`/posts/${postId}`).send({
      author_id: author.id,
      title: 'Post actualizado',
      content: 'Contenido actualizado',
      published: false,
    });
    expect(updated.status).toBe(200);
    expect(updated.body.title).toBe('Post actualizado');
  });

  test('crea y lista comments asociados a posts y authors', async () => {
    const author = (await request(app).get('/authors')).body[0];
    const post = (await request(app).get('/posts')).body[0];
    const created = await request(app).post('/comments').send({
      post_id: post.id,
      author_id: author.id,
      content: 'Comentario de prueba',
    });
    expect(created.status).toBe(201);

    const comments = await request(app).get(`/posts/${post.id}/comments`);
    expect(comments.status).toBe(200);
    expect(comments.body[0].post.title).toBe('Post actualizado');
  });

  test('DELETE responde 204 y luego 404', async () => {
    const post = (await request(app).get('/posts')).body[0];
    expect((await request(app).delete(`/posts/${post.id}`)).status).toBe(204);
    expect((await request(app).get(`/posts/${post.id}`)).status).toBe(404);

    const author = (await request(app).get('/authors')).body[0];
    expect((await request(app).delete(`/authors/${author.id}`)).status).toBe(204);
    expect((await request(app).get(`/authors/${author.id}`)).status).toBe(404);
  });

  test('una ruta inexistente responde 404', async () => {
    const response = await request(app).get('/no-existe');
    expect(response.status).toBe(404);
  });
});
