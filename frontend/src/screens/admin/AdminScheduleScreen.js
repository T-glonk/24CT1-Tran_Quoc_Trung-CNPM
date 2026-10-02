import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';
import { HOURS } from '../../constants/initialData';

export function AdminScheduleScreen({ courts = [], onAddWalkinBooking }) {
  const [selectedCourt, setSelectedCourt] = useState(courts[0]?.id || '1');
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedHour, setSelectedHour] = useState('14:00');
  const [modalVisible, setModalVisible] = useState(false);

  const handleCreateWalkin = () => {
    if (!guestName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên khách vãng lai');
      return;
    }
    const court = courts.find((c) => c.id === selectedCourt) || courts[0];
    const newBooking = {
      id: `BK-POS-${Date.now().toString().slice(-4)}`,
      court,
      courtId: court.id,
      userId: 'walkin',
      userName: guestName.trim(),
      userPhone: guestPhone.trim(),
      date: new Date().toLocaleDateString('vi-VN'),
      slot: `${selectedHour} - ${parseInt(selectedHour) + 1}:00`,
      hoursCount: 1,
      totalPrice: court.price,
      grandTotal: court.price,
      paymentMethod: 'Tiền mặt',
      paymentStatus: 'paid',
      status: 'in_use',
      note: 'Khách đặt trực tiếp tại quầy thu ngân',
      createdAt: new Date().toLocaleString('vi-VN'),
    };
    onAddWalkinBooking(newBooking);
    setGuestName('');
    setGuestPhone('');
    setModalVisible(false);
    Alert.alert('✅ Thành công', `Đã tạo lịch và thu tiền mặt cho ${newBooking.userName}!`);
  };

  return (
    <View style={st.container}>
      {/* Top action header */}
      <View style={st.topBar}>
        <Text style={st.topTitle}>Lịch Sân Trực Quan & Đặt Tại Quầy</Text>
        <TouchableOpacity style={st.createBtn} onPress={() => setModalVisible(true)}>
          <Text style={st.createBtnText}>＋ Đặt Khách Tại Quầy</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14 }}>
        <Text style={st.sectionHeading}>Chọn Sân Xem Lịch Khung Giờ</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          {courts.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[st.courtPill, selectedCourt === c.id && st.courtPillActive]}
              onPress={() => setSelectedCourt(c.id)}
            >
              <Text style={[st.courtPillText, selectedCourt === c.id && st.courtPillTextActive]}>
                {c.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hour slots visual table */}
        <View style={st.timelineCard}>
          {HOURS.slice(2, 16).map((h, i) => {
            const isBooked = i % 4 === 1;
            const isInUse = i % 5 === 2;
            return (
              <View key={h} style={st.hourRow}>
                <Text style={st.hourText}>{h}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  {isInUse ? (
                    <View style={[st.slotBlock, { backgroundColor: '#0284c7' }]}>
                      <Text style={st.slotBlockText}>🏸 Khách đang chơi (Hoàng Minh Đức)</Text>
                    </View>
                  ) : isBooked ? (
                    <View style={[st.slotBlock, { backgroundColor: '#f59e0b' }]}>
                      <Text style={st.slotBlockText}>📋 Đã đặt trước (Trung Quốc - VIP)</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={st.emptySlotBtn}
                      onPress={() => {
                        setSelectedHour(h);
                        setModalVisible(true);
                      }}
                    >
                      <Text style={st.emptySlotText}>Trống · Bấm để xếp lịch</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Modal Walkin Booking */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={st.modalBackdrop}>
          <View style={st.modalCard}>
            <Text style={st.modalTitle}>Xếp Sân & Thu Tiền Tại Quầy</Text>
            <Text style={st.inputLabel}>Khung giờ</Text>
            <Text style={st.readonlyVal}>
              ⏰ {selectedHour} - {parseInt(selectedHour) + 1}:00 (Hôm nay)
            </Text>

            <Text style={st.inputLabel}>Họ tên khách *</Text>
            <TextInput
              style={st.input}
              value={guestName}
              onChangeText={setGuestName}
              placeholder="Nhập tên khách"
            />

            <Text style={st.inputLabel}>Số điện thoại</Text>
            <TextInput
              style={st.input}
              value={guestPhone}
              onChangeText={setGuestPhone}
              placeholder="09xx xxx xxx"
              keyboardType="phone-pad"
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={st.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.submitBtn} onPress={handleCreateWalkin}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>XÁC NHẬN & THU TIỀN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: AL.bg },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: AL.border,
  },
  topTitle: { color: AL.textDark, fontSize: 13, fontWeight: '800' },
  createBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  createBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  sectionHeading: { fontSize: 13, fontWeight: '800', color: AL.textDark, marginBottom: 8 },
  courtPill: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AL.border,
  },
  courtPillActive: { backgroundColor: AL.primary, borderColor: AL.primary },
  courtPillText: { color: AL.textSub, fontSize: 12, fontWeight: '700' },
  courtPillTextActive: { color: '#fff', fontWeight: '800' },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: AL.border,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  hourText: { width: 50, color: AL.textSub, fontSize: 12, fontWeight: '700' },
  slotBlock: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  slotBlockText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  emptySlotBtn: {
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  emptySlotText: { color: '#94a3b8', fontSize: 11, fontWeight: '600' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    width: '100%',
    maxWidth: 400,
  },
  modalTitle: { fontSize: 15, fontWeight: '900', color: AL.textDark, marginBottom: 12 },
  readonlyVal: { color: AL.primaryDark, fontSize: 13, fontWeight: '800', marginBottom: 6 },
  inputLabel: { color: '#334155', fontSize: 12, fontWeight: '700', marginBottom: 4, marginTop: 8 },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 10,
    fontSize: 14,
    color: '#0f172a',
  },
  cancelBtn: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  submitBtn: { flex: 2, backgroundColor: AL.primary, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
});
