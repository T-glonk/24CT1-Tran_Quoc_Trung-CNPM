import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../context/AppContext';
import { COLORS as C } from '../constants/theme';
import { Header } from '../components/common/Header';

// Auth Screens
import { WelcomeScreen } from '../screens/auth/WelcomeScreen';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';

// Customer Screens
import { HomeScreen } from '../screens/customer/HomeScreen';
import { BookingScreen } from '../screens/customer/BookingScreen';
import { MyBookingsScreen } from '../screens/customer/MyBookingsScreen';
import { FavoritesScreen } from '../screens/customer/FavoritesScreen';
import { ExploreScreen } from '../screens/customer/ExploreScreen';
import { AccountScreen } from '../screens/customer/AccountScreen';
import { MapScreen } from '../screens/map/MapScreen';

// Admin Screens
import { AdminHomeScreen } from '../screens/admin/AdminHomeScreen';
import { AdminCourtsScreen } from '../screens/admin/AdminCourtsScreen';
import { AdminScheduleScreen } from '../screens/admin/AdminScheduleScreen';
import { AdminBookingsScreen } from '../screens/admin/AdminBookingsScreen';
import { AdminCustomersScreen } from '../screens/admin/AdminCustomersScreen';
import { AdminUsersScreen } from '../screens/admin/AdminUsersScreen';
import { AdminServicesScreen } from '../screens/admin/AdminServicesScreen';
import { AdminTransactionsScreen } from '../screens/admin/AdminTransactionsScreen';
import { AdminReportsScreen } from '../screens/admin/AdminReportsScreen';
import { AdminSettingsScreen } from '../screens/admin/AdminSettingsScreen';
import { AdminProfileScreen } from '../screens/admin/AdminProfileScreen';

// Navigation Bar
import { BottomTabBar } from './BottomTabBar';

