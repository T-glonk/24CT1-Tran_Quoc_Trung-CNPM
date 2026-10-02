import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  KeyboardAvoidingView, Platform, Alert, TextInput, ActivityIndicator,
} from 'react-native';
import { COLORS as C, USERS_DB } from './data';

// ─── SHARED INPUT COMPONENTS ─────────────────────────────────────────────────

function PhoneInput({ value, onChangeText }) {
  return (
    <View style={as.phoneRow}>
      <TouchableOpacity style={as.prefixBox}>
        <Text style={{ fontSize: 18 }}>🇻🇳</Text>
        <Text style={as.prefixText}>+84</Text>
        <Text style={as.prefixArrow}>▾</Text>
      </TouchableOpacity>
      <View style={as.phoneDivider} />
      <TextInput
        style={as.phoneInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="Nhập số điện thoại"
        placeholderTextColor="#94a3b8"
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
    </View>
  );
}

function FormInput({ value, onChangeText, placeholder, secureTextEntry, rightIcon, onRightPress }) {
  return (
    <View style={as.inputBox}>
      <TextInput
        style={as.inputField}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
      {rightIcon ? (
        <TouchableOpacity style={as.inputRight} onPress={onRightPress}>
          <Text style={{ fontSize: 18 }}>{rightIcon}</Text>
        </TouchableOpacity>
      ) : value ? (
        <TouchableOpacity style={as.inputRight} onPress={() => onChangeText('')}>
          <View style={as.clearCircle}><Text style={{ color: '#fff', fontSize: 12 }}>✕</Text></View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

function FieldLabel({ text }) {
  return <Text style={as.fieldLabel}>{text}</Text>;
}

// ─── WELCOME SCREEN ──────────────────────────────────────────────────────────
export function WelcomeScreen({ navigate }) {
  return (
    <View style={[as.greenBg, { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 28 }]}>
      <Text style={{ fontSize: 72, marginBottom: 12 }}>🏸</Text>
      <Text style={as.welcomeTitle}>BADMINTON COURT</Text>
      <Text style={as.welcomeSub}>Đặt sân cầu lông trực tuyến</Text>
      <View style={as.welcomeDivider} />
      <Text style={as.welcomeClass}>CHÀO CÁC BẠN 24CT1</Text>
      <Text style={as.welcomeClass}>ĐẾN VỚI HỌC PHẦN NÀY</Text>
      <View style={{ width: '100%', marginTop: 40, gap: 12 }}>
        <TouchableOpacity style={as.whiteBtn} onPress={() => navigate('login')}>
          <Text style={as.whiteBtnText}>Đăng nhập</Text>
        </TouchableOpacity>
        <TouchableOpacity style={as.outlineWhiteBtn} onPress={() => navigate('register')}>
          <Text style={as.outlineWhiteBtnText}>Tạo tài khoản</Text>
        </TouchableOpacity>
      </View>
      <Text style={as.hintText}>Demo: user@court.vn / 123456{'\n'}Admin: admin@court.vn / 123456</Text>
    </View>
  );
}

// ─── LOGIN SCREEN ─────────────────────────────────────────────────────────────
export function LoginScreen({ navigate, onLogin }) {
  const [tab, setTab] = useState('phone'); // 'phone' | 'email'
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    const identifier = tab === 'phone' ? phone.trim() : email.trim();
    if (!identifier || !password) { Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin'); return; }
    setLoading(true);
    setTimeout(() => {
      let user;
      if (tab === 'phone') {
        user = USERS_DB.find(u => (u.phone === identifier || u.phone === '0' + identifier) && u.password === password);
      } else {
        user = USERS_DB.find(u => u.email === identifier && u.password === password);
      }
      setLoading(false);
      if (user) onLogin(user);
      else Alert.alert('Lỗi', 'Thông tin đăng nhập không đúng');
    }, 700);
  };

  return (
    <View style={as.greenBg}>
      {/* Back + Title */}
      <View style={as.topBar}>
        <TouchableOpacity onPress={() => navigate('welcome')} style={as.backBtn}>
          <Text style={as.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={as.topBarTitle}>Đăng nhập</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={as.scrollContent} keyboardShouldPersistTaps="handled">
          {/* Main card */}
          <View style={as.card}>
            {/* Tab SĐT / Email */}
            <View style={as.tabRow}>
              <TouchableOpacity style={[as.tabBtn, tab === 'phone' && as.tabBtnActive]}
                onPress={() => setTab('phone')}>
                <Text style={[as.tabText, tab === 'phone' && as.tabTextActive]}>Số điện thoại</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[as.tabBtn, tab === 'email' && as.tabBtnActive]}
                onPress={() => setTab('email')}>
                <Text style={[as.tabText, tab === 'email' && as.tabTextActive]}>Email</Text>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20 }}>
              {tab === 'phone' ? (
                <>
                  <FieldLabel text="Số điện thoại của bạn?" />
                  <PhoneInput value={phone} onChangeText={setPhone} />
                </>
              ) : (
                <>
                  <FieldLabel text="Email của bạn?" />
                  <FormInput value={email} onChangeText={setEmail} placeholder="Nhập email" />
                </>
              )}

              <FieldLabel text="Mật khẩu (*)" />
              <FormInput
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu (*)"
                secureTextEntry={!showPass}
                rightIcon={showPass ? '👁️' : '🙈'}
                onRightPress={() => setShowPass(!showPass)}
              />

              {/* Login button */}
              <TouchableOpacity style={as.greenBtn} onPress={handleLogin} disabled={loading}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={as.greenBtnText}>ĐĂNG NHẬP</Text>}
              </TouchableOpacity>

              {/* Biometric */}
              <TouchableOpacity style={as.biometricBtn}>
                <Text style={{ fontSize: 20, marginRight: 10 }}>🫣</Text>
                <Text style={as.biometricText}>Đăng nhập với sinh trắc học</Text>
              </TouchableOpacity>

              {/* Quick Demo Login Chips */}
              <View style={{ marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                <Text style={{ fontSize: 11, color: '#64748b', fontWeight: '700', marginBottom: 6 }}>
                  ⚡ ĐĂNG NHẬP NHANH (1 CHẠM):
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#dcfce7', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#86efac' }}
                    onPress={() => {
                      const admin = USERS_DB.find(u => u.role === 'admin');
                      if (admin) onLogin(admin);
                    }}
                  >
                    <Text style={{ color: '#15803d', fontSize: 11, fontWeight: '800' }}>👑 SUPER ADMIN</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{ flex: 1, backgroundColor: '#e0f2fe', borderRadius: 8, paddingVertical: 8, alignItems: 'center', borderWidth: 1, borderColor: '#7dd3fc' }}
                    onPress={() => {
                      const cust = USERS_DB.find(u => u.role === 'customer');
                      if (cust) onLogin(cust);
                    }}
                  >
                    <Text style={{ color: '#0369a1', fontSize: 11, fontWeight: '800' }}>👤 KHÁCH HÀNG</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Forgot password */}
              <View style={as.forgotRow}>
                <Text style={as.forgotLabel}>Bạn quên mật khẩu? </Text>
                <TouchableOpacity><Text style={as.forgotLink}>Quên mật khẩu</Text></TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Register link */}
          <View style={as.switchRow}>
            <Text style={as.switchLabel}>Bạn chưa có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigate('register')}>
              <Text style={as.switchLink}>Đăng ký</Text>
            </TouchableOpacity>
          </View>

          {/* Social login */}
          <TouchableOpacity style={as.socialBtn}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>🍎</Text>
            <Text style={as.socialBtnText}>Đăng nhập với Apple</Text>
          </TouchableOpacity>
          <TouchableOpacity style={as.socialBtn}>
            <Text style={{ fontSize: 20, marginRight: 10 }}>🌐</Text>
            <Text style={as.socialBtnText}>Đăng nhập với Google</Text>
          </TouchableOpacity>

          {/* Owner banner */}
          <TouchableOpacity
            style={as.ownerBanner}
            onPress={() => {
              const admin = USERS_DB.find(u => u.role === 'admin');
              if (admin) onLogin(admin);
            }}
          >
            <Text style={as.ownerBannerText}>
              Nếu bạn là <Text style={{ fontWeight: '900' }}>CHỦ SÂN</Text> hoặc{' '}
              <Text style={{ fontWeight: '900' }}>NHÂN VIÊN</Text>,{'\n'}
              Bấm vào đây để vào ứng dụng ALOBO -{' '}
              <Text style={as.ownerBannerLink}>Quản lý sân ➔</Text>
            </Text>
          </TouchableOpacity>


          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── REGISTER SCREEN ─────────────────────────────────────────────────────────
export function RegisterScreen({ navigate, onLogin }) {
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = () => {
    if (!phone.trim() || !email.trim() || !name.trim() || !password || !confirm) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin'); return;
    }
    if (password !== confirm) { Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp'); return; }
    if (password.length < 6) { Alert.alert('Lỗi', 'Mật khẩu tối thiểu 6 ký tự'); return; }
    if (USERS_DB.find(u => u.email === email.trim())) { Alert.alert('Lỗi', 'Email đã được sử dụng'); return; }
    setLoading(true);
    setTimeout(() => {
      const u = {
        id: 'u_' + Date.now(), name: name.trim(),
        email: email.trim(), phone: phone.trim(),
        password, role: 'customer',
      };
      USERS_DB.push(u);
      setLoading(false);
      Alert.alert('✅ Thành công', 'Tạo tài khoản thành công!', [
        { text: 'Đăng nhập', onPress: () => onLogin(u) },
      ]);
    }, 700);
  };

  return (
    <View style={as.greenBg}>
      <View style={as.topBar}>
        <TouchableOpacity onPress={() => navigate('login')} style={as.backBtn}>
          <Text style={as.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={as.topBarTitle}>Đăng ký</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={as.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={as.card}>
            <View style={{ padding: 20 }}>
              <FieldLabel text="Số điện thoại của bạn?" />
              <PhoneInput value={phone} onChangeText={setPhone} />

              <FieldLabel text="Email của bạn?" />
              <FormInput value={email} onChangeText={setEmail} placeholder="Nhập email của bạn"
                keyboardType="email-address" />

              <FieldLabel text="Tên đầy đủ (*)" />
              <FormInput value={name} onChangeText={setName} placeholder="Nhập họ và tên" />

              <FieldLabel text="Mật khẩu (*)" />
              <FormInput value={password} onChangeText={setPassword}
                placeholder="Nhập mật khẩu (*)"
                secureTextEntry={!showPass}
                rightIcon={showPass ? '👁️' : '🙈'}
                onRightPress={() => setShowPass(!showPass)} />

              <FieldLabel text="Nhập mật khẩu" />
              <FormInput value={confirm} onChangeText={setConfirm}
                placeholder="Nhập lại mật khẩu"
                secureTextEntry={!showConfirm}
                rightIcon={showConfirm ? '👁️' : '🙈'}
                onRightPress={() => setShowConfirm(!showConfirm)} />

              <TouchableOpacity style={[as.greenBtn, { marginTop: 8 }]} onPress={handleRegister} disabled={loading}>
                {loading
                  ? <ActivityIndicator color="#fff" />
                  : <Text style={as.greenBtnText}>ĐĂNG KÝ</Text>}
              </TouchableOpacity>

              <View style={as.switchRow}>
                <Text style={as.switchLabel}>Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigate('login')}>
                  <Text style={as.switchLink}>Đăng nhập</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{ height: 30 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const as = StyleSheet.create({
  greenBg: { flex: 1, backgroundColor: C.primary },

  // Top bar
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 8, paddingVertical: 14 },
  topBarTitle: { color: '#fff', fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
  backIcon: { color: '#fff', fontSize: 32, lineHeight: 36 },

  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // Welcome
  welcomeTitle: { color: '#fff', fontSize: 26, fontWeight: '900', letterSpacing: 1, textAlign: 'center' },
  welcomeSub: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 6, textAlign: 'center' },
  welcomeDivider: { width: 60, height: 2, backgroundColor: 'rgba(255,255,255,0.5)', marginVertical: 20 },
  welcomeClass: { color: '#fff', fontSize: 20, fontWeight: '800', textAlign: 'center', marginTop: 2 },
  hintText: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 20, textAlign: 'center', lineHeight: 18 },
  whiteBtn: { backgroundColor: '#fff', borderRadius: 10, paddingVertical: 15, alignItems: 'center' },
  whiteBtnText: { color: C.primary, fontSize: 16, fontWeight: '800' },
  outlineWhiteBtn: { borderRadius: 10, paddingVertical: 15, alignItems: 'center',
    borderWidth: 2, borderColor: '#fff' },
  outlineWhiteBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Card
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', marginBottom: 16 },

  // Tabs
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#e2e8f0' },
  tabBtn: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
  tabBtnActive: { borderBottomColor: C.primary },
  tabText: { color: '#94a3b8', fontSize: 15, fontWeight: '600' },
  tabTextActive: { color: C.primary, fontWeight: '800' },

  // Field label
  fieldLabel: { color: '#1e293b', fontSize: 15, fontWeight: '700', marginBottom: 8, marginTop: 4 },

  // Phone input
  phoneRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 10, marginBottom: 16, backgroundColor: '#fff', overflow: 'hidden' },
  prefixBox: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 14, gap: 4 },
  prefixText: { color: '#1e293b', fontSize: 14, fontWeight: '600' },
  prefixArrow: { color: '#94a3b8', fontSize: 11 },
  phoneDivider: { width: 1, height: 24, backgroundColor: '#e2e8f0' },
  phoneInput: { flex: 1, padding: 14, color: '#1e293b', fontSize: 15 },

  // Form input
  inputBox: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0',
    borderRadius: 10, marginBottom: 16, backgroundColor: '#fff' },
  inputField: { flex: 1, padding: 14, color: '#1e293b', fontSize: 15 },
  inputRight: { padding: 14 },
  clearCircle: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#94a3b8',
    alignItems: 'center', justifyContent: 'center' },

  // Buttons
  greenBtn: { backgroundColor: C.primary, borderRadius: 10, paddingVertical: 16,
    alignItems: 'center', marginTop: 8, marginBottom: 16 },
  greenBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },

  biometricBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 10, paddingVertical: 13, marginBottom: 16 },
  biometricText: { color: '#374151', fontSize: 14, fontWeight: '600' },

  forgotRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 4 },
  forgotLabel: { color: '#94a3b8', fontSize: 13 },
  forgotLink: { color: C.primary, fontSize: 13, fontWeight: '700' },

  switchRow: { flexDirection: 'row', justifyContent: 'center', marginVertical: 12 },
  switchLabel: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  switchLink: { color: '#fff', fontSize: 14, fontWeight: '800' },

  socialBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#fff', borderRadius: 10, paddingVertical: 14, marginBottom: 10 },
  socialBtnText: { color: '#1e293b', fontSize: 15, fontWeight: '700' },

  ownerBanner: { backgroundColor: '#fffbeb', borderRadius: 12, padding: 14, marginTop: 6,
    borderWidth: 1, borderColor: '#fde68a' },
  ownerBannerText: { color: '#92400e', fontSize: 13, lineHeight: 20 },
  ownerBannerLink: { color: C.primary, fontWeight: '700' },
});
