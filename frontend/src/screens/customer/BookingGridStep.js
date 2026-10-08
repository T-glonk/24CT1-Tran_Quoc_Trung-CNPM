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
import { HOURS, INITIAL_BOOKED, INITIAL_CLUBS } from '../../constants/initialData';

export function BookingGridStep({
  user,
  courts = [],
  clubs = INITIAL_CLUBS,
  selectedClub,
  onSelectClub,
  onNext,
  onBack,
}) {
  const [activeClub, setActiveClub] = useState(selectedClub || clubs[0] || INITIAL_CLUBS[0]);
  const [bookedSlots, setBookedSlots] = useState(INITIAL_BOOKED);
  const [selected, setSelected] = useState([]);
  const [selectedDate, setSelectedDate] = useState('28/08/2026');

  const DATE_OPTIONS = [
    { label: 'Hôm nay', date: '28/08/2026', day: 'Thứ 4' },
    { label: 'Ngày mai', date: '29/08/2026', day: 'Thứ 5' },
    { label: '30/08', date: '30/08/2026', day: 'Thứ 6' },
    { label: '31/08', date: '31/08/2026', day: 'Thứ 7' },
    { label: '01/09', date: '01/09/2026', day: 'CN' },
  ];

  // Lọc chính xác danh sách các sân THUỘC RIÊNG CƠ SỞ ĐƯỢC CHỌN (Không gộp chung các cơ sở khác)
  const facilityCourts = courts.filter((c) => c.clubId === activeClub.id);
  const displayCourts = facilityCourts.length > 0 ? facilityCourts : courts.slice(0, activeClub.totalCourts || 6);

  const handleSwitchClub = (club) => {
    setActiveClub(club);
    if (onSelectClub) onSelectClub(club);
    setSelected([]); // Reset slots khi đổi cơ sở
  };

  const isBooked = (cid, h) => bookedSlots.some((s) => s.courtId === cid && s.hour === h);
  const isSelected = (cid, h) => selected.some((s) => s.courtId === cid && s.hour === h);

  const toggleSlot = (cid, h, court) => {
    if (isBooked(cid, h)) return;
    if (court.status === 'maintenance') {
      Alert.alert('Thông báo', `${court.name} đang trong thời gian bảo dưỡng kỹ thuật.`);
      return;
    }
    setSelected((prev) => {
      const exists = prev.find((s) => s.courtId === cid && s.hour === h);
      return exists
        ? prev.filter((s) => !(s.courtId === cid && s.hour === h))
        : [...prev, { courtId: cid, hour: h, courtName: court.name, price: court.price }];
    });
  };

  const totalHours = selected.length;
  const totalPrice = selected.reduce((sum, s) => {
    const c = displayCourts.find((ct) => ct.id === s.courtId) || courts.find((ct) => ct.id === s.courtId);
    return sum + (c ? c.price : (s.price || 80000));
  }, 0);

  const handleNext = () => {
    if (selected.length === 0) {
      Alert.alert('Chưa chọn giờ', 'Vui lòng nhấn vào ô khung giờ còn trống để đặt sân');
      return;
    }
    onNext(selected, bookedSlots, selectedDate, setBookedSlots, activeClub);
  };

  // Helper rút gọn tên sân (vd: "Sân 1", "Sân 2", "Sân 5 VIP")
  const getShortCourtName = (fullCourt, index) => {
    if (!fullCourt) return `Sân ${index + 1}`;
    const name = fullCourt.name || '';
    if (name.includes('Sân 1')) return 'Sân 1';
    if (name.includes('Sân 2')) return 'Sân 2';
    if (name.includes('Sân 3')) return 'Sân 3';
    if (name.includes('Sân 4')) return 'Sân 4';
    if (name.includes('Sân 5')) return name.includes('VIP') ? 'Sân 5 (VIP)' : 'Sân 5';
    if (name.includes('Sân 6')) return 'Sân 6';
    if (name.includes('Sân 7')) return 'Sân 7';
    if (name.includes('Sân 8')) return name.includes('Bảo dưỡng') ? 'Sân 8 (Bảo trì)' : 'Sân 8';
    return `Sân ${index + 1}`;
  };

  const CELL_W = 56;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={st.gridHeader}>
        <TouchableOpacity onPress={onBack} style={st.backBtn}>
          <Text style={{ color: '#fff', fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={st.gridHeaderTitle}>ĐẶT SÂN THEO KHUNG GIỜ</Text>
          <Text style={st.gridHeaderSub} numberOfLines={1}>{activeClub.name}</Text>
        </View>
      </View>

      {/* 1. THANH CHỌN CƠ SỞ (FACILITY SWITCHER) */}
      <View style={st.facilitySwitcherSection}>
        <Text style={st.switcherLabel}>CHỌN CƠ SỞ SÂN THI ĐẤU:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
          {clubs.map((club, idx) => {
            const isCurrent = activeClub.id === club.id;
            return (
              <TouchableOpacity
                key={club.id}
                style={[st.clubChip, isCurrent && st.clubChipActive]}
                onPress={() => handleSwitchClub(club)}
                activeOpacity={0.8}
              >
                <Text style={[st.clubChipIcon, isCurrent && { color: '#fff' }]}>🏸</Text>
                <View>
                  <Text style={[st.clubChipText, isCurrent && st.clubChipTextActive]}>
                    Cơ sở {idx + 1}
                  </Text>
                  <Text style={[st.clubChipSub, isCurrent && { color: '#d1fae5' }]} numberOfLines={1}>
                    {club.name.split(':')[1] ? club.name.split(':')[1].trim() : club.name}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 2. THÔNG TIN CƠ SỞ ĐANG CHỌN */}
      <View style={st.currentFacilityCard}>
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={st.currentFacilityName}>{activeClub.name}</Text>
          </View>
          <Text style={st.currentFacilityAddr} numberOfLines={1}>📍 {activeClub.address}</Text>
          <Text style={st.currentFacilityPrice}>💰 Giá thuê: <Text style={{ fontWeight: '800', color: '#059669' }}>{activeClub.priceRange || '60.000đ - 120.000đ/h'}</Text></Text>
        </View>
        <View style={st.facilityBadgeRight}>
          <Text style={st.facilityCourtCount}>{displayCourts.length} SÂN</Text>
          <Text style={st.facilityRating}>⭐ {activeClub.rating || 5.0}</Text>
        </View>
      </View>

      {/* 3. CHỌN NGÀY THI ĐẤU */}
      <View style={st.dateRowSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12, gap: 8 }}>
          {DATE_OPTIONS.map((item) => {
            const isSel = selectedDate === item.date;
            return (
              <TouchableOpacity
                key={item.date}
                style={[st.dateChip, isSel && st.dateChipActive]}
                onPress={() => {
                  setSelectedDate(item.date);
                  setSelected([]); // Reset slots khi đổi ngày
                }}
              >
                <Text style={[st.dateChipDay, isSel && { color: '#d1fae5' }]}>{item.day}</Text>
                <Text style={[st.dateChipLabel, isSel && st.dateChipLabelActive]}>{item.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Legend Ribbon */}
      <View style={st.legendRow}>
        {[
          ['#ffffff', 'Trống', '#cbd5e1'],
          ['#059669', 'Đang chọn', '#059669'],
          ['#fca5a5', 'Đã đặt', '#f87171'],
          ['#e2e8f0', 'Bảo trì', '#94a3b8'],
        ].map(([bg, label, border]) => (
          <View key={label} style={st.legendItem}>
            <View style={[st.legendDot, { backgroundColor: bg, borderColor: border }]} />
            <Text style={st.legendText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* 4. BẢNG TRẠNG THÁI KHUNG GIỜ (CHỈ HIỆN SÂN CỦA CƠ SỞ ĐƯỢC CHỌN) */}
      <ScrollView style={{ flex: 1 }} horizontal showsHorizontalScrollIndicator={true}>
        <View style={{ paddingBottom: 90 }}>
          {/* Hour header row */}
          <View style={{ flexDirection: 'row', backgroundColor: '#e2e8f0', borderBottomWidth: 1, borderColor: '#cbd5e1' }}>
            <View style={st.gridCourtLabelHeader}>
              <Text style={st.gridCourtLabelHeaderText}>SỐ SÂN</Text>
            </View>
            {HOURS.map((h) => (
              <View key={h} style={[st.gridHourCell, { width: CELL_W }]}>
                <Text style={st.gridHourText}>{h}</Text>
              </View>
            ))}
          </View>

          {/* Court rows */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {displayCourts.map((court, idx) => {
              const courtShortTitle = getShortCourtName(court, idx);
              const isMaintenance = court.status === 'maintenance';

              return (
                <View key={court.id || idx} style={st.gridRow}>
                  {/* Cột Tên sân riêng biệt */}
                  <View style={[st.gridCourtLabel, isMaintenance && { backgroundColor: '#f1f5f9' }]}>
                    <Text style={st.gridCourtNumber}>{courtShortTitle}</Text>
                    <Text style={st.gridCourtPriceTag}>
                      {isMaintenance ? 'Bảo dưỡng' : `${((court.price || 80000) / 1000)}k/h`}
                    </Text>
                  </View>

                  {/* Các ô khung giờ */}
                  {HOURS.map((h, hIdx) => {
                    const hour = 5 + hIdx;
                    const booked = isBooked(court.id, hour);
                    const sel = isSelected(court.id, hour);

                    return (
                      <TouchableOpacity
                        key={h}
                        style={[
                          st.gridCell,
                          { width: CELL_W },
                          booked && st.gridCellBooked,
                          sel && st.gridCellSelected,
                          isMaintenance && st.gridCellMaintenance,
                        ]}
                        onPress={() => toggleSlot(court.id, hour, court)}
                        activeOpacity={booked || isMaintenance ? 1 : 0.7}
                      >
                        {sel ? (
                          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '900' }}>✓</Text>
                        ) : booked ? (
                          <Text style={{ color: '#b91c1c', fontSize: 9, fontWeight: '700' }}>ĐÃ ĐẶT</Text>
                        ) : isMaintenance ? (
                          <Text style={{ color: '#94a3b8', fontSize: 9 }}>✕</Text>
                        ) : null}
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom Floating Bar */}
      <View style={st.gridBottomBar}>
        <View style={st.gridBottomInfo}>
          <Text style={st.gridBottomFacilityText} numberOfLines={1}>
            📍 {activeClub.name.split(':')[0] || 'QT Sport'} • {selectedDate}
          </Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
            <Text style={st.gridBottomText}>
              Đã chọn: <Text style={st.gridBottomBold}>{totalHours} giờ</Text> ({selected.length} ô)
            </Text>
            <Text style={st.gridBottomPrice}>
              {totalPrice.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[st.nextBtn, selected.length === 0 && { opacity: 0.5 }]}
          onPress={handleNext}
          disabled={selected.length === 0}
        >
          <Text style={st.nextBtnText}>TIẾP TỤC ĐẶT SÂN →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  gridHeader: {
    backgroundColor: '#065f46',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  gridHeaderTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  gridHeaderSub: {
    color: '#a7f3d0',
    fontSize: 11,
    marginTop: 2,
  },
  facilitySwitcherSection: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  switcherLabel: {
    color: '#64748b',
    fontSize: 10,
    fontWeight: '800',
    marginHorizontal: 14,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  clubChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    gap: 6,
  },
  clubChipActive: {
    backgroundColor: '#059669',
    borderColor: '#047857',
  },
  clubChipIcon: { fontSize: 14 },
  clubChipText: { color: '#334155', fontSize: 12, fontWeight: '800' },
  clubChipTextActive: { color: '#fff' },
  clubChipSub: { color: '#64748b', fontSize: 10, maxWidth: 120 },
  currentFacilityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecfdf5',
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  currentFacilityName: { color: '#064e3b', fontSize: 13, fontWeight: '800' },
  currentFacilityAddr: { color: '#047857', fontSize: 11, marginTop: 2 },
  currentFacilityPrice: { color: '#374151', fontSize: 11, marginTop: 3 },
  facilityBadgeRight: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#6ee7b7',
  },
  facilityCourtCount: { color: '#059669', fontSize: 11, fontWeight: '900' },
  facilityRating: { color: '#d97706', fontSize: 10, fontWeight: '700', marginTop: 2 },
  dateRowSection: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
    marginTop: 8,
  },
  dateChip: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  dateChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  dateChipDay: { color: '#64748b', fontSize: 10, fontWeight: '600' },
  dateChipLabel: { color: '#1e293b', fontSize: 12, fontWeight: '800' },
  dateChipLabelActive: { color: '#fff' },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  legendDot: { width: 14, height: 14, borderRadius: 3, borderWidth: 1 },
  legendText: { color: '#475569', fontSize: 11, fontWeight: '600' },
  gridCourtLabelHeader: {
    width: 95,
    paddingVertical: 8,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cbd5e1',
  },
  gridCourtLabelHeaderText: { color: '#334155', fontSize: 10, fontWeight: '800' },
  gridHourCell: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderLeftWidth: 1,
    borderColor: '#cbd5e1',
  },
  gridHourText: { color: '#1e293b', fontSize: 11, fontWeight: '800' },
  gridRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  gridCourtLabel: {
    width: 95,
    paddingVertical: 12,
    paddingHorizontal: 6,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCourtNumber: { color: '#0f172a', fontSize: 12, fontWeight: '800' },
  gridCourtPriceTag: { color: '#059669', fontSize: 10, fontWeight: '700', marginTop: 2 },
  gridCell: {
    height: 48,
    backgroundColor: '#fff',
    borderRightWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCellBooked: {
    backgroundColor: '#fee2e2',
  },
  gridCellSelected: {
    backgroundColor: '#059669',
  },
  gridCellMaintenance: {
    backgroundColor: '#f1f5f9',
  },
  gridBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 8,
  },
  gridBottomInfo: { flex: 1 },
  gridBottomFacilityText: { color: '#64748b', fontSize: 11, fontWeight: '600' },
  gridBottomText: { color: '#334155', fontSize: 12 },
  gridBottomBold: { fontWeight: '800', color: '#0f172a' },
  gridBottomPrice: { color: '#059669', fontSize: 16, fontWeight: '900' },
  nextBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextBtnText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
});