export function AppNavigator() {
  const {
    currentUser,
    authScreen,
    screen,
    courts,
    clubs,
    selectedClub,
    setSelectedClub,
    selectClubAndBook,
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
  } = useApp();

  // ── 1. AUTH FLOW ──
  if (!currentUser) {
    if (authScreen === 'welcome') {
      return (
        <SafeAreaView style={st.root}>
          <StatusBar style="light" />
          <WelcomeScreen navigate={setAuthScreen} />
        </SafeAreaView>
      );
    }
    if (authScreen === 'login') {
      return (
        <SafeAreaView style={st.root}>
          <StatusBar style="light" />
          <Header title="Đăng nhập" onBack={() => setAuthScreen('welcome')} />
          <LoginScreen navigate={setAuthScreen} onLogin={handleLogin} />
        </SafeAreaView>
      );
    }
    if (authScreen === 'register') {
      return (
        <SafeAreaView style={st.root}>
          <StatusBar style="light" />
          <Header title="Tạo tài khoản" onBack={() => setAuthScreen('login')} />
          <RegisterScreen navigate={setAuthScreen} onLogin={handleLogin} />
        </SafeAreaView>
      );
    }
  }

  // ── 2. MAIN APPLICATION ──
  const isAdmin = currentUser.role === 'admin';

  const renderAdminHeader = (title) => (
    <View style={st.adminSubHeader}>
      <TouchableOpacity onPress={() => navigate('adminHome')} style={st.adminBackBtn}>
        <Text style={st.adminBackBtnText}>← Tổng quan</Text>
      </TouchableOpacity>
      <Text style={st.adminSubHeaderTitle}>{title}</Text>
      <View style={{ width: 60 }} />
    </View>
  );

  const renderScreen = () => {
    switch (screen) {
      // ── Customer Screens ──
      case 'home':
        return (
          <HomeScreen
            user={currentUser}
            navigate={navigate}
            clubs={clubs}
            bookings={bookings}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectClub={selectClubAndBook}
          />
        );
      case 'mapTab':
        return (
          <MapScreen
            navigate={navigate}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'booking':
        return (
          <BookingScreen
            user={currentUser}
            courts={courts}
            clubs={clubs}
            selectedClub={selectedClub}
            onSelectClub={setSelectedClub}
            navigate={navigate}
            onConfirm={handleConfirmBooking}
          />
        );
      case 'myBookings':
        return (
          <MyBookingsScreen
            bookings={bookings}
            user={currentUser}
            navigate={navigate}
            onCancelBooking={(id) => handleCancelBooking(id, 'Khách tự hủy')}
          />
        );
      case 'favorites':
        return <FavoritesScreen favorites={favorites} navigate={navigate} />;
      case 'explore':
        return (
          <ExploreScreen
            navigate={navigate}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
      case 'account':
        return (
          <AccountScreen
            user={currentUser}
            navigate={navigate}
            bookings={bookings}
            onLogout={handleLogout}
          />
        );

      // ── Admin Screens ──
      case 'adminHome':
        return (
          <AdminHomeScreen
            user={currentUser}
            navigate={navigate}
            bookings={bookings}
            courts={courts}
            clubs={clubs}
            selectedClub={selectedClub}
            onSelectClub={setSelectedClub}
            services={servicesList}
            transactions={transactionsList}
            onUpdateCourtStatus={handleCourtStatusChange}
            onApproveBooking={(id) => handleUpdateBookingStatus(id, 'confirmed')}
            onLogout={handleLogout}
          />
        );
      case 'adminCourts':
        return (
          <View style={{ flex: 1 }}>
            {renderAdminHeader('2.1 & 2.8 Quản Lý Sân & Trạng Thái')}
            <AdminCourtsScreen
              courts={courts}
              clubs={clubs}
              selectedClub={selectedClub}
              onSelectClub={setSelectedClub}
              onToggleStatus={handleCourtStatusChange}
              onAddCourt={handleAddCourt}
              onUpdatePrice={handleUpdateCourtPrice}
            />
          </View>
        );
      case 'adminSchedule':
        return (
          <View style={{ flex: 1 }}>
            {renderAdminHeader('2.2 Lịch Real-time & Đặt Tại Quầy')}
            <AdminScheduleScreen
              courts={courts}
              clubs={clubs}
              selectedClub={selectedClub}
              onSelectClub={setSelectedClub}
              onAddWalkinBooking={handleAddWalkinBooking}
            />
          </View>
        );
      case 'adminBookings':
        return (
          <View style={{ flex: 1 }}>
            {renderAdminHeader('2.3 Quản Lý & Duyệt Đơn Đặt Sân')}
            <AdminBookingsScreen
              bookings={bookings}
              clubs={clubs}
              selectedClub={selectedClub}
              onSelectClub={setSelectedClub}
              onUpdateStatus={handleUpdateBookingStatus}
              onCancelBooking={handleCancelBooking}
            />
          </View>
        );
      case 'adminUsers':
        return (
          <View style={{ flex: 1 }}>
            {renderAdminHeader('2.4 & 2.11 Tài Khoản & Phân Quyền')}
            <AdminUsersScreen
              users={usersList}
              onToggleUserStatus={handleToggleUserStatus}
              onUpdateUserRole={handleUpdateUserRole}
              onAddUser={handleAddUser}
            />
          </View>
        );
      case 'adminCustomers':
        return (
          <View style={{ flex: 1 }}>
            {renderAdminHeader('2.5 Khách Hàng CRM & Hội Viên')}
            <AdminCustomersScreen users={usersList} bookings={bookings} />
          </View>
        );
      case 'adminServices':
        return (
          <View style={{ flex: 1 }}>
            {renderAdminHeader('2.6 Bán Hàng POS & Kho Dịch Vụ')}
            <AdminServicesScreen
              services={servicesList}
              onUpdateStock={handleUpdateStock}
              onAddService={handleAddService}
            />
          </View>
        );
      case 'adminTransactions':
        return (
          <View style={{ flex: 1 }}>
            {renderAdminHeader('2.7 Sổ Quỹ & Giao Dịch Thu Chi')}
            <AdminTransactionsScreen transactions={transactionsList} />
          </View>
        );
      case 'adminReports':
        return (
          <View style={{ flex: 1 }}>
            {renderAdminHeader('2.9 & 2.10 Thống Kê & Báo Cáo')}
            <AdminReportsScreen bookings={bookings} courts={courts} />
          </View>
        );
      case 'adminSettings':
        return (
          <View style={{ flex: 1 }}>
            {renderAdminHeader('2.11 Cài Đặt Hệ Thống & Audit Logs')}
            <AdminSettingsScreen logs={logsList} onLogout={handleLogout} />
          </View>
        );
      case 'adminProfile':
        return (
          <AdminProfileScreen
            user={currentUser}
            onLogout={handleLogout}
            navigate={navigate}
          />
        );

      default:
        return (
          <HomeScreen
            user={currentUser}
            navigate={navigate}
            bookings={bookings}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        );
    }
  };

  return (
    <SafeAreaView style={st.root}>
      <StatusBar style="light" />

      {/* Screen Content */}
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      {/* Bottom Tab Bar */}
      <BottomTabBar screen={screen} navigate={navigate} isAdmin={isAdmin} />
    </SafeAreaView>
  );
}

const st = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  adminSubHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#15803d',
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  adminBackBtn: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  adminBackBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  adminSubHeaderTitle: { color: '#fff', fontSize: 14, fontWeight: '800' },
});
