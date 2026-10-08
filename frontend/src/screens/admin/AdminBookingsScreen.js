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
import { INITIAL_CLUBS } from '../../constants/initialData';

export function AdminBookingsScreen({
  bookings = [],
  clubs = INITIAL_CLUBS,
  selectedClub,
  onSelectClub,
  onUpdateStatus,
  onCancelBooking,
}) {
  const [activeClubFilter, setActiveClubFilter] = useState('all'); // 'all' | clubId
  const [activeStatusTab, setActiveStatusTab] = useState('all'); // 'all' | 'pending' | 'confirmed' | 'in_use' | 'cancelled'

  const filtered = bookings.filter((b) => {
    // Filter by facility
    if (activeClubFilter !== 'all') {
      const matchClubId = b.clubId === activeClubFilter || b.court?.clubId === activeClubFilter;
      if (!matchClubId) return false;
    }
    // Filter by status
    if (activeStatusTab !== 'all') {
      if (b.status !== activeStatusTab) return false;
    }
    return true;
  });

  return (
    <View style={st.container}>
      {/* Facility Filter Bar */}
      <View style={st.facilityFilterCard}>
        <Text style={st.facilityFilterTitle}>🏢 LỌC ĐƠN THEO CƠ SỞ:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.facilityScroll}>
          <TouchableOpacity
            style={[st.facilityChip, activeClubFilter === 'all' && st.facilityChipActive]}
            onPress={() => setActiveClubFilter('all')}
          >
            <Text style={[st.facilityChipText, activeClubFilter === 'all' && st.facilityChipTextActive]}>
              🌐 Tất cả cơ sở ({bookings.length})
            </Text>
          </TouchableOpacity>

          {clubs.map((club) => {
            const countForClub = bookings.filter(
              (b) => b.clubId === club.id || b.court?.clubId === club.id
            ).length;
            const isSelected = activeClubFilter === club.id;

            return (
              <TouchableOpacity
                key={club.id}
                style={[st.facilityChip, isSelected && st.facilityChipActive]}
                onPress={() => {
                  setActiveClubFilter(club.id);
                  if (onSelectClub) onSelectClub(club);
                }}
              >
                <Text style={[st.facilityChipText, isSelected && st.facilityChipTextActive]}>
                  {club.name.replace('QT Sport - ', '')} ({countForClub})
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Status Filter Pills */}
      <View style={st.statusFilterCard}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.statusScroll}>
          {[
            ['all', 'Tất cả trạng thái'],
            ['pending', '⏳ Chờ duyệt'],
            ['confirmed', '✅ Đã duyệt'],
            ['in_use', '🏸 Đang thi đấu'],
            ['cancelled', '❌ Đã hủy'],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              style={[st.statusPill, activeStatusTab === key && st.statusPillActive]}
              onPress={() => setActiveStatusTab(key)}
            >
              <Text style={[st.statusPillText, activeStatusTab === key && st.statusPillTextActive]}>
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Bookings Count Header */}
      <View style={st.resultsCountRow}>
        <Text style={st.resultsCountText}>
          Danh sách: <Text style={{ fontWeight: '900', color: AL.textDark }}>{filtered.length} đơn đặt sân</Text>
        </Text>
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

          const facilityName =
            item.clubName ||
            item.court?.clubName ||
            clubs.find((c) => c.id === item.clubId || c.id === item.court?.clubId)?.name ||
            'QT Sport - Sân Hoa Thiên Lý';

          return (
            <View style={st.orderCard}>
              <View style={st.orderTopRow}>
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

              {/* Facility & Court Info */}
              <View style={st.facilityTagBox}>
                <Text style={st.facilityTagText} numberOfLines={1}>
                  🏢 {facilityName}
                </Text>
              </View>

              <Text style={st.cardCustomer}>
                👤 {item.userName} · 📞 {item.userPhone || 'Khách trực tuyến'}
              </Text>

              <Text style={st.cardCourtTime}>
                🏸 {item.court?.name || 'Sân Cầu Lông'} · ⏰ {item.slot} ({item.date || 'Hôm nay'})
              </Text>

              <Text style={st.cardPrice}>
                💰 {(item.grandTotal || item.totalPrice || 160000).toLocaleString('vi-VN')} đ ({item.paymentMethod || 'Chuyển khoản QR'})
              </Text>

              {item.note ? <Text style={st.noteText}>📝 {item.note}</Text> : null}

              {/* Action Buttons */}
              <View style={st.actionRow}>
                {isPending && (
                  <TouchableOpacity
                    style={st.approveBtn}
                    onPress={() => {
                      if (onUpdateStatus) onUpdateStatus(item.id, 'confirmed');
                      Alert.alert('✅ Thành công', `Đã duyệt đơn ${item.id}`);
                    }}
                  >
                    <Text style={st.btnText}>Duyệt Đơn Ngay</Text>
                  </TouchableOpacity>
                )}
                {item.status !== 'cancelled' && (
                  <TouchableOpacity
                    style={st.cancelBtn}
                    onPress={() =>
                      Alert.alert('Hủy đơn', `Bạn có chắc muốn hủy đơn ${item.id}?`, [
                        { text: 'Không' },
                        {
                          text: 'Hủy đơn',
                          style: 'destructive',
                          onPress: () => onCancelBooking && onCancelBooking(item.id, 'Admin hủy đơn'),
                        },
                      ])
                    }
                  >
                    <Text style={st.cancelBtnText}>Hủy Đơn</Text>
                  </TouchableOpacity>
                )}
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
  facilityFilterCard: {
    backgroundColor: '#064e3b',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#047857',
  },
  facilityFilterTitle: {
    color: '#a7f3d0',
    fontSize: 11,
    fontWeight: '900',
    marginBottom: 6,
  },
  facilityScroll: {
    gap: 8,
  },
  facilityChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  facilityChipActive: {
    backgroundColor: '#10b981',
    borderColor: '#34d399',
  },
  facilityChipText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '700',
  },
  facilityChipTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  statusFilterCard: {
    backgroundColor: '#ffffff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: AL.border,
  },
  statusScroll: {
    gap: 8,
    paddingHorizontal: 12,
  },
  statusPill: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  statusPillActive: {
    backgroundColor: AL.primary,
  },
  statusPillText: {
    color: AL.textSub,
    fontSize: 12,
    fontWeight: '700',
  },
  statusPillTextActive: {
    color: '#ffffff',
    fontWeight: '800',
  },
  resultsCountRow: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  resultsCountText: {
    color: AL.textSub,
    fontSize: 12,
  },
  orderCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AL.border,
    elevation: 1,
  },
  orderTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tagRibbon: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  tagRibbonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
  },
  orderCode: {
    color: AL.textSub,
    fontSize: 11,
    fontWeight: '700',
  },
  facilityTagBox: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  facilityTagText: {
    color: '#166534',
    fontSize: 11,
    fontWeight: '800',
  },
  cardCustomer: {
    color: AL.textDark,
    fontSize: 15,
    fontWeight: '800',
    marginBottom: 4,
  },
  cardCourtTime: {
    color: AL.textSub,
    fontSize: 13,
    marginBottom: 4,
  },
  cardPrice: {
    color: AL.primaryDark,
    fontSize: 13,
    fontWeight: '800',
    marginBottom: 4,
  },
  noteText: {
    color: '#64748b',
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 12,
  },
  approveBtn: {
    flex: 1.5,
    backgroundColor: AL.primary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '800',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  cancelBtnText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '800',
  },
});
