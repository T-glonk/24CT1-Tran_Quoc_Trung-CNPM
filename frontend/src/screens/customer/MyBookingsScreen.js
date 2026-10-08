import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { BookingDetailScreen } from './BookingDetailScreen';

export function MyBookingsScreen({ bookings = [], user, navigate, onCancelBooking }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const mine = bookings.filter((b) => b.userId === user?.id || b.userId === 'user1' || !b.userId);

  if (selectedBooking) {
    return (
      <BookingDetailScreen
        booking={selectedBooking}
        user={user}
        onBack={() => setSelectedBooking(null)}
        onCancel={(id) => {
          onCancelBooking(id);
          setSelectedBooking(null);
        }}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={st.header}>
        <Text style={st.headerTitle}>Lịch Đặt Của Tôi</Text>
        <View style={st.viewAllBtn}>
          <Text style={st.viewAllText}>{mine.length} đơn đặt 📅</Text>
        </View>
      </View>

      {mine.length === 0 ? (
        <View style={st.centerEmpty}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>📋</Text>
          <Text style={{ color: C.sub, fontSize: 15 }}>Bạn chưa có lịch đặt sân nào</Text>
          <TouchableOpacity style={st.bookNowBtn} onPress={() => navigate('booking')}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>🏸 Đặt sân ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={mine}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 14, paddingBottom: 100 }}
          renderItem={({ item }) => {
            const clubName = item.clubName || item.court?.clubName || 'Cơ sở 1: Sân Hoa Thiên Lý';
            const courtName = item.courtName || item.court?.name || 'Sân 1';
            const grandTotal = item.grandTotal || item.totalPrice || 160000;
            const isConfirmed = item.status === 'confirmed';
            const isInUse = item.status === 'in_use';
            const isCancelled = item.status === 'cancelled';

            return (
              <TouchableOpacity
                style={st.bookingItem}
                onPress={() => setSelectedBooking(item)}
                activeOpacity={0.8}
              >
                <View style={st.bookingItemLeft}>
                  <View style={st.bookingTagRow}>
                    <View style={st.bookingTag}>
                      <Text style={st.bookingTagText}>Đơn ngày</Text>
                    </View>
                    <Text style={st.bookingCodeText}>Mã: {item.id}</Text>
                  </View>
                  <Text style={st.bookingItemName}>
                    {clubName} · <Text style={{ color: '#38bdf8' }}>{courtName}</Text>
                  </Text>
                  <Text style={st.bookingItemDetail}>
                    ⏰ Khung giờ: {item.slot || item.slot_time} · {item.date || item.booking_date}
                  </Text>
                  <Text style={st.bookingItemAddr} numberOfLines={1}>
                    📍 {item.court?.location || '207 Quách Thị Trang, Cẩm Lệ, Đà Nẵng'}
                  </Text>
                </View>

                <View style={st.bookingItemRight}>
                  <View
                    style={[
                      st.statusPill,
                      {
                        backgroundColor: isConfirmed
                          ? 'rgba(34,197,94,0.18)'
                          : isInUse
                          ? 'rgba(2,132,199,0.18)'
                          : isCancelled
                          ? 'rgba(239,68,68,0.18)'
                          : 'rgba(245,158,11,0.18)',
                        borderWidth: 1,
                        borderColor: isConfirmed
                          ? '#22c55e'
                          : isInUse
                          ? '#0284c7'
                          : isCancelled
                          ? '#ef4444'
                          : '#f59e0b',
                      },
                    ]}
                  >
                    <Text
                      style={[
                        st.statusText,
                        {
                          color: isConfirmed
                            ? '#4ade80'
                            : isInUse
                            ? '#38bdf8'
                            : isCancelled
                            ? '#f87171'
                            : '#fbbf24',
                        },
                      ]}
                    >
                      ● {isConfirmed ? 'Đã duyệt' : isInUse ? 'Đang chơi' : isCancelled ? 'Đã hủy' : 'Chờ duyệt'}
                    </Text>
                  </View>
                  <Text style={st.priceText}>
                    {grandTotal.toLocaleString('vi-VN')} đ
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const st = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: C.primaryDark,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  viewAllBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  viewAllText: { color: '#4ade80', fontSize: 12, fontWeight: '700' },
  centerEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  bookNowBtn: {
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 16,
  },
  bookingItem: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  bookingItemLeft: { flex: 1 },
  bookingItemRight: { alignItems: 'flex-end', justifyContent: 'space-between', paddingLeft: 8 },
  bookingTagRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  bookingTag: { backgroundColor: C.primary, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  bookingTagText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  bookingCodeText: { color: C.sub, fontSize: 11 },
  bookingItemName: { color: '#fff', fontSize: 14, fontWeight: '800', marginBottom: 4 },
  bookingItemDetail: { color: '#facc15', fontSize: 12, marginBottom: 4, fontWeight: '600' },
  bookingItemAddr: { color: C.sub, fontSize: 11 },
  statusPill: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontSize: 10, fontWeight: '800' },
  priceText: { color: '#facc15', fontSize: 13, fontWeight: '800' },
});
