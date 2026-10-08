import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { INITIAL_CLUBS } from '../../constants/initialData';

export function BookingConfirmStep({
  user,
  courts = [],
  activeClub = INITIAL_CLUBS[0],
  selected = [],
  selectedDate = '28/08/2026',
  onBack,
  onPay,
}) {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [note, setNote] = useState('');

  // Danh mục tiện ích / dịch vụ đi kèm có thể mua thêm khi đặt sân
  const [services, setServices] = useState([
    { id: 'srv1', name: 'Nước điện giải Revive chanh muối', price: 15000, qty: 0, icon: '🥤' },
    { id: 'srv2', name: 'Nước thể thao Pocari Sweat', price: 20000, qty: 0, icon: '💧' },
    { id: 'srv3', name: 'Ống cầu lông Hải Yến S90 (12 quả)', price: 240000, qty: 0, icon: '🏸' },
    { id: 'srv4', name: 'Thuê vợt Yonex Astrox 88D Pro', price: 30000, qty: 0, icon: '🎾' },
  ]);

  const updateServiceQty = (id, delta) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, qty: Math.max(0, s.qty + delta) } : s))
    );
  };

  const servicesTotal = services.reduce((sum, s) => sum + s.qty * s.price, 0);

  // Nhóm các khung giờ theo từng sân
  const grouped = {};
  selected.forEach((s) => {
    if (!grouped[s.courtId]) grouped[s.courtId] = [];
    grouped[s.courtId].push(s.hour);
  });

  const totalHours = selected.length;
  const courtPriceTotal = selected.reduce((sum, s) => {
    const c = courts.find((ct) => ct.id === s.courtId);
    return sum + (c ? c.price : (s.price || 80000));
  }, 0);

  const grandTotal = courtPriceTotal + servicesTotal;

  const handlePay = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên người đặt sân');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại liên hệ');
      return;
    }

    const addedServices = services
      .filter((s) => s.qty > 0)
      .map((s) => ({ id: s.id, name: s.name, qty: s.qty, price: s.price }));

    onPay({
      name: name.trim(),
      phone: phone.trim(),
      note: note.trim(),
      totalHours,
      courtPriceTotal,
      servicesTotal,
      totalPrice: courtPriceTotal,
      grandTotal,
      servicesAdded: addedServices,
      activeClub,
      selectedDate,
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={st.gridHeader}>
        <TouchableOpacity onPress={onBack} style={st.backBtn}>
          <Text style={{ color: '#fff', fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={st.gridHeaderTitle}>XÁC NHẬN THÔNG TIN ĐẶT SÂN</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14, paddingBottom: 110 }}>
        {/* 1. Thông tin cơ sở đã chọn */}
        <View style={st.confirmSection}>
          <View style={st.confirmSectionTitle}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🏟️</Text>
            <Text style={st.confirmSectionTitleText}>Cơ sở thi đấu đã chọn</Text>
          </View>
          <Text style={st.confirmClubName}>{activeClub.name}</Text>
          <Text style={st.confirmClubAddr}>📍 {activeClub.address}</Text>
          <Text style={st.confirmClubHotline}>📞 Hotline hỗ trợ: {activeClub.phone || '0905 591 379'}</Text>
        </View>

        {/* 2. Chi tiết số sân và khung giờ */}
        <View style={st.confirmSection}>
          <View style={st.confirmSectionTitle}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>📋</Text>
            <Text style={st.confirmSectionTitleText}>Lịch đặt sân ({selectedDate})</Text>
          </View>

          {Object.entries(grouped).map(([cid, hours]) => {
            const court = courts.find((c) => c.id === cid);
            const minH = Math.min(...hours);
            const maxH = Math.max(...hours) + 1;
            const courtSubtotal = hours.reduce((s) => s + (court ? court.price : 80000), 0);

            return (
              <View key={cid} style={st.courtSlotRow}>
                <View style={{ flex: 1 }}>
                  <Text style={st.courtSlotName}>🏸 {court?.name || `Sân ${cid}`}</Text>
                  <Text style={st.courtSlotTime}>⏰ Khung giờ: {minH}:00 - {maxH}:00 ({hours.length} tiếng)</Text>
                </View>
                <Text style={st.courtSlotPrice}>{courtSubtotal.toLocaleString('vi-VN')} đ</Text>
              </View>
            );
          })}

          <View style={st.courtTotalRow}>
            <Text style={st.courtTotalLabel}>Tổng tiền thuê sân ({totalHours}h):</Text>
            <Text style={st.courtTotalVal}>{courtPriceTotal.toLocaleString('vi-VN')} đ</Text>
          </View>
        </View>

        {/* 3. Dịch vụ & Tiện ích thêm (Nước, Cầu, Thuê Vợt) */}
        <View style={st.confirmSection}>
          <View style={st.confirmSectionTitle}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🥤</Text>
            <Text style={st.confirmSectionTitleText}>Dịch vụ & Tiện ích chuẩn bị sẵn</Text>
          </View>

          {services.map((srv) => (
            <View key={srv.id} style={st.serviceRow}>
              <Text style={{ fontSize: 20, marginRight: 8 }}>{srv.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={st.serviceName}>{srv.name}</Text>
                <Text style={st.servicePrice}>{srv.price.toLocaleString('vi-VN')} đ</Text>
              </View>
              <View style={st.stepperRow}>
                <TouchableOpacity
                  style={[st.stepperBtn, srv.qty === 0 && { opacity: 0.4 }]}
                  onPress={() => updateServiceQty(srv.id, -1)}
                  disabled={srv.qty === 0}
                >
                  <Text style={st.stepperBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={st.stepperQty}>{srv.qty}</Text>
                <TouchableOpacity
                  style={st.stepperBtn}
                  onPress={() => updateServiceQty(srv.id, 1)}
                >
                  <Text style={st.stepperBtnText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* 4. Thông tin liên hệ người đặt */}
        <View style={st.confirmSection}>
          <View style={st.confirmSectionTitle}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>👤</Text>
            <Text style={st.confirmSectionTitleText}>Thông tin người đặt sân</Text>
          </View>

          <Text style={st.inputLabel}>Họ và tên người nhận sân <Text style={{ color: '#ef4444' }}>*</Text></Text>
          <TextInput
            style={st.inputBox}
            value={name}
            onChangeText={setName}
            placeholder="Ví dụ: Nguyễn Văn An"
            placeholderTextColor="#94a3b8"
          />

          <Text style={st.inputLabel}>Số điện thoại nhận vé <Text style={{ color: '#ef4444' }}>*</Text></Text>
          <TextInput
            style={st.inputBox}
            value={phone}
            onChangeText={setPhone}
            placeholder="Ví dụ: 0905591379"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
          />

          <Text style={st.inputLabel}>Ghi chú cho sân (Tùy chọn)</Text>
          <TextInput
            style={[st.inputBox, { height: 60, textAlignVertical: 'top' }]}
            value={note}
            onChangeText={setNote}
            placeholder="Ví dụ: Bật đèn sớm 5 phút, chuẩn bị lưới thi đấu..."
            placeholderTextColor="#94a3b8"
            multiline
          />
        </View>
      </ScrollView>

      {/* Bottom Sticky Payment Bar */}
      <View style={st.bottomBar}>
        <View style={{ flex: 1 }}>
          <Text style={st.bottomTotalLabel}>TỔNG THANH TOÁN</Text>
          <Text style={st.bottomTotalVal}>{grandTotal.toLocaleString('vi-VN')} đ</Text>
        </View>
        <TouchableOpacity style={st.payBtn} onPress={handlePay}>
          <Text style={st.payBtnText}>THANH TOÁN QR →</Text>
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
    justifyContent: 'space-between',
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
  confirmSection: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  confirmSectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    paddingBottom: 8,
  },
  confirmSectionTitleText: { color: '#0f172a', fontSize: 14, fontWeight: '800' },
  confirmClubName: { color: '#064e3b', fontSize: 14, fontWeight: '800' },
  confirmClubAddr: { color: '#475569', fontSize: 12, marginTop: 3 },
  confirmClubHotline: { color: '#059669', fontSize: 12, fontWeight: '700', marginTop: 4 },
  courtSlotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  courtSlotName: { color: '#0f172a', fontSize: 13, fontWeight: '800' },
  courtSlotTime: { color: '#64748b', fontSize: 12, marginTop: 2 },
  courtSlotPrice: { color: '#059669', fontSize: 13, fontWeight: '800' },
  courtTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 6,
  },
  courtTotalLabel: { color: '#475569', fontSize: 12, fontWeight: '700' },
  courtTotalVal: { color: '#0f172a', fontSize: 13, fontWeight: '800' },
  serviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
  },
  serviceName: { color: '#1e293b', fontSize: 13, fontWeight: '700' },
  servicePrice: { color: '#059669', fontSize: 12, fontWeight: '800', marginTop: 2 },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  stepperBtn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: { color: '#0f172a', fontSize: 16, fontWeight: '900' },
  stepperQty: { minWidth: 24, textAlign: 'center', fontWeight: '800', color: '#0f172a', fontSize: 13 },
  inputLabel: { color: '#334155', fontSize: 12, fontWeight: '700', marginTop: 10, marginBottom: 4 },
  inputBox: {
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: '#0f172a',
    fontSize: 13,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 8,
  },
  bottomTotalLabel: { color: '#64748b', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  bottomTotalVal: { color: '#059669', fontSize: 18, fontWeight: '900' },
  payBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  payBtnText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
});
