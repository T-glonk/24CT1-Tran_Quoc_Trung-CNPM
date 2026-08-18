import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Platform,
} from 'react-native';

// ─── DATA ────────────────────────────────────────────────────────────────────

const COURTS = [
  { id: '1', name: 'Sân A1', location: 'Tòa nhà A - Tầng 1', price: 80000, status: 'available' },
  { id: '2', name: 'Sân A2', location: 'Tòa nhà A - Tầng 1', price: 80000, status: 'booked' },
  { id: '3', name: 'Sân B1', location: 'Tòa nhà B - Tầng 2', price: 100000, status: 'available' },
  { id: '4', name: 'Sân B2', location: 'Tòa nhà B - Tầng 2', price: 100000, status: 'available' },
  { id: '5', name: 'Sân C1', location: 'Nhà thi đấu C', price: 120000, status: 'booked' },
  { id: '6', name: 'Sân C2', location: 'Nhà thi đấu C', price: 120000, status: 'available' },
];

const TIME_SLOTS = [
  '07:00 - 08:00',
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
  '18:00 - 19:00',
  '19:00 - 20:00',
  '20:00 - 21:00',
];

// ─── SCREENS ─────────────────────────────────────────────────────────────────

function HomeScreen({ navigate, bookings }) {
  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Welcome Banner */}
      <View style={styles.banner}>
        <Text style={styles.bannerEmoji}>🏸</Text>
        <Text style={styles.bannerTitle}>CHÀO CÁC BẠN 24CT1</Text>
        <Text style={styles.bannerSubtitle}>ĐẾN VỚI HỌC PHẦN NÀY</Text>
        <View style={styles.bannerDivider} />
        <Text style={styles.bannerDesc}>Hệ thống đặt sân cầu lông trực tuyến</Text>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{COURTS.filter(c => c.status === 'available').length}</Text>
          <Text style={styles.statLabel}>Sân trống</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{COURTS.length}</Text>
          <Text style={styles.statLabel}>Tổng sân</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNum}>{bookings.length}</Text>
          <Text style={styles.statLabel}>Đặt của bạn</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#16a34a' }]} onPress={() => navigate('courts')}>
          <Text style={styles.actionIcon}>🏟️</Text>
          <Text style={styles.actionLabel}>Đặt sân</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#2563eb' }]} onPress={() => navigate('bookings')}>
          <Text style={styles.actionIcon}>📋</Text>
          <Text style={styles.actionLabel}>Lịch của tôi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionCard, { backgroundColor: '#7c3aed' }]} onPress={() => navigate('courts')}>
          <Text style={styles.actionIcon}>🔍</Text>
          <Text style={styles.actionLabel}>Xem sân</Text>
        </TouchableOpacity>
      </View>

      {/* Available courts preview */}
      <Text style={styles.sectionTitle}>Sân đang trống</Text>
      {COURTS.filter(c => c.status === 'available').slice(0, 3).map(court => (
        <TouchableOpacity key={court.id} style={styles.courtPreviewCard} onPress={() => navigate('courts')}>
          <View style={styles.courtPreviewLeft}>
            <Text style={styles.courtPreviewName}>{court.name}</Text>
            <Text style={styles.courtPreviewLocation}>📍 {court.location}</Text>
          </View>
          <View style={styles.courtPreviewRight}>
            <Text style={styles.courtPreviewPrice}>{court.price.toLocaleString('vi-VN')}đ/h</Text>
            <View style={styles.availableBadge}>
              <Text style={styles.availableText}>Trống</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function CourtsScreen({ navigate, onSelectCourt }) {
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? COURTS : COURTS.filter(c => c.status === filter);

  return (
    <View style={styles.screen}>
      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {['all', 'available', 'booked'].map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
              {f === 'all' ? 'Tất cả' : f === 'available' ? '✅ Còn trống' : '❌ Đã đặt'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.courtCard}>
            <View style={styles.courtCardHeader}>
              <Text style={styles.courtName}>{item.name}</Text>
              <View style={[styles.statusBadge, { backgroundColor: item.status === 'available' ? '#16a34a' : '#dc2626' }]}>
                <Text style={styles.statusText}>{item.status === 'available' ? 'Còn trống' : 'Đã đặt'}</Text>
              </View>
            </View>
            <Text style={styles.courtLocation}>📍 {item.location}</Text>
            <View style={styles.courtCardFooter}>
              <Text style={styles.courtPrice}>💰 {item.price.toLocaleString('vi-VN')}đ / giờ</Text>
              {item.status === 'available' ? (
                <TouchableOpacity
                  style={styles.bookBtn}
                  onPress={() => { onSelectCourt(item); navigate('booking'); }}
                >
                  <Text style={styles.bookBtnText}>Đặt ngay</Text>
                </TouchableOpacity>
              ) : (
                <View style={styles.bookedBtn}>
                  <Text style={styles.bookedBtnText}>Không khả dụng</Text>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
}

function BookingScreen({ selectedCourt, navigate, onConfirmBooking }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');

  if (!selectedCourt) {
    return (
      <View style={[styles.screen, styles.centerContent]}>
        <Text style={styles.emptyIcon}>🏸</Text>
        <Text style={styles.emptyText}>Chưa chọn sân</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigate('courts')}>
          <Text style={styles.primaryBtnText}>Chọn sân ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleConfirm = () => {
    if (!name.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập tên của bạn'); return; }
    if (!phone.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại'); return; }
    if (!date.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập ngày đặt sân'); return; }
    if (!selectedSlot) { Alert.alert('Lỗi', 'Vui lòng chọn khung giờ'); return; }

    const booking = {
      id: Date.now().toString(),
      court: selectedCourt,
      name,
      phone,
      date,
      slot: selectedSlot,
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    onConfirmBooking(booking);
    Alert.alert(
      '✅ Đặt sân thành công!',
      `Sân: ${selectedCourt.name}\nNgày: ${date}\nGiờ: ${selectedSlot}\nTên: ${name}`,
      [{ text: 'Xem lịch của tôi', onPress: () => navigate('bookings') }]
    );
  };

  return (
    <ScrollView style={styles.screen} showsVerticalScrollIndicator={false}>
      {/* Court info */}
      <View style={styles.selectedCourtCard}>
        <Text style={styles.selectedCourtTitle}>🏟️ {selectedCourt.name}</Text>
        <Text style={styles.selectedCourtLocation}>📍 {selectedCourt.location}</Text>
        <Text style={styles.selectedCourtPrice}>💰 {selectedCourt.price.toLocaleString('vi-VN')}đ / giờ</Text>
      </View>

      {/* Form */}
      <Text style={styles.sectionTitle}>Thông tin đặt sân</Text>
      <View style={styles.formCard}>
        <Text style={styles.inputLabel}>Họ và tên *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên"
          placeholderTextColor="#94a3b8"
          value={name}
          onChangeText={setName}
        />
        <Text style={styles.inputLabel}>Số điện thoại *</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điện thoại"
          placeholderTextColor="#94a3b8"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <Text style={styles.inputLabel}>Ngày đặt sân * (dd/mm/yyyy)</Text>
        <TextInput
          style={styles.input}
          placeholder="VD: 18/08/2026"
          placeholderTextColor="#94a3b8"
          value={date}
          onChangeText={setDate}
        />
      </View>

      {/* Time slots */}
      <Text style={styles.sectionTitle}>Chọn khung giờ</Text>
      <View style={styles.slotGrid}>
        {TIME_SLOTS.map(slot => (
          <TouchableOpacity
            key={slot}
            style={[styles.slotBtn, selectedSlot === slot && styles.slotBtnActive]}
            onPress={() => setSelectedSlot(slot)}
          >
            <Text style={[styles.slotText, selectedSlot === slot && styles.slotTextActive]}>{slot}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Total */}
      {selectedSlot && (
        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Tổng tiền:</Text>
          <Text style={styles.totalAmount}>{selectedCourt.price.toLocaleString('vi-VN')}đ</Text>
        </View>
      )}

      <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
        <Text style={styles.confirmBtnText}>✅ Xác nhận đặt sân</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

function BookingsScreen({ bookings, navigate }) {
  if (bookings.length === 0) {
    return (
      <View style={[styles.screen, styles.centerContent]}>
        <Text style={styles.emptyIcon}>📋</Text>
        <Text style={styles.emptyText}>Bạn chưa có lịch đặt sân nào</Text>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => navigate('courts')}>
          <Text style={styles.primaryBtnText}>Đặt sân ngay</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.screen}
      data={bookings}
      keyExtractor={item => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View style={styles.bookingCard}>
          <View style={styles.bookingCardHeader}>
            <Text style={styles.bookingCourtName}>{item.court.name}</Text>
            <View style={styles.confirmedBadge}>
              <Text style={styles.confirmedText}>✅ Đã đặt</Text>
            </View>
          </View>
          <View style={styles.bookingRow}>
            <Text style={styles.bookingIcon}>📅</Text>
            <Text style={styles.bookingInfo}>{item.date} — {item.slot}</Text>
          </View>
          <View style={styles.bookingRow}>
            <Text style={styles.bookingIcon}>👤</Text>
            <Text style={styles.bookingInfo}>{item.name}</Text>
          </View>
          <View style={styles.bookingRow}>
            <Text style={styles.bookingIcon}>📞</Text>
            <Text style={styles.bookingInfo}>{item.phone}</Text>
          </View>
          <View style={styles.bookingRow}>
            <Text style={styles.bookingIcon}>📍</Text>
            <Text style={styles.bookingInfo}>{item.court.location}</Text>
          </View>
          <View style={styles.bookingFooter}>
            <Text style={styles.bookingPrice}>💰 {item.court.price.toLocaleString('vi-VN')}đ</Text>
            <Text style={styles.bookingCreated}>Đặt lúc: {item.createdAt}</Text>
          </View>
        </View>
      )}
    />
  );
}

// ─── BOTTOM TAB BAR ───────────────────────────────────────────────────────────

const TABS = [
  { key: 'home', label: 'Trang chủ', icon: '🏠' },
  { key: 'courts', label: 'Sân', icon: '🏟️' },
  { key: 'booking', label: 'Đặt sân', icon: '🏸' },
  { key: 'bookings', label: 'Lịch của tôi', icon: '📋' },
];

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [screen, setScreen] = useState('home');
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [bookings, setBookings] = useState([]);

  const navigate = (s) => setScreen(s);

  const handleSelectCourt = (court) => {
    setSelectedCourt(court);
  };

  const handleConfirmBooking = (booking) => {
    setBookings(prev => [booking, ...prev]);
  };

  const renderScreen = () => {
    switch (screen) {
      case 'home':
        return <HomeScreen navigate={navigate} bookings={bookings} />;
      case 'courts':
        return <CourtsScreen navigate={navigate} onSelectCourt={handleSelectCourt} />;
      case 'booking':
        return <BookingScreen selectedCourt={selectedCourt} navigate={navigate} onConfirmBooking={handleConfirmBooking} />;
      case 'bookings':
        return <BookingsScreen bookings={bookings} navigate={navigate} />;
      default:
        return <HomeScreen navigate={navigate} bookings={bookings} />;
    }
  };

  const screenTitles = {
    home: 'Trang chủ',
    courts: 'Danh sách sân',
    booking: 'Đặt sân',
    bookings: 'Lịch của tôi',
  };

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerLogo}>🏸</Text>
        <Text style={styles.headerTitle}>{screenTitles[screen]}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Content */}
      <View style={{ flex: 1 }}>
        {renderScreen()}
      </View>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabItem}
            onPress={() => navigate(tab.key)}
          >
            <Text style={[styles.tabIcon, screen === tab.key && styles.tabIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, screen === tab.key && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────

const COLORS = {
  primary: '#16a34a',
  bg: '#0f172a',
  card: '#1e293b',
  border: '#334155',
  text: '#f1f5f9',
  subtext: '#94a3b8',
  accent: '#22c55e',
};

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  screen: { flex: 1, backgroundColor: COLORS.bg },
  centerContent: { alignItems: 'center', justifyContent: 'center', padding: 24 },

  // Header
  header: {
    backgroundColor: COLORS.card,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  headerLogo: { fontSize: 28 },
  headerTitle: { color: COLORS.text, fontSize: 18, fontWeight: '700' },

  // Banner
  banner: {
    margin: 16,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#16a34a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
  },
  bannerEmoji: { fontSize: 48, marginBottom: 8 },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '900', textAlign: 'center', letterSpacing: 1 },
  bannerSubtitle: { color: '#dcfce7', fontSize: 16, fontWeight: '700', textAlign: 'center', marginTop: 4 },
  bannerDivider: { width: 60, height: 2, backgroundColor: '#fff', opacity: 0.4, marginVertical: 12 },
  bannerDesc: { color: '#dcfce7', fontSize: 13, textAlign: 'center' },

  // Stats
  statsRow: { flexDirection: 'row', marginHorizontal: 16, gap: 8, marginBottom: 4 },
  statCard: {
    flex: 1, backgroundColor: COLORS.card, borderRadius: 12, padding: 14,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.border,
  },
  statNum: { color: COLORS.accent, fontSize: 26, fontWeight: '800' },
  statLabel: { color: COLORS.subtext, fontSize: 11, marginTop: 2 },

  // Section title
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '700', marginHorizontal: 16, marginTop: 20, marginBottom: 8 },

  // Action cards
  actionRow: { flexDirection: 'row', marginHorizontal: 16, gap: 10 },
  actionCard: {
    flex: 1, borderRadius: 14, padding: 16, alignItems: 'center',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4,
  },
  actionIcon: { fontSize: 28, marginBottom: 6 },
  actionLabel: { color: '#fff', fontSize: 12, fontWeight: '700' },

  // Court preview
  courtPreviewCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: COLORS.card, marginHorizontal: 16, marginBottom: 8,
    borderRadius: 12, padding: 14, borderWidth: 1, borderColor: COLORS.border,
  },
  courtPreviewLeft: { flex: 1 },
  courtPreviewName: { color: COLORS.text, fontSize: 15, fontWeight: '700' },
  courtPreviewLocation: { color: COLORS.subtext, fontSize: 12, marginTop: 2 },
  courtPreviewRight: { alignItems: 'flex-end' },
  courtPreviewPrice: { color: COLORS.accent, fontSize: 13, fontWeight: '700' },
  availableBadge: { backgroundColor: '#166534', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2, marginTop: 4 },
  availableText: { color: '#86efac', fontSize: 11, fontWeight: '600' },

  // Filter
  filterRow: { flexDirection: 'row', padding: 12, gap: 8, backgroundColor: COLORS.card, borderBottomWidth: 1, borderBottomColor: COLORS.border },
  filterBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center', backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border },
  filterBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterText: { color: COLORS.subtext, fontSize: 12, fontWeight: '600' },
  filterTextActive: { color: '#fff' },

  // Court card
  courtCard: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  courtCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  courtName: { color: COLORS.text, fontSize: 17, fontWeight: '700' },
  statusBadge: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 3 },
  statusText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  courtLocation: { color: COLORS.subtext, fontSize: 13, marginBottom: 12 },
  courtCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courtPrice: { color: COLORS.accent, fontSize: 14, fontWeight: '700' },
  bookBtn: { backgroundColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  bookBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  bookedBtn: { backgroundColor: COLORS.border, borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8 },
  bookedBtnText: { color: COLORS.subtext, fontSize: 13 },

  // Selected court
  selectedCourtCard: {
    margin: 16, backgroundColor: '#166534', borderRadius: 14, padding: 16,
    borderWidth: 1, borderColor: '#16a34a',
  },
  selectedCourtTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 6 },
  selectedCourtLocation: { color: '#dcfce7', fontSize: 13, marginBottom: 4 },
  selectedCourtPrice: { color: '#86efac', fontSize: 15, fontWeight: '700' },

  // Form
  formCard: { marginHorizontal: 16, backgroundColor: COLORS.card, borderRadius: 14, padding: 16, borderWidth: 1, borderColor: COLORS.border },
  inputLabel: { color: COLORS.subtext, fontSize: 13, fontWeight: '600', marginBottom: 6, marginTop: 10 },
  input: {
    backgroundColor: COLORS.bg, borderWidth: 1, borderColor: COLORS.border,
    borderRadius: 8, padding: 12, color: COLORS.text, fontSize: 15,
  },

  // Slots
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 16, gap: 8 },
  slotBtn: {
    backgroundColor: COLORS.card, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 9,
    borderWidth: 1, borderColor: COLORS.border,
  },
  slotBtnActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  slotText: { color: COLORS.subtext, fontSize: 13, fontWeight: '600' },
  slotTextActive: { color: '#fff' },

  // Total
  totalCard: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginHorizontal: 16, marginTop: 16, backgroundColor: '#166534',
    borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#16a34a',
  },
  totalLabel: { color: '#dcfce7', fontSize: 15, fontWeight: '600' },
  totalAmount: { color: '#86efac', fontSize: 20, fontWeight: '800' },

  // Confirm
  confirmBtn: {
    marginHorizontal: 16, marginTop: 16, backgroundColor: COLORS.primary,
    borderRadius: 12, padding: 16, alignItems: 'center',
  },
  confirmBtnText: { color: '#fff', fontSize: 16, fontWeight: '800' },

  // Primary button
  primaryBtn: { backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 14, marginTop: 16 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // Empty state
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyText: { color: COLORS.subtext, fontSize: 16, textAlign: 'center' },

  // Booking card
  bookingCard: {
    backgroundColor: COLORS.card, borderRadius: 14, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  bookingCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  bookingCourtName: { color: COLORS.text, fontSize: 16, fontWeight: '700' },
  confirmedBadge: { backgroundColor: '#166534', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  confirmedText: { color: '#86efac', fontSize: 12, fontWeight: '600' },
  bookingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  bookingIcon: { fontSize: 14, marginRight: 8 },
  bookingInfo: { color: COLORS.subtext, fontSize: 13 },
  bookingFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: COLORS.border },
  bookingPrice: { color: COLORS.accent, fontSize: 15, fontWeight: '700' },
  bookingCreated: { color: COLORS.subtext, fontSize: 11 },

  // Tab bar
  tabBar: {
    flexDirection: 'row', backgroundColor: COLORS.card,
    borderTopWidth: 1, borderTopColor: COLORS.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 6,
    paddingTop: 8,
  },
  tabItem: { flex: 1, alignItems: 'center' },
  tabIcon: { fontSize: 22 },
  tabIconActive: {},
  tabLabel: { color: COLORS.subtext, fontSize: 11, marginTop: 2 },
  tabLabelActive: { color: COLORS.accent, fontWeight: '700' },
});
