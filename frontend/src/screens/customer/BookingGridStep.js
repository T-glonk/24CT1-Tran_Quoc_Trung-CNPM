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
import { HOURS, INITIAL_BOOKED } from '../../constants/initialData';

export function BookingGridStep({ user, courts, onNext, onBack }) {
  const [bookedSlots, setBookedSlots] = useState(INITIAL_BOOKED);
  const [selected, setSelected] = useState([]);
  const [selectedDate] = useState('28/08/2026');

  const isBooked = (cid, h) => bookedSlots.some((s) => s.courtId === cid && s.hour === h);
  const isSelected = (cid, h) => selected.some((s) => s.courtId === cid && s.hour === h);

  const toggleSlot = (cid, h) => {
    if (isBooked(cid, h)) return;
    setSelected((prev) => {
      const exists = prev.find((s) => s.courtId === cid && s.hour === h);
      return exists
        ? prev.filter((s) => !(s.courtId === cid && s.hour === h))
        : [...prev, { courtId: cid, hour: h }];
    });
  };

  const totalHours = selected.length;
  const totalPrice = selected.reduce((sum, s) => {
    const c = courts.find((ct) => ct.id === s.courtId);
    return sum + (c ? c.price : 0);
  }, 0);

  const handleNext = () => {
    if (selected.length === 0) {
      Alert.alert('Lỗi', 'Vui lòng chọn ít nhất 1 khung giờ');
      return;
    }
    onNext(selected, bookedSlots, selectedDate, setBookedSlots);
  };

  const CELL_W = 54;

  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      {/* Header */}
      <View style={st.gridHeader}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={st.gridHeaderTitle}>ĐẶT LỊCH THEO SÂN - TRỰC QUAN</Text>
        <TouchableOpacity style={st.datePill}>
          <Text style={st.datePillText}>{selectedDate} 📅</Text>
        </TouchableOpacity>
      </View>

      {/* Legend Ribbon */}
      <View style={st.legendRow}>
        {[
          ['#fff', 'Trống'],
          ['#f87171', 'Đã đặt'],
          ['#9ca3af', 'Khoá'],
          ['#a855f7', '! Sự kiện'],
        ].map(([color, label]) => (
          <View key={label} style={st.legendItem}>
            <View
              style={[
                st.legendDot,
                {
                  backgroundColor: color,
                  borderWidth: color === '#fff' ? 1 : 0,
                  borderColor: '#ccc',
                },
              ]}
            />
            <Text style={st.legendText}>{label}</Text>
          </View>
        ))}
      </View>

      <Text style={st.noteText}>
        Lưu ý: Nếu bạn cần đặt lịch cố định vui lòng liên hệ hotline: {user?.phone || '0905 591 379'}
      </Text>

      {/* Scrollable grid */}
      <ScrollView style={{ flex: 1 }} horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Hour header row */}
          <View style={{ flexDirection: 'row' }}>
            <View style={st.gridCourtLabelHeader} />
            {HOURS.map((h) => (
              <View key={h} style={[st.gridHourCell, { width: CELL_W }]}>
                <Text style={st.gridHourText}>{h}</Text>
              </View>
            ))}
          </View>
          {/* Court rows */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {courts.map((court) => (
              <View key={court.id} style={{ flexDirection: 'row' }}>
                <View style={st.gridCourtLabel}>
                  <Text style={st.gridCourtText} numberOfLines={2}>
                    {court.name}
                  </Text>
                </View>
                {HOURS.map((h, idx) => {
                  const hour = 5 + idx;
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
                      ]}
                      onPress={() => toggleSlot(court.id, hour)}
                      activeOpacity={booked ? 1 : 0.7}
                    >
                      {sel && <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={st.gridBottomBar}>
        <View style={st.gridBottomInfo}>
          <Text style={st.gridBottomUp}>∧</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: '100%',
              paddingHorizontal: 4,
            }}
          >
            <Text style={st.gridBottomText}>
              Tổng giờ: <Text style={st.gridBottomBold}>{totalHours}h00</Text>
            </Text>
            <Text style={st.gridBottomText}>
              Tổng tiền:{' '}
              <Text style={st.gridBottomBold}>{totalPrice.toLocaleString('vi-VN')} đ</Text>
            </Text>
          </View>
        </View>
        <TouchableOpacity
          style={[st.nextBtn, selected.length === 0 && { opacity: 0.5 }]}
          onPress={handleNext}
        >
          <Text style={st.nextBtnText}>TIẾP THEO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  gridHeader: {
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  gridHeaderTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  datePill: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  datePillText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
    flexWrap: 'wrap',
    gap: 10,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 14, height: 14, borderRadius: 3 },
  legendText: { color: '#374151', fontSize: 11 },
  noteText: {
    color: C.danger,
    fontSize: 11,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#fef2f2',
    textAlign: 'center',
  },
  gridCourtLabelHeader: { width: 72, backgroundColor: '#f8fafc' },
  gridCourtLabel: {
    width: 72,
    backgroundColor: '#f8fafc',
    borderRightWidth: 1,
    borderColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 2,
    borderBottomWidth: 1,
  },
  gridCourtText: { color: '#374151', fontSize: 10, fontWeight: '700', textAlign: 'center' },
  gridHourCell: {
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#e2e8f0',
    borderBottomWidth: 1,
    backgroundColor: '#f8fafc',
  },
  gridHourText: { color: '#64748b', fontSize: 10 },
  gridCell: {
    height: 38,
    borderRightWidth: 1,
    borderColor: '#e2e8f0',
    borderBottomWidth: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridCellBooked: { backgroundColor: '#f87171' },
  gridCellSelected: { backgroundColor: '#bbf7d0', borderWidth: 1, borderColor: '#16a34a' },
  gridBottomBar: { backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e2e8f0' },
  gridBottomInfo: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, alignItems: 'center' },
  gridBottomUp: { color: C.primary, fontSize: 16, marginBottom: 4 },
  gridBottomText: { color: '#374151', fontSize: 14 },
  gridBottomBold: { fontWeight: '800', color: '#1e293b' },
  nextBtn: {
    backgroundColor: C.warning,
    paddingVertical: 14,
    alignItems: 'center',
    margin: 12,
    borderRadius: 12,
  },
  nextBtnText: { color: '#1e293b', fontWeight: '900', fontSize: 15, letterSpacing: 1 },
});
