import React, { useState, useRef, useEffect } from 'react';
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
import {
  generateBookingDays,
  isPastSlot,
  getMonthYearDisplay,
  getTodayDateStr,
} from '../../utils/dateUtils';

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
  
  // Khởi tạo dải ngày động thời gian thực (30 ngày tới bắt đầu từ hôm nay)
  const [daysList] = useState(() => generateBookingDays(30));
  const [selectedDate, setSelectedDate] = useState(() => getTodayDateStr());
  
  // Ref để cuộn ngang thanh chọn ngày
  const dateScrollRef = useRef(null);

  // Lọc chính xác danh sách các sân THUỘC RIÊNG CƠ SỞ ĐƯỢC CHỌN
  const facilityCourts = courts.filter((c) => c.clubId === activeClub.id);
  const displayCourts = facilityCourts.length > 0 ? facilityCourts : courts.slice(0, activeClub.totalCourts || 8);

  const handleSwitchClub = (club) => {
    setActiveClub(club);
    if (onSelectClub) onSelectClub(club);
    setSelected([]); // Reset slots khi đổi cơ sở
  };

  const isBooked = (cid, h) => bookedSlots.some((s) => s.courtId === cid && s.hour === h);
  const isSelected = (cid, h) => selected.some((s) => s.courtId === cid && s.hour === h);

  const toggleSlot = (cid, h, court) => {
    // 1. Kiểm tra nếu slot đã trôi qua thời gian thực tế
    if (isPastSlot(selectedDate, h)) {
      Alert.alert(
        'Khung giờ đã qua',
        `Khung giờ ${h}:00 - ${h + 1}:00 ngày ${selectedDate} đã trôi qua so với thời gian hiện tại. Vui lòng chọn khung giờ khác.`
      );
      return;
    }

    // 2. Kiểm tra nếu slot đã có người đặt
    if (isBooked(cid, h)) {
      Alert.alert('Đã được đặt', `Khung giờ này đã có khách hàng đặt trước.`);
      return;
    }

    // 3. Kiểm tra nếu sân đang bảo trì
    if (court.status === 'maintenance') {
      Alert.alert('Bảo trì', `${court.name} đang trong thời gian bảo dưỡng kỹ thuật định kỳ.`);
      return;
    }

    // Chọn / Bỏ chọn slot
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
      Alert.alert('Chưa chọn giờ', 'Vui lòng nhấn vào ô khung giờ còn trống màu trắng để đặt sân');
      return;
    }
    onNext(selected, bookedSlots, selectedDate, setBookedSlots, activeClub);
  };

  // Nút điều hướng ngày sang trái / phải
  const handleShiftDate = (direction) => {
    const currentIndex = daysList.findIndex((d) => d.date === selectedDate);
    if (currentIndex === -1) return;
    
    let targetIndex = currentIndex + direction;
    if (targetIndex < 0) targetIndex = 0;
    if (targetIndex >= daysList.length) targetIndex = daysList.length - 1;

    const targetDay = daysList[targetIndex];
    setSelectedDate(targetDay.date);
    setSelected([]); // Reset slots khi đổi ngày

    // Cuộn nhẹ dải ngày
    if (dateScrollRef.current) {
      dateScrollRef.current.scrollTo({
        x: Math.max(0, targetIndex * 68 - 100),
        animated: true,
      });
    }
  };

  // Helper hiển thị tên sân rút gọn giống mẫu: C.Lông 1, C.Lông 2, ...
  const getShortCourtName = (fullCourt, index) => {
    return `C.Lông ${index + 1}`;
  };

  const CELL_W = 58;

  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      {/* ─── 1. HEADER XANH ĐẬM (THEO ẢNH MẪU) ─────────────────────────── */}
      <View style={st.topHeaderSection}>
        {/* Hàng 1: Nút Back + Tiêu đề */}
        <View style={st.headerTitleRow}>
          <TouchableOpacity onPress={onBack} style={st.backBtn} activeOpacity={0.7}>
            <Text style={st.backBtnText}>‹</Text>
          </TouchableOpacity>
          <Text style={st.headerTitle} numberOfLines={1}>
            ĐẶT LỊCH THEO SÂN - TRỰC QUAN
          </Text>
        </View>

        {/* Hàng 2: Chọn tháng / năm + Nút điều hướng < > */}
        <View style={st.monthNavRow}>
          <TouchableOpacity
            style={st.monthPickerBtn}
            onPress={() => Alert.alert('Thời gian thực', `Hệ thống đang đồng bộ theo thời gian thực tế: ${selectedDate}`)}
            activeOpacity={0.8}
          >
            <Text style={st.monthPickerText}>
              {getMonthYearDisplay(selectedDate)} ⌵
            </Text>
          </TouchableOpacity>

          <View style={st.navArrowsGroup}>
            <TouchableOpacity
              style={st.arrowBtn}
              onPress={() => handleShiftDate(-1)}
              activeOpacity={0.7}
            >
              <Text style={st.arrowBtnText}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={st.arrowBtn}
              onPress={() => handleShiftDate(1)}
              activeOpacity={0.7}
            >
              <Text style={st.arrowBtnText}>›</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Hàng 3: Dải chọn ngày (Thứ / Ngày-Tháng) dạng Pill */}
        <ScrollView
          ref={dateScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={st.dateScrollContainer}
        >
          {daysList.map((item) => {
            const isSel = selectedDate === item.date;
            return (
              <TouchableOpacity
                key={item.date}
                style={[st.datePill, isSel && st.datePillActive]}
                onPress={() => {
                  setSelectedDate(item.date);
                  setSelected([]); // Reset slots khi đổi ngày
                }}
                activeOpacity={0.8}
              >
                <Text style={[st.datePillDay, isSel && st.datePillDayActive]}>
                  {item.day}
                </Text>
                <Text style={[st.datePillDate, isSel && st.datePillDateActive]}>
                  {item.displayDate}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Hàng 4: Chú thích trạng thái (Legend) */}
        <View style={st.legendRow}>
          <View style={st.legendItem}>
            <View style={[st.legendBox, { backgroundColor: '#ffffff', borderColor: '#cbd5e1' }]} />
            <Text style={st.legendText}>Trống</Text>
          </View>
          <View style={st.legendItem}>
            <View style={[st.legendBox, { backgroundColor: '#ef4444' }]} />
            <Text style={st.legendText}>Đã đặt</Text>
          </View>
          <View style={st.legendItem}>
            <View style={[st.legendBox, { backgroundColor: '#9ca3af' }]} />
            <Text style={st.legendText}>Khoá</Text>
          </View>
          <View style={st.legendItem}>
            <View style={[st.legendBox, { backgroundColor: '#c084fc', alignItems: 'center', justifyContent: 'center' }]}>
              <Text style={{ color: '#fff', fontSize: 9, fontWeight: '900' }}>!</Text>
            </View>
            <Text style={st.legendText}>Sự kiện</Text>
          </View>
          {selected.length > 0 && (
            <View style={st.legendItem}>
              <View style={[st.legendBox, { backgroundColor: '#10b981' }]} />
              <Text style={[st.legendText, { color: '#6ee7b7' }]}>Đang chọn</Text>
            </View>
          )}
        </View>

        {/* Hàng 5: Link xem giá */}
        <TouchableOpacity
          style={st.pricingLinkRow}
          onPress={() =>
            Alert.alert(
              'Bảng giá thuê sân',
              `${activeClub.name}\n• Khung giờ thường: 60.000đ - 80.000đ/h\n• Khung giờ vàng (17h-21h): 100.000đ - 120.000đ/h\n• Tiêu chuẩn: Thảm BWF, ánh sáng chống loá.`
            )
          }
        >
          <Text style={st.pricingLinkText}>Xem sân & bảng giá</Text>
        </TouchableOpacity>
      </View>

      {/* ─── 2. GHI CHÚ ĐẶT LỊCH CỐ ĐỊNH ─────────────────────────────── */}
      <View style={st.noticeBar}>
        <Text style={st.noticeText}>
          <Text style={st.noticeHighlight}>Lưu ý: </Text>
          Nếu bạn cần đặt lịch cố định vui lòng liên hệ:{' '}
          <Text style={st.noticePhone}>0936 157 135</Text> để được hỗ trợ
        </Text>
      </View>

      {/* ─── 3. BẢNG KHUNG GIỜ THỜI GIAN THỰC (TIMELINE GRID) ───────── */}
      <ScrollView style={{ flex: 1 }} horizontal showsHorizontalScrollIndicator={true}>
        <View style={{ paddingBottom: 110 }}>
          {/* Hàng tiêu đề giờ (Header timeline xanh lơ nhạt) */}
          <View style={st.gridTimelineHeader}>
            <View style={st.gridCourtCorner}>
              <Text style={st.gridCourtCornerText}>SÂN</Text>
            </View>
            {HOURS.map((h) => (
              <View key={h} style={[st.gridHourHeaderCell, { width: CELL_W }]}>
                <Text style={st.gridHourHeaderText}>{h}</Text>
              </View>
            ))}
          </View>

          {/* Các hàng sân thi đấu */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {displayCourts.map((court, idx) => {
              const courtLabel = getShortCourtName(court, idx);
              const isMaintenance = court.status === 'maintenance';

              return (
                <View key={court.id || idx} style={st.courtRow}>
                  {/* Cột tên sân nền xanh mint nhạt */}
                  <View style={st.courtNameColumn}>
                    <Text style={st.courtNameText}>{courtLabel}</Text>
                  </View>

                  {/* Các ô khung giờ */}
                  {HOURS.map((h, hIdx) => {
                    const hour = 5 + hIdx;
                    const past = isPastSlot(selectedDate, hour);
                    const booked = isBooked(court.id, hour);
                    const sel = isSelected(court.id, hour);

                    // Trạng thái ô:
                    // 1. past: Màu xám khoá (đã qua thời gian thực)
                    // 2. booked: Màu đỏ nhạt đã đặt
                    // 3. sel: Màu xanh đang chọn
                    // 4. maintenance: Màu xám bảo dưỡng
                    // 5. trống: Màu trắng cho phép click

                    return (
                      <TouchableOpacity
                        key={h}
                        style={[
                          st.timeSlotCell,
                          { width: CELL_W },
                          past && st.timeSlotPast,
                          booked && !past && st.timeSlotBooked,
                          sel && st.timeSlotSelected,
                          isMaintenance && st.timeSlotMaintenance,
                        ]}
                        onPress={() => toggleSlot(court.id, hour, court)}
                        activeOpacity={past || booked || isMaintenance ? 0.9 : 0.6}
                      >
                        {sel ? (
                          <Text style={st.selectedTick}>✓</Text>
                        ) : booked && !past ? (
                          <Text style={st.bookedText}>ĐÃ ĐẶT</Text>
                        ) : past ? (
                          <Text style={st.pastText}>✕</Text>
                        ) : isMaintenance ? (
                          <Text style={st.maintenanceText}>Bảo trì</Text>
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

      {/* ─── 4. THANH ĐIỀU KHIỂN DƯỚI CÙNG & NÚT TIẾP THEO (VÀNG/CAM) ─── */}
      <View style={st.bottomActionBar}>
        <View style={st.bottomSummary}>
          <Text style={st.bottomDateInfo}>
            {selectedDate} • {activeClub.name.split(':')[0] || 'QT Sport'}
          </Text>
          <View style={st.bottomPriceRow}>
            <Text style={st.bottomCountText}>
              Đã chọn: <Text style={st.bottomCountBold}>{totalHours} giờ</Text>
            </Text>
            <Text style={st.bottomTotalPrice}>
              {totalPrice.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[st.nextStepBtn, selected.length === 0 && st.nextStepBtnDisabled]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={st.nextStepBtnText}>TIẾP THEO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  // ── 1. Top Header ──
  topHeaderSection: {
    backgroundColor: '#0a5c36',
    paddingTop: 8,
    paddingBottom: 10,
    paddingHorizontal: 12,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  backBtnText: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '300',
    lineHeight: 28,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
    flex: 1,
  },
  monthNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  monthPickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthPickerText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  navArrowsGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  arrowBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowBtnText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 20,
  },
  dateScrollContainer: {
    gap: 8,
    paddingVertical: 2,
  },
  datePill: {
    minWidth: 58,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  datePillActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  datePillDay: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 2,
  },
  datePillDayActive: {
    color: '#0a5c36',
    fontWeight: '700',
  },
  datePillDate: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '800',
  },
  datePillDateActive: {
    color: '#0a5c36',
    fontWeight: '900',
  },
  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: 14,
    marginTop: 10,
    paddingHorizontal: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  legendBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
  },
  legendText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '500',
  },
  pricingLinkRow: {
    marginTop: 8,
    paddingHorizontal: 4,
  },
  pricingLinkText: {
    color: '#bef264',
    fontSize: 12,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },

  // ── 2. Notice Bar ──
  noticeBar: {
    backgroundColor: '#ecfdf5',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#d1fae5',
  },
  noticeText: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 16,
  },
  noticeHighlight: {
    color: '#ea580c',
    fontWeight: '800',
  },
  noticePhone: {
    color: '#0f766e',
    fontWeight: '700',
  },

  // ── 3. Grid Table ──
  gridTimelineHeader: {
    flexDirection: 'row',
    backgroundColor: '#e0f2fe',
    borderBottomWidth: 1,
    borderColor: '#bae6fd',
  },
  gridCourtCorner: {
    width: 78,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#bae6fd',
    borderRightWidth: 1,
    borderColor: '#93c5fd',
  },
  gridCourtCornerText: {
    color: '#0369a1',
    fontSize: 11,
    fontWeight: '800',
  },
  gridHourHeaderCell: {
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderColor: '#bae6fd',
  },
  gridHourHeaderText: {
    color: '#0369a1',
    fontSize: 11,
    fontWeight: '700',
  },
  courtRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#e2e8f0',
  },
  courtNameColumn: {
    width: 78,
    height: 48,
    backgroundColor: '#d1fae5',
    borderRightWidth: 1,
    borderColor: '#a7f3d0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courtNameText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '700',
  },
  timeSlotCell: {
    height: 48,
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotPast: {
    backgroundColor: '#e2e8f0',
  },
  timeSlotBooked: {
    backgroundColor: '#fee2e2',
  },
  timeSlotSelected: {
    backgroundColor: '#059669',
  },
  timeSlotMaintenance: {
    backgroundColor: '#f1f5f9',
  },
  selectedTick: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
  },
  bookedText: {
    color: '#ef4444',
    fontSize: 8,
    fontWeight: '800',
  },
  pastText: {
    color: '#94a3b8',
    fontSize: 11,
    fontWeight: '600',
  },
  maintenanceText: {
    color: '#94a3b8',
    fontSize: 8,
  },

  // ── 4. Bottom Floating Bar ──
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 22,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  bottomSummary: {
    marginBottom: 8,
  },
  bottomDateInfo: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  bottomPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  bottomCountText: {
    color: '#334155',
    fontSize: 12,
  },
  bottomCountBold: {
    fontWeight: '800',
    color: '#0f172a',
  },
  bottomTotalPrice: {
    color: '#059669',
    fontSize: 16,
    fontWeight: '900',
  },
  nextStepBtn: {
    backgroundColor: '#eab308',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#ca8a04',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  nextStepBtnDisabled: {
    backgroundColor: '#fde047',
    opacity: 0.65,
  },
  nextStepBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
