const HttpError = require('../utils/httpError');
const { toPositiveInteger, validateAuthor } = require('../utils/validators');

module.exports = function createAuthorsController(service) {
  function parseId(value) {
    const id = toPositiveInteger(value);
    if (!id) throw new HttpError(400, 'El id debe ser un entero positivo');
    return id;
  }

  return {
    list: async (req, res, next) => {
      try { res.json(await service.list()); } catch (error) { next(error); }
    },
    detail: async (req, res, next) => {
      try {
        const author = await service.findById(parseId(req.params.id));
        if (!author) throw new HttpError(404, 'Author no encontrado');
        res.json(author);
      } catch (error) { next(error); }
    },
    create: async (req, res, next) => {
      try {
        const errors = validateAuthor(req.body);
        if (errors.length) throw new HttpError(400, errors.join('. '));
        res.status(201).json(await service.create(req.body));
      } catch (error) { next(error); }
    },
    update: async (req, res, next) => {
      try {
        const errors = validateAuthor(req.body);
        if (errors.length) throw new HttpError(400, errors.join('. '));
        const author = await service.update(parseId(req.params.id), req.body);
        if (!author) throw new HttpError(404, 'Author no encontrado');
        res.json(author);
      } catch (error) { next(error); }
    },
    remove: async (req, res, next) => {
      try {
        const deleted = await service.remove(parseId(req.params.id));
        if (!deleted) throw new HttpError(404, 'Author no encontrado');
        res.status(204).send();
      } catch (error) { next(error); }
    },
  };
};
