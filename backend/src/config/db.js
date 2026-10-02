// ─── PERSISTENT DATABASE ENGINE WITH FILE-BACKED STORE ─────────────────────────
const fs = require('fs');
const path = require('path');

const { INITIAL_USERS } = require('../data/users');
const { INITIAL_COURTS, INITIAL_CLUBS } = require('../data/courts');
const { INITIAL_BOOKINGS } = require('../data/bookings');
const { INITIAL_SERVICES } = require('../data/services');
const { INITIAL_TRANSACTIONS, INITIAL_ACTIVITY_LOGS } = require('../data/logs');

const DB_FILE_PATH = path.join(__dirname, '../data/database.json');

class DatabaseStore {
  constructor() {
    this.users = [];
    this.courts = [];
    this.clubs = [];
    this.bookings = [];
    this.services = [];
    this.transactions = [];
    this.logs = [];

    this.init();
  }

  // Khởi tạo và nạp dữ liệu từ file database.json (hoặc seed ban đầu)
  init() {
    try {
      if (fs.existsSync(DB_FILE_PATH)) {
        const fileContent = fs.readFileSync(DB_FILE_PATH, 'utf8');
        const data = JSON.parse(fileContent);

        this.users = Array.isArray(data.users) && data.users.length ? data.users : [...INITIAL_USERS];
        this.courts = Array.isArray(data.courts) && data.courts.length ? data.courts : [...INITIAL_COURTS];
        this.clubs = Array.isArray(data.clubs) && data.clubs.length ? data.clubs : [...INITIAL_CLUBS];
        this.bookings = Array.isArray(data.bookings) && data.bookings.length ? data.bookings : [...INITIAL_BOOKINGS];
        this.services = Array.isArray(data.services) && data.services.length ? data.services : [...INITIAL_SERVICES];
        this.transactions = Array.isArray(data.transactions) && data.transactions.length ? data.transactions : [...INITIAL_TRANSACTIONS];
        this.logs = Array.isArray(data.logs) && data.logs.length ? data.logs : [...INITIAL_ACTIVITY_LOGS];

        console.log(`[Database] Đã nạp dữ liệu thành công từ file persistent: ${DB_FILE_PATH}`);
      } else {
        this.loadDefaultSeeds();
        this.saveToFile();
        console.log(`[Database] Đã khởi tạo cơ sở dữ liệu mới tại: ${DB_FILE_PATH}`);
      }
    } catch (err) {
      console.error(`[Database Error] Không thể nạp database.json, sử dụng seeds mẫu:`, err.message);
      this.loadDefaultSeeds();
    }
  }

  loadDefaultSeeds() {
    this.users = JSON.parse(JSON.stringify(INITIAL_USERS));
    this.courts = JSON.parse(JSON.stringify(INITIAL_COURTS));
    this.clubs = JSON.parse(JSON.stringify(INITIAL_CLUBS));
    this.bookings = JSON.parse(JSON.stringify(INITIAL_BOOKINGS));
    this.services = JSON.parse(JSON.stringify(INITIAL_SERVICES));
    this.transactions = JSON.parse(JSON.stringify(INITIAL_TRANSACTIONS));
    this.logs = JSON.parse(JSON.stringify(INITIAL_ACTIVITY_LOGS));
  }

