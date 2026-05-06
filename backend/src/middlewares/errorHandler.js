export function notFound(req, _res, next) {
  const error = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

export function errorHandler(error, _req, res, _next) {
  const statusCode = error.statusCode || 500;
  if (statusCode === 500) console.error(error);
  res.status(statusCode).json({ success: false, message: statusCode === 500 ? 'Internal server error' : error.message });
}
