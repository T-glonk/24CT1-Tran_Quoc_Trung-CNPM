import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';
import { courtApi } from '../api/courtApi';
import { bookingApi } from '../api/bookingApi';
import { customerApi } from '../api/customerApi';
import { serviceApi } from '../api/serviceApi';
import { reportApi } from '../api/reportApi';

// Fallback initial seeds if offline
import {
  INITIAL_USERS,
  INITIAL_COURTS,
  INITIAL_CLUBS,
  INITIAL_BOOKINGS,
  INITIAL_SERVICES,
  INITIAL_TRANSACTIONS,
  INITIAL_ACTIVITY_LOGS,
} from '../constants/initialData';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [authScreen, setAuthScreen] = useState('welcome');
  const [screen, setScreen] = useState('home');

  const [courts, setCourts] = useState(INITIAL_COURTS);
  const [clubs, setClubs] = useState(INITIAL_CLUBS);
  const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
  const [usersList, setUsersList] = useState(INITIAL_USERS);
  const [servicesList, setServicesList] = useState(INITIAL_SERVICES);
  const [transactionsList, setTransactionsList] = useState(INITIAL_TRANSACTIONS);
  const [logsList, setLogsList] = useState(INITIAL_ACTIVITY_LOGS);
  const [favorites, setFavorites] = useState([]);

  // Fetch initial data from Backend if available
  useEffect(() => {
    async function loadData() {
      try {
        const [courtsRes, bookingsRes, servicesRes, usersRes, txnsRes, logsRes] = await Promise.all([
          courtApi.getAllCourts(),
          bookingApi.getAllBookings(),
          serviceApi.getAllServices(),
          customerApi.getAllCustomers(),
          reportApi.getTransactions(),
          reportApi.getLogs(),
        ]);

        if (courtsRes?.success) setCourts(courtsRes.data);
        if (bookingsRes?.success) setBookings(bookingsRes.data);
        if (servicesRes?.success) setServicesList(servicesRes.data);
        if (usersRes?.success) setUsersList(usersRes.data);
        if (txnsRes?.success) setTransactionsList(txnsRes.data);
        if (logsRes?.success) setLogsList(logsRes.data);
      } catch (err) {
        console.log('[AppProvider] Using local state cache:', err.message);
      }
    }
    loadData();
  }, []);

  const navigate = (sc) => setScreen(sc);

  // ── Auth Actions ──
  const handleLogin = (user) => {
    setCurrentUser(user);
    setScreen(user.role === 'admin' ? 'adminHome' : 'home');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAuthScreen('welcome');
    setScreen('home');
  };

  // ── Customer Booking Actions ──
  const handleConfirmBooking = async (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);

    // Add transaction
    const newTxn = {
      id: `TXN-${Date.now().toString().slice(-4)}`,
      bookingId: newBooking.id,
      customerName: newBooking.userName,
      amount: newBooking.grandTotal || newBooking.court.price,
      method: newBooking.paymentMethod || 'Chuyển khoản QR',
      status: 'completed',
      time: new Date().toLocaleString('vi-VN'),
      ref: 'ONLINE-APP',
    };
    setTransactionsList((prev) => [newTxn, ...prev]);

    // Try backend sync
    try {
      await bookingApi.createBooking(newBooking);
    } catch (e) {}
  };

  const handleCancelBooking = async (bookingId, reason) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId ? { ...b, status: 'cancelled', note: `Hủy: ${reason}` } : b
      )
    );
    try {
      await bookingApi.cancelBooking(bookingId, reason);
    } catch (e) {}
  };

  // ── Admin Court Handlers ──
  const handleCourtStatusChange = async (id, newStatus) => {
    setCourts((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: newStatus,
              currentGuest: newStatus === 'in_use' ? 'Khách đang thi đấu' : newStatus === 'maintenance' ? 'Đang bảo dưỡng' : null,
              currentSlot: newStatus === 'in_use' ? 'Hiện tại' : null,
            }
          : c
      )
    );

    const logItem = {
      id: `L-${Date.now()}`,
      action: 'Cập nhật trạng thái sân',
      detail: `Đổi trạng thái sân ID ${id} sang ${newStatus}`,
      user: currentUser?.name || 'Admin',
      time: 'Vừa xong',
      type: 'court',
    };
    setLogsList((prev) => [logItem, ...prev]);

    try {
      await courtApi.updateStatus(id, newStatus);
    } catch (e) {}
  };

  const handleAddCourt = async (newCourt) => {
    setCourts((prev) => [...prev, newCourt]);
    try {
      await courtApi.addCourt(newCourt);
    } catch (e) {}
  };

  const handleUpdateCourtPrice = async (courtId, newPrice) => {
    setCourts((prev) => prev.map((c) => (c.id === courtId ? { ...c, price: newPrice } : c)));
    try {
      await courtApi.updatePrice(courtId, newPrice);
    } catch (e) {}
  };

  // ── Admin Booking Handlers ──
  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
    try {
      await bookingApi.updateStatus(bookingId, newStatus);
    } catch (e) {}
  };

  const handleAddWalkinBooking = (newBooking) => {
    setBookings((prev) => [newBooking, ...prev]);
    setTransactionsList((prev) => [
      {
        id: `TXN-${Date.now().toString().slice(-4)}`,
        bookingId: newBooking.id,
        customerName: newBooking.userName,
        amount: newBooking.grandTotal,
        method: 'Tiền mặt',
        status: 'completed',
        time: new Date().toLocaleString('vi-VN'),
        ref: 'POS-CASH',
      },
      ...prev,
    ]);
  };

  // ── Admin User Handlers ──
  const handleToggleUserStatus = async (userId) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'locked' : 'active' } : u
      )
    );
    try {
      await customerApi.toggleStatus(userId);
    } catch (e) {}
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    setUsersList((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
    try {
      await customerApi.updateRole(userId, newRole);
    } catch (e) {}
  };

  const handleAddUser = async (newUser) => {
    setUsersList((prev) => [newUser, ...prev]);
    try {
      await customerApi.addCustomer(newUser);
    } catch (e) {}
  };

  // ── Admin Service / POS Handlers ──
  const handleUpdateStock = async (serviceId, newStock) => {
    setServicesList((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, stock: newStock } : s))
    );
    try {
      await serviceApi.updateStock(serviceId, 0, newStock);
    } catch (e) {}
  };

  const handleAddService = async (newService) => {
    setServicesList((prev) => [newService, ...prev]);
    try {
      await serviceApi.addService(newService);
    } catch (e) {}
  };

  const handleToggleFavorite = (clubId) => {
    setFavorites((prev) =>
      prev.includes(clubId) ? prev.filter((id) => id !== clubId) : [...prev, clubId]
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        authScreen,
        screen,
        courts,
        clubs,
        bookings,
        usersList,
        servicesList,
        transactionsList,
        logsList,
        favorites,
        setAuthScreen,
        navigate,
        handleLogin,
        handleLogout,
        handleConfirmBooking,
        handleCancelBooking,
        handleCourtStatusChange,
        handleAddCourt,
        handleUpdateCourtPrice,
        handleUpdateBookingStatus,
        handleAddWalkinBooking,
        handleToggleUserStatus,
        handleUpdateUserRole,
        handleAddUser,
        handleUpdateStock,
        handleAddService,
        handleToggleFavorite,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
