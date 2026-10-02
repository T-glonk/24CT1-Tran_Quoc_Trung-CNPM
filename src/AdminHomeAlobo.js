import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  TextInput,
  Modal,
  Alert,
  Platform,
  Dimensions,
} from 'react-native';
import {
  COLORS as C,
  USERS_DB,
  COURTS_DATA,
  SERVICES_DATA,
  INITIAL_ADMIN_BOOKINGS,
  TRANSACTIONS_DATA,
  ACTIVITY_LOGS,
  HOURS,
  CLUBS,
} from './data';

const { width } = Dimensions.get('window');

// ─── ALOBO STYLES & COLOR PALETTE ───────────────────────────────────────────
const ALOBO = {
  primary: '#16a34a',       // Alobo Emerald Green
  primaryDark: '#15803d',
  primaryLight: '#dcfce7',
  accent: '#22c55e',
  bg: '#f1f5f9',            // Modern Light Background
  card: '#ffffff',          // Pure White Cards
  cardBorder: '#e2e8f0',
  text: '#0f172a',          // Dark Slate
  textSub: '#64748b',       // Muted Slate
  danger: '#ef4444',
  dangerLight: '#fee2e2',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  info: '#0284c7',
  infoLight: '#e0f2fe',
  purple: '#7c3aed',
  purpleLight: '#f3e8ff',
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ALOBO ADMIN DASHBOARD (TRANG CHỦ QUẢN LÝ CHUẨN ALOBO SPORT)
// ═══════════════════════════════════════════════════════════════════════════════
export function AdminHome({
  user,
  navigate,
  bookings = INITIAL_ADMIN_BOOKINGS,
  courts = COURTS_DATA,
  services = SERVICES_DATA,
  transactions = TRANSACTIONS_DATA,
  onUpdateCourtStatus,
  onApproveBooking,
}) {
  const [selectedClub, setSelectedClub] = useState(CLUBS[0]);
  const [clubModalVisible, setClubModalVisible] = useState(false);
  const [quickCheckinModal, setQuickCheckinModal] = useState(false);
  const [searchPhone, setSearchPhone] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('today'); // today | week | month

  const today = new Date().toLocaleDateString('vi-VN');

  // Stats
  const totalRevenue = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const availableCourts = courts.filter((c) => c.status === 'available').length;
  const inUseCourts = courts.filter((c) => c.status === 'in_use').length;
  const bookedCourts = courts.filter((c) => c.status === 'booked').length;
  const maintenanceCourts = courts.filter((c) => c.status === 'maintenance').length;
  const pendingOrders = bookings.filter((b) => b.status === 'pending');

  const handleQuickCheckinSearch = () => {
    if (!searchPhone.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập SĐT hoặc mã đơn để tìm kiếm');
      return;
    }
    const found = bookings.find(
      (b) => b.userPhone.includes(searchPhone) || b.id.toLowerCase().includes(searchPhone.toLowerCase())
    );
    if (found) {
      Alert.alert(
        'Tìm thấy đơn đặt!',
        `Khách: ${found.userName}\nSân: ${found.court?.name}\nGiờ: ${found.slot}\nTrạng thái: ${found.status}`,
        [
          { text: 'Đóng' },
          {
            text: '🏸 Check-in Vào Sân',
            onPress: () => {
              if (onUpdateCourtStatus && found.court) {
                onUpdateCourtStatus(found.court.id, 'in_use');
              }
              setQuickCheckinModal(false);
              setSearchPhone('');
              Alert.alert('Thành công', `Đã check-in cho khách ${found.userName}!`);
            },
          },
        ]
      );
    } else {
      Alert.alert('Không tìm thấy', 'Không có đơn đặt nào trùng khớp với thông tin này.');
    }
  };

  return (
    <ScrollView style={al.container} showsVerticalScrollIndicator={false}>
      {/* ── ALOBO TOP BAR ── */}
      <View style={al.topBar}>
        <View style={{ flex: 1 }}>
          <Text style={al.topBarSub}>ALOBO QUẢN LÝ SÂN · CA SÁNG</Text>
          <TouchableOpacity style={al.clubSelector} onPress={() => setClubModalVisible(true)}>
            <Text style={al.clubSelectorName} numberOfLines={1}>🏸 {selectedClub.name}</Text>
            <Text style={{ color: '#fff', fontSize: 12, marginLeft: 4 }}>▼</Text>
          </TouchableOpacity>
        </View>

        <View style={al.topBarActions}>
          <TouchableOpacity style={al.iconBtn} onPress={() => setQuickCheckinModal(true)}>
            <Text style={{ fontSize: 18 }}>📷</Text>
          </TouchableOpacity>
          <TouchableOpacity style={al.iconBtn} onPress={() => navigate('adminBookings')}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
            {pendingOrders.length > 0 && (
              <View style={al.badgeDot}>
                <Text style={al.badgeDotText}>{pendingOrders.length}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={al.avatarBtn} onPress={() => navigate('adminProfile')}>
            <Text style={{ fontSize: 16 }}>🛡️</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── ALOBO FLOATING KPI CARD (DOANH THU & CÔNG SUẤT) ── */}
      <View style={al.kpiCard}>
        <View style={al.kpiHeader}>
          <View>
            <Text style={al.kpiLabel}>DOANH THU HÔM NAY ({today})</Text>
            <Text style={al.kpiValue}>{(totalRevenue).toLocaleString('vi-VN')} <Text style={{ fontSize: 15, fontWeight: '700' }}>đ</Text></Text>
          </View>
          <View style={al.kpiOccupancyBadge}>
            <Text style={al.kpiOccupancyText}>🔥 {Math.round(((inUseCourts + bookedCourts) / courts.length) * 100)}% Công suất</Text>
          </View>
        </View>

        <View style={al.kpiDivider} />

        {/* 4 Mini Metrics */}
        <View style={al.kpiGrid}>
          <View style={al.kpiItem}>
            <Text style={al.kpiItemNum}>{inUseCourts}</Text>
            <Text style={[al.kpiItemLabel, { color: ALOBO.danger }]}>🔴 Đang đá</Text>
          </View>
          <View style={al.kpiItem}>
            <Text style={al.kpiItemNum}>{availableCourts}</Text>
            <Text style={[al.kpiItemLabel, { color: ALOBO.primary }]}>🟢 Sân trống</Text>
          </View>
          <View style={al.kpiItem}>
            <Text style={al.kpiItemNum}>{bookedCourts}</Text>
            <Text style={[al.kpiItemLabel, { color: ALOBO.warning }]}>🟡 Đã đặt</Text>
          </View>
          <View style={al.kpiItem}>
            <Text style={al.kpiItemNum}>{maintenanceCourts}</Text>
            <Text style={[al.kpiItemLabel, { color: ALOBO.textSub }]}>⚙️ Bảo trì</Text>
          </View>
        </View>
      </View>

      {/* ── ALOBO FAST ACTION BAR (4 NÚT THAO TÁC NHANH TẠI QUẦY) ── */}
      <View style={al.quickActionsRow}>
        <TouchableOpacity style={[al.quickActionBtn, { backgroundColor: '#ecfdf5' }]} onPress={() => navigate('adminSchedule')}>
          <View style={[al.quickActionIconBox, { backgroundColor: ALOBO.primary }]}>
            <Text style={{ fontSize: 20, color: '#fff' }}>⚡</Text>
          </View>
          <Text style={al.quickActionTitle}>Đặt tại quầy</Text>
          <Text style={al.quickActionSub}>Tạo đơn nhanh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[al.quickActionBtn, { backgroundColor: '#f0f9ff' }]} onPress={() => setQuickCheckinModal(true)}>
          <View style={[al.quickActionIconBox, { backgroundColor: ALOBO.info }]}>
            <Text style={{ fontSize: 20, color: '#fff' }}>🔍</Text>
          </View>
          <Text style={al.quickActionTitle}>Check-in</Text>
          <Text style={al.quickActionSub}>Tra cứu SĐT/QR</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[al.quickActionBtn, { backgroundColor: '#fefce8' }]} onPress={() => navigate('adminServices')}>
          <View style={[al.quickActionIconBox, { backgroundColor: ALOBO.warning }]}>
            <Text style={{ fontSize: 20, color: '#fff' }}>🥤</Text>
          </View>
          <Text style={al.quickActionTitle}>Bán nước POS</Text>
          <Text style={al.quickActionSub}>Cầu & Vợt</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[al.quickActionBtn, { backgroundColor: '#faf5ff' }]} onPress={() => navigate('adminTransactions')}>
          <View style={[al.quickActionIconBox, { backgroundColor: ALOBO.purple }]}>
            <Text style={{ fontSize: 20, color: '#fff' }}>💳</Text>
          </View>
          <Text style={al.quickActionTitle}>Sổ quỹ ca</Text>
          <Text style={al.quickActionSub}>Tiền mặt & QR</Text>
        </TouchableOpacity>
      </View>

      {/* ── ALOBO PENDING BOOKINGS ALERT (ĐƠN KHÁCH ĐẶT ONLINE CẦN DUYỆT) ── */}
      {pendingOrders.length > 0 && (
        <View style={al.pendingSection}>
          <View style={al.sectionHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 16 }}>⏳</Text>
              <Text style={al.sectionTitle}>Đơn trực tuyến chờ duyệt</Text>
              <View style={al.badgeCount}>
                <Text style={al.badgeCountText}>{pendingOrders.length}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => navigate('adminBookings')}>
              <Text style={al.linkText}>Xem tất cả ›</Text>
            </TouchableOpacity>
          </View>

          {pendingOrders.map((order) => (
            <View key={order.id} style={al.pendingCard}>
              <View style={al.pendingTop}>
                <View>
                  <Text style={al.pendingCustName}>{order.userName}</Text>
                  <Text style={al.pendingPhone}>📞 {order.userPhone}</Text>
                </View>
                <Text style={al.pendingPrice}>{(order.grandTotal || order.totalPrice).toLocaleString('vi-VN')} đ</Text>
              </View>

              <View style={al.pendingInfoRow}>
                <Text style={al.pendingCourt}>🏟️ {order.court?.name}</Text>
                <Text style={al.pendingTime}>⏰ {order.date} ({order.slot})</Text>
              </View>

              {order.note ? <Text style={al.pendingNote}>📝 "{order.note}"</Text> : null}

              <View style={al.pendingActions}>
                <TouchableOpacity
                  style={al.btnApproveAlobo}
                  onPress={() => {
                    if (onApproveBooking) onApproveBooking(order.id);
                    Alert.alert('✅ Thành công', `Đã duyệt đơn cho khách ${order.userName}`);
                  }}
                >
                  <Text style={al.btnApproveAloboText}>✓ XÁC NHẬN ĐƠN</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* ── ALOBO LIVE COURT MONITOR (SƠ ĐỒ TRẠNG THÁI SÂN TRỰC TIẾP) ── */}
      <View style={al.sectionContainer}>
        <View style={al.sectionHeader}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 16 }}>🏟️</Text>
            <Text style={al.sectionTitle}>Sơ đồ 8 sân trực tiếp</Text>
          </View>
          <TouchableOpacity onPress={() => navigate('adminCourts')}>
            <Text style={al.linkText}>Cài đặt sân ›</Text>
          </TouchableOpacity>
        </View>

        <View style={al.courtsGrid}>
          {courts.map((court) => {
            let statusColor = ALOBO.primary;
            let statusBg = '#dcfce7';
            let statusText = 'Trống';
            let icon = '🟢';

            if (court.status === 'in_use') {
              statusColor = ALOBO.danger;
              statusBg = '#fee2e2';
              statusText = 'Đang đá';
              icon = '🔴';
            } else if (court.status === 'booked') {
              statusColor = ALOBO.warning;
              statusBg = '#fef3c7';
              statusText = 'Đã đặt';
              icon = '🟡';
            } else if (court.status === 'maintenance') {
              statusColor = '#64748b';
              statusBg = '#f1f5f9';
              statusText = 'Bảo trì';
              icon = '⚙️';
            }

            return (
              <TouchableOpacity
                key={court.id}
                style={[al.courtCardAlobo, { borderColor: statusColor }]}
                onPress={() => {
                  Alert.alert(
                    court.name,
                    `Giá: ${court.price.toLocaleString('vi-VN')} đ/h\nTrạng thái: ${statusText}\nKhách: ${court.currentGuest || 'Chưa có'}`,
                    [
                      { text: 'Đóng' },
                      {
                        text: court.status === 'available' ? '🏸 Nhận Khách Đá' : '🟢 Trả Sân Trống',
                        onPress: () => {
                          if (onUpdateCourtStatus) {
                            onUpdateCourtStatus(court.id, court.status === 'available' ? 'in_use' : 'available');
                          }
                        },
                      },
                    ]
                  );
                }}
              >
                <View style={al.courtCardTop}>
                  <Text style={al.courtCardName}>{court.name.replace('Sân ', 'S#')}</Text>
                  <View style={[al.courtStatusBadge, { backgroundColor: statusBg }]}>
                    <Text style={[al.courtStatusBadgeText, { color: statusColor }]}>{icon} {statusText}</Text>
                  </View>
                </View>

                <Text style={al.courtCardPrice}>{court.price.toLocaleString('vi-VN')} đ/h</Text>

                <View style={al.courtCardBottom}>
                  <Text style={al.courtCardGuest} numberOfLines={1}>
                    {court.currentGuest ? court.currentGuest.split('(')[0] : 'Sẵn sàng'}
                  </Text>
                  {court.currentSlot ? (
                    <Text style={al.courtCardTime}>⏰ {court.currentSlot}</Text>
                  ) : (
                    <Text style={al.courtCardActionHint}>Chạm để thao tác ›</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── ALOBO MANAGEMENT MENU GRID (DANH MỤC TIỆN ÍCH ALOBO) ── */}
      <View style={al.sectionContainer}>
        <Text style={al.sectionTitle}>📋 Danh mục quản trị hệ thống</Text>
        <View style={al.menuGrid}>
          {[
            { icon: '🏟️', title: 'Quản lý Sân', desc: 'Giá & Thông tin', screen: 'adminCourts', bg: '#ecfdf5', iconBg: ALOBO.primary },
            { icon: '📅', title: 'Lịch Real-time', desc: 'Ma trận & Timeline', screen: 'adminSchedule', bg: '#f0f9ff', iconBg: ALOBO.info },
            { icon: '📋', title: 'Đơn Đặt Sân', desc: `${bookings.length} đơn`, screen: 'adminBookings', bg: '#f3e8ff', iconBg: ALOBO.purple },
            { icon: '👥', title: 'Tài Khoản', desc: 'Phân quyền Staff', screen: 'adminUsers', bg: '#fef3c7', iconBg: ALOBO.warning },
            { icon: '💎', title: 'Khách Hàng', desc: 'Hội viên & CRM', screen: 'adminCustomers', bg: '#fdf2f8', iconBg: '#ec4899' },
            { icon: '🥤', title: 'Dịch Vụ & Kho', desc: 'Nước, Vợt, Cầu', screen: 'adminServices', bg: '#ecfdf5', iconBg: '#059669' },
            { icon: '💳', title: 'Sổ Quỹ & GD', desc: 'Tiền mặt & QR', screen: 'adminTransactions', bg: '#eff6ff', iconBg: '#2563eb' },
            { icon: '📊', title: 'Báo Cáo KPI', desc: 'Doanh thu & Giờ vàng', screen: 'adminReports', bg: '#fff7ed', iconBg: '#ea580c' },
            { icon: '⚙️', title: 'Cài Đặt', desc: 'Giờ mở cửa & Logs', screen: 'adminSettings', bg: '#f1f5f9', iconBg: '#475569' },
          ].map((item) => (
            <TouchableOpacity
              key={item.title}
              style={[al.menuCard, { backgroundColor: item.bg }]}
              onPress={() => item.screen && navigate(item.screen)}
            >
              <View style={[al.menuIconCircle, { backgroundColor: item.iconBg }]}>
                <Text style={{ fontSize: 20 }}>{item.icon}</Text>
              </View>
              <Text style={al.menuTitle}>{item.title}</Text>
              <Text style={al.menuDesc}>{item.desc}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Modal Switch Branch / Club ── */}
      <Modal visible={clubModalVisible} transparent animationType="fade">
        <View style={al.modalOverlay}>
          <View style={al.modalBox}>
            <Text style={al.modalTitle}>Chọn Câu Lạc Bộ / Chi Nhánh</Text>
            {CLUBS.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={[al.clubOption, selectedClub.id === c.id && al.clubOptionActive]}
                onPress={() => {
                  setSelectedClub(c);
                  setClubModalVisible(false);
                }}
              >
                <Text style={{ fontSize: 18, marginRight: 8 }}>🏸</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[al.clubOptionName, selectedClub.id === c.id && { color: ALOBO.primary, fontWeight: '800' }]}>{c.name}</Text>
                  <Text style={al.clubOptionAddr}>{c.address}</Text>
                </View>
                {selectedClub.id === c.id && <Text style={{ color: ALOBO.primary, fontWeight: '900' }}>✓</Text>}
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={al.modalBtnClose} onPress={() => setClubModalVisible(false)}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>ĐÓNG</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Modal Quick Check-in / Scan ── */}
      <Modal visible={quickCheckinModal} transparent animationType="slide">
        <View style={al.modalOverlay}>
          <View style={al.modalBox}>
            <Text style={al.modalTitle}>🔍 Check-in Nhanh Tại Quầy</Text>
            <Text style={{ color: ALOBO.textSub, fontSize: 13, marginBottom: 12 }}>
              Nhập Số điện thoại hoặc Mã đơn của khách để nhận sân:
            </Text>
            <TextInput
              style={al.modalInput}
              placeholder="VD: 0905591379 hoặc BK-1002"
              placeholderTextColor="#94a3b8"
              value={searchPhone}
              onChangeText={setSearchPhone}
              autoFocus
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={al.modalBtnCancel} onPress={() => setQuickCheckinModal(false)}>
                <Text style={{ color: ALOBO.text, fontWeight: '700' }}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={al.modalBtnConfirm} onPress={handleQuickCheckinSearch}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>TRA CỨU & CHECK-IN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// ALOBO ADMIN STYLESHEET
// ═══════════════════════════════════════════════════════════════════════════════
const al = StyleSheet.create({
  container: { flex: 1, backgroundColor: ALOBO.bg },

  // Top Bar
  topBar: {
    backgroundColor: ALOBO.primaryDark,
    paddingTop: Platform.OS === 'ios' ? 12 : 16,
    paddingBottom: 28,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBarSub: { color: '#bbf7d0', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  clubSelector: { flexDirection: 'row', alignItems: 'center', marginTop: 3 },
  clubSelectorName: { color: '#ffffff', fontSize: 16, fontWeight: '900', maxWidth: width * 0.58 },
  topBarActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#facc15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: ALOBO.danger,
    borderRadius: 8,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: '#fff',
  },
  badgeDotText: { color: '#fff', fontSize: 9, fontWeight: '900' },

  // KPI Floating Card
  kpiCard: {
    backgroundColor: ALOBO.card,
    marginHorizontal: 14,
    marginTop: -16,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: ALOBO.cardBorder,
  },
  kpiHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kpiLabel: { color: ALOBO.textSub, fontSize: 11, fontWeight: '700' },
  kpiValue: { color: ALOBO.primaryDark, fontSize: 24, fontWeight: '900', marginTop: 2 },
  kpiOccupancyBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  kpiOccupancyText: { color: '#b45309', fontSize: 11, fontWeight: '800' },
  kpiDivider: { height: 1, backgroundColor: ALOBO.cardBorder, marginVertical: 12 },
  kpiGrid: { flexDirection: 'row', justifyContent: 'space-between' },
  kpiItem: { alignItems: 'center', flex: 1 },
  kpiItemNum: { color: ALOBO.text, fontSize: 16, fontWeight: '900' },
  kpiItemLabel: { fontSize: 11, fontWeight: '700', marginTop: 2 },

  // Quick Action Buttons
  quickActionsRow: {
    flexDirection: 'row',
    paddingHorizontal: 14,
    marginTop: 14,
    gap: 8,
  },
  quickActionBtn: {
    flex: 1,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ALOBO.cardBorder,
  },
  quickActionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  quickActionTitle: { color: ALOBO.text, fontSize: 12, fontWeight: '800' },
  quickActionSub: { color: ALOBO.textSub, fontSize: 9, marginTop: 1 },

  // Pending Section
  pendingSection: { marginTop: 16, paddingHorizontal: 14 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  sectionTitle: { color: ALOBO.text, fontSize: 15, fontWeight: '900' },
  linkText: { color: ALOBO.primary, fontSize: 12, fontWeight: '700' },
  badgeCount: { backgroundColor: ALOBO.danger, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 1 },
  badgeCountText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  pendingCard: {
    backgroundColor: ALOBO.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#fde68a',
    backgroundColor: '#fffbeb',
  },
  pendingTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  pendingCustName: { color: ALOBO.text, fontSize: 14, fontWeight: '800' },
  pendingPhone: { color: ALOBO.textSub, fontSize: 12 },
  pendingPrice: { color: ALOBO.primaryDark, fontSize: 14, fontWeight: '900' },
  pendingInfoRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  pendingCourt: { color: ALOBO.text, fontSize: 12, fontWeight: '700' },
  pendingTime: { color: ALOBO.textSub, fontSize: 12 },
  pendingNote: { color: ALOBO.warning, fontSize: 11, fontStyle: 'italic', marginTop: 4 },
  pendingActions: { marginTop: 10 },
  btnApproveAlobo: {
    backgroundColor: ALOBO.primary,
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnApproveAloboText: { color: '#fff', fontSize: 12, fontWeight: '900' },

  // Live Courts Grid
  sectionContainer: { marginTop: 18, paddingHorizontal: 14 },
  courtsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  courtCardAlobo: {
    width: (width - 38) / 2,
    backgroundColor: ALOBO.card,
    borderRadius: 14,
    padding: 12,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  courtCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  courtCardName: { color: ALOBO.text, fontSize: 14, fontWeight: '900' },
  courtStatusBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  courtStatusBadgeText: { fontSize: 10, fontWeight: '800' },
  courtCardPrice: { color: ALOBO.primaryDark, fontSize: 12, fontWeight: '800', marginTop: 4 },
  courtCardBottom: { marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: ALOBO.cardBorder },
  courtCardGuest: { color: ALOBO.text, fontSize: 11, fontWeight: '700' },
  courtCardTime: { color: ALOBO.warning, fontSize: 10, fontWeight: '700', marginTop: 2 },
  courtCardActionHint: { color: ALOBO.textSub, fontSize: 10, marginTop: 2 },

  // Menu Grid
  menuGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 10 },
  menuCard: {
    width: (width - 44) / 3,
    borderRadius: 14,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: ALOBO.cardBorder,
  },
  menuIconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  menuTitle: { color: ALOBO.text, fontSize: 11, fontWeight: '800', textAlign: 'center' },
  menuDesc: { color: ALOBO.textSub, fontSize: 9, marginTop: 1, textAlign: 'center' },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#ffffff', borderRadius: 18, padding: 18, width: '100%', maxWidth: 400 },
  modalTitle: { color: ALOBO.text, fontSize: 16, fontWeight: '900', marginBottom: 12 },
  modalInput: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: ALOBO.cardBorder,
    paddingHorizontal: 14,
    height: 44,
    fontSize: 14,
    color: ALOBO.text,
    marginBottom: 14,
  },
  modalBtnCancel: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalBtnConfirm: { flex: 1.5, backgroundColor: ALOBO.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  modalBtnClose: { backgroundColor: ALOBO.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  clubOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: ALOBO.cardBorder },
  clubOptionActive: { backgroundColor: '#f0fdf4', borderRadius: 8, paddingHorizontal: 6 },
  clubOptionName: { color: ALOBO.text, fontSize: 13, fontWeight: '700' },
  clubOptionAddr: { color: ALOBO.textSub, fontSize: 11, marginTop: 1 },
});

// Re-export sub screens with Alobo styling integration
export {
  AdminCourtsScreen,
  AdminScheduleScreen,
  AdminBookingsScreen,
  AdminUsersScreen,
  AdminCustomersScreen,
  AdminServicesScreen,
  AdminTransactionsScreen,
  AdminReportsScreen,
  AdminSettingsScreen,
  AdminProfileScreen,
} from './AdminScreens';
