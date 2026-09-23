const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isBlank(value) {
  return typeof value !== 'string' || value.trim().length === 0;
}

function toPositiveInteger(value) {
  if (typeof value === 'number') {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }

  if (typeof value !== 'string' || !/^\d+$/.test(value.trim())) {
    return null;
  }

  const parsed = Number(value.trim());
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

function validateAuthor(body) {
  if (!isObject(body)) {
    return ['body debe ser un objeto JSON válido'];
  }

  const errors = [];

  if (isBlank(body.name)) {
    errors.push('name es obligatorio y no puede estar vacío');
  } else if (body.name.trim().length > 120) {
    errors.push('name no puede superar los 120 caracteres');
  }

  if (isBlank(body.email)) {
    errors.push('email es obligatorio');
  } else if (!EMAIL_PATTERN.test(body.email.trim())) {
    errors.push('email debe tener un formato válido');
  } else if (body.email.trim().length > 255) {
    errors.push('email no puede superar los 255 caracteres');
  }

  if (
    body.bio !== undefined &&
    body.bio !== null &&
    typeof body.bio !== 'string'
  ) {
    errors.push('bio debe ser texto o null');
  }

  return errors;
}

function validatePost(body) {
  if (!isObject(body)) {
    return ['body debe ser un objeto JSON válido'];
  }

  const errors = [];

  if (isBlank(body.title)) {
    errors.push('title es obligatorio y no puede estar vacío');
  } else if (body.title.trim().length > 200) {
    errors.push('title no puede superar los 200 caracteres');
  }

  if (isBlank(body.content)) {
    errors.push('content es obligatorio y no puede estar vacío');
  }

  if (!toPositiveInteger(body.author_id)) {
    errors.push('author_id debe ser un entero positivo');
  }

  if (body.published !== undefined && typeof body.published !== 'boolean') {
    errors.push('published debe ser booleano');
  }

  return errors;
}

function validateComment(body) {
  if (!isObject(body)) {
    return ['body debe ser un objeto JSON válido'];
  }

  const errors = [];

  if (!toPositiveInteger(body.post_id)) {
    errors.push('post_id debe ser un entero positivo');
  }

  if (!toPositiveInteger(body.author_id)) {
    errors.push('author_id debe ser un entero positivo');
  }

  if (isBlank(body.content)) {
    errors.push('content es obligatorio y no puede estar vacío');
  }

  return errors;
}

module.exports = {
  isBlank,
  toPositiveInteger,
  validateAuthor,
  validatePost,
  validateComment,
};