const HttpError = require('../utils/httpError');
const { toPositiveInteger, validateComment } = require('../utils/validators');

module.exports = function createCommentsController(service, authorsService, postsService) {
  return {
    list: async (req, res, next) => {
      try { res.json(await service.list()); } catch (error) { next(error); }
    },
    byPost: async (req, res, next) => {
      try {
        const postId = toPositiveInteger(req.params.postId);
        if (!postId) throw new HttpError(400, 'postId debe ser un entero positivo');
        if (!(await postsService.findById(postId))) throw new HttpError(404, 'Post no encontrado');
        res.json(await service.findByPost(postId));
      } catch (error) { next(error); }
    },
    create: async (req, res, next) => {
      try {
        const errors = validateComment(req.body);
        if (errors.length) throw new HttpError(400, errors.join('. '));
        if (!(await postsService.findById(req.body.post_id))) throw new HttpError(400, 'El post indicado no existe');
        if (!(await authorsService.findById(req.body.author_id))) throw new HttpError(400, 'El author indicado no existe');
        res.status(201).json(await service.create(req.body));
      } catch (error) { next(error); }
    },
  };
};
