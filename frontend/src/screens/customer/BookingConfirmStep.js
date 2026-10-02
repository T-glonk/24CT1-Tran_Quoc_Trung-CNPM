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

export function BookingConfirmStep({ user, courts, selected, selectedDate, onBack, onPay }) {
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [note, setNote] = useState('');

  const grouped = {};
  selected.forEach((s) => {
    if (!grouped[s.courtId]) grouped[s.courtId] = [];
    grouped[s.courtId].push(s.hour);
  });

  const totalHours = selected.length;
  const totalPrice = selected.reduce((sum, s) => {
    const c = courts.find((ct) => ct.id === s.courtId);
    return sum + (c ? c.price : 0);
  }, 0);

  const handlePay = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên người đặt');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại');
      return;
    }
    onPay({ name, phone, note, totalHours, totalPrice });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      <View style={st.gridHeader}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={st.gridHeaderTitle}>XÁC NHẬN THÔNG TIN ĐẶT SÂN</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14 }}>
        {/* Court info */}
        <View style={st.confirmSection}>
          <View style={st.confirmSectionTitle}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🗺️</Text>
            <Text style={st.confirmSectionTitleText}>Thông tin câu lạc bộ</Text>
          </View>
          <Text style={st.confirmLabel}>
            Tên CLB: <Text style={st.confirmValue}>CLB Cầu Lông TPT Sport</Text>
          </Text>
          <Text style={[st.confirmLabel, { marginTop: 6, lineHeight: 20 }]}>
            Địa chỉ:{' '}
            <Text style={st.confirmValue}>
              207 Quách Thị Trang, Hòa Xuân, Cẩm Lệ, TP Đà Nẵng
            </Text>
          </Text>
        </View>

        {/* Booking info */}
        <View style={st.confirmSection}>
          <View style={st.confirmSectionTitle}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>📋</Text>
            <Text style={st.confirmSectionTitleText}>Chi tiết khung giờ</Text>
          </View>
          <Text style={st.confirmLabel}>
            Ngày chơi: <Text style={st.confirmValue}>{selectedDate}</Text>
          </Text>
          {Object.entries(grouped).map(([cid, hours]) => {
            const court = courts.find((c) => c.id === cid);
            const minH = Math.min(...hours);
            const maxH = Math.max(...hours) + 1;
            const price = hours.reduce((s, h) => {
              const c = courts.find((ct) => ct.id === cid);
              return s + (c ? c.price : 0);
            }, 0);
            return (
              <Text key={cid} style={[st.confirmLabel, { marginTop: 4 }]}>
                {'- '}
                {court?.name}: <Text style={st.confirmValue}>{minH}:00 - {maxH}:00</Text>
                {'  |  '}
                <Text style={{ color: C.primary, fontWeight: '700' }}>
                  {price.toLocaleString('vi-VN')} đ
                </Text>
              </Text>
            );
          })}
          <Text style={[st.confirmLabel, { marginTop: 8 }]}>
            Tổng thời lượng: <Text style={st.confirmValue}>{totalHours}h00</Text>
          </Text>
        </View>

        {/* Guest Input Info */}
        <View style={st.confirmSection}>
          <View style={st.confirmSectionTitle}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>👤</Text>
            <Text style={st.confirmSectionTitleText}>Thông tin người đặt sân</Text>
          </View>

          <Text style={st.formFieldLabel}>Họ và tên *</Text>
          <View style={st.formFieldWrap}>
            <TextInput
              style={st.formField}
              value={name}
              onChangeText={setName}
              placeholder="Nhập tên người chơi"
            />
          </View>

          <Text style={st.formFieldLabel}>Số điện thoại nhận tin *</Text>
          <View style={st.formFieldWrap}>
            <TextInput
              style={st.formField}
              value={phone}
              onChangeText={setPhone}
              placeholder="Nhập số điện thoại"
              keyboardType="phone-pad"
            />
          </View>

          <Text style={st.formFieldLabel}>Ghi chú cho sân</Text>
          <View style={[st.formFieldWrap, { height: 70 }]}>
            <TextInput
              style={[st.formField, { textAlignVertical: 'top' }]}
              value={note}
              onChangeText={setNote}
              placeholder="Ví dụ: Cần bật thêm đèn, chuẩn bị sẵn vợt thuê..."
              multiline
            />
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={st.confirmBottomBar}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ color: '#64748b', fontSize: 13, fontWeight: '700' }}>TỔNG THANH TOÁN:</Text>
          <Text style={{ color: C.primaryDark, fontSize: 18, fontWeight: '900' }}>
            {totalPrice.toLocaleString('vi-VN')} VNĐ
          </Text>
        </View>
        <TouchableOpacity style={st.confirmPayBtn} onPress={handlePay}>
          <Text style={st.confirmPayBtnText}>TIẾP TỤC THANH TOÁN</Text>
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
  confirmSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  confirmSectionTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0fdf4',
  },
  confirmSectionTitleText: { color: C.primary, fontSize: 15, fontWeight: '800' },
  confirmLabel: { color: '#374151', fontSize: 13 },
  confirmValue: { color: '#1e293b', fontWeight: '700' },
  formFieldLabel: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 4,
    marginTop: 8,
  },
  formFieldWrap: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    paddingHorizontal: 10,
    height: 44,
    justifyContent: 'center',
  },
  formField: { color: '#1e293b', fontSize: 14 },
  confirmBottomBar: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  confirmPayBtn: {
    backgroundColor: C.warning,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmPayBtnText: {
    color: '#1e293b',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
