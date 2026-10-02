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

  const orderCode = '#' + (parseInt(booking.id) % 100000 || 9684);
  const totalHours = booking.slot ? booking.slot.split(',').length : 1;
  const totalPrice = (booking.court?.price || 80000) * totalHours;

  return (
    <View style={{ flex: 1, backgroundColor: C.primary }}>
      {/* Header */}
      <View style={st.detailHeader}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: '800' }}>←</Text>
        </TouchableOpacity>
        <Text style={st.detailHeaderTitle}>Chi tiết đặt lịch</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={st.detailTabRow}>
        {[
          ['info', 'Thông tin'],
          ['service', 'Dịch vụ'],
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

      <ScrollView style={{ flex: 1, backgroundColor: C.primary }} showsVerticalScrollIndicator={false}>
        {tab === 'info' && (
          <View style={{ padding: 14 }}>
            {/* Customer card */}
            <View style={st.detailCard}>
              <View style={st.detailCustomerRow}>
                <View style={st.detailAvatar}>
                  <Text style={{ fontSize: 28 }}>😎</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={st.detailKHLabel}>
                    KH: <Text style={st.detailKHName}>{booking.userName || user?.name}</Text>
                  </Text>
                  <Text style={st.detailKHSub}>
                    Đối tượng: <Text style={{ fontWeight: '800', color: '#1e293b' }}>HỌC SINH SINH VIÊN</Text>
                  </Text>
                  <Text style={st.detailKHSub}>
                    Số điện thoại: <Text style={{ color: '#1e293b' }}>{booking.userPhone || user?.phone}</Text>
                  </Text>
                </View>
              </View>
            </View>

            {/* Booking info card */}
            <View style={st.detailCard}>
              <View style={st.detailSectionHeader}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>📋</Text>
                <Text style={st.detailSectionTitle}>Thông tin đơn</Text>
              </View>

              {[
                ['Mã lịch đặt:', orderCode, true],
                ['Trạng thái:', booking.status === 'confirmed' ? 'Đã xác nhận' : 'Chờ duyệt', false, '#16a34a'],
                ['Tên CLB:', booking.court?.clubName || 'CLB Cầu Lông TPT Sport', false],
                ['Địa chỉ:', booking.court?.location || '207 Quách Thị Trang, Cẩm Lệ, Đà Nẵng', false],
                ['Ngày chơi:', booking.date, false],
                ['Khung giờ:', `${booking.court?.name}: ${booking.slot}`, false, C.primary],
                ['Tổng tiền:', `${totalPrice.toLocaleString('vi-VN')} đ`, true],
              ].map(([label, value, bold, color]) => (
                <View key={label} style={st.detailRow}>
                  <Text style={st.detailRowLabel}>{label}</Text>
                  <Text
                    style={[
                      st.detailRowValue,
                      bold && { color: C.primary, fontWeight: '800' },
                      color && { color },
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
                <Text style={st.detailSectionTitle}>Dịch vụ đi kèm</Text>
              </View>
              <View style={st.centerEmpty}>
                <Text style={{ fontSize: 40 }}>📦</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 10 }}>Chưa có dịch vụ thêm</Text>
              </View>
            </View>
          </View>
        )}

        {tab === 'team' && (
          <View style={{ padding: 14 }}>
            <View style={st.detailCard}>
              <View style={st.detailSectionHeader}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>👥</Text>
                <Text style={st.detailSectionTitle}>Thành viên đội nhóm</Text>
              </View>
              <View style={st.centerEmpty}>
                <Text style={{ fontSize: 40 }}>👥</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 10 }}>Chưa có thành viên đội nhóm</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Cancel button */}
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
    </View>
  );
}

const st = StyleSheet.create({
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  detailHeaderTitle: { color: '#fff', fontSize: 17, fontWeight: '800', flex: 1, textAlign: 'center' },
  detailTabRow: { flexDirection: 'row', backgroundColor: C.primary, paddingHorizontal: 14 },
  detailTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  detailTabActive: { borderBottomColor: '#fff' },
  detailTabText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600' },
  detailTabTextActive: { color: '#fff', fontWeight: '800' },
  detailCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12 },
  detailCustomerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0fdf4',
  },
  detailAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#fde68a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailKHLabel: { color: '#64748b', fontSize: 13, marginBottom: 2 },
  detailKHName: { color: '#1e293b', fontWeight: '800', fontSize: 14 },
  detailKHSub: { color: '#64748b', fontSize: 12, marginTop: 2 },
  detailSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0fdf4',
  },
  detailSectionTitle: { color: C.primary, fontSize: 15, fontWeight: '800' },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: 6,
  },
  detailRowLabel: { color: '#64748b', fontSize: 13, flex: 1 },
  detailRowValue: { color: '#1e293b', fontSize: 13, fontWeight: '700', textAlign: 'right' },
  centerEmpty: { alignItems: 'center', justifyContent: 'center', padding: 20 },
  detailBottomBar: {
    padding: 14,
    backgroundColor: C.primary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  cancelBtn: { backgroundColor: C.danger, borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontSize: 15, fontWeight: '900', letterSpacing: 1 },
});
