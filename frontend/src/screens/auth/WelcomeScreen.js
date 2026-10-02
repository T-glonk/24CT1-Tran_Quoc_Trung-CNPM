import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS as C } from '../../constants/theme';

export function WelcomeScreen({ navigate }) {
  return (
    <View style={[st.greenBg, { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 }]}>
      <Text style={{ fontSize: 72, marginBottom: 12 }}>🏸</Text>
      <Text style={st.welcomeTitle}>NACHIBOOKING</Text>
      <Text style={st.welcomeSub}>Đặt sân cầu lông trực tuyến</Text>
      <View style={st.welcomeDivider} />
      <Text style={st.welcomeClass}>CHÀO MỪNG CÁC BẠN</Text>
      <Text style={st.welcomeClass}>ĐẾN VỚI APP BOOKING BADMINTON</Text>
      <View style={st.welcomeDivider} />

      <View style={{ width: '100%', marginTop: 20 }}>
        <TouchableOpacity style={st.whiteBtn} onPress={() => navigate('login')}>
          <Text style={st.whiteBtnText}>ĐĂNG NHẬP</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.outlineBtn} onPress={() => navigate('register')}>
          <Text style={st.outlineBtnText}>ĐĂNG KÝ TÀI KHOẢN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  greenBg: {
    backgroundColor: C.primary,
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 1.5,
    textAlign: 'center',
  },
  welcomeSub: {
    color: '#dcfce7',
    fontSize: 14,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  welcomeDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#86efac',
    borderRadius: 2,
    marginVertical: 16,
  },
  welcomeClass: {
    color: '#facc15',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
    textAlign: 'center',
    lineHeight: 22,
  },
  whiteBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  whiteBtnText: {
    color: C.primaryDark,
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
  outlineBtn: {
    borderWidth: 2,
    borderColor: '#ffffff',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
  },
  outlineBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 1,
  },
});
