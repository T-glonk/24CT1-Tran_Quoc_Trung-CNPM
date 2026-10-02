import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';

export function AdminCourtsScreen({ courts = [], onToggleStatus, onAddCourt, onUpdatePrice }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [courtName, setCourtName] = useState('');
  const [courtPrice, setCourtPrice] = useState('80000');

  const handleAdd = () => {
    if (!courtName.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên sân');
      return;
    }
    const newCourt = {
      id: String(courts.length + 1),
      name: courtName.trim(),
      clubId: 'c1',
      clubName: 'CLB Cầu Lông TPT Sport',
      location: '207 Quách Thị Trang, Cẩm Lệ, Đà Nẵng',
      district: 'Cẩm Lệ',
      price: Number(courtPrice) || 80000,
      type: 'Thảm PVC thi đấu',
      status: 'available',
      currentGuest: null,
      currentSlot: null,
    };
    onAddCourt(newCourt);
    setCourtName('');
    setModalVisible(false);
    Alert.alert('✅ Thành công', `Đã thêm sân "${newCourt.name}" vào hệ thống`);
  };

  return (
    <View style={st.container}>
      <View style={st.topBar}>
        <Text style={st.topTitle}>Danh Sách Sân Đấu ({courts.length} Sân)</Text>
        <TouchableOpacity style={st.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={st.addBtnText}>＋ Thêm Sân</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={courts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14 }}
        renderItem={({ item }) => (
          <View style={st.courtCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={st.courtName}>{item.name}</Text>
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

            <Text style={st.courtDetail}>📍 {item.location}</Text>
            <Text style={st.courtPrice}>
              💰 {item.price.toLocaleString('vi-VN')} đ/h ({item.type})
            </Text>

            {item.currentGuest && (
              <View style={st.guestBox}>
                <Text style={st.guestText}>👤 Khách hiện tại: {item.currentGuest}</Text>
                {item.currentSlot && <Text style={st.guestSub}>Khung giờ: {item.currentSlot}</Text>}
              </View>
            )}

            {/* Quick State Toggle Buttons */}
            <View style={st.toggleRow}>
              {['available', 'in_use', 'maintenance'].map((stKey) => (
                <TouchableOpacity
                  key={stKey}
                  style={[st.toggleBtn, item.status === stKey && st.toggleBtnActive]}
                  onPress={() => onToggleStatus(item.id, stKey)}
                >
                  <Text style={[st.toggleBtnText, item.status === stKey && st.toggleBtnTextActive]}>
                    {stKey === 'available' ? 'Trống' : stKey === 'in_use' ? 'Đang dùng' : 'Bảo trì'}
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
            <Text style={st.modalTitle}>Thêm Sân Đấu Mới</Text>
            <Text style={st.inputLabel}>Tên sân</Text>
            <TextInput
              style={st.input}
              value={courtName}
              onChangeText={setCourtName}
              placeholder="Ví dụ: Sân 3 - VIP"
            />
            <Text style={st.inputLabel}>Giá thuê (đ/h)</Text>
            <TextInput
              style={st.input}
              value={courtPrice}
              onChangeText={setCourtPrice}
              keyboardType="numeric"
            />
            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={st.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.submitBtn} onPress={handleAdd}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>THÊM SÂN</Text>
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
  topTitle: { color: AL.textDark, fontSize: 14, fontWeight: '800' },
  addBtn: {
    backgroundColor: AL.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addBtnText: { color: '#fff', fontSize: 12, fontWeight: '800' },
  courtCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: AL.border,
  },
  courtName: { fontSize: 15, fontWeight: '800', color: AL.textDark },
  statusTag: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  statusTagText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  courtDetail: { color: AL.textSub, fontSize: 12, marginTop: 4 },
  courtPrice: { color: AL.primaryDark, fontSize: 13, fontWeight: '800', marginTop: 4 },
  guestBox: {
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  guestText: { color: '#1e293b', fontSize: 12, fontWeight: '700' },
  guestSub: { color: '#64748b', fontSize: 11, marginTop: 2 },
  toggleRow: { flexDirection: 'row', gap: 6, marginTop: 10 },
  toggleBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AL.border,
  },
  toggleBtnActive: { backgroundColor: AL.primary, borderColor: AL.primary },
  toggleBtnText: { color: AL.textSub, fontSize: 11, fontWeight: '700' },
  toggleBtnTextActive: { color: '#fff', fontWeight: '800' },
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
  modalTitle: { fontSize: 16, fontWeight: '900', color: AL.textDark, marginBottom: 12 },
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
  submitBtn: { flex: 1.5, backgroundColor: AL.primary, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
});
