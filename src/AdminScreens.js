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
  Image,
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

// ═══════════════════════════════════════════════════════════════════════════════
// ALOBO COLOR PALETTE & THEME (EXACT MATCH TO ALOBO APP SCREENSHOTS)
// ═══════════════════════════════════════════════════════════════════════════════
const AL = {
  headerBg: '#0f5132',       // Dark forest green header
  headerGreen: '#14532d',
  bg: '#f1f5f9',              // Clean light gray app background
  cardBg: '#ffffff',
  primary: '#16a34a',         // Alobo Green
  primaryDark: '#15803d',
  accentGreen: '#10b981',
  orange: '#f59e0b',          // Action button orange
  orangeBtn: '#f97316',
  yellow: '#eab308',
  cyan: '#06b6d4',
  purple: '#7c3aed',
  teal: '#0d9488',
  pink: '#ec4899',
  danger: '#ef4444',
  textDark: '#0f172a',
  textSub: '#64748b',
  border: '#e2e8f0',
};

// ═══════════════════════════════════════════════════════════════════════════════
// 1. ALOBO HOME DASHBOARD (IMAGE 1: TRANG CHỦ & MA TRẬN LỊCH TRỰC QUAN)
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
  const [guideModal, setGuideModal] = useState(false);
  const [branchModal, setBranchModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('Sân Hoa Thiên Lý (TPT Sport)');

  const TIME_SLOTS = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  ];

  const MATRIX_COURTS = [
    { id: 'c6', name: 'Sân 6', color: '#10b981', guest: 'Huy - 0969678482', start: 1, span: 3, type: 'Lịch ngày' },
    { id: 'c7', name: 'Sân 7', color: '#f59e0b', guest: 'Ngọc Ngân - 0379241287', start: 5, span: 4, type: 'Chờ cọc' },
    { id: 'c8', name: 'Sân 8', color: '#0284c7', guest: 'Anh Bình An - 0985685956', start: 3, span: 4, type: 'Lịch cố định' },
    { id: 'c9', name: 'Sân 9', color: '#ec4899', guest: '[Xé vé] - Sự kiện cuối tuần (#8746)', start: 3, span: 5, type: 'Sự kiện' },
    { id: 'c10', name: 'Sân 10', color: '#84cc16', guest: '[Xé vé] - aa (#8738)', start: 4, span: 4, type: 'Lịch sinh hoạt' },
    { id: 'c11', name: 'Sân 11', color: '#10b981', guest: 'Trâm - 0708018101', start: 4, span: 5, type: 'Lịch ngày' },
    { id: 'cVIP', name: 'Sân VIP', color: '#0284c7', guest: 'A Bắc - 0984561253', start: 6, span: 4, type: 'Lịch cố định' },
    { id: 'c12', name: 'Sân 12', color: '#64748b', guest: 'Bảo trì hệ thống đèn', start: 0, span: 2, type: 'Khóa' },
  ];

  return (
    <ScrollView style={styles.aloboBg} showsVerticalScrollIndicator={false}>
      {/* ── TOP HEADER VỚI LOGO TRÁI CẦU ALOBO & HƯỚNG DẪN ── */}
      <View style={styles.homeHeader}>
        <View style={styles.homeHeaderTop}>
          <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigate('adminSettings')}>
            <Text style={{ fontSize: 20, color: '#fff' }}>☰</Text>
          </TouchableOpacity>

          {/* Alobo Circular Logo */}
          <View style={styles.aloboLogoCircle}>
            <Text style={{ fontSize: 34 }}>🏸</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <TouchableOpacity style={styles.headerIconBtn} onPress={() => navigate('adminBookings')}>
              <Text style={{ fontSize: 18, color: '#fff' }}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.guideBtnPill} onPress={() => setGuideModal(true)}>
              <Text style={{ fontSize: 13, marginRight: 4 }}>💡</Text>
              <Text style={styles.guideBtnText}>Hướng dẫn</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* ── ALOBO LIVE TIMELINE MATRIX WIDGET (IMAGE 1) ── */}
      <View style={styles.matrixWidgetCard}>
        {/* Legend Ribbon Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.legendRow}>
          {[
            { label: 'Trống', color: '#ffffff', border: true },
            { label: 'Lịch cố định', color: '#0284c7' },
            { label: 'Lịch ngày', color: '#10b981' },
            { label: 'Lịch sinh hoạt', color: '#84cc16' },
            { label: 'Sự kiện', color: '#ec4899' },
            { label: 'Chờ KH cọc', color: '#f59e0b' },
            { label: 'Khóa', color: '#64748b' },
            { label: 'Chưa T.T dịch vụ', color: '#eab308' },
          ].map((item) => (
            <View key={item.label} style={styles.legendPill}>
              <View style={[styles.legendSquare, { backgroundColor: item.color }, item.border && { borderWidth: 1, borderColor: '#cbd5e1' }]} />
              <Text style={styles.legendLabelText}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Scrollable Matrix Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            {/* Hour Header */}
            <View style={styles.matrixHeaderRow}>
              <View style={styles.matrixCourtHeaderCol}>
                <Text style={styles.matrixHeaderText}>SÂN</Text>
              </View>
              {TIME_SLOTS.map((slot) => (
                <View key={slot} style={styles.matrixHourCell}>
                  <Text style={styles.matrixHourText}>{slot}</Text>
                </View>
              ))}
            </View>

            {/* Matrix Court Rows */}
            {MATRIX_COURTS.map((court) => (
              <View key={court.id} style={styles.matrixBodyRow}>
                <View style={styles.matrixCourtLabelCol}>
                  <Text style={styles.matrixCourtLabelText}>{court.name}</Text>
                </View>

                {TIME_SLOTS.map((_, idx) => {
                  const isBookingStart = idx === court.start;
                  const isInsideBooking = idx >= court.start && idx < court.start + court.span;

                  if (isBookingStart) {
                    return (
                      <TouchableOpacity
                        key={idx}
                        style={[
                          styles.matrixBookingBlock,
                          {
                            width: court.span * 62 - 4,
                            backgroundColor: court.color,
                          },
                        ]}
                        onPress={() => Alert.alert('Chi tiết đặt sân', `${court.name}\n${court.guest}\nLoại: ${court.type}`)}
                      >
                        <Text style={styles.matrixBookingText} numberOfLines={1}>
                          {court.guest}
                        </Text>
                      </TouchableOpacity>
                    );
                  }

                  if (isInsideBooking) return null;

                  return (
                    <TouchableOpacity
                      key={idx}
                      style={styles.matrixEmptySlot}
                      onPress={() => navigate('adminSchedule')}
                    >
                      <Text style={{ color: '#cbd5e1', fontSize: 10 }}>＋</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* ── 4 BIG FEATURE TILES (IMAGE 1 MENU CÁC TÍNH NĂNG) ── */}
      <View style={styles.fourFeaturesGrid}>
        {/* Card 1: Quản lý chi nhánh */}
        <TouchableOpacity
          style={[styles.featureBigCard, { backgroundColor: '#0d9488' }]}
          onPress={() => navigate('adminCourts')}
        >
          <View style={styles.featureIconContainer}>
            <Text style={{ fontSize: 26, color: '#fff' }}>🏢</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.featureBigTitle}>Quản lý chi nhánh</Text>
            <Text style={styles.featureBigSub}>8 sân thi đấu</Text>
          </View>
        </TouchableOpacity>

        {/* Card 2: Quản lý khách hàng */}
        <TouchableOpacity
          style={[styles.featureBigCard, { backgroundColor: '#0284c7' }]}
          onPress={() => navigate('adminCustomers')}
        >
          <View style={styles.featureIconContainer}>
            <Text style={{ fontSize: 26, color: '#fff' }}>👥</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.featureBigTitle}>Quản lý khách hàng</Text>
            <Text style={styles.featureBigSub}>120 hội viên CRM</Text>
          </View>
        </TouchableOpacity>

        {/* Card 3: Hạng thành viên */}
        <TouchableOpacity
          style={[styles.featureBigCard, { backgroundColor: '#10b981' }]}
          onPress={() => navigate('adminCustomers')}
        >
          <View style={styles.featureIconContainer}>
            <Text style={{ fontSize: 26, color: '#fff' }}>💎</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.featureBigTitle}>Hạng thành viên</Text>
            <Text style={styles.featureBigSub}>Gói & Thẻ VIP</Text>
          </View>
        </TouchableOpacity>

        {/* Card 4: Quản lý thu chi */}
        <TouchableOpacity
          style={[styles.featureBigCard, { backgroundColor: '#7c3aed' }]}
          onPress={() => navigate('adminTransactions')}
        >
          <View style={styles.featureIconContainer}>
            <Text style={{ fontSize: 26, color: '#fff' }}>💰</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.featureBigTitle}>Quản lý thu chi</Text>
            <Text style={styles.featureBigSub}>Sổ quỹ & Ca trực</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* ── EXTRA QUICK SHORTCUTS ── */}
      <View style={styles.extraShortcutsRow}>
        <TouchableOpacity style={styles.extraBtn} onPress={() => navigate('adminServices')}>
          <Text style={{ fontSize: 20 }}>🥤</Text>
          <Text style={styles.extraBtnText}>Bán hàng POS</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraBtn} onPress={() => navigate('adminReports')}>
          <Text style={{ fontSize: 20 }}>📊</Text>
          <Text style={styles.extraBtnText}>Báo cáo KPI</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraBtn} onPress={() => navigate('adminUsers')}>
          <Text style={{ fontSize: 20 }}>🛡️</Text>
          <Text style={styles.extraBtnText}>Phân quyền</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.extraBtn} onPress={() => navigate('adminSettings')}>
          <Text style={{ fontSize: 20 }}>⚙️</Text>
          <Text style={styles.extraBtnText}>Cài đặt</Text>
        </TouchableOpacity>
      </View>

      {/* ── ALOBO BANNER TEXT ── */}
      <View style={styles.aloboFooterBanner}>
        <Text style={styles.aloboBannerTitle}>MENU CÁC TÍNH NĂNG</Text>
        <Text style={styles.aloboBannerSub}>GIÚP QUẢN LÝ SÂN DỄ DÀNG</Text>
      </View>

      {/* ── Guide Modal ── */}
      <Modal visible={guideModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitleText}>💡 Hướng Dẫn Sử Dụng Alobo Quản Lý</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.guideStepText}>1. 📅 <Text style={{ fontWeight: '700' }}>Đặt lịch & Xem ma trận:</Text> Bấm vào bất kỳ ô trống nào trên ma trận để tạo lịch cho khách.</Text>
              <Text style={styles.guideStepText}>2. 📋 <Text style={{ fontWeight: '700' }}>Duyệt đơn online:</Text> Kiểm tra tab "Duyệt đơn" để phê duyệt các yêu cầu đặt sân từ ứng dụng khách hàng.</Text>
              <Text style={styles.guideStepText}>3. 🥤 <Text style={{ fontWeight: '700' }}>Bán hàng POS:</Text> Bán nước, vợt, cầu và bấm nút cam "LÊN ĐƠN" để thanh toán.</Text>
              <Text style={styles.guideStepText}>4. 👥 <Text style={{ fontWeight: '700' }}>Hội viên & CRM:</Text> Quản lý thời hạn gói, gia hạn và thẻ tích điểm.</Text>
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setGuideModal(false)}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>ĐÃ HIỂU</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <View style={{ height: 60 }} />
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. ALOBO POS ORDER SCREEN (IMAGE 2: ĐƠN BÁN HÀNG & NÚT LÊN ĐƠN CAM)
// ═══════════════════════════════════════════════════════════════════════════════
export function AdminServicesScreen({ services = SERVICES_DATA }) {
  const [quantities, setQuantities] = useState({
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 2, // Rockstar
    s7: 1, // Thuê vợt / Bóng tập
    s5: 0,
  });
  const [search, setSearch] = useState('');
  const [checkoutModal, setCheckoutModal] = useState(false);

  const POS_ITEMS = [
    { id: 's1', name: 'Nước Lọc - Aquafina (Chai)', price: 10000, unit: 'Chai', icon: '💧', category: 'Nước uống' },
    { id: 's2', name: 'Revive Chanh Muối (Chai)', price: 15000, unit: 'Chai', icon: '🍋', category: 'Nước uống' },
    { id: 's3', name: 'Revive Thường (Chai)', price: 15000, unit: 'Chai', icon: '🥤', category: 'Nước uống' },
    { id: 's4', name: 'Rockstar (Lon)', price: 20000, unit: 'Lon', icon: '⚡', category: 'Nước uống' },
    { id: 's7', name: 'Bóng Tập / Vợt Cho Thuê (Xe)', price: 50000, unit: 'Xe', icon: '🏸', category: 'Phụ Kiện' },
    { id: 's8', name: 'Máy Bắn Bóng PP-Smart Pro (Giờ)', price: 60000, unit: 'Giờ', icon: '🤖', category: 'Phụ Kiện' },
    { id: 's5', name: 'Ống cầu lông Hải Yến S90 (12 quả)', price: 240000, unit: 'Ống', icon: '🏸', category: 'Phụ Kiện' },
  ];

  const updateQty = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const totalAmount = POS_ITEMS.reduce((sum, item) => sum + (quantities[item.id] || 0) * item.price, 0);
  const totalItemsCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  return (
    <View style={styles.aloboBg}>
      {/* Search Header */}
      <View style={styles.posSearchContainer}>
        <View style={styles.posSearchBox}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>🔍</Text>
          <TextInput
            style={styles.posSearchInput}
            placeholder="Nhập tên sản phẩm cần tìm kiếm"
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterIconBtn}>
          <Text style={{ fontSize: 18 }}>🍸</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Nước uống Section */}
        <View style={styles.posSectionCard}>
          {POS_ITEMS.filter((i) => i.category === 'Nước uống').map((item) => {
            const qty = quantities[item.id] || 0;
            return (
              <View key={item.id} style={styles.posItemRow}>
                <View style={styles.posItemIconBox}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.posItemName}>{item.name}</Text>
                  <Text style={styles.posItemPrice}>{item.price.toLocaleString('vi-VN')} đ / {item.unit}</Text>
                </View>

                {qty > 0 ? (
                  <View style={styles.posStepper}>
                    <TouchableOpacity style={styles.posStepBtn} onPress={() => updateQty(item.id, -1)}>
                      <Text style={styles.posStepBtnText}>－</Text>
                    </TouchableOpacity>
                    <Text style={styles.posStepNum}>{qty}</Text>
                    <TouchableOpacity style={styles.posStepBtn} onPress={() => updateQty(item.id, 1)}>
                      <Text style={styles.posStepBtnText}>＋</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.posAddBtn} onPress={() => updateQty(item.id, 1)}>
                    <Text style={{ color: '#10b981', fontSize: 18, fontWeight: '900' }}>⊕</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Phụ Kiện Section */}
        <Text style={styles.posSectionHeading}>Phụ Kiện</Text>
        <View style={styles.posSectionCard}>
          {POS_ITEMS.filter((i) => i.category === 'Phụ Kiện').map((item) => {
            const qty = quantities[item.id] || 0;
            return (
              <View key={item.id} style={styles.posItemRow}>
                <View style={styles.posItemIconBox}>
                  <Text style={{ fontSize: 24 }}>{item.icon}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.posItemName}>{item.name}</Text>
                  <Text style={styles.posItemPrice}>{item.price.toLocaleString('vi-VN')} đ / {item.unit}</Text>
                </View>

                {qty > 0 ? (
                  <View style={styles.posStepper}>
                    <TouchableOpacity style={styles.posStepBtn} onPress={() => updateQty(item.id, -1)}>
                      <Text style={styles.posStepBtnText}>－</Text>
                    </TouchableOpacity>
                    <Text style={styles.posStepNum}>{qty}</Text>
                    <TouchableOpacity style={styles.posStepBtn} onPress={() => updateQty(item.id, 1)}>
                      <Text style={styles.posStepBtnText}>＋</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.posAddBtn} onPress={() => updateQty(item.id, 1)}>
                    <Text style={{ color: '#10b981', fontSize: 18, fontWeight: '900' }}>⊕</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* ── STICKY BOTTOM BUTTON: LÊN ĐƠN (IMAGE 2) ── */}
      <View style={styles.posStickyBottom}>
        <TouchableOpacity
          style={styles.posSubmitBtn}
          onPress={() => {
            if (totalItemsCount === 0) {
              Alert.alert('Chưa chọn món', 'Vui lòng chọn ít nhất 1 sản phẩm');
            } else {
              setCheckoutModal(true);
            }
          }}
        >
          <Text style={styles.posSubmitBtnText}>LÊN ĐƠN ({totalAmount.toLocaleString('vi-VN')} đ)</Text>
        </TouchableOpacity>
      </View>

      {/* Checkout Modal */}
      <Modal visible={checkoutModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitleText}>🧾 Xác Nhận Thanh Toán POS</Text>
            <Text style={{ color: '#0f172a', fontWeight: '800', fontSize: 18, marginVertical: 8 }}>
              Tổng tiền: {totalAmount.toLocaleString('vi-VN')} VNĐ
            </Text>
            <Text style={{ color: AL.textSub, fontSize: 13, marginBottom: 14 }}>
              Số lượng sản phẩm: {totalItemsCount} món
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={styles.modalCancelBtn} onPress={() => setCheckoutModal(false)}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalConfirmBtn}
                onPress={() => {
                  setCheckoutModal(false);
                  setQuantities({ s1: 0, s2: 0, s3: 0, s4: 0, s7: 0, s5: 0 });
                  Alert.alert('✅ Thành công', 'Đã in hóa đơn và hoàn tất đơn bán hàng!');
                }}
              >
                <Text style={{ color: '#fff', fontWeight: '800' }}>THU TIỀN MẶT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. ALOBO ORDER APPROVAL & SCHEDULE SCREEN (IMAGE 3: DUYỆT ĐƠN & LỊCH ĐẶT)
// ═══════════════════════════════════════════════════════════════════════════════
export function AdminBookingsScreen({ bookings = INITIAL_ADMIN_BOOKINGS, onUpdateStatus }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'day' | 'fixed' | 'event'

  const ALOBO_ORDERS = [
    {
      id: '#7399',
      title: '[Xé vé] - XÉ VÉ 0đ',
      tag: 'Xé vé',
      tagColor: '#10b981',
      court: 'Sân 11',
      time: '8h30 - 9h30 | Ngày 17/12/2025',
      tickets: '2/10',
      status: 'HOÀN THÀNH',
    },
    {
      id: '#7373',
      title: '[Xé vé] - Xé vé tháng 12',
      level: 'TB',
      tag: 'Sự kiện',
      tagColor: '#ec4899',
      court: 'Sân 6: 22h30 - 24h00, Sân 8: 22h30 - 24h00',
      time: 'Ngày 17/12/2025',
      tickets: '3/8',
      status: 'HOÀN THÀNH',
    },
    {
      id: '#7336',
      title: 'Nhi test hạng thành viên',
      tag: 'Đơn cố định',
      tagColor: '#0284c7',
      court: 'Sân pick20: 4h - 4h30, Sân pick21: 4h - 4h30, Sân pick22: 4h - 4h30',
      time: 'Thời gian: Tháng 12/2025 | 01/12/2025 - 31/12/2025',
      status: 'HOÀN THÀNH',
    },
    {
      id: '#7322',
      title: 'toàn',
      tag: 'Đơn cố định',
      tagColor: '#0284c7',
      depositTag: 'Đã cọc',
      court: 'Sân pick20: 16h30 - 18h, Sân pick21: 16h30 - 18h',
      time: 'Ngày 17/12/2025',
      status: 'HOÀN THÀNH',
    },
  ];

  return (
    <View style={styles.aloboBg}>
      {/* Top Filter Bar with Club Dropdown & Date */}
      <View style={styles.aloboOrdersHeader}>
        <TouchableOpacity style={styles.branchSelectBtn}>
          <Text style={styles.branchSelectText} numberOfLines={1}>Sân Hoa Thiên Lý (CLB TPT Sport) ▾</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.datePickerBtn}>
          <Text style={styles.datePickerText}>17/12/2025 📅</Text>
        </TouchableOpacity>
      </View>

      {/* Category Pills (Đơn ngày, Đơn cố định, Đơn sự kiện, Chuỗi sự kiện, Tất cả) */}
      <View style={styles.orderTabScrollContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 12 }}>
          {[
            ['all', 'Tất cả'],
            ['day', 'Đơn ngày'],
            ['fixed', 'Đơn cố định'],
            ['event', 'Đơn sự kiện'],
            ['chain', 'Chuỗi sự kiện'],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[styles.orderCategoryPill, activeTab === key && styles.orderCategoryPillActive]}
              onPress={() => setActiveTab(key)}
            >
              <Text style={[styles.orderCategoryText, activeTab === key && styles.orderCategoryTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List of Alobo Booking Cards */}
      <FlatList
        data={ALOBO_ORDERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        renderItem={({ item }) => (
          <View style={styles.aloboOrderCard}>
            {/* Tag Badges Ribbon */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <View style={[styles.orderTagRibbon, { backgroundColor: item.tagColor }]}>
                <Text style={styles.orderTagRibbonText}>{item.tag}</Text>
              </View>
              {item.depositTag && (
                <View style={[styles.orderTagRibbon, { backgroundColor: '#f59e0b' }]}>
                  <Text style={styles.orderTagRibbonText}>{item.depositTag}</Text>
                </View>
              )}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.orderCardTitle}>{item.title}</Text>
                {item.level && (
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelBadgeText}>🛡️ Trình độ: {item.level}</Text>
                  </View>
                )}
                <Text style={styles.orderCardCode}>Mã đơn: {item.id}</Text>
                <Text style={styles.orderCardDetail}>Chi tiết đơn: {item.court}</Text>
                <Text style={styles.orderCardTime}>{item.time}</Text>
                {item.tickets && <Text style={styles.orderCardTickets}>Số lượng vé: {item.tickets}</Text>}
              </View>

              {/* Complete / Confirm Button */}
              <TouchableOpacity
                style={styles.orderCompleteBtn}
                onPress={() => Alert.alert('Thành công', `Đơn ${item.id} đã hoàn tất`)}
              >
                <Text style={styles.orderCompleteBtnText}>{item.status}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Floating Action Button: + Tạo lịch đặt (IMAGE 3) */}
      <TouchableOpacity
        style={styles.floatingCreateBtn}
        onPress={() => Alert.alert('Tạo lịch mới', 'Mở giao diện xếp sân và tạo lịch đặt')}
      >
        <Text style={styles.floatingCreateBtnText}>＋ Tạo lịch đặt</Text>
      </TouchableOpacity>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 4. ALOBO MEMBERS CRM SCREEN (IMAGE 4: QUẢN LÝ HỘI VIÊN)
// ═══════════════════════════════════════════════════════════════════════════════
export function AdminCustomersScreen() {
  const [search, setSearch] = useState('');

  const MEMBERS = [
    {
      id: 'm1',
      name: 'Bùi Ngọc Hân',
      phone: '+84 567 567 234',
      status: 'Hết hạn',
      statusColor: '#ef4444',
      statusBg: '#fee2e2',
      spent: '10.000.000 đ',
      debt: '10.000.000 đ',
      package: 'Gói hội viên VIP VUI VẺ Tháng 10 - C...',
      expire: '01/10/2025 - 31/10/2025',
    },
    {
      id: 'm2',
      name: 'Bùi Ngọc Diệp',
      phone: '+84 567 567 234',
      status: 'Sắp hết hạn',
      statusColor: '#f59e0b',
      statusBg: '#fef3c7',
      spent: '10.000.000 đ',
      debt: '10.000.000 đ',
      package: 'Gói hội viên VIP VUI VẺ Tháng 10 - C...',
      expire: '01/10/2025 - 31/10/2025',
    },
    {
      id: 'm3',
      name: 'Hoàng Thanh Hằng',
      phone: '+84 567 567 234',
      status: 'Đang hoạt động',
      statusColor: '#10b981',
      statusBg: '#dcfce7',
      spent: '10.000.000 đ',
      debt: '10.000.000 đ',
      package: 'Gói hội viên Vàng - Cầu lông 6 tháng',
      expire: '01/01/2026 - 30/06/2026',
    },
  ];

  return (
    <View style={styles.aloboBg}>
      {/* 4 Top Pills */}
      <View style={styles.memberTopIconsRow}>
        {[
          { icon: '👑', label: 'Chương trình\nhội viên' },
          { icon: '📦', label: 'Gói\nhội viên' },
          { icon: '💳', label: 'Thẻ\nhội viên' },
          { icon: '🕒', label: 'Báo cáo\nthống kê' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.memberTopPill}>
            <Text style={{ fontSize: 20, marginBottom: 2 }}>{item.icon}</Text>
            <Text style={styles.memberTopPillText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search & Sort Row */}
      <View style={styles.memberSearchRow}>
        <View style={styles.memberSearchInputBox}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 13, color: '#0f172a' }}
            placeholder="Tìm kiếm hội viên..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.memberToolBtn}><Text style={{ fontSize: 16 }}>☰</Text></TouchableOpacity>
        <TouchableOpacity style={styles.memberToolBtn}><Text style={{ fontSize: 16 }}>⇅</Text></TouchableOpacity>
      </View>

      {/* 4 KPI Cards (120 Tổng thẻ, 70 Thẻ hoạt động, 7 Đã gia hạn, 32 Sắp hết hạn) */}
      <View style={styles.memberKpiGrid}>
        <View style={styles.memberKpiCard}>
          <Text style={[styles.memberKpiNum, { color: '#0f172a' }]}>120</Text>
          <Text style={styles.memberKpiLabel}>Tổng thẻ</Text>
        </View>
        <View style={styles.memberKpiCard}>
          <Text style={[styles.memberKpiNum, { color: '#10b981' }]}>70</Text>
          <Text style={styles.memberKpiLabel}>● Thẻ hoạt động</Text>
        </View>
        <View style={styles.memberKpiCard}>
          <Text style={[styles.memberKpiNum, { color: '#0284c7' }]}>7</Text>
          <Text style={styles.memberKpiLabel}>● Đã gia hạn</Text>
        </View>
        <View style={styles.memberKpiCard}>
          <Text style={[styles.memberKpiNum, { color: '#f59e0b' }]}>32</Text>
          <Text style={styles.memberKpiLabel}>● Sắp hết hạn</Text>
        </View>
      </View>

      <Text style={styles.memberSummaryLine}>● Tổng 120 hội viên      ● Hoạt động 100</Text>

      {/* Members List */}
      <FlatList
        data={MEMBERS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 60 }}
        renderItem={({ item }) => (
          <View style={styles.memberItemCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.memberAvatarCircle}>
                  <Text style={{ fontSize: 18 }}>👩</Text>
                </View>
                <View style={{ marginLeft: 8 }}>
                  <Text style={styles.memberNameText}>{item.name}</Text>
                  <Text style={styles.memberPhoneText}>📞 {item.phone}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={[styles.memberStatusPill, { backgroundColor: item.statusBg }]}>
                  <Text style={[styles.memberStatusPillText, { color: item.statusColor }]}>● {item.status}</Text>
                </View>
                <Text style={{ color: '#94a3b8', fontSize: 16 }}>•••</Text>
              </View>
            </View>

            {/* Financial Numbers */}
            <View style={styles.memberFinanceRow}>
              <View style={styles.memberFinanceBox}>
                <Text style={{ color: '#10b981', fontSize: 11, fontWeight: '700' }}>📈 {item.spent}</Text>
              </View>
              <View style={styles.memberFinanceBox}>
                <Text style={{ color: '#ef4444', fontSize: 11, fontWeight: '700' }}>⚠️ {item.debt}</Text>
              </View>
            </View>

            {/* Package & Renew Button */}
            <View style={styles.memberPackageBox}>
              <View style={{ flex: 1 }}>
                <Text style={styles.memberPackageTitle}>⚠️ {item.package}</Text>
                <Text style={styles.memberPackageTime}>Thời hạn: {item.expire}</Text>
              </View>
              <TouchableOpacity
                style={styles.memberRenewBtn}
                onPress={() => Alert.alert('Gia hạn thẻ', `Gia hạn thẻ thành viên cho ${item.name}`)}
              >
                <Text style={styles.memberRenewBtnText}>Gia hạn</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// OTHER SUB-SCREENS (QUẢN LÝ SÂN, SCHEDULE, GIAO DỊCH, BÁO CÁO, CÀI ĐẶT)
// ═══════════════════════════════════════════════════════════════════════════════
export function AdminCourtsScreen({ courts = COURTS_DATA, onToggleStatus }) {
  return (
    <FlatList
      style={{ flex: 1, backgroundColor: AL.bg }}
      data={courts}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 14 }}
      renderItem={({ item }) => (
        <View style={styles.courtManageCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '900', color: AL.textDark }}>{item.name}</Text>
            <View style={[styles.orderTagRibbon, { backgroundColor: item.status === 'available' ? '#10b981' : '#ef4444' }]}>
              <Text style={styles.orderTagRibbonText}>{item.status === 'available' ? 'SẴN SÀNG' : 'ĐANG DÙNG'}</Text>
            </View>
          </View>
          <Text style={{ color: AL.textSub, fontSize: 12, marginTop: 4 }}>📍 {item.location}</Text>
          <Text style={{ color: AL.primaryDark, fontSize: 14, fontWeight: '800', marginTop: 4 }}>
            💰 {item.price.toLocaleString('vi-VN')} đ/h ({item.type})
          </Text>
        </View>
      )}
    />
  );
}

export function AdminScheduleScreen({ courts = COURTS_DATA }) {
  return <AdminHome courts={courts} navigate={() => {}} />;
}

export function AdminUsersScreen() {
  return <AdminCustomersScreen />;
}

export function AdminTransactionsScreen() {
  return (
    <ScrollView style={styles.aloboBg} contentContainerStyle={{ padding: 14 }}>
      <Text style={styles.modalTitleText}>💳 Sổ Quỹ Thu Chi Ca Trực</Text>
      {TRANSACTIONS_DATA.map((t) => (
        <View key={t.id} style={styles.courtManageCard}>
          <Text style={{ fontWeight: '800', color: AL.textDark }}>{t.customerName} - {t.method}</Text>
          <Text style={{ color: AL.primaryDark, fontWeight: '800', fontSize: 15, marginTop: 2 }}>+{t.amount.toLocaleString('vi-VN')} đ</Text>
          <Text style={{ color: AL.textSub, fontSize: 11, marginTop: 2 }}>Mã: {t.id} · {t.time}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export function AdminReportsScreen() {
  return (
    <ScrollView style={styles.aloboBg} contentContainerStyle={{ padding: 14 }}>
      <Text style={styles.modalTitleText}>📊 Báo Cáo Doanh Thu & Công Suất</Text>
      <View style={styles.memberKpiGrid}>
        <View style={styles.memberKpiCard}><Text style={styles.memberKpiNum}>1.85M</Text><Text style={styles.memberKpiLabel}>Hôm nay</Text></View>
        <View style={styles.memberKpiCard}><Text style={[styles.memberKpiNum, { color: '#10b981' }]}>12.4M</Text><Text style={styles.memberKpiLabel}>Tuần này</Text></View>
        <View style={styles.memberKpiCard}><Text style={[styles.memberKpiNum, { color: '#0284c7' }]}>48.9M</Text><Text style={styles.memberKpiLabel}>Tháng này</Text></View>
      </View>
    </ScrollView>
  );
}

export function AdminSettingsScreen() {
  return (
    <ScrollView style={styles.aloboBg} contentContainerStyle={{ padding: 14 }}>
      <Text style={styles.modalTitleText}>⚙️ Cài Đặt Hệ Thống Alobo</Text>
      <View style={styles.courtManageCard}>
        <Text style={{ fontWeight: '800', color: AL.textDark }}>Thông Tin Câu Lạc Bộ</Text>
        <Text style={{ color: AL.textSub, fontSize: 12, marginTop: 2 }}>CLB Cầu Lông TPT Sport · 8 Sân Tiêu Chuẩn</Text>
      </View>
    </ScrollView>
  );
}

export function AdminProfileScreen({ user, onLogout }) {
  return (
    <View style={[styles.aloboBg, { padding: 20, alignItems: 'center' }]}>
      <View style={[styles.aloboLogoCircle, { width: 80, height: 80, borderRadius: 40 }]}>
        <Text style={{ fontSize: 44 }}>🛡️</Text>
      </View>
      <Text style={{ fontSize: 18, fontWeight: '900', color: AL.textDark, marginTop: 12 }}>{user?.name || 'Trần Quốc Trung'}</Text>
      <Text style={{ color: AL.primaryDark, fontWeight: '800', fontSize: 12, marginTop: 2 }}>👑 SUPER ADMIN - ALOBO SPORT</Text>
      <TouchableOpacity style={styles.logoutBtnAlobo} onPress={onLogout}>
        <Text style={{ color: '#fff', fontWeight: '800' }}>ĐĂNG XUẤT</Text>
      </TouchableOpacity>
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMPLETE ALOBO STYLESHEET
// ═══════════════════════════════════════════════════════════════════════════════
const styles = StyleSheet.create({
  aloboBg: { flex: 1, backgroundColor: AL.bg },

  // Home Header (Image 1)
  homeHeader: {
    backgroundColor: AL.headerBg,
    paddingTop: Platform.OS === 'ios' ? 14 : 18,
    paddingBottom: 24,
    paddingHorizontal: 16,
  },
  homeHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aloboLogoCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  guideBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
  },
  guideBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '900' },

  // Matrix Widget Card (Image 1)
  matrixWidgetCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: -12,
    borderRadius: 14,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: AL.border,
  },
  legendRow: { flexDirection: 'row', gap: 6, paddingBottom: 8 },
  legendPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', borderRadius: 4, paddingHorizontal: 5, paddingVertical: 2 },
  legendSquare: { width: 8, height: 8, borderRadius: 2, marginRight: 4 },
  legendLabelText: { color: '#475569', fontSize: 9, fontWeight: '700' },

  matrixHeaderRow: { flexDirection: 'row', backgroundColor: '#e2e8f0', borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  matrixCourtHeaderCol: { width: 64, padding: 6, justifyContent: 'center' },
  matrixHeaderText: { fontSize: 10, fontWeight: '800', color: '#475569' },
  matrixHourCell: { width: 62, paddingVertical: 6, alignItems: 'center', borderLeftWidth: 1, borderLeftColor: '#cbd5e1' },
  matrixHourText: { fontSize: 10, fontWeight: '800', color: '#475569' },

  matrixBodyRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#f1f5f9', height: 34, alignItems: 'center' },
  matrixCourtLabelCol: { width: 64, paddingLeft: 6 },
  matrixCourtLabelText: { fontSize: 10, fontWeight: '800', color: '#1e293b' },
  matrixEmptySlot: { width: 62, height: '100%', borderLeftWidth: 1, borderLeftColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  matrixBookingBlock: {
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginHorizontal: 2,
  },
  matrixBookingText: { color: '#ffffff', fontSize: 9, fontWeight: '800' },

  // 4 Big Feature Cards (Image 1)
  fourFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 14,
    gap: 10,
    justifyContent: 'space-between',
  },
  featureBigCard: {
    width: (width - 34) / 2,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBigTitle: { color: '#ffffff', fontSize: 13, fontWeight: '900' },
  featureBigSub: { color: 'rgba(255,255,255,0.85)', fontSize: 10, marginTop: 2 },

  // Extra Shortcuts
  extraShortcutsRow: { flexDirection: 'row', paddingHorizontal: 12, marginTop: 14, gap: 8 },
  extraBtn: { flex: 1, backgroundColor: '#ffffff', borderRadius: 12, padding: 10, alignItems: 'center', borderWidth: 1, borderColor: AL.border },
  extraBtnText: { color: AL.textDark, fontSize: 10, fontWeight: '800', marginTop: 4 },

  aloboFooterBanner: { alignItems: 'center', marginTop: 24 },
  aloboBannerTitle: { color: '#14532d', fontSize: 24, fontWeight: '900', fontStyle: 'italic', letterSpacing: 0.5 },
  aloboBannerSub: { color: '#16a34a', fontSize: 12, fontWeight: '900', letterSpacing: 1, marginTop: 2 },

  // POS Screen (Image 2)
  posSearchContainer: { flexDirection: 'row', padding: 12, backgroundColor: AL.headerGreen, gap: 8 },
  posSearchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 10, paddingHorizontal: 10, height: 40 },
  posSearchInput: { flex: 1, fontSize: 13, color: '#0f172a' },
  filterIconBtn: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center' },
  posSectionHeading: { fontSize: 14, fontWeight: '900', color: AL.textDark, marginLeft: 14, marginTop: 14, marginBottom: 6 },
  posSectionCard: { backgroundColor: '#ffffff', marginHorizontal: 12, borderRadius: 14, paddingHorizontal: 12, borderWidth: 1, borderColor: AL.border },
  posItemRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  posItemIconBox: { width: 44, height: 44, borderRadius: 10, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  posItemName: { color: AL.textDark, fontSize: 13, fontWeight: '800' },
  posItemPrice: { color: AL.textSub, fontSize: 12, marginTop: 2 },
  posAddBtn: { padding: 4 },
  posStepper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fef3c7', borderRadius: 8, paddingHorizontal: 4 },
  posStepBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  posStepBtnText: { color: '#b45309', fontSize: 16, fontWeight: '900' },
  posStepNum: { color: '#b45309', fontSize: 14, fontWeight: '900', paddingHorizontal: 4 },
  posStickyBottom: { position: 'absolute', bottom: 16, left: 14, right: 14 },
  posSubmitBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  posSubmitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },

  // Orders Screen (Image 3)
  aloboOrdersHeader: { flexDirection: 'row', backgroundColor: AL.headerGreen, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  branchSelectBtn: { flex: 1, backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  branchSelectText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  datePickerBtn: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  datePickerText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  orderTabScrollContainer: { backgroundColor: '#ffffff', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: AL.border },
  orderCategoryPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#f1f5f9' },
  orderCategoryPillActive: { backgroundColor: AL.primary },
  orderCategoryText: { fontSize: 12, fontWeight: '700', color: AL.textSub },
  orderCategoryTextActive: { color: '#fff', fontWeight: '800' },
  aloboOrderCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: AL.border },
  orderTagRibbon: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  orderTagRibbonText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  orderCardTitle: { color: AL.textDark, fontSize: 14, fontWeight: '800' },
  levelBadge: { backgroundColor: '#ecfdf5', borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, alignSelf: 'flex-start', marginVertical: 3 },
  levelBadgeText: { color: '#059669', fontSize: 10, fontWeight: '700' },
  orderCardCode: { color: AL.textSub, fontSize: 11, marginTop: 2 },
  orderCardDetail: { color: AL.textDark, fontSize: 11, fontWeight: '700', marginTop: 2 },
  orderCardTime: { color: AL.textSub, fontSize: 11, marginTop: 1 },
  orderCardTickets: { color: '#ea580c', fontSize: 11, fontWeight: '800', marginTop: 2 },
  orderCompleteBtn: { backgroundColor: '#0d9488', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8 },
  orderCompleteBtnText: { color: '#fff', fontSize: 11, fontWeight: '900' },
  floatingCreateBtn: { position: 'absolute', bottom: 20, right: 16, backgroundColor: '#f59e0b', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 12, elevation: 6 },
  floatingCreateBtnText: { color: '#fff', fontSize: 13, fontWeight: '900' },

  // Members Screen (Image 4)
  memberTopIconsRow: { flexDirection: 'row', backgroundColor: '#ffffff', padding: 10, justifyContent: 'space-between', borderBottomWidth: 1, borderBottomColor: AL.border },
  memberTopPill: { alignItems: 'center', flex: 1 },
  memberTopPillText: { fontSize: 10, fontWeight: '700', color: AL.textDark, textAlign: 'center' },
  memberSearchRow: { flexDirection: 'row', padding: 10, gap: 6 },
  memberSearchInputBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 10, paddingHorizontal: 10, height: 38, borderWidth: 1, borderColor: AL.border },
  memberToolBtn: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#ffffff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: AL.border },
  memberKpiGrid: { flexDirection: 'row', paddingHorizontal: 10, gap: 6 },
  memberKpiCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 10, padding: 8, alignItems: 'center', borderWidth: 1, borderColor: AL.border },
  memberKpiNum: { fontSize: 16, fontWeight: '900' },
  memberKpiLabel: { fontSize: 9, fontWeight: '700', color: AL.textSub, marginTop: 2 },
  memberSummaryLine: { fontSize: 11, color: '#10b981', fontWeight: '800', paddingHorizontal: 12, marginVertical: 8 },
  memberItemCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 12, marginBottom: 10, borderWidth: 1, borderColor: AL.border },
  memberAvatarCircle: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#f1f5f9', alignItems: 'center', justifyContent: 'center' },
  memberNameText: { color: AL.textDark, fontSize: 13, fontWeight: '800' },
  memberPhoneText: { color: AL.textSub, fontSize: 11 },
  memberStatusPill: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  memberStatusPillText: { fontSize: 10, fontWeight: '800' },
  memberFinanceRow: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  memberFinanceBox: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 8, padding: 6, alignItems: 'center' },
  memberPackageBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fffbeb', borderRadius: 8, padding: 8, borderWidth: 1, borderColor: '#fef3c7' },
  memberPackageTitle: { color: '#b45309', fontSize: 11, fontWeight: '800' },
  memberPackageTime: { color: '#92400e', fontSize: 10, marginTop: 2 },
  memberRenewBtn: { backgroundColor: '#14532d', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  memberRenewBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },

  // Generic & Modals
  courtManageCard: { backgroundColor: '#ffffff', borderRadius: 12, padding: 12, marginBottom: 8, borderWidth: 1, borderColor: AL.border },
  logoutBtnAlobo: { backgroundColor: '#ef4444', borderRadius: 10, paddingHorizontal: 24, paddingVertical: 10, marginTop: 20 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', padding: 20 },
  modalCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 18, width: '100%', maxWidth: 400 },
  modalTitleText: { fontSize: 16, fontWeight: '900', color: AL.textDark, marginBottom: 10 },
  guideStepText: { fontSize: 13, color: '#334155', marginBottom: 10, lineHeight: 18 },
  modalCloseBtn: { backgroundColor: AL.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center', marginTop: 12 },
  modalCancelBtn: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  modalConfirmBtn: { flex: 1.5, backgroundColor: AL.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
});
