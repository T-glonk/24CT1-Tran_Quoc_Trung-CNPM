// ─── REPORTS, KPIS & AUDIT LOGS CONTROLLER ──────────────────────────────────
const db = require('../config/db');

// GET /api/reports/summary
function getSummary(req, res) {
  const courts = db.getCourts();
  const bookings = db.getBookings();
  const users = db.getUsers();
  const transactions = db.getTransactions();

  const totalRevenue = transactions
    .filter(t => t.status === 'completed')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  const activeCourtsCount = courts.filter(c => c.status === 'in_use').length;
  const availableCourtsCount = courts.filter(c => c.status === 'available').length;
  const maintenanceCourtsCount = courts.filter(c => c.status === 'maintenance').length;

  res.json({
    success: true,
    data: {
      totalCourts: courts.length,
      activeCourts: activeCourtsCount,
      availableCourts: availableCourtsCount,
      maintenanceCourts: maintenanceCourtsCount,
      totalBookings: bookings.length,
      pendingBookings: bookings.filter(b => b.status === 'pending').length,
      confirmedBookings: bookings.filter(b => b.status === 'confirmed').length,
      totalMembers: users.length,
      activeMembers: users.filter(u => u.status === 'active').length,
      totalRevenue,
      todayRevenue: 1850000,
      weekRevenue: 12400000,
      monthRevenue: 48900000,
    },
  });
}

// GET /api/reports/logs
function getActivityLogs(req, res) {
  const logs = db.getLogs();
  res.json({
    success: true,
    count: logs.length,
    data: logs,
  });
}

module.exports = {
  getSummary,
  getActivityLogs,
};
