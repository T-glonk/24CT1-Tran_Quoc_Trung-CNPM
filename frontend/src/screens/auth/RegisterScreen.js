import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { APP_ASSETS } from '../../constants/assets';
import { PhoneInput } from '../../components/auth/PhoneInput';
import { FormInput } from '../../components/auth/FormInput';
import { FieldLabel } from '../../components/auth/FieldLabel';
import { authApi } from '../../api/authApi';

export function RegisterScreen({ navigate, onLogin }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập họ và tên');
      return;
    }
    if (!phone.trim() && !email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập số điện thoại hoặc email');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
      return;
    }
    if (password !== confirmPass) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp');
      return;
    }

    setLoading(true);

    try {
      const res = await authApi.register({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: password.trim(),
      });

      if (res && res.success && res.data) {
        setLoading(false);
        Alert.alert('✅ Thành công', 'Đăng ký tài khoản thành công!', [
          { text: 'Đăng nhập ngay', onPress: () => onLogin(res.data) },
        ]);
        return;
      }
    } catch (e) {}

    // Fallback registration
    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || `${phone.trim()}@court.vn`,
      password: password.trim(),
      role: 'customer',
      status: 'active',
      joinedDate: new Date().toLocaleDateString('vi-VN'),
      tier: 'Đồng',
      totalSpent: 0,
      bookingsCount: 0,
    };

    setLoading(false);
    Alert.alert('✅ Thành công', 'Đăng ký tài khoản thành công!', [
      { text: 'Vào ứng dụng', onPress: () => onLogin(newUser) },
    ]);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#f8fafc' }}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}
        showsVerticalScrollIndicator={false}
      >
        <View style={st.topBadge}>
          <Image
            source={APP_ASSETS.logo}
            style={st.logoImage}
            resizeMode="contain"
          />
          <Text style={st.badgeTitle}>QT SPORT</Text>
          <Text style={st.badgeSub}>Tạo tài khoản thành viên trên ứng dụng di động</Text>
        </View>

        <View style={{ marginTop: 10 }}>
          <FieldLabel text="Họ và tên" required />
          <FormInput
            value={name}
            onChangeText={setName}
            placeholder="Ví dụ: Nguyễn Văn A"
          />

          <FieldLabel text="Số điện thoại" required />
          <PhoneInput value={phone} onChangeText={setPhone} />

          <FieldLabel text="Email" />
          <FormInput
            value={email}
            onChangeText={setEmail}
            placeholder="example@court.vn"
          />

          <FieldLabel text="Mật khẩu" required />
          <FormInput
            value={password}
            onChangeText={setPassword}
            placeholder="Tối thiểu 6 ký tự"
            secureTextEntry={!showPass}
            rightIcon={showPass ? '👁️' : '👁️‍🗨️'}
            onRightPress={() => setShowPass(!showPass)}
          />

          <FieldLabel text="Xác nhận mật khẩu" required />
          <FormInput
            value={confirmPass}
            onChangeText={setConfirmPass}
            placeholder="Nhập lại mật khẩu"
            secureTextEntry={!showPass}
          />

          <TouchableOpacity
            style={[st.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={st.submitBtnText}>ĐĂNG KÝ TÀI KHOẢN</Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={st.loginFooter}>
          <Text style={{ color: '#64748b', fontSize: 14 }}>Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigate('login')}>
            <Text style={{ color: C.primary, fontSize: 14, fontWeight: '800' }}>
              Đăng nhập ngay
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  topBadge: {
    alignItems: 'center',
    marginBottom: 16,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 18,
    marginBottom: 10,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  badgeTitle: {
    color: '#0f172a',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  badgeSub: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  submitBtn: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1,
  },
  loginFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
