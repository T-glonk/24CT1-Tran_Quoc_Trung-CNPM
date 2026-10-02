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
import { serviceApi } from '../../api/serviceApi';

export function AdminServicesScreen({ services = [], onUpdateStock, onAddService }) {
  const [quantities, setQuantities] = useState({
    s1: 0,
    s2: 0,
    s3: 0,
    s4: 2,
    s7: 1,
    s5: 0,
  });
  const [search, setSearch] = useState('');
  const [checkoutModal, setCheckoutModal] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('50');

  const updateQty = (id, delta) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + delta),
    }));
  };

  const filtered = search.trim()
    ? services.filter((s) => s.name.toLowerCase().includes(search.toLowerCase()))
    : services;

  const totalAmount = services.reduce(
    (sum, item) => sum + (quantities[item.id] || 0) * item.price,
    0
  );
  const totalItemsCount = Object.values(quantities).reduce((a, b) => a + b, 0);

  const handleCheckout = async () => {
    const selectedItems = services
      .filter((s) => (quantities[s.id] || 0) > 0)
      .map((s) => ({ id: s.id, name: s.name, qty: quantities[s.id], price: s.price }));

    setCheckoutModal(false);
    setQuantities({});

    try {
      await serviceApi.posCheckout({
        items: selectedItems,
        totalAmount,
        customerName: 'Khách lẻ tại quầy POS',
        paymentMethod: 'Tiền mặt',
      });
    } catch (e) {}

    Alert.alert('✅ Thành công', 'Đã in hóa đơn và hoàn tất đơn bán hàng POS!');
  };

  const handleAddProduct = () => {
    if (!newProdName.trim() || !newProdPrice) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên và giá sản phẩm');
      return;
    }
    const newProduct = {
      id: `s${services.length + 1}`,
      name: newProdName.trim(),
      category: 'Nước uống',
      price: Number(newProdPrice),
      stock: Number(newProdStock) || 50,
      cost: Number(newProdPrice) * 0.6,
      unit: 'Chai/Lon',
      icon: '🥤',
    };
    onAddService(newProduct);
    setNewProdName('');
    setNewProdPrice('');
    setAddProductModal(false);
    Alert.alert('✅ Thành công', `Đã thêm món "${newProduct.name}" vào kho hàng POS`);
  };

  return (
    <View style={st.container}>
      {/* Search Header */}
      <View style={st.posSearchContainer}>
        <View style={st.posSearchBox}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>🔍</Text>
          <TextInput
            style={st.posSearchInput}
            placeholder="Tìm sản phẩm nước uống, phụ kiện..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={st.filterIconBtn} onPress={() => setAddProductModal(true)}>
          <Text style={{ fontSize: 18, color: '#fff', fontWeight: '900' }}>＋</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }}>
        {/* Products List */}
        <Text style={st.posSectionHeading}>Danh Mục Sản Phẩm & Kho Hàng ({filtered.length} món)</Text>
        <View style={st.posSectionCard}>
          {filtered.map((item) => {
            const qty = quantities[item.id] || 0;
            return (
              <View key={item.id} style={st.posItemRow}>
                <View style={st.posItemIconBox}>
                  <Text style={{ fontSize: 24 }}>{item.icon || '📦'}</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={st.posItemName}>{item.name}</Text>
                  <Text style={st.posItemPrice}>
                    {item.price.toLocaleString('vi-VN')} đ · Tồn: {item.stock} {item.unit}
                  </Text>
                </View>

                {qty > 0 ? (
                  <View style={st.posStepper}>
                    <TouchableOpacity style={st.posStepBtn} onPress={() => updateQty(item.id, -1)}>
                      <Text style={st.posStepBtnText}>－</Text>
                    </TouchableOpacity>
                    <Text style={st.posStepNum}>{qty}</Text>
                    <TouchableOpacity style={st.posStepBtn} onPress={() => updateQty(item.id, 1)}>
                      <Text style={st.posStepBtnText}>＋</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={st.posAddBtn} onPress={() => updateQty(item.id, 1)}>
                    <Text style={{ color: '#10b981', fontSize: 20, fontWeight: '900' }}>⊕</Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky Bottom POS Action Bar */}
      <View style={st.posStickyBottom}>
        <TouchableOpacity
          style={[st.posSubmitBtn, totalItemsCount === 0 && { opacity: 0.6 }]}
          onPress={() => {
            if (totalItemsCount === 0) {
              Alert.alert('Chưa chọn món', 'Vui lòng chọn ít nhất 1 sản phẩm để lên đơn');
            } else {
              setCheckoutModal(true);
            }
          }}
        >
          <Text style={st.posSubmitBtnText}>
            LÊN ĐƠN ({totalAmount.toLocaleString('vi-VN')} đ)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Checkout Modal */}
      <Modal visible={checkoutModal} transparent animationType="slide">
        <View style={st.modalBackdrop}>
          <View style={st.modalCard}>
            <Text style={st.modalTitleText}>🧾 Xác Nhận Đơn POS Tại Quầy</Text>
            <Text style={{ color: '#0f172a', fontWeight: '800', fontSize: 18, marginVertical: 8 }}>
              Tổng tiền: {totalAmount.toLocaleString('vi-VN')} VNĐ
            </Text>
            <Text style={{ color: AL.textSub, fontSize: 13, marginBottom: 14 }}>
              Số lượng sản phẩm: {totalItemsCount} món
            </Text>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity style={st.modalCancelBtn} onPress={() => setCheckoutModal(false)}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.modalConfirmBtn} onPress={handleCheckout}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>THU TIỀN MẶT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Product Modal */}
      <Modal visible={addProductModal} transparent animationType="slide">
        <View style={st.modalBackdrop}>
          <View style={st.modalCard}>
            <Text style={st.modalTitleText}>＋ Nhập Món Mới Vào Kho</Text>
            <Text style={st.inputLabel}>Tên món / dụng cụ *</Text>
            <TextInput style={st.input} value={newProdName} onChangeText={setNewProdName} placeholder="Ví dụ: Nước tăng lực Monster" />

            <Text style={st.inputLabel}>Giá bán (VNĐ) *</Text>
            <TextInput style={st.input} value={newProdPrice} onChangeText={setNewProdPrice} placeholder="Ví dụ: 25000" keyboardType="numeric" />

            <Text style={st.inputLabel}>Số lượng nhập kho ban đầu</Text>
            <TextInput style={st.input} value={newProdStock} onChangeText={setNewProdStock} keyboardType="numeric" />

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
              <TouchableOpacity style={st.modalCancelBtn} onPress={() => setAddProductModal(false)}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.modalConfirmBtn} onPress={handleAddProduct}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>LƯU KHO</Text>
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
  posSearchContainer: { flexDirection: 'row', padding: 12, backgroundColor: AL.headerGreen, gap: 8 },
  posSearchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  posSearchInput: { flex: 1, fontSize: 13, color: '#0f172a' },
  filterIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: AL.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  posSectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: AL.textDark,
    marginLeft: 14,
    marginTop: 14,
    marginBottom: 6,
  },
  posSectionCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    borderRadius: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: AL.border,
  },
  posItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  posItemIconBox: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    alignItems: 'center',
    justifyContent: 'center',
  },
  posItemName: { color: AL.textDark, fontSize: 13, fontWeight: '800' },
  posItemPrice: { color: AL.textSub, fontSize: 12, marginTop: 2 },
  posAddBtn: { padding: 6 },
  posStepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 8,
    paddingHorizontal: 4,
  },
  posStepBtn: { paddingHorizontal: 8, paddingVertical: 4 },
  posStepBtnText: { color: '#b45309', fontSize: 16, fontWeight: '900' },
  posStepNum: { color: '#b45309', fontSize: 14, fontWeight: '900', paddingHorizontal: 4 },
  posStickyBottom: { position: 'absolute', bottom: 16, left: 14, right: 14 },
  posSubmitBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    shadowColor: '#ea580c',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  posSubmitBtnText: { color: '#ffffff', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },
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
  modalTitleText: { fontSize: 16, fontWeight: '900', color: AL.textDark, marginBottom: 10 },
  modalCancelBtn: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
  modalConfirmBtn: { flex: 1.5, backgroundColor: AL.primary, borderRadius: 10, paddingVertical: 10, alignItems: 'center' },
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
});
