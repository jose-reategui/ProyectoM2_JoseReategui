const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isBlank(value) {
  return typeof value !== 'string' || value.trim().length === 0;
}

function toPositiveInteger(value) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
}

function validateAuthor(body) {
  const errors = [];
  if (isBlank(body.name)) errors.push('name es obligatorio y no puede estar vacío');
  if (isBlank(body.email)) {
    errors.push('email es obligatorio');
  } else if (!EMAIL_PATTERN.test(body.email.trim())) {
    errors.push('email debe tener un formato válido');
  }
  return errors;
}

function validatePost(body) {
  const errors = [];
  if (isBlank(body.title)) errors.push('title es obligatorio y no puede estar vacío');
  if (isBlank(body.content)) errors.push('content es obligatorio y no puede estar vacío');
  if (!toPositiveInteger(body.author_id)) errors.push('author_id debe ser un entero positivo');
  if (body.published !== undefined && typeof body.published !== 'boolean') {
    errors.push('published debe ser booleano');
  }
  return errors;
}

function validateComment(body) {
  const errors = [];
  if (!toPositiveInteger(body.post_id)) errors.push('post_id debe ser un entero positivo');
  if (!toPositiveInteger(body.author_id)) errors.push('author_id debe ser un entero positivo');
  if (isBlank(body.content)) errors.push('content es obligatorio y no puede estar vacío');
  return errors;
}

module.exports = {
  isBlank,
  toPositiveInteger,
  validateAuthor,
  validatePost,
  validateComment,
};
