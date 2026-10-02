import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { PhoneInput } from '../../components/auth/PhoneInput';
import { FormInput } from '../../components/auth/FormInput';
import { FieldLabel } from '../../components/auth/FieldLabel';
import { authApi } from '../../api/authApi';
import { INITIAL_USERS } from '../../constants/initialData';

export function LoginScreen({ navigate, onLogin }) {
  const [tab, setTab] = useState('phone'); // 'phone' | 'email'
  const [phone, setPhone] = useState('0905591379');
  const [email, setEmail] = useState('trung05082005tqt@gmail.com');
  const [password, setPassword] = useState('123456');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const fillQuickUser = (role) => {
    if (role === 'admin') {
      setEmail('admin@court.vn');
      setPhone('0905 591 379');
      setPassword('123456');
    } else if (role === 'manager') {
      setEmail('manager@court.vn');
      setPhone('0912 345 678');
      setPassword('123456');
    } else {
      setEmail('trung05082005tqt@gmail.com');
      setPhone('0905591379');
      setPassword('123456');
    }
  };

  const handleLogin = async () => {
    const account = tab === 'phone' ? phone.trim() : email.trim();
    if (!account) {
      Alert.alert('Lỗi', `Vui lòng nhập ${tab === 'phone' ? 'số điện thoại' : 'email'}`);
      return;
    }
    if (!password.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu');
      return;
    }

    setLoading(true);

    try {
      // 1. Try Backend API
      const res = await authApi.login({
        account,
        email: tab === 'email' ? account : undefined,
        phone: tab === 'phone' ? account : undefined,
        password: password.trim(),
      });

      if (res && res.success && res.data) {
        setLoading(false);
        onLogin(res.data);
        return;
      } else if (res && !res.isOffline) {
        setLoading(false);
        Alert.alert('Đăng nhập thất bại', res.message || 'Sai thông tin đăng nhập');
        return;
      }
    } catch (e) {
      // Fallback local search
    }

    // 2. Offline fallback
    const user = INITIAL_USERS.find(
      (u) =>
        (u.phone.replace(/\s/g, '') === account.replace(/\s/g, '') ||
          u.email.toLowerCase() === account.toLowerCase()) &&
        u.password === password.trim()
    );

    setLoading(false);

    if (user) {
      if (user.status === 'locked') {
        Alert.alert('Tài khoản bị khóa', 'Tài khoản này đã bị khóa do vi phạm quy định.');
        return;
      }
      onLogin(user);
    } else {
      Alert.alert('Đăng nhập thất bại', 'Số điện thoại/Email hoặc mật khẩu không chính xác.');
    }
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
        {/* Logo Card */}
        <View style={st.topBadge}>
          <Text style={{ fontSize: 36, marginBottom: 4 }}>🏸</Text>
          <Text style={st.badgeTitle}>BADMINTON COURT</Text>
          <Text style={st.badgeSub}>Đăng nhập tài khoản</Text>
        </View>

        {/* Tab switcher */}
        <View style={st.tabBar}>
          <TouchableOpacity
            style={[st.tabBtn, tab === 'phone' && st.tabBtnActive]}
            onPress={() => setTab('phone')}
          >
            <Text style={[st.tabText, tab === 'phone' && st.tabTextActive]}>Số điện thoại</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[st.tabBtn, tab === 'email' && st.tabBtnActive]}
            onPress={() => setTab('email')}
          >
            <Text style={[st.tabText, tab === 'email' && st.tabTextActive]}>Email / Tài khoản</Text>
          </TouchableOpacity>
        </View>

        {/* Inputs */}
        <View style={{ marginTop: 16 }}>
          {tab === 'phone' ? (
            <>
              <FieldLabel text="Số điện thoại" required />
              <PhoneInput value={phone} onChangeText={setPhone} />
            </>
          ) : (
            <>
              <FieldLabel text="Địa chỉ Email" required />
              <FormInput
                value={email}
                onChangeText={setEmail}
                placeholder="example@court.vn"
              />
            </>
          )}

          <FieldLabel text="Mật khẩu" required />
          <FormInput
            value={password}
            onChangeText={setPassword}
            placeholder="Nhập mật khẩu"
            secureTextEntry={!showPass}
            rightIcon={showPass ? '👁️' : '👁️‍🗨️'}
            onRightPress={() => setShowPass(!showPass)}
          />

          <TouchableOpacity style={{ alignSelf: 'flex-end', marginBottom: 16 }}>
            <Text style={{ color: C.primary, fontSize: 13, fontWeight: '700' }}>
              Quên mật khẩu?
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[st.submitBtn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={st.submitBtnText}>ĐĂNG NHẬP</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Quick Credentials for Demonstration */}
        <View style={st.demoCard}>
          <Text style={st.demoTitle}>Tài khoản mẫu trải nghiệm nhanh:</Text>
          <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
            <TouchableOpacity style={st.demoChip} onPress={() => fillQuickUser('admin')}>
              <Text style={st.demoChipText}>👑 Super Admin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.demoChip} onPress={() => fillQuickUser('customer')}>
              <Text style={st.demoChipText}>🏸 Khách VIP</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Register Link */}
        <View style={st.registerFooter}>
          <Text style={{ color: '#64748b', fontSize: 14 }}>Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => navigate('register')}>
            <Text style={{ color: C.primary, fontSize: 14, fontWeight: '800' }}>
              Đăng ký ngay
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
    marginBottom: 20,
  },
  badgeTitle: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
  },
  badgeSub: {
    color: '#64748b',
    fontSize: 13,
    marginTop: 2,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '700',
  },
  tabTextActive: {
    color: C.primaryDark,
    fontWeight: '800',
  },
  submitBtn: {
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
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
  demoCard: {
    backgroundColor: '#ecfdf5',
    borderRadius: 12,
    padding: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  demoTitle: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '800',
  },
  demoChip: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#10b981',
  },
  demoChipText: {
    color: '#065f46',
    fontSize: 12,
    fontWeight: '700',
  },
  registerFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
});
