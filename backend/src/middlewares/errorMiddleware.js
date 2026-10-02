// ─── GLOBAL ERROR HANDLER & 404 NOT FOUND MIDDLEWARE ─────────────────────────

function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: `Không tìm thấy endpoint: ${req.method} ${req.originalUrl}`,
  });
}

function errorHandler(err, req, res, next) {
  console.error('[API Error]:', err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Lỗi máy chủ nội bộ',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}

module.exports = { notFoundHandler, errorHandler };
