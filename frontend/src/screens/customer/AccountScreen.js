import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';

export function AccountScreen({ user, navigate, bookings, onLogout }) {
  const mine = bookings.filter((b) => b.userId === user?.id || b.userId === 'user1');

  return (
    <ScrollView style={st.screen} showsVerticalScrollIndicator={false}>
      {/* Account Profile Header */}
      <View style={st.accountHeader}>
        <View style={st.accountProfileRow}>
          <View style={st.accountAvatar}>
            <Text style={{ fontSize: 26 }}>👤</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={st.accountName}>{user?.name || 'Khách hàng'}</Text>
            <Text style={st.accountEmail}>{user?.email || 'customer@court.vn'}</Text>
            <Text style={st.accountPhone}>📞 {user?.phone || '0905 591 379'}</Text>
          </View>
        </View>
      </View>

      {/* Member tier card */}
      <TouchableOpacity style={st.memberCard}>
        <Text style={{ fontSize: 22 }}>👑</Text>
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={st.memberTitle}>Hạng thành viên: {user?.tier || 'Kim Cương'}</Text>
          <Text style={st.memberSub}>Tích lũy chi tiêu: {(user?.totalSpent || 2850000).toLocaleString('vi-VN')} đ</Text>
        </View>
        <Text style={{ color: C.warning, fontSize: 20 }}>›</Text>
      </TouchableOpacity>

      {/* Quick Actions Grid */}
      <View style={st.quickActRow}>
        {[
          { icon: '📅', label: 'Lịch đã đặt', screen: 'myBookings', count: mine.length },
          { icon: '🔔', label: 'Thông báo', screen: null, count: 0 },
          { icon: '🎓', label: 'Khoá học', screen: null, count: 0 },
          { icon: '🎁', label: 'Ưu đãi', screen: null, count: 2 },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={st.quickActItem}
            onPress={() => item.screen && navigate(item.screen)}
          >
            <View style={{ position: 'relative' }}>
              <Text style={{ fontSize: 26 }}>{item.icon}</Text>
              {item.count > 0 && (
                <View style={st.quickActBadge}>
                  <Text style={st.quickActBadgeText}>{item.count}</Text>
                </View>
              )}
            </View>
            <Text style={st.quickActLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Account Settings Menu */}
      <Text style={st.sectionTitle}>Cài đặt tài khoản</Text>
      {[
        { icon: '⚙️', label: 'Thông tin cá nhân' },
        { icon: '🔒', label: 'Đổi mật khẩu & Bảo mật' },
        { icon: '💳', label: 'Phương thức thanh toán' },
        { icon: '❓', label: 'Trợ giúp & Hỗ trợ khách hàng' },
      ].map((item) => (
        <TouchableOpacity key={item.label} style={st.menuRow}>
          <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
          <Text style={st.menuLabel}>{item.label}</Text>
          <Text style={{ color: C.sub, fontSize: 16 }}>›</Text>
        </TouchableOpacity>
      ))}

      {/* Logout Button */}
      <TouchableOpacity
        style={st.logoutBtn}
        onPress={() =>
          Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất khỏi tài khoản?', [
            { text: 'Huỷ' },
            { text: 'Đăng xuất', style: 'destructive', onPress: onLogout },
          ])
        }
      >
        <Text style={st.logoutText}>🚪 ĐĂNG XUẤT</Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  accountHeader: { backgroundColor: C.primary, padding: 16 },
  accountProfileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 14,
  },
  accountAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  accountEmail: { color: '#dcfce7', fontSize: 12, marginTop: 2 },
  accountPhone: { color: '#fef08a', fontSize: 12, marginTop: 2, fontWeight: '700' },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: C.warning,
  },
  memberTitle: { color: C.warning, fontSize: 14, fontWeight: '800' },
  memberSub: { color: C.sub, fontSize: 11, marginTop: 2 },
  quickActRow: { flexDirection: 'row', marginHorizontal: 12, marginTop: 12, gap: 8 },
  quickActItem: {
    flex: 1,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  quickActBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: C.danger,
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    alignItems: 'center',
  },
  quickActBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  quickActLabel: { color: C.sub, fontSize: 11, textAlign: 'center' },
  sectionTitle: {
    color: C.text,
    fontSize: 14,
    fontWeight: '700',
    marginHorizontal: 14,
    marginTop: 16,
    marginBottom: 8,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.card,
    marginHorizontal: 12,
    marginBottom: 6,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  menuLabel: { flex: 1, color: C.text, fontSize: 13, fontWeight: '600' },
  logoutBtn: {
    marginHorizontal: 12,
    marginTop: 20,
    backgroundColor: C.danger,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  logoutText: { color: '#fff', fontSize: 14, fontWeight: '800', letterSpacing: 1 },
});
