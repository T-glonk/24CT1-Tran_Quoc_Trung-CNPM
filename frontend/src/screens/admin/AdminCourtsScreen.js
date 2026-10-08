import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';
import { INITIAL_CLUBS } from '../../constants/initialData';

export function AdminCourtsScreen({
  courts = [],
  clubs = INITIAL_CLUBS,
  selectedClub,
  onSelectClub,
  onToggleStatus,
  onAddCourt,
  onUpdatePrice,
}) {
  const [activeClubId, setActiveClubId] = useState(selectedClub?.id || clubs[0]?.id || 'c1');
  const [modalVisible, setModalVisible] = useState(false);
  const [priceModalVisible, setPriceModalVisible] = useState(false);
  const [selectedCourtForPrice, setSelectedCourtForPrice] = useState(null);
  const [newPriceVal, setNewPriceVal] = useState('');

  const activeClub = clubs.find((c) => c.id === activeClubId) || clubs[0] || INITIAL_CLUBS[0];

  // Lọc chính xác các sân của cơ sở đang chọn (KHÔNG GỘP CHUNG TẤT CẢ SÂN)
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
          district: activeClub.district,
          price: 80000,
          type: 'Thảm PVC thi đấu',
          status: 'available',
        }));

  const [courtName, setCourtName] = useState(`Sân ${displayCourts.length + 1}`);
  const [courtPrice, setCourtPrice] = useState('80000');
  const [courtType, setCourtType] = useState('Thảm PVC Chống Trơn');

  const handleSelectFacility = (club) => {
    setActiveClubId(club.id);
    if (onSelectClub) {
      onSelectClub(club);
    }
  };

  const handleOpenAddModal = () => {
    setCourtName(`Sân ${displayCourts.length + 1}`);
    setCourtPrice('80000');
    setCourtType('Thảm PVC Chống Trơn');
    setModalVisible(true);
  };

  const handleAdd = () => {
    if (!courtName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sân');
      return;
    }
    const newCourt = {
      id: `${activeClub.id}_${Date.now().toString().slice(-4)}`,
      name: courtName.trim(),
      clubId: activeClub.id,
      clubName: activeClub.name,
      location: activeClub.address,
      district: activeClub.district,
      price: Number(courtPrice) || 80000,
      type: courtType.trim() || 'Thảm PVC thi đấu',
      status: 'available',
      currentGuest: null,
      currentSlot: null,
    };
    if (onAddCourt) {
      onAddCourt(newCourt);
    }
    setModalVisible(false);
    Alert.alert('✅ Thành công', `Đã thêm "${newCourt.name}" vào ${activeClub.name}`);
  };

  const handleSavePrice = () => {
    if (!selectedCourtForPrice) return;
    const priceNum = Number(newPriceVal);
    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Lỗi', 'Giá thuê không hợp lệ');
      return;
    }
    if (onUpdatePrice) {
      onUpdatePrice(selectedCourtForPrice.id, priceNum);
    }
    setPriceModalVisible(false);
    Alert.alert('✅ Thành công', `Đã đổi giá ${selectedCourtForPrice.name} thành ${priceNum.toLocaleString('vi-VN')} đ/h`);
  };

  return (
    <View style={st.container}>
      {/* Facility Switcher Bar (Quản lý riêng biệt từng cơ sở) */}
      <View style={st.facilityHeaderCard}>
        <View style={st.facilityHeaderTitleRow}>
          <Text style={st.facilityHeaderTitle}>🏢 CHỌN CƠ SỞ ĐỂ QUẢN LÝ SÂN:</Text>
          <Text style={st.facilityCountBadge}>{displayCourts.length} Sân đấu</Text>
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

      {/* Facility Action Subheader */}
      <View style={st.topBar}>
        <View style={{ flex: 1 }}>
          <Text style={st.activeClubName} numberOfLines={1}>
            📍 {activeClub.name}
          </Text>
          <Text style={st.activeClubDetail} numberOfLines={1}>
            {activeClub.address} · ({displayCourts.length} Sân hoạt động)
          </Text>
        </View>
        <TouchableOpacity style={st.addBtn} onPress={handleOpenAddModal}>
          <Text style={st.addBtnText}>＋ Thêm Sân</Text>
        </TouchableOpacity>
      </View>

      {/* Courts List strictly for the selected facility */}
      <FlatList
        data={displayCourts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 100 }}
        renderItem={({ item, index }) => (
          <View style={st.courtCard}>
            <View style={st.cardHeaderRow}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={st.courtNumberCircle}>
                  <Text style={st.courtNumberText}>{index + 1}</Text>
                </View>
                <View>
                  <Text style={st.courtName}>{item.name}</Text>
                  <Text style={st.courtClubTag}>{activeClub.name.replace('QT Sport - ', '')}</Text>
                </View>
              </View>

              <View
                style={[
                  st.statusTag,
                  {
                    backgroundColor:
                      item.status === 'available'
                        ? '#10b981'
                        : item.status === 'in_use'
                        ? '#0284c7'
                        : item.status === 'booked'
                        ? '#f59e0b'
                        : '#ef4444',
                  },
                ]}
              >
                <Text style={st.statusTagText}>
                  {item.status === 'available'
                    ? 'SẴN SÀNG'
                    : item.status === 'in_use'
                    ? 'ĐANG SỬ DỤNG'
                    : item.status === 'booked'
                    ? 'ĐÃ ĐẶT'
                    : 'BẢO TRÌ'}
                </Text>
              </View>
            </View>

            <View style={st.cardDetailsRow}>
              <Text style={st.courtDetailText}>🏸 {item.type || 'Thảm PVC Quốc tế'}</Text>
              <TouchableOpacity
                style={st.priceEditBtn}
                onPress={() => {
                  setSelectedCourtForPrice(item);
                  setNewPriceVal(String(item.price || 80000));
                  setPriceModalVisible(true);
                }}
              >
                <Text style={st.courtPriceText}>
                  💰 {(item.price || 80000).toLocaleString('vi-VN')} đ/h ✏️
                </Text>
              </TouchableOpacity>
            </View>

            {item.currentGuest && (
              <View style={st.guestBox}>
                <Text style={st.guestText}>👤 Khách: {item.currentGuest}</Text>
                {item.currentSlot && <Text style={st.guestSub}>Khung giờ: {item.currentSlot}</Text>}
              </View>
            )}

            {/* Quick State Toggle Buttons */}
            <View style={st.toggleRow}>
              {[
                { key: 'available', label: '🟢 Trống' },
                { key: 'in_use', label: '🔵 Đang dùng' },
                { key: 'maintenance', label: '🔴 Bảo trì' },
              ].map((stItem) => (
                <TouchableOpacity
                  key={stItem.key}
                  style={[st.toggleBtn, item.status === stItem.key && st.toggleBtnActive]}
                  onPress={() => onToggleStatus && onToggleStatus(item.id, stItem.key)}
                >
                  <Text style={[st.toggleBtnText, item.status === stItem.key && st.toggleBtnTextActive]}>
                    {stItem.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />

      {/* Add Court Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={st.modalBackdrop}>
          <View style={st.modalCard}>
            <Text style={st.modalTitle}>＋ Thêm Sân Đấu Cho {activeClub.name.replace('QT Sport - ', '')}</Text>

            <Text style={st.inputLabel}>Tên sân đấu *</Text>
            <TextInput
              style={st.input}
              value={courtName}
              onChangeText={setCourtName}
              placeholder="Ví dụ: Sân 7 (VIP)"
            />

            <Text style={st.inputLabel}>Loại thảm / Loại sân</Text>
            <TextInput
              style={st.input}
              value={courtType}
              onChangeText={setCourtType}
              placeholder="Ví dụ: Thảm Yonex BWF"
            />

            <Text style={st.inputLabel}>Giá thuê mỗi giờ (VNĐ) *</Text>
            <TextInput
              style={st.input}
              value={courtPrice}
              onChangeText={setCourtPrice}
              keyboardType="numeric"
              placeholder="80000"
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
              <TouchableOpacity style={st.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.submitBtn} onPress={handleAdd}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>XÁC NHẬN THÊM</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Price Modal */}
      <Modal visible={priceModalVisible} transparent animationType="fade">
        <View style={st.modalBackdrop}>
          <View style={st.modalCard}>
            <Text style={st.modalTitle}>✏️ Đổi Giá Thuê: {selectedCourtForPrice?.name}</Text>
            <Text style={{ color: AL.textSub, fontSize: 13, marginBottom: 12 }}>
              Cơ sở: {activeClub.name}
            </Text>

            <Text style={st.inputLabel}>Giá thuê mới (đ/h)</Text>
            <TextInput
              style={st.input}
              value={newPriceVal}
              onChangeText={setNewPriceVal}
              keyboardType="numeric"
              placeholder="Nhập giá mới..."
            />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
              <TouchableOpacity style={st.cancelBtn} onPress={() => setPriceModalVisible(false)}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.submitBtn} onPress={handleSavePrice}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>LƯU GIÁ MỚI</Text>
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
  activeClubName: {
    color: AL.textDark,
    fontSize: 14,
    fontWeight: '800',
  },
  activeClubDetail: {
    color: AL.textSub,
    fontSize: 11,
    marginTop: 2,
  },
  addBtn: {
    backgroundColor: AL.primary,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    elevation: 2,
  },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  courtCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AL.border,
    elevation: 1,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  courtNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ecfdf5',
    borderWidth: 1,
    borderColor: '#a7f3d0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courtNumberText: {
    color: AL.primaryDark,
    fontSize: 14,
    fontWeight: '900',
  },
  courtName: { fontSize: 16, fontWeight: '900', color: AL.textDark },
  courtClubTag: { color: AL.textSub, fontSize: 11, fontWeight: '600' },
  statusTag: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  statusTagText: { color: '#fff', fontSize: 10, fontWeight: '900' },
  cardDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  courtDetailText: { color: AL.textDark, fontSize: 13, fontWeight: '600' },
  priceEditBtn: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  courtPriceText: { color: AL.primaryDark, fontSize: 13, fontWeight: '800' },
  guestBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  guestText: { color: '#166534', fontSize: 12, fontWeight: '700' },
  guestSub: { color: '#15803d', fontSize: 11, marginTop: 2 },
  toggleRow: { flexDirection: 'row', gap: 8, marginTop: 12 },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AL.border,
  },
  toggleBtnActive: {
    backgroundColor: AL.primary,
    borderColor: AL.primary,
  },
  toggleBtnText: { color: AL.textSub, fontSize: 12, fontWeight: '700' },
  toggleBtnTextActive: { color: '#fff', fontWeight: '900' },
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
  modalTitle: { fontSize: 16, fontWeight: '900', color: AL.textDark, marginBottom: 12 },
  inputLabel: { color: '#334155', fontSize: 12, fontWeight: '700', marginBottom: 4, marginTop: 10 },
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
