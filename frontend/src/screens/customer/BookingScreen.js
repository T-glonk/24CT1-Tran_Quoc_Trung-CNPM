import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { BookingGridStep } from './BookingGridStep';
import { BookingConfirmStep } from './BookingConfirmStep';
import { BookingPaymentStep } from './BookingPaymentStep';
import { INITIAL_CLUBS } from '../../constants/initialData';

export function BookingScreen({
  user,
  courts = [],
  clubs = INITIAL_CLUBS,
  selectedClub,
  onSelectClub,
  navigate,
  onConfirm,
}) {
  const [step, setStep] = useState('grid'); // grid | confirm | payment
  const [selected, setSelected] = useState([]);
  const [bookedSlotsRef, setBookedSlotsRef] = useState(null);
  const [selectedDate, setSelectedDate] = useState('28/08/2026');
  const [orderInfo, setOrderInfo] = useState(null);
  const [activeFacility, setActiveFacility] = useState(selectedClub || clubs[0] || INITIAL_CLUBS[0]);

  const handleGridNext = (sel, bookedSlots, date, setBooked, club) => {
    setSelected(sel);
    setBookedSlotsRef({ bookedSlots, setBooked });
    setSelectedDate(date);
    if (club) setActiveFacility(club);
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
        court: {
          ...targetCourt,
          clubId: activeFacility.id,
          clubName: activeFacility.name,
          location: activeFacility.address,
        },
        courtId: targetCourt.id,
        userId: user?.id || 'guest',
        userName: orderInfo.name,
        userPhone: orderInfo.phone,
        date: selectedDate,
        slot: selected.map((s) => `${s.hour}:00-${s.hour + 1}:00`).join(', '),
        hoursCount: orderInfo.totalHours,
        totalPrice: orderInfo.totalPrice,
        servicesAdded: orderInfo.servicesAdded || [],
        grandTotal: orderInfo.grandTotal || orderInfo.totalPrice,
        paymentMethod: 'Chuyển khoản QR',
        paymentStatus: 'paid',
        status: 'confirmed',
        note: orderInfo.note || '',
        createdAt: new Date().toLocaleString('vi-VN'),
      };
      onConfirm(booking);
    }

    Alert.alert(
      '✅ Đặt sân thành công!',
      `Hệ thống đã xác nhận đơn đặt sân của bạn tại ${activeFacility.name}.`,
      [
        {
          text: 'Xem vé của tôi',
          onPress: () => {
            setStep('grid');
            navigate('myBookings');
          },
        },
        { text: 'Đóng', onPress: () => setStep('grid') },
      ]
    );
  };

  if (step === 'grid') {
    return (
      <BookingGridStep
        user={user}
        courts={courts}
        clubs={clubs}
        selectedClub={activeFacility}
        onSelectClub={(clb) => {
          setActiveFacility(clb);
          if (onSelectClub) onSelectClub(clb);
        }}
        onNext={handleGridNext}
        onBack={() => navigate('home')}
      />
    );
  }

  if (step === 'confirm') {
    return (
      <BookingConfirmStep
        user={user}
        courts={courts}
        activeClub={activeFacility}
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
        activeClub={activeFacility}
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
});
