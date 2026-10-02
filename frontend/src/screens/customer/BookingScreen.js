import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { BookingGridStep } from './BookingGridStep';
import { BookingConfirmStep } from './BookingConfirmStep';
import { BookingPaymentStep } from './BookingPaymentStep';

export function BookingScreen({ user, courts, navigate, onConfirm }) {
  const [step, setStep] = useState('modal'); // modal | grid | confirm | payment
  const [selected, setSelected] = useState([]);
  const [bookedSlotsRef, setBookedSlotsRef] = useState(null);
  const [selectedDate, setSelectedDate] = useState('28/08/2026');
  const [orderInfo, setOrderInfo] = useState(null);

  const handleGridNext = (sel, bookedSlots, date, setBooked) => {
    setSelected(sel);
    setBookedSlotsRef({ bookedSlots, setBooked });
    setSelectedDate(date);
    setStep('confirm');
  };

  const handleConfirmPay = (info) => {
    setOrderInfo(info);
    setStep('payment');
  };

  const handleDone = () => {
    if (bookedSlotsRef) {
      bookedSlotsRef.setBooked((prev) => [...prev, ...selected]);
    }
    const targetCourt = courts.find((c) => c.id === selected[0]?.courtId) || courts[0];
    if (targetCourt && orderInfo) {
      const booking = {
        id: `BK-${Date.now().toString().slice(-4)}`,
        court: targetCourt,
        courtId: targetCourt.id,
        userId: user?.id || 'guest',
        userName: orderInfo.name,
        userPhone: orderInfo.phone,
        date: selectedDate,
        slot: selected.map((s) => `${s.hour}:00-${s.hour + 1}:00`).join(', '),
        hoursCount: orderInfo.totalHours,
        totalPrice: orderInfo.totalPrice,
        grandTotal: orderInfo.totalPrice,
        paymentMethod: 'Chuyển khoản QR',
        paymentStatus: 'paid',
        status: 'confirmed',
        note: orderInfo.note,
        createdAt: new Date().toLocaleString('vi-VN'),
      };
      onConfirm(booking);
    }
    Alert.alert(
      '✅ Đặt sân thành công!',
      'Hệ thống đã ghi nhận lịch đặt sân của bạn thành công.',
      [
        {
          text: 'Xem vé của tôi',
          onPress: () => {
            setStep('modal');
            navigate('myBookings');
          },
        },
        { text: 'Đóng', onPress: () => setStep('modal') },
      ]
    );
  };

  if (step === 'modal') {
    return (
      <View style={[st.modalRoot, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
        <Modal visible={true} transparent animationType="fade">
          <View style={st.modalOverlay}>
            <View style={st.modalBox}>
              <View style={st.modalHeader}>
                <Text style={st.modalTitle}>CHỌN HÌNH THỨC ĐẶT SÂN</Text>
                <TouchableOpacity onPress={() => navigate('home')}>
                  <Text style={{ fontSize: 20, color: '#64748b' }}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Option 1 */}
              <TouchableOpacity style={st.bookOptionCard} onPress={() => setStep('grid')}>
                <View style={{ flex: 1 }}>
                  <Text style={st.bookOptionTitle}>ĐẶT LỊCH THEO SÂN - TRỰC QUAN</Text>
                  <Text style={st.bookOptionDesc}>
                    Đặt lịch theo sân trên bảng trạng thái sân trực tiếp, tự do lựa chọn nhiều khung giờ và sân đấu.
                  </Text>
                </View>
                <View style={st.bookOptionArrow}>
                  <Text style={{ color: '#fff', fontSize: 18 }}>→</Text>
                </View>
              </TouchableOpacity>

              {/* Option 2 */}
              <TouchableOpacity
                style={[st.bookOptionCard, { backgroundColor: '#fdf4ff', borderColor: '#d946ef' }]}
                onPress={() => Alert.alert('Thông báo', 'Tính năng Tuyển Vãng Lai theo vé sẽ sớm ra mắt!')}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[st.bookOptionTitle, { color: '#a21caf' }]}>MUA VÉ VÃNG LAI</Text>
                  <Text style={[st.bookOptionDesc, { color: '#86198f' }]}>
                    Mua vé ngay hôm nay hoặc các ngày tiếp theo để tham gia sự kiện giao lưu tại sân.
                  </Text>
                </View>
                <View style={[st.bookOptionArrow, { backgroundColor: '#d946ef' }]}>
                  <Text style={{ color: '#fff', fontSize: 18 }}>→</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  if (step === 'grid') {
    return (
      <BookingGridStep
        user={user}
        courts={courts}
        onNext={handleGridNext}
        onBack={() => setStep('modal')}
      />
    );
  }

  if (step === 'confirm') {
    return (
      <BookingConfirmStep
        user={user}
        courts={courts}
        selected={selected}
        selectedDate={selectedDate}
        onBack={() => setStep('grid')}
        onPay={handleConfirmPay}
      />
    );
  }

  if (step === 'payment') {
    return (
      <BookingPaymentStep
        user={user}
        orderInfo={orderInfo}
        onBack={() => setStep('confirm')}
        onDone={handleDone}
      />
    );
  }

  return null;
}

const st = StyleSheet.create({
  modalRoot: { flex: 1, backgroundColor: C.bg },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%' },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { color: '#1e293b', fontSize: 16, fontWeight: '800' },
  bookOptionCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.primary,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  bookOptionTitle: { color: C.primaryDark, fontSize: 13, fontWeight: '800', marginBottom: 6 },
  bookOptionDesc: { color: '#374151', fontSize: 12, lineHeight: 18 },
  bookOptionArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
