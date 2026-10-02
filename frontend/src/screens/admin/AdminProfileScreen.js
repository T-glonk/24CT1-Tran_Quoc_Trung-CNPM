import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';

export function AdminProfileScreen({ user, onLogout, navigate }) {
  return (
    <View style={[st.container, { padding: 24, alignItems: 'center' }]}>
      <View style={st.avatarCircle}>
        <Text style={{ fontSize: 48 }}>🛡️</Text>
      </View>
      <Text style={st.nameText}>{user?.name || 'Trần Quốc Trung'}</Text>
      <Text style={st.roleBadge}>👑 QUẢN TRỊ VIÊN HỆ THỐNG (SUPER ADMIN)</Text>
      <Text style={st.emailText}>📧 {user?.email || 'admin@court.vn'}</Text>
      <Text style={st.phoneText}>📞 {user?.phone || '0905 591 379'}</Text>

      <TouchableOpacity
        style={st.logoutBtn}
        onPress={() =>
          Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất khỏi quyền Admin?', [
            { text: 'Hủy' },
            { text: 'Đăng xuất', style: 'destructive', onPress: onLogout },
          ])
        }
      >
        <Text style={st.logoutBtnText}>ĐĂNG XUẤT HỆ THỐNG</Text>
      </TouchableOpacity>
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: AL.bg },
  avatarCircle: {
    width: 86,
    height: 86,
    borderRadius: 43,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    borderWidth: 2,
    borderColor: AL.primary,
  },
  nameText: { fontSize: 18, fontWeight: '900', color: AL.textDark, marginTop: 14 },
  roleBadge: {
    color: AL.primaryDark,
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    fontWeight: '800',
    fontSize: 11,
    marginTop: 6,
  },
  emailText: { color: AL.textSub, fontSize: 13, marginTop: 8 },
  phoneText: { color: AL.textSub, fontSize: 13, marginTop: 2 },
  logoutBtn: {
    backgroundColor: '#ef4444',
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 14,
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  logoutBtnText: { color: '#fff', fontWeight: '800', fontSize: 14, letterSpacing: 1 },
});
