const HttpError = require('../utils/httpError');
const { toPositiveInteger, validatePost } = require('../utils/validators');

module.exports = function createPostsController(service, authorsService) {
  function parseId(value, label = 'id') {
    const id = toPositiveInteger(value);
    if (!id) throw new HttpError(400, `${label} debe ser un entero positivo`);
    return id;
  }

  async function ensureAuthor(authorId) {
    const id = parseId(authorId, 'author_id');
    if (!(await authorsService.findById(id))) throw new HttpError(400, 'El author indicado no existe');
    return id;
  }

  return {
    list: async (req, res, next) => {
      try { res.json(await service.list()); } catch (error) { next(error); }
    },
    detail: async (req, res, next) => {
      try {
        const post = await service.findById(parseId(req.params.id));
        if (!post) throw new HttpError(404, 'Post no encontrado');
        res.json(post);
      } catch (error) { next(error); }
    },
    byAuthor: async (req, res, next) => {
      try {
        const authorId = parseId(req.params.authorId, 'authorId');
        if (!(await authorsService.findById(authorId))) throw new HttpError(404, 'Author no encontrado');
        res.json(await service.findByAuthor(authorId));
      } catch (error) { next(error); }
    },
    create: async (req, res, next) => {
      try {
        const errors = validatePost(req.body);
        if (errors.length) throw new HttpError(400, errors.join('. '));
        await ensureAuthor(req.body.author_id);
        res.status(201).json(await service.create(req.body));
      } catch (error) { next(error); }
    },
    update: async (req, res, next) => {
      try {
        const errors = validatePost(req.body);
        if (errors.length) throw new HttpError(400, errors.join('. '));
        await ensureAuthor(req.body.author_id);
        const post = await service.update(parseId(req.params.id), req.body);
        if (!post) throw new HttpError(404, 'Post no encontrado');
        res.json(post);
      } catch (error) { next(error); }
    },
    remove: async (req, res, next) => {
      try {
        const deleted = await service.remove(parseId(req.params.id));
        if (!deleted) throw new HttpError(404, 'Post no encontrado');
        res.status(204).send();
      } catch (error) { next(error); }
    },
  };
};
