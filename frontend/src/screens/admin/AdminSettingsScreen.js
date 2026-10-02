import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';

export function AdminSettingsScreen({ logs = [], onLogout }) {
  const [logoutModal, setLogoutModal] = useState(false);

  const handleConfirmLogout = () => {
    setLogoutModal(false);
    if (onLogout) onLogout();
  };

  return (
    <ScrollView style={st.container} contentContainerStyle={{ padding: 14 }}>
      {/* Club Information Card */}
      <View style={st.card}>
        <Text style={st.cardTitle}>Hệ Thống Chuỗi Sân Cầu Lông QT Sport</Text>
        <Text style={st.cardSub}>🏸 QT Sport - Cơ sở 1: Sân Hoa Thiên Lý · 8 Sân Tiêu Chuẩn BWF</Text>
        <Text style={st.cardSub}>📍 207 Quách Thị Trang, Hòa Xuân, Cẩm Lệ, Đà Nẵng</Text>
        <Text style={st.cardSub}>📞 Hotline quản lý: 0905 591 379 · Hệ thống 8 cơ sở toàn quốc</Text>
      </View>

      {/* Quick Logout Button */}
      <TouchableOpacity style={st.logoutCardBtn} onPress={() => setLogoutModal(true)}>
        <Text style={{ fontSize: 18, marginRight: 8 }}>🚪</Text>
        <Text style={st.logoutCardBtnText}>ĐĂNG XUẤT TÀI KHOẢN QUẢN TRỊ</Text>
      </TouchableOpacity>

      {/* System Audit Logs */}
      <Text style={st.sectionHeading}>📜 Nhật Ký Hoạt Động & Audit Logs</Text>
      {logs.map((item) => (
        <View key={item.id} style={st.logCard}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={st.logAction}>⚡ {item.action}</Text>
            <Text style={st.logTime}>{item.time}</Text>
          </View>
          <Text style={st.logDetail}>{item.detail}</Text>
          <Text style={st.logUser}>Thực hiện bởi: {item.user}</Text>
        </View>
      ))}

      {/* Logout Confirmation Modal */}
      <Modal visible={logoutModal} transparent animationType="fade">
        <View style={st.modalBackdrop}>
          <View style={st.logoutModalCard}>
            <View style={st.logoutIconCircle}>
              <Text style={{ fontSize: 32 }}>🚪</Text>
            </View>
            <Text style={st.logoutModalTitle}>Xác Nhận Đăng Xuất</Text>
            <Text style={st.logoutModalDesc}>
              Bạn có chắc chắn muốn kết thúc phiên làm việc và đăng xuất khỏi tài khoản Quản trị viên (Admin) không?
            </Text>

            <View style={st.logoutModalBtnRow}>
              <TouchableOpacity
                style={st.cancelLogoutBtn}
                onPress={() => setLogoutModal(false)}
              >
                <Text style={st.cancelLogoutBtnText}>Hủy bỏ</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={st.confirmLogoutBtn}
                onPress={handleConfirmLogout}
              >
                <Text style={st.confirmLogoutBtnText}>Đăng xuất ngay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: AL.bg },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: AL.border,
  },
  cardTitle: { fontSize: 14, fontWeight: '800', color: AL.textDark, marginBottom: 4 },
  cardSub: { color: AL.textSub, fontSize: 12, marginTop: 2 },
  logoutCardBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingVertical: 12,
    marginBottom: 16,
  },
  logoutCardBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  sectionHeading: { fontSize: 13, fontWeight: '800', color: AL.textDark, marginBottom: 8 },
  logCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AL.border,
  },
  logAction: { color: AL.primaryDark, fontWeight: '800', fontSize: 12 },
  logTime: { color: AL.textSub, fontSize: 10 },
  logDetail: { color: AL.textDark, fontSize: 12, marginTop: 4, fontWeight: '600' },
  logUser: { color: AL.textSub, fontSize: 11, marginTop: 2 },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoutModalCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 22,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
  },
  logoutIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  logoutModalTitle: { fontSize: 17, fontWeight: '900', color: '#1e293b', marginBottom: 6 },
  logoutModalDesc: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 19,
    marginBottom: 20,
  },
  logoutModalBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  cancelLogoutBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  cancelLogoutBtnText: { color: '#475569', fontSize: 13, fontWeight: '800' },
  confirmLogoutBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmLogoutBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '900' },
});
