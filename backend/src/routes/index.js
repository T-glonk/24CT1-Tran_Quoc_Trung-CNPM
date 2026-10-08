const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const courtRoutes = require('./courtRoutes');
const bookingRoutes = require('./bookingRoutes');
const customerRoutes = require('./customerRoutes');
const serviceRoutes = require('./serviceRoutes');
const transactionRoutes = require('./transactionRoutes');
const reportRoutes = require('./reportRoutes');
const dbRoutes = require('./dbRoutes');
const syncRoutes = require('./syncRoutes');

// Mount Sub-routers
router.use('/auth', authRoutes);
router.use('/courts', courtRoutes);
router.use('/bookings', bookingRoutes);
router.use('/customers', customerRoutes);
router.use('/services', serviceRoutes);
router.use('/transactions', transactionRoutes);
router.use('/reports', reportRoutes);
router.use('/db', dbRoutes);
router.use('/sync', syncRoutes);


// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Badminton Court Booking API',
  });
});

module.exports = router;
