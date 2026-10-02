// ─── AUTH & ROLE CHECK MIDDLEWARE ─────────────────────────────────────────────
const db = require('../config/db');

function authMiddleware(req, res, next) {
  const userId = req.headers['x-user-id'];
  if (!userId) {
    // If no explicit auth header in dev, allow request or set guest
    req.user = null;
    return next();
  }
  const user = db.getUserById(userId);
  if (user) {
    req.user = user;
  }
  next();
}

function requireAdmin(req, res, next) {
  const userId = req.headers['x-user-id'];
  const user = userId ? db.getUserById(userId) : null;
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Quyền truy cập bị từ chối: Yêu cầu quyền Quản trị viên (Admin)' });
  }
  req.user = user;
  next();
}

module.exports = { authMiddleware, requireAdmin };
