require('dotenv').config();
const express = require('express');
const cors = require('cors');

const routes = require('./routes');
const { loggerMiddleware } = require('./middlewares/loggerMiddleware');
const { authMiddleware } = require('./middlewares/authMiddleware');
const { notFoundHandler, errorHandler } = require('./middlewares/errorMiddleware');

const { testMySQLConnection } = require('./config/mysql');

const app = express();
const PORT = process.env.PORT || 5000;

// ── Middlewares ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(loggerMiddleware);
app.use(authMiddleware);

// ── API Routes ──
app.use('/api', routes);

// Root greeting
app.get('/', (req, res) => {
  res.json({
    message: '🏸 Chào mừng đến với Badminton Court & Alobo Sport API Server',
    version: '1.0.0',
    docs: '/api/health',
  });
});

// ── Error Handling ──
app.use(notFoundHandler);
app.use(errorHandler);

// Start HTTP Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, async () => {
    console.log(`\n=================================================`);
    console.log(`🏸 BADMINTON COURT BACKEND SERVER IS RUNNING`);
    console.log(`🚀 Port: http://localhost:${PORT}`);
    console.log(`📡 API Endpoints: http://localhost:${PORT}/api`);
    console.log(`=================================================\n`);
    await testMySQLConnection();
  });
}

module.exports = app;
