const express = require('express');

module.exports = function createAuthorsRouter(controller) {
  const router = express.Router();
  router.get('/', controller.list);
  router.get('/:id', controller.detail);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);
  return router;
};
