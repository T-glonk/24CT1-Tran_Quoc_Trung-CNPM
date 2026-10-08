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
import { HOURS, INITIAL_CLUBS } from '../../constants/initialData';

export function AdminScheduleScreen({
  courts = [],
  clubs = INITIAL_CLUBS,
  selectedClub,
  onSelectClub,
  onAddWalkinBooking,
}) {
  const [activeClubId, setActiveClubId] = useState(selectedClub?.id || clubs[0]?.id || 'c1');
  const activeClub = clubs.find((c) => c.id === activeClubId) || clubs[0] || INITIAL_CLUBS[0];

  // Lọc danh sách sân CHỈ CỦA CƠ SỞ ĐƯỢC CHỌN (Không gộp chung)
  const facilityCourts = courts.filter((c) => c.clubId === activeClub.id);
  const displayCourts =
    facilityCourts.length > 0
      ? facilityCourts
      : Array.from({ length: activeClub.totalCourts || 6 }, (_, i) => ({
          id: `${activeClub.id}_${i + 1}`,
          name: `Sân ${i + 1}`,
          clubId: activeClub.id,
          clubName: activeClub.name,
          location: activeClub.address,
          price: 80000,
          status: 'available',
        }));

  const [selectedCourtId, setSelectedCourtId] = useState(displayCourts[0]?.id || `${activeClub.id}_1`);
  const [guestName, setGuestName] = useState('');
  const [guestPhone, setGuestPhone] = useState('');
  const [selectedHour, setSelectedHour] = useState('14:00');
  const [modalVisible, setModalVisible] = useState(false);

  const selectedCourt =
    displayCourts.find((c) => c.id === selectedCourtId) || displayCourts[0];

  const handleSelectFacility = (club) => {
    setActiveClubId(club.id);
    const newFacilityCourts = courts.filter((c) => c.clubId === club.id);
    const firstCourt = newFacilityCourts[0] || { id: `${club.id}_1` };
    setSelectedCourtId(firstCourt.id);
    if (onSelectClub) {
      onSelectClub(club);
    }
  };

  const handleCreateWalkin = () => {
    if (!guestName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ tên khách vãng lai');
      return;
    }
    const court = selectedCourt;
    const newBooking = {
      id: `BK-POS-${Date.now().toString().slice(-4)}`,
      court,
      courtId: court.id,
      clubId: activeClub.id,
      clubName: activeClub.name,
      userId: 'walkin',
      userName: guestName.trim(),
      userPhone: guestPhone.trim() || 'Khách vãng lai',
      date: new Date().toLocaleDateString('vi-VN'),
      slot: `${selectedHour} - ${parseInt(selectedHour) + 1}:00`,
      hoursCount: 1,
      totalPrice: court.price || 80000,
      grandTotal: court.price || 80000,
      paymentMethod: 'Tiền mặt tại quầy',
      paymentStatus: 'paid',
      status: 'in_use',
      note: `Khách đặt tại quầy ${activeClub.name.replace('QT Sport - ', '')}`,
      createdAt: new Date().toLocaleString('vi-VN'),
    };

    if (onAddWalkinBooking) {
      onAddWalkinBooking(newBooking);
    }
    setGuestName('');
    setGuestPhone('');
    setModalVisible(false);
    Alert.alert('✅ Thành công', `Đã tạo lịch và thu tiền mặt cho ${newBooking.userName} tại ${court.name}!`);
  };

  return (
    <View style={st.container}>
      {/* Facility Switcher Tabs */}
      <View style={st.facilityHeaderCard}>
        <View style={st.facilityHeaderTitleRow}>
          <Text style={st.facilityHeaderTitle}>🏢 CHỌN CƠ SỞ XEM LỊCH SÂN:</Text>
          <Text style={st.facilityCountBadge}>{displayCourts.length} Sân hoạt động</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.facilityScroll}>
          {clubs.map((club, idx) => {
            const isSelected = club.id === activeClub.id;
            return (
              <TouchableOpacity
                key={club.id}
                style={[st.facilityChip, isSelected && st.facilityChipActive]}
                onPress={() => handleSelectFacility(club)}
                activeOpacity={0.8}
              >
                <Text style={[st.facilityChipIcon, isSelected && { color: '#fff' }]}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🏸'}
                </Text>
                <View style={{ marginLeft: 6 }}>
                  <Text
                    style={[st.facilityChipName, isSelected && st.facilityChipNameActive]}
                    numberOfLines={1}
                  >
                    {club.name.replace('QT Sport - ', '')}
                  </Text>
                  <Text style={[st.facilityChipSub, isSelected && { color: '#dcfce7' }]}>
                    {club.totalCourts || 6} Sân · {club.district}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Top action header */}
      <View style={st.topBar}>
        <View style={{ flex: 1 }}>
          <Text style={st.topTitle}>Lịch Sân {activeClub.name.replace('QT Sport - ', '')}</Text>
          <Text style={st.topSubTitle}>Chọn sân bên dưới để xem timeline & xếp lịch</Text>
        </View>
        <TouchableOpacity style={st.createBtn} onPress={() => setModalVisible(true)}>
          <Text style={st.createBtnText}>＋ Đặt Khách Tại Quầy</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 14, paddingBottom: 100 }}>
        <Text style={st.sectionHeading}>
          🏸 Danh Sách Sân Của {activeClub.name.replace('QT Sport - ', '')}:
        </Text>

        {/* Court selection pills for THIS facility only */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 14 }}>
          {displayCourts.map((c) => {
            const isSelected = selectedCourtId === c.id;
            return (
              <TouchableOpacity
                key={c.id}
                style={[st.courtPill, isSelected && st.courtPillActive]}
                onPress={() => setSelectedCourtId(c.id)}
              >
                <Text style={[st.courtPillText, isSelected && st.courtPillTextActive]}>
                  {c.name}
                </Text>
                <Text style={[st.courtPillPrice, isSelected && { color: '#dcfce7' }]}>
                  {((c.price || 80000) / 1000)}k/h
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Timeline View for the selected court */}
        <View style={st.timelineCard}>
          <View style={st.timelineHeader}>
            <Text style={st.timelineCourtTitle}>
              ⏰ Timeline Khung Giờ Hôm Nay · {selectedCourt?.name}
            </Text>
            <Text style={st.timelineCourtType}>
              {selectedCourt?.type || 'Thảm PVC Tiêu chuẩn'}
            </Text>
          </View>

          {HOURS.slice(1, 17).map((h, i) => {
            const isBooked = (i * 3 + 2) % 7 === 0 && i >= 8;
            const isInUse = i === 12 || i === 13;
            const isFixed = i === 14 && selectedCourtId.includes('1');

            return (
              <View key={h} style={st.hourRow}>
                <Text style={st.hourText}>{h}</Text>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  {isInUse ? (
                    <View style={[st.slotBlock, { backgroundColor: '#0284c7' }]}>
                      <Text style={st.slotBlockText}>🏸 Khách đang thi đấu (Hoàng Minh Đức - 0905888777)</Text>
                    </View>
                  ) : isFixed ? (
                    <View style={[st.slotBlock, { backgroundColor: '#7c3aed' }]}>
                      <Text style={st.slotBlockText}>🏆 Lịch Cố Định Tháng (CLB Đà Nẵng Đôi Nam)</Text>
                    </View>
                  ) : isBooked ? (
                    <View style={[st.slotBlock, { backgroundColor: '#f59e0b' }]}>
                      <Text style={st.slotBlockText}>📋 Khách đặt trước (Trung Quốc - VIP)</Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={st.emptySlotBtn}
                      onPress={() => {
                        setSelectedHour(h);
                        setModalVisible(true);
                      }}
                    >
                      <Text style={st.emptySlotText}>＋ Trống · Nhấn để xếp sân & thu tiền</Text>
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
            <Text style={st.modalTitle}>⚡ Xếp Sân & Thu Tiền Tại Quầy</Text>
            <Text style={st.modalSub}>
              Cơ sở: <Text style={{ fontWeight: '800', color: AL.primaryDark }}>{activeClub.name}</Text>
            </Text>

            <Text style={st.inputLabel}>Sân đấu được chọn</Text>
            <Text style={st.readonlyVal}>🏸 {selectedCourt?.name} ({(selectedCourt?.price || 80000).toLocaleString('vi-VN')} đ/h)</Text>

            <Text style={st.inputLabel}>Khung giờ đặt</Text>
            <Text style={st.readonlyVal}>⏰ {selectedHour} - {parseInt(selectedHour) + 1}:00 (Hôm nay)</Text>

            <Text style={st.inputLabel}>Họ tên khách vãng lai *</Text>
            <TextInput
              style={st.input}
              value={guestName}
              onChangeText={setGuestName}
              placeholder="Nhập tên khách (VD: Anh Hùng)"
            />

            <Text style={st.inputLabel}>Số điện thoại khách</Text>
            <TextInput
              style={st.input}
              value={guestPhone}
              onChangeText={setGuestPhone}
              placeholder="09xx xxx xxx"
              keyboardType="phone-pad"
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
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
  facilityHeaderCard: {
    backgroundColor: '#064e3b',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderColor: '#047857',
  },
  facilityHeaderTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  facilityHeaderTitle: {
    color: '#a7f3d0',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  facilityCountBadge: {
    backgroundColor: '#047857',
    color: '#ecfdf5',
    fontSize: 10,
    fontWeight: '800',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  facilityScroll: {
    gap: 8,
    paddingVertical: 2,
  },
  facilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
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
  facilityChipIcon: { fontSize: 16 },
  facilityChipName: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '800',
  },
  facilityChipNameActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  facilityChipSub: {
    color: '#94a3b8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: AL.border,
  },
  topTitle: { color: AL.textDark, fontSize: 14, fontWeight: '800' },
  topSubTitle: { color: AL.textSub, fontSize: 11, marginTop: 2 },
  createBtn: {
    backgroundColor: AL.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  createBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: AL.textDark,
    marginBottom: 8,
  },
  courtPill: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: AL.border,
    alignItems: 'center',
  },
  courtPillActive: {
    backgroundColor: AL.primary,
    borderColor: AL.primary,
  },
  courtPillText: {
    color: AL.textDark,
    fontSize: 13,
    fontWeight: '800',
  },
  courtPillTextActive: {
    color: '#ffffff',
    fontWeight: '900',
  },
  courtPillPrice: {
    color: AL.textSub,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: AL.border,
  },
  timelineHeader: {
    borderBottomWidth: 1,
    borderColor: '#f1f5f9',
    paddingBottom: 10,
    marginBottom: 10,
  },
  timelineCourtTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: AL.textDark,
  },
  timelineCourtType: {
    fontSize: 11,
    color: AL.textSub,
    marginTop: 2,
  },
  hourRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#f8fafc',
  },
  hourText: {
    width: 45,
    fontSize: 12,
    fontWeight: '700',
    color: '#64748b',
  },
  slotBlock: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  slotBlockText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
  },
  emptySlotBtn: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'dashed',
  },
  emptySlotText: {
    color: '#64748b',
    fontSize: 11,
    fontWeight: '600',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    width: '100%',
    maxWidth: 420,
  },
  modalTitle: { fontSize: 16, fontWeight: '900', color: AL.textDark, marginBottom: 4 },
  modalSub: { fontSize: 12, color: AL.textSub, marginBottom: 12 },
  inputLabel: { color: '#334155', fontSize: 12, fontWeight: '700', marginBottom: 4, marginTop: 8 },
  readonlyVal: {
    backgroundColor: '#f1f5f9',
    padding: 10,
    borderRadius: 8,
    color: '#1e293b',
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  cancelBtn: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  submitBtn: { flex: 1.5, backgroundColor: AL.primary, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
});
