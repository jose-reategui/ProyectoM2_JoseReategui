function notFoundHandler(req, res) {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.code === '23505') {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }

  if (error.code === '23503') {
    return res.status(400).json({ error: 'La referencia indicada no existe' });
  }

  const status = error.status || 500;
  const message = status === 500 ? 'Error interno del servidor' : error.message;

  if (status === 500 && process.env.NODE_ENV !== 'test') console.error(error);
  return res.status(status).json({ error: message });
}

module.exports = { notFoundHandler, errorHandler };
