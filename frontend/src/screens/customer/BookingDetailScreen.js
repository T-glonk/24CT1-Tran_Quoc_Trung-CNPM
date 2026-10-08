import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';

export function BookingDetailScreen({ booking, user, onBack, onCancel }) {
  const [tab, setTab] = useState('info'); // info | service | team

  const orderCode = booking.id ? (booking.id.startsWith('BK-') ? booking.id : `#${booking.id}`) : '#9684';
  const courtPrice = booking.courtPrice || booking.court?.price || 80000;
  const servicesTotal = booking.servicesTotal || 0;
  const grandTotal = booking.grandTotal || booking.totalPrice || (courtPrice + servicesTotal);
  const servicesList = booking.services || [];

  const clubTitle = booking.clubName || booking.court?.clubName || 'Cơ sở 1: Sân Hoa Thiên Lý';
  const courtTitle = booking.courtName || booking.court?.name || 'Sân 1';

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Header */}
      <View style={st.detailHeader}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>←</Text>
        </TouchableOpacity>
        <Text style={st.detailHeaderTitle}>Chi Tiết Đặt Lịch</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={st.detailTabRow}>
        {[
          ['info', 'Thông tin'],
          ['service', `Dịch vụ (${servicesList.length})`],
          ['team', 'Đội nhóm'],
        ].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[st.detailTab, tab === key && st.detailTabActive]}
            onPress={() => setTab(key)}
          >
            <Text style={[st.detailTabText, tab === key && st.detailTabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {tab === 'info' && (
          <View style={{ padding: 14 }}>
            {/* Status Card */}
            <View style={st.statusHeroCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={st.statusHeroCode}>MÃ ĐƠN: {orderCode}</Text>
                  <Text style={st.statusHeroDate}>Ngày tạo: {booking.createdAt || booking.date || 'Hôm nay'}</Text>
                </View>
                <View
                  style={[
                    st.statusHeroBadge,
                    {
                      backgroundColor:
                        booking.status === 'confirmed'
                          ? '#166534'
                          : booking.status === 'in_use'
                          ? '#0369a1'
                          : booking.status === 'cancelled'
                          ? '#991b1b'
                          : '#854d0e',
                    },
                  ]}
                >
                  <Text style={st.statusHeroBadgeText}>
                    {booking.status === 'confirmed'
                      ? '● ĐÃ XÁC NHẬN'
                      : booking.status === 'in_use'
                      ? '● ĐANG SỬ DỤNG'
                      : booking.status === 'cancelled'
                      ? '● ĐÃ HỦY'
                      : '● CHỜ DUYỆT'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Customer card */}
            <View style={st.detailCard}>
              <View style={st.detailCustomerRow}>
                <View style={st.detailAvatar}>
                  <Text style={{ fontSize: 24 }}>👤</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={st.detailKHLabel}>
                    Khách hàng: <Text style={st.detailKHName}>{booking.userName || user?.name || 'Khách trực tuyến'}</Text>
                  </Text>
                  <Text style={st.detailKHSub}>
                    Số điện thoại: <Text style={{ color: '#fff', fontWeight: '700' }}>{booking.userPhone || user?.phone || '0905 591 379'}</Text>
                  </Text>
                  <Text style={st.detailKHSub}>
                    Phương thức: <Text style={{ color: '#facc15', fontWeight: '700' }}>{booking.paymentMethod || 'Chuyển khoản QR MBBank'}</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Booking info card */}
            <View style={st.detailCard}>
              <View style={st.detailSectionHeader}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>🏸</Text>
                <Text style={st.detailSectionTitle}>Thông tin sân thi đấu</Text>
              </View>

              {[
                ['Cơ sở:', clubTitle, true, '#4ade80'],
                ['Sân đấu:', courtTitle, true, '#38bdf8'],
                ['Ngày thi đấu:', booking.date || booking.booking_date || 'Hôm nay', false],
                ['Khung giờ chơi:', booking.slot || booking.slot_time || '17:00 - 18:00', true, '#facc15'],
                ['Tiền thuê sân:', `${courtPrice.toLocaleString('vi-VN')} đ`, false],
                ['Tiền dịch vụ thêm:', `${servicesTotal.toLocaleString('vi-VN')} đ`, false],
                ['TỔNG THANH TOÁN:', `${grandTotal.toLocaleString('vi-VN')} đ`, true, '#facc15'],
              ].map(([label, value, bold, color]) => (
                <View key={label} style={st.detailRow}>
                  <Text style={st.detailRowLabel}>{label}</Text>
                  <Text
                    style={[
                      st.detailRowValue,
                      bold && { fontWeight: '800' },
                      color ? { color } : { color: '#fff' },
                    ]}
                  >
                    {value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {tab === 'service' && (
          <View style={{ padding: 14 }}>
            <View style={st.detailCard}>
              <View style={st.detailSectionHeader}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>🥤</Text>
                <Text style={st.detailSectionTitle}>Dịch Vụ Đã Đặt Đi Kèm</Text>
              </View>
              {servicesList.length === 0 ? (
                <View style={st.centerEmpty}>
                  <Text style={{ fontSize: 40 }}>📦</Text>
                  <Text style={{ color: C.sub, fontSize: 14, marginTop: 10 }}>Không có dịch vụ đi kèm trong đơn này</Text>
                </View>
              ) : (
                servicesList.map((item, idx) => (
                  <View key={item.id || idx} style={st.serviceItemRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={st.serviceItemName}>{item.name}</Text>
                      <Text style={st.serviceItemSub}>Số lượng: x{item.qty} · Đơn giá: {item.price.toLocaleString('vi-VN')} đ</Text>
                    </View>
                    <Text style={st.serviceItemTotal}>
                      {((item.qty || 1) * item.price).toLocaleString('vi-VN')} đ
                    </Text>
                  </View>
                ))
              )}
            </View>
          </View>
        )}

        {tab === 'team' && (
          <View style={{ padding: 14 }}>
            <View style={st.detailCard}>
              <View style={st.detailSectionHeader}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>👥</Text>
                <Text style={st.detailSectionTitle}>Thành viên & Đội nhóm</Text>
              </View>
              <View style={st.centerEmpty}>
                <Text style={{ fontSize: 40 }}>🏸</Text>
                <Text style={{ color: C.sub, fontSize: 14, marginTop: 10 }}>Chưa có thành viên ghép đội</Text>
                <Text style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>Bạn có thể mời bạn bè tham gia sân này</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Cancel button if not cancelled */}
      {booking.status !== 'cancelled' && (
        <View style={st.detailBottomBar}>
          <TouchableOpacity
            style={st.cancelBtn}
            onPress={() =>
              Alert.alert('Huỷ đặt lịch', 'Bạn có chắc chắn muốn huỷ lịch đặt sân này?', [
                { text: 'Không' },
                {
                  text: 'Huỷ lịch',
                  style: 'destructive',
                  onPress: () => {
                    onCancel(booking.id);
                    onBack();
                  },
                },
              ])
            }
          >
            <Text style={st.cancelBtnText}>HUỶ ĐẶT LỊCH</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const st = StyleSheet.create({
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.primaryDark,
    paddingHorizontal: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  detailHeaderTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center' },
  detailTabRow: { flexDirection: 'row', backgroundColor: C.card, borderBottomWidth: 1, borderBottomColor: C.border },
  detailTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  detailTabActive: { borderBottomColor: C.primary },
  detailTabText: { color: C.sub, fontSize: 13, fontWeight: '700' },
  detailTabTextActive: { color: C.primary, fontWeight: '800' },
  statusHeroCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  statusHeroCode: { color: '#fff', fontSize: 14, fontWeight: '900' },
  statusHeroDate: { color: C.sub, fontSize: 11, marginTop: 2 },
  statusHeroBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusHeroBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  detailCard: {
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  detailCustomerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(34,197,94,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: C.primary,
  },
  detailKHLabel: { color: C.sub, fontSize: 13, marginBottom: 2 },
  detailKHName: { color: '#fff', fontWeight: '800', fontSize: 14 },
  detailKHSub: { color: C.sub, fontSize: 12, marginTop: 2 },
  detailSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  detailSectionTitle: { color: C.primary, fontSize: 15, fontWeight: '800' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  detailRowLabel: { color: C.sub, fontSize: 13, flex: 1 },
  detailRowValue: { fontSize: 13, fontWeight: '700', textAlign: 'right' },
  serviceItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  serviceItemName: { color: '#fff', fontSize: 13, fontWeight: '800' },
  serviceItemSub: { color: C.sub, fontSize: 11, marginTop: 2 },
  serviceItemTotal: { color: '#facc15', fontSize: 13, fontWeight: '800' },
  centerEmpty: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  detailBottomBar: {
    padding: 14,
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  cancelBtn: { backgroundColor: '#ef4444', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 1 },
});