  // Ghi toàn bộ dữ liệu xuống đĩa cứng (database.json)
  saveToFile() {
    try {
      const dbData = {
        meta: {
          version: '1.0.0',
          appName: 'Alobo Badminton Court Booking & Management',
          lastSaved: new Date().toISOString(),
          tablesCount: 7,
          recordsCount: {
            users: this.users.length,
            courts: this.courts.length,
            clubs: this.clubs.length,
            bookings: this.bookings.length,
            services: this.services.length,
            transactions: this.transactions.length,
            logs: this.logs.length,
          },
        },
        users: this.users,
        courts: this.courts,
        clubs: this.clubs,
        bookings: this.bookings,
        services: this.services,
        transactions: this.transactions,
        logs: this.logs,
      };

      const dirPath = path.dirname(DB_FILE_PATH);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }

      fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbData, null, 2), 'utf8');
    } catch (err) {
      console.error('[Database Error] Lỗi ghi file database.json:', err.message);
    }
  }

  // Reset database về dữ liệu ban đầu
  resetDatabase() {
    this.loadDefaultSeeds();
    this.saveToFile();
    return this.getStats();
  }

  // Lấy thống kê dữ liệu
  getStats() {
    return {
      status: 'online',
      filePath: DB_FILE_PATH,
      counts: {
        users: this.users.length,
        courts: this.courts.length,
        clubs: this.clubs.length,
        bookings: this.bookings.length,
        services: this.services.length,
        transactions: this.transactions.length,
        logs: this.logs.length,
      },
      lastUpdated: new Date().toISOString(),
    };
  }

  // ── Users ──
  getUsers() { return this.users; }
  getUserById(id) { return this.users.find(u => u.id === id); }
  getUserByEmailOrPhone(query) {
    if (!query) return null;
    const q = query.toString().trim().toLowerCase();
    return this.users.find(u =>
      (u.email && u.email.toLowerCase() === q) ||
      (u.phone && u.phone.trim() === q)
    );
  }
  addUser(user) {
    const newUser = {
      id: user.id || `user_${Date.now()}`,
      joinedDate: user.joinedDate || new Date().toLocaleDateString('vi-VN'),
      totalSpent: user.totalSpent || 0,
      bookingsCount: user.bookingsCount || 0,
      tier: user.tier || 'Đồng',
      status: user.status || 'active',
      ...user,
    };
    this.users.unshift(newUser);
    this.saveToFile();
    return newUser;
  }
  updateUser(id, updates) {
    const idx = this.users.findIndex(u => u.id === id);
    if (idx !== -1) {
      this.users[idx] = { ...this.users[idx], ...updates };
      this.saveToFile();
      return this.users[idx];
    }
    return null;
  }

  // ── Courts & Clubs ──
  getCourts() { return this.courts; }
  getCourtById(id) { return this.courts.find(c => c.id === id); }
  addCourt(court) {
    const newCourt = {
      id: court.id || `${this.courts.length + 1}`,
      status: 'available',
      currentGuest: null,
      currentSlot: null,
      ...court,
    };
    this.courts.push(newCourt);
    this.saveToFile();
    return newCourt;
  }
  updateCourt(id, updates) {
    const idx = this.courts.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.courts[idx] = { ...this.courts[idx], ...updates };
      this.saveToFile();
      return this.courts[idx];
    }
    return null;
  }
  getClubs() { return this.clubs; }

  // ── Bookings ──
  getBookings() { return this.bookings; }
  getBookingById(id) { return this.bookings.find(b => b.id === id); }
  addBooking(booking) {
    const newBooking = {
      id: booking.id || `BK-${Date.now().toString().slice(-4)}`,
      status: booking.status || 'confirmed',
      paymentStatus: booking.paymentStatus || 'paid',
      createdAt: booking.createdAt || new Date().toLocaleString('vi-VN'),
      ...booking,
    };
    this.bookings.unshift(newBooking);
    this.saveToFile();
    return newBooking;
  }
  updateBooking(id, updates) {
    const idx = this.bookings.findIndex(b => b.id === id);
    if (idx !== -1) {
      this.bookings[idx] = { ...this.bookings[idx], ...updates };
      this.saveToFile();
      return this.bookings[idx];
    }
    return null;
  }

  // ── Services ──
  getServices() { return this.services; }
  getServiceById(id) { return this.services.find(s => s.id === id); }
  addService(service) {
    const newService = { id: service.id || `s${this.services.length + 1}`, ...service };
    this.services.push(newService);
    this.saveToFile();
    return newService;
  }
  updateService(id, updates) {
    const idx = this.services.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.services[idx] = { ...this.services[idx], ...updates };
      this.saveToFile();
      return this.services[idx];
    }
    return null;
  }

  // ── Transactions ──
  getTransactions() { return this.transactions; }
  addTransaction(txn) {
    const newTxn = {
      id: txn.id || `TXN-${Date.now().toString().slice(-4)}`,
      time: txn.time || new Date().toLocaleString('vi-VN'),
      status: txn.status || 'completed',
      ...txn,
    };
    this.transactions.unshift(newTxn);
    this.saveToFile();
    return newTxn;
  }

  // ── Audit Logs ──
  getLogs() { return this.logs; }
  addLog(log) {
    const newLog = {
      id: log.id || `L-${Date.now()}`,
      time: log.time || 'Vừa xong',
      ...log,
    };
    this.logs.unshift(newLog);
    this.saveToFile();
    return newLog;
  }
}

// Singleton database instance
const db = new DatabaseStore();

module.exports = db;
