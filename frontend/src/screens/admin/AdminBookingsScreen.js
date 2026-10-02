import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';

export function AdminBookingsScreen({ bookings = [], onUpdateStatus, onCancelBooking }) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'day' | 'fixed' | 'event'

  const filtered = activeTab === 'all' ? bookings : bookings;

  return (
    <View style={st.container}>
      {/* Top Filter Bar */}
      <View style={st.ordersHeader}>
        <TouchableOpacity style={st.branchSelectBtn}>
          <Text style={st.branchSelectText} numberOfLines={1}>
            Sân Hoa Thiên Lý (CLB TPT Sport) ▾
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.datePickerBtn}>
          <Text style={st.datePickerText}>28/08/2026 📅</Text>
        </TouchableOpacity>
      </View>

      {/* Category Filter Pills */}
      <View style={st.orderTabScrollContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 12 }}
        >
          {[
            ['all', 'Tất cả đơn'],
            ['day', 'Đơn ngày'],
            ['fixed', 'Đơn cố định'],
            ['event', 'Sự kiện giao lưu'],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[st.orderCategoryPill, activeTab === key && st.orderCategoryPillActive]}
              onPress={() => setActiveTab(key)}
            >
              <Text
                style={[
                  st.orderCategoryText,
                  activeTab === key && st.orderCategoryTextActive,
                ]}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* List of Bookings */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        renderItem={({ item }) => {
          const isPending = item.status === 'pending';
          const isConfirmed = item.status === 'confirmed';
          const isInUse = item.status === 'in_use';

          return (
            <View style={st.orderCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <View
                  style={[
                    st.tagRibbon,
                    {
                      backgroundColor:
                        isConfirmed ? '#10b981' : isInUse ? '#0284c7' : isPending ? '#f59e0b' : '#ef4444',
                    },
                  ]}
                >
                  <Text style={st.tagRibbonText}>
                    {isConfirmed
                      ? 'ĐÃ DUYỆT'
                      : isInUse
                      ? 'ĐANG THI ĐẤU'
                      : isPending
                      ? 'CHỜ DUYỆT'
                      : 'ĐÃ HỦY'}
                  </Text>
                </View>
                <Text style={st.orderCode}>Mã: {item.id}</Text>
              </View>

              <Text style={st.cardTitle}>
                {item.userName} · {item.userPhone || 'Khách trực tuyến'}
              </Text>
              <Text style={st.cardDetail}>
                🏟️ {item.court?.name || 'Sân Cầu Lông'} · ⏰ {item.slot}
              </Text>
              <Text style={st.cardPrice}>
                💰 {(item.grandTotal || item.totalPrice || 160000).toLocaleString('vi-VN')} đ ({item.paymentMethod || 'Chuyển khoản QR'})
              </Text>

              {item.note ? <Text style={st.noteText}>📝 Ghi chú: {item.note}</Text> : null}

              {/* Action Buttons */}
              <View style={st.actionRow}>
                {isPending && (
                  <TouchableOpacity
                    style={st.approveBtn}
                    onPress={() => {
                      onUpdateStatus(item.id, 'confirmed');
                      Alert.alert('✅ Thành công', `Đã duyệt đơn ${item.id}`);
                    }}
                  >
                    <Text style={st.btnText}>Duyệt Đơn</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={st.cancelBtn}
                  onPress={() =>
                    Alert.alert('Hủy đơn', `Bạn có chắc muốn hủy đơn ${item.id}?`, [
                      { text: 'Không' },
                      {
                        text: 'Hủy đơn',
                        style: 'destructive',
                        onPress: () => onCancelBooking(item.id, 'Admin hủy đơn'),
                      },
                    ])
                  }
                >
                  <Text style={st.cancelBtnText}>Hủy Đơn</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: AL.bg },
  ordersHeader: {
    flexDirection: 'row',
    backgroundColor: AL.headerGreen,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  branchSelectBtn: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  branchSelectText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  datePickerBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  datePickerText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  orderTabScrollContainer: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: AL.border,
  },
  orderCategoryPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f1f5f9',
  },
  orderCategoryPillActive: { backgroundColor: AL.primary },
  orderCategoryText: { fontSize: 12, fontWeight: '700', color: AL.textSub },
  orderCategoryTextActive: { color: '#fff', fontWeight: '800' },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: AL.border,
  },
  tagRibbon: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagRibbonText: { color: '#fff', fontSize: 9, fontWeight: '900' },
  orderCode: { color: AL.textSub, fontSize: 11 },
  cardTitle: { color: AL.textDark, fontSize: 14, fontWeight: '800', marginTop: 2 },
  cardDetail: { color: AL.primaryDark, fontSize: 12, fontWeight: '700', marginTop: 2 },
  cardPrice: { color: '#d97706', fontSize: 12, fontWeight: '800', marginTop: 2 },
  noteText: { color: AL.textSub, fontSize: 11, fontStyle: 'italic', marginTop: 4 },
  actionRow: { flexDirection: 'row', gap: 8, marginTop: 10, justifyContent: 'flex-end' },
  approveBtn: { backgroundColor: AL.primary, borderRadius: 8, paddingHorizontal: 14, paddingVertical: 6 },
  btnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  cancelBtn: { backgroundColor: '#fee2e2', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  cancelBtnText: { color: '#ef4444', fontSize: 11, fontWeight: '800' },
});
