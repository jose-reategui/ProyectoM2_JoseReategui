const express = require('express');

module.exports = function createPostsRouter(controller, commentsController) {
  const router = express.Router();
  router.get('/', controller.list);
  router.get('/author/:authorId', controller.byAuthor);
  router.get('/:postId/comments', commentsController.byPost);
  router.get('/:id', controller.detail);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
};
