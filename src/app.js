require('dotenv').config();
const path = require('path');
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const defaultPool = require('./db/pool');
const createAuthorsService = require('./services/authors.service');
const createPostsService = require('./services/posts.service');
const createCommentsService = require('./services/comments.service');
const createAuthorsController = require('./controllers/authors.controller');
const createPostsController = require('./controllers/posts.controller');
const createCommentsController = require('./controllers/comments.controller');
const createAuthorsRouter = require('./routes/authors.routes');
const createPostsRouter = require('./routes/posts.routes');
const createCommentsRouter = require('./routes/comments.routes');
const { notFoundHandler, errorHandler } = require('./middlewares/errorHandler');

function createApp({ db = defaultPool } = {}) {
  const app = express();
  const authorsService = createAuthorsService(db);
  const postsService = createPostsService(db);
  const commentsService = createCommentsService(db);
  const authorsController = createAuthorsController(authorsService);
  const postsController = createPostsController(postsService, authorsService);
  const commentsController = createCommentsController(commentsService, authorsService, postsService);
  const openapi = YAML.load(path.join(__dirname, 'docs', 'openapi.yaml'));

  app.disable('x-powered-by');
  app.use(express.json({ limit: '100kb' }));

  app.get('/', (req, res) => {
    res.json({ message: 'API Authors & Posts', documentation: '/api-docs' });
  });
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.get('/openapi.json', (req, res) => res.json(openapi));
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapi));
  app.use('/authors', createAuthorsRouter(authorsController));
  app.use('/posts', createPostsRouter(postsController, commentsController));
  app.use('/comments', createCommentsRouter(commentsController));
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
