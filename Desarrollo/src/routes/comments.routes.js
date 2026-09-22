const express = require('express');

module.exports = function createCommentsRouter(controller) {
  const router = express.Router();
  router.get('/', controller.list);
  router.post('/', controller.create);
  return router;
};
