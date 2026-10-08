import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { APP_ASSETS } from '../../constants/assets';

export function WelcomeScreen({ navigate }) {
  return (
    <View style={[st.greenBg, { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 }]}>
      {/* Brand App Logo */}
      <Image
        source={APP_ASSETS.logo}
        style={st.logoImage}
        resizeMode="contain"
      />

      <Text style={st.welcomeTitle}>QT SPORT</Text>
      <Text style={st.welcomeSub}>Ứng dụng đặt sân cầu lông & Quản lý CLB</Text>
      <View style={st.welcomeDivider} />
      <Text style={st.welcomeClass}>HỆ THỐNG ĐẶT SÂN THỂ THAO</Text>
      <Text style={st.welcomeClass}>24CT1 - TRẦN QUỐC TRUNG</Text>
      <View style={st.welcomeDivider} />

      <View style={{ width: '100%', marginTop: 24 }}>
        <TouchableOpacity style={st.whiteBtn} onPress={() => navigate('login')} activeOpacity={0.85}>
          <Text style={st.whiteBtnText}>ĐĂNG NHẬP NGAY</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.outlineBtn} onPress={() => navigate('register')} activeOpacity={0.85}>
          <Text style={st.outlineBtnText}>ĐĂNG KÝ TÀI KHOẢN MỚI</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  greenBg: {
    backgroundColor: C.primaryDark,
  },
  logoImage: {
    width: 110,
    height: 110,
    borderRadius: 24,
    marginBottom: 16,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  welcomeTitle: {
    color: '#ffffff',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: 2,
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
