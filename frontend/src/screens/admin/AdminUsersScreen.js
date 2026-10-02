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

export function AdminUsersScreen({ users = [], onToggleUserStatus, onUpdateUserRole, onAddUser }) {
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('staff');

  const handleCreate = () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên nhân viên/người dùng');
      return;
    }
    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || '0905 000 000',
      email: `${phone.trim() || Date.now()}@court.vn`,
      role,
      status: 'active',
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      tier: 'Bạc',
      totalSpent: 0,
      bookingsCount: 0,
    };
    onAddUser(newUser);
    setName('');
    setPhone('');
    setModalVisible(false);
    Alert.alert('✅ Thành công', `Đã thêm tài khoản "${newUser.name}" với vai trò ${role}`);
  };

  return (
    <View style={st.container}>
      <View style={st.topBar}>
        <Text style={st.topTitle}>Quản Lý Tài Khoản & Phân Quyền</Text>
        <TouchableOpacity style={st.addBtn} onPress={() => setModalVisible(true)}>
          <Text style={st.addBtnText}>＋ Thêm Tài Khoản</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14 }}
        renderItem={({ item }) => {
          const isLocked = item.status === 'locked';
          return (
            <View style={st.userCard}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={st.userName}>{item.name}</Text>
                  <Text style={st.userEmail}>{item.email} · 📞 {item.phone}</Text>
                </View>

                <View
                  style={[
                    st.roleBadge,
                    {
                      backgroundColor:
                        item.role === 'admin'
                          ? '#7c3aed'
                          : item.role === 'manager'
                          ? '#0284c7'
                          : item.role === 'staff'
                          ? '#10b981'
                          : '#64748b',
                    },
                  ]}
                >
                  <Text style={st.roleBadgeText}>
                    {item.role === 'admin'
                      ? 'ADMIN'
                      : item.role === 'manager'
                      ? 'QUẢN LÝ'
                      : item.role === 'staff'
                      ? 'LỄ TÂN'
                      : 'KHÁCH'}
                  </Text>
                </View>
              </View>

              <View style={st.actionRow}>
                {/* Role Switcher */}
                <View style={{ flexDirection: 'row', gap: 4 }}>
                  {['staff', 'manager', 'admin'].map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[st.roleBtn, item.role === r && st.roleBtnActive]}
                      onPress={() => onUpdateUserRole(item.id, r)}
                    >
                      <Text style={[st.roleBtnText, item.role === r && st.roleBtnTextActive]}>
                        {r === 'staff' ? 'Lễ tân' : r === 'manager' ? 'Quản lý' : 'Admin'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Lock / Unlock button */}
                <TouchableOpacity
                  style={[st.statusToggleBtn, isLocked ? st.unlockBtn : st.lockBtn]}
                  onPress={() => onToggleUserStatus(item.id)}
                >
                  <Text style={[st.statusToggleText, isLocked && { color: '#15803d' }]}>
                    {isLocked ? '🔓 Mở khóa' : '🔒 Khóa'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />

      {/* Add User Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={st.modalBackdrop}>
          <View style={st.modalCard}>
            <Text style={st.modalTitle}>Thêm Tài Khoản Mới</Text>
            <Text style={st.inputLabel}>Họ và tên *</Text>
            <TextInput style={st.input} value={name} onChangeText={setName} placeholder="Ví dụ: Lê Văn Quản Lý" />

            <Text style={st.inputLabel}>Số điện thoại</Text>
            <TextInput style={st.input} value={phone} onChangeText={setPhone} placeholder="09xx xxx xxx" keyboardType="phone-pad" />

            <Text style={st.inputLabel}>Vai trò</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 4 }}>
              {[
                ['staff', 'Lễ tân / Thu ngân'],
                ['manager', 'Quản lý'],
                ['admin', 'Admin'],
              ].map(([rKey, rLabel]) => (
                <TouchableOpacity
                  key={rKey}
                  style={[st.roleOptionPill, role === rKey && st.roleOptionPillActive]}
                  onPress={() => setRole(rKey)}
                >
                  <Text style={[st.roleOptionText, role === rKey && st.roleOptionTextActive]}>
                    {rLabel}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
              <TouchableOpacity style={st.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={{ color: '#0f172a', fontWeight: '700' }}>HỦY</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.submitBtn} onPress={handleCreate}>
                <Text style={{ color: '#fff', fontWeight: '800' }}>LƯU TÀI KHOẢN</Text>
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
  addBtn: {
    backgroundColor: AL.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
  userCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: AL.border,
  },
  userName: { fontSize: 14, fontWeight: '800', color: AL.textDark },
  userEmail: { color: AL.textSub, fontSize: 12, marginTop: 2 },
  roleBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  roleBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: '#f1f5f9',
  },
  roleBtn: {
    backgroundColor: '#f8fafc',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: AL.border,
  },
  roleBtnActive: { backgroundColor: AL.primaryDark, borderColor: AL.primaryDark },
  roleBtnText: { color: AL.textSub, fontSize: 11, fontWeight: '700' },
  roleBtnTextActive: { color: '#fff', fontWeight: '800' },
  statusToggleBtn: { borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 },
  lockBtn: { backgroundColor: '#fee2e2' },
  unlockBtn: { backgroundColor: '#dcfce7' },
  statusToggleText: { color: '#ef4444', fontSize: 11, fontWeight: '800' },
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
  roleOptionPill: {
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: AL.border,
  },
  roleOptionPillActive: { backgroundColor: AL.primary, borderColor: AL.primary },
  roleOptionText: { color: AL.textSub, fontSize: 11, fontWeight: '700' },
  roleOptionTextActive: { color: '#fff', fontWeight: '800' },
  cancelBtn: { flex: 1, backgroundColor: '#f1f5f9', borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
  submitBtn: { flex: 1.5, backgroundColor: AL.primary, borderRadius: 8, paddingVertical: 10, alignItems: 'center' },
});
