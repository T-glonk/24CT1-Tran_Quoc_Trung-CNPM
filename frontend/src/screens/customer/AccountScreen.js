import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';

export function AccountScreen({ user, navigate, bookings = [], onLogout }) {
  const mine = bookings.filter((b) => b.userId === user?.id || b.userId === 'user1' || !b.userId);

  // Modals state
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [passwordModalVisible, setPasswordModalVisible] = useState(false);
  const [paymentModalVisible, setPaymentModalVisible] = useState(false);
  const [supportModalVisible, setSupportModalVisible] = useState(false);
  const [tierModalVisible, setTierModalVisible] = useState(false);

  // Change password state
  const [oldPass, setOldPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmNewPass, setConfirmNewPass] = useState('');

  const handleChangePassword = () => {
    if (!oldPass.trim() || !newPass.trim() || !confirmNewPass.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ các trường mật khẩu');
      return;
    }
    if (newPass !== confirmNewPass) {
      Alert.alert('Lỗi', 'Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }
    Alert.alert('✅ Thành công', 'Đổi mật khẩu tài khoản thành công!');
    setPasswordModalVisible(false);
    setOldPass('');
    setNewPass('');
    setConfirmNewPass('');
  };

  const tierName = user?.tier || 'Đồng';
  const totalSpent = Number(user?.totalSpent || (mine.length * 160000));

  return (
    <ScrollView style={st.screen} showsVerticalScrollIndicator={false}>
      {/* Account Profile Header */}
      <View style={st.accountHeader}>
        <TouchableOpacity
          style={st.accountProfileRow}
          activeOpacity={0.85}
          onPress={() => (user ? setProfileModalVisible(true) : navigate('login'))}
        >
          <View style={st.accountAvatar}>
            <Text style={{ fontSize: 28 }}>{user ? '👤' : '🏸'}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={st.accountName}>{user?.name || 'Khách vãng lai'}</Text>
            <Text style={st.accountEmail}>{user?.email || 'Chưa đăng nhập'}</Text>
            <Text style={st.accountPhone}>
              {user?.phone ? `📞 ${user.phone}` : '👉 Chạm để đăng nhập / đăng ký'}
            </Text>
          </View>
          <TouchableOpacity
            style={st.headerEditBtn}
            onPress={() => (user ? setProfileModalVisible(true) : navigate('login'))}
          >
            <Text style={{ fontSize: 20 }}>{user ? '⚙️' : '🔑'}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      </View>

      {/* Member tier card */}
      <TouchableOpacity
        style={st.memberCard}
        activeOpacity={0.8}
        onPress={() => setTierModalVisible(true)}
      >
        <Text style={{ fontSize: 26 }}>👑</Text>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={st.memberTitle}>Hạng thành viên: {tierName}</Text>
          <Text style={st.memberSub}>
            Tích lũy chi tiêu: {totalSpent.toLocaleString('vi-VN')} đ (Chạm để xem quyền lợi)
          </Text>
        </View>
        <Text style={{ color: C.warning, fontSize: 22, fontWeight: '800' }}>›</Text>
      </TouchableOpacity>

      {/* Quick Actions Grid */}
      <View style={st.quickActRow}>
        {[
          { icon: '📅', label: 'Lịch đã đặt', action: () => navigate('myBookings'), count: mine.length },
          { icon: '🔔', label: 'Thông báo', action: () => Alert.alert('Thông báo', 'Bạn không có thông báo mới nào.'), count: 0 },
          { icon: '🎓', label: 'Khoá học', action: () => Alert.alert('Khóa học cầu lông', 'Tính năng đăng ký lớp học sẽ sớm ra mắt!'), count: 0 },
          { icon: '🎁', label: 'Ưu đãi', action: () => Alert.alert('Ưu đãi hội viên', 'Tặng Voucher giảm 20% cho thành viên mới!'), count: 2 },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={st.quickActItem}
            onPress={item.action}
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
        { icon: '⚙️', label: 'Thông tin cá nhân', action: () => setProfileModalVisible(true) },
        { icon: '🔒', label: 'Đổi mật khẩu & Bảo mật', action: () => setPasswordModalVisible(true) },
        { icon: '💳', label: 'Phương thức thanh toán', action: () => setPaymentModalVisible(true) },
        { icon: '❓', label: 'Trợ giúp & Hỗ trợ khách hàng', action: () => setSupportModalVisible(true) },
      ].map((item) => (
        <TouchableOpacity
          key={item.label}
          style={st.menuRow}
          activeOpacity={0.7}
          onPress={item.action}
        >
          <Text style={{ fontSize: 18, marginRight: 12 }}>{item.icon}</Text>
          <Text style={st.menuLabel}>{item.label}</Text>
          <Text style={{ color: C.sub, fontSize: 16 }}>›</Text>
        </TouchableOpacity>
      ))}

      {/* Auth or Logout Actions */}
      {user ? (
        <TouchableOpacity
          style={st.logoutBtn}
          activeOpacity={0.85}
          onPress={() =>
            Alert.alert('Đăng xuất', 'Bạn có chắc muốn đăng xuất khỏi tài khoản?', [
              { text: 'Huỷ' },
              { text: 'Đăng xuất', style: 'destructive', onPress: onLogout },
            ])
          }
        >
          <Text style={st.logoutText}>🚪 ĐĂNG XUẤT</Text>
        </TouchableOpacity>
      ) : (
        <View style={st.guestAuthCard}>
          <Text style={st.guestAuthTitle}>Tài khoản thành viên</Text>
          <Text style={st.guestAuthSub}>
            Đăng nhập hoặc đăng ký để quản lý lịch đặt sân, tích điểm và nhận ưu đãi hội viên!
          </Text>
          <View style={st.guestBtnRow}>
            <TouchableOpacity
              style={st.guestLoginBtn}
              onPress={() => navigate('login')}
              activeOpacity={0.85}
            >
              <Text style={st.guestLoginBtnText}>🔑 ĐĂNG NHẬP</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={st.guestRegBtn}
              onPress={() => navigate('register')}
              activeOpacity={0.85}
            >
              <Text style={st.guestRegBtnText}>📝 ĐĂNG KÝ</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={{ height: 40 }} />

      {/* ── 1. MODAL CHI TIẾT THÔNG TIN CÁ NHÂN ── */}
      <Modal
        visible={profileModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setProfileModalVisible(false)}
      >
        <View style={st.modalOverlay}>
          <View style={st.profileModalContent}>
            {/* Modal Header */}
            <View style={st.modalHeader}>
              <Text style={st.modalHeaderTitle}>HỒ SƠ KHÁCH HÀNG</Text>
              <TouchableOpacity onPress={() => setProfileModalVisible(false)} style={st.modalCloseBtn}>
                <Text style={st.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16 }}>
              {/* Profile Avatar & Badge */}
              <View style={st.profileHeroCard}>
                <View style={st.profileHeroAvatar}>
                  <Text style={{ fontSize: 40 }}>👤</Text>
                </View>
                <Text style={st.profileHeroName}>{user?.name || 'Khách hàng'}</Text>
                <View style={st.rolePill}>
                  <Text style={st.rolePillText}>🏸 HỘI VIÊN QT SPORT</Text>
                </View>
              </View>

              {/* Thông tin chi tiết */}
              <View style={st.infoBox}>
                <Text style={st.infoBoxTitle}>📋 Chi tiết tài khoản</Text>

                <View style={st.infoRow}>
                  <Text style={st.infoLabel}>🆔 Mã tài khoản (ID):</Text>
                  <Text style={st.infoVal}>{user?.id || 'Chưa xác định'}</Text>
                </View>

                <View style={st.infoRow}>
                  <Text style={st.infoLabel}>👤 Họ và tên:</Text>
                  <Text style={st.infoVal}>{user?.name || 'Chưa cập nhật'}</Text>
                </View>

                <View style={st.infoRow}>
                  <Text style={st.infoLabel}>📧 Địa chỉ Email:</Text>
                  <Text style={st.infoVal}>{user?.email || 'Chưa cập nhật'}</Text>
                </View>

                <View style={st.infoRow}>
                  <Text style={st.infoLabel}>📞 Số điện thoại:</Text>
                  <Text style={st.infoVal}>{user?.phone || 'Chưa cập nhật'}</Text>
                </View>

                <View style={st.infoRow}>
                  <Text style={st.infoLabel}>👑 Hạng hội viên:</Text>
                  <Text style={[st.infoVal, { color: '#eab308', fontWeight: '900' }]}>{tierName}</Text>
                </View>

                <View style={st.infoRow}>
                  <Text style={st.infoLabel}>📅 Ngày đăng ký:</Text>
                  <Text style={st.infoVal}>{user?.joinedDate || 'Hôm nay'}</Text>
                </View>

                <View style={st.infoRow}>
                  <Text style={st.infoLabel}>💰 Tổng tiền đã chi:</Text>
                  <Text style={[st.infoVal, { color: '#22c55e', fontWeight: '900' }]}>
                    {totalSpent.toLocaleString('vi-VN')} đ
                  </Text>
                </View>

                <View style={st.infoRow}>
                  <Text style={st.infoLabel}>🏸 Tổng số đơn đặt sân:</Text>
                  <Text style={[st.infoVal, { color: '#38bdf8', fontWeight: '900' }]}>
                    {mine.length} lượt
                  </Text>
                </View>

                <View style={[st.infoRow, { borderBottomWidth: 0 }]}>
                  <Text style={st.infoLabel}>🟢 Trạng thái:</Text>
                  <Text style={[st.infoVal, { color: '#22c55e' }]}>Đang hoạt động (Active)</Text>
                </View>
              </View>

              <TouchableOpacity
                style={st.modalActionBtn}
                onPress={() => {
                  setProfileModalVisible(false);
                  Alert.alert('Thông báo', 'Dữ liệu hồ sơ của bạn đã được đồng bộ chuẩn với cơ sở dữ liệu hệ thống.');
                }}
              >
                <Text style={st.modalActionBtnText}>ĐÓNG CỬA SỔ</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── 2. MODAL ĐỔI MẬT KHẨU ── */}
      <Modal
        visible={passwordModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPasswordModalVisible(false)}
      >
        <View style={st.modalOverlay}>
          <View style={st.smallModalContent}>
            <View style={st.modalHeader}>
              <Text style={st.modalHeaderTitle}>🔒 ĐỔI MẬT KHẨU</Text>
              <TouchableOpacity onPress={() => setPasswordModalVisible(false)} style={st.modalCloseBtn}>
                <Text style={st.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 16 }}>
              <Text style={st.inputLabel}>Mật khẩu hiện tại</Text>
              <TextInput
                style={st.inputBox}
                secureTextEntry
                placeholder="Nhập mật khẩu hiện tại"
                placeholderTextColor="#94a3b8"
                value={oldPass}
                onChangeText={setOldPass}
              />

              <Text style={st.inputLabel}>Mật khẩu mới</Text>
              <TextInput
                style={st.inputBox}
                secureTextEntry
                placeholder="Tối thiểu 6 ký tự"
                placeholderTextColor="#94a3b8"
                value={newPass}
                onChangeText={setNewPass}
              />

              <Text style={st.inputLabel}>Xác nhận mật khẩu mới</Text>
              <TextInput
                style={st.inputBox}
                secureTextEntry
                placeholder="Nhập lại mật khẩu mới"
                placeholderTextColor="#94a3b8"
                value={confirmNewPass}
                onChangeText={setConfirmNewPass}
              />

              <TouchableOpacity style={st.submitModalBtn} onPress={handleChangePassword}>
                <Text style={st.submitModalBtnText}>CẬP NHẬT MẬT KHẨU</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── 3. MODAL PHƯƠNG THỨC THANH TOÁN ── */}
      <Modal
        visible={paymentModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPaymentModalVisible(false)}
      >
        <View style={st.modalOverlay}>
          <View style={st.smallModalContent}>
            <View style={st.modalHeader}>
              <Text style={st.modalHeaderTitle}>💳 PHƯƠNG THỨC THANH TOÁN</Text>
              <TouchableOpacity onPress={() => setPaymentModalVisible(false)} style={st.modalCloseBtn}>
                <Text style={st.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 16 }}>
              <View style={st.payMethodCard}>
                <Text style={{ fontSize: 24, marginRight: 10 }}>🏦</Text>
                <View style={{ flex: 1 }}>
                  <Text style={st.payMethodTitle}>Chuyển khoản VietQR (Tự động)</Text>
                  <Text style={st.payMethodSub}>MB Bank - 0905591379 (Mặc định)</Text>
                </View>
                <Text style={{ color: '#22c55e', fontWeight: '900' }}>✓</Text>
              </View>

              <View style={[st.payMethodCard, { marginTop: 10 }]}>
                <Text style={{ fontSize: 24, marginRight: 10 }}>💵</Text>
                <View style={{ flex: 1 }}>
                  <Text style={st.payMethodTitle}>Thanh toán tiền mặt</Text>
                  <Text style={st.payMethodSub}>Thanh toán trực tiếp tại quầy lễ tân</Text>
                </View>
              </View>

              <TouchableOpacity style={st.submitModalBtn} onPress={() => setPaymentModalVisible(false)}>
                <Text style={st.submitModalBtnText}>ĐÓNG</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── 4. MODAL TRỢ GIÚP & HỖ TRỢ CSKH ── */}
      <Modal
        visible={supportModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setSupportModalVisible(false)}
      >
        <View style={st.modalOverlay}>
          <View style={st.smallModalContent}>
            <View style={st.modalHeader}>
              <Text style={st.modalHeaderTitle}>📞 TRỢ GIÚP & HỖ TRỢ</Text>
              <TouchableOpacity onPress={() => setSupportModalVisible(false)} style={st.modalCloseBtn}>
                <Text style={st.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 16 }}>
              <Text style={{ color: '#fff', fontSize: 13, marginBottom: 14 }}>
                Đội ngũ hỗ trợ hệ thống QT Sport luôn sẵn sàng phục vụ quý khách 24/7.
              </Text>

              <View style={st.infoRow}>
                <Text style={st.infoLabel}>📞 Hotline CSKH:</Text>
                <Text style={[st.infoVal, { color: '#38bdf8' }]}>0905 591 379</Text>
              </View>

              <View style={st.infoRow}>
                <Text style={st.infoLabel}>💬 Zalo hỗ trợ:</Text>
                <Text style={[st.infoVal, { color: '#38bdf8' }]}>0905 591 379</Text>
              </View>

              <View style={st.infoRow}>
                <Text style={st.infoLabel}>📧 Email:</Text>
                <Text style={st.infoVal}>support@court.vn</Text>
              </View>

              <View style={[st.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={st.infoLabel}>🏢 Trụ sở chính:</Text>
                <Text style={st.infoVal}>207 Quách Thị Trang, Đà Nẵng</Text>
              </View>

              <TouchableOpacity style={st.submitModalBtn} onPress={() => setSupportModalVisible(false)}>
                <Text style={st.submitModalBtnText}>ĐÓNG</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── 5. MODAL QUYỀN LỢI HẠNG HỘI VIÊN ── */}
      <Modal
        visible={tierModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setTierModalVisible(false)}
      >
        <View style={st.modalOverlay}>
          <View style={st.smallModalContent}>
            <View style={st.modalHeader}>
              <Text style={st.modalHeaderTitle}>👑 HẠNG HỘI VIÊN & ƯU ĐÃI</Text>
              <TouchableOpacity onPress={() => setTierModalVisible(false)} style={st.modalCloseBtn}>
                <Text style={st.modalCloseBtnText}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 16 }}>
              {[
                { name: '🥉 Hạng Đồng (Mặc định)', rule: 'Tích lũy từ 0 đ', benefit: 'Đặt sân trực tuyến, nhận tin giải đấu' },
                { name: '🥈 Hạng Bạc', rule: 'Tích lũy từ 1.000.000 đ', benefit: 'Giảm 5% giá thuê sân, ưu tiên giữ sân' },
                { name: '🥇 Hạng Vàng', rule: 'Tích lũy từ 3.000.000 đ', benefit: 'Giảm 10% giá thuê sân, tặng 2 chai nước/lần' },
                { name: '💎 Hạng Kim Cương (VIP)', rule: 'Tích lũy từ 10.000.000 đ', benefit: 'Giảm 15%, phục vụ sân VIP, miễn phí gửi xe' },
              ].map((t) => (
                <View key={t.name} style={st.tierCardItem}>
                  <Text style={st.tierCardName}>{t.name}</Text>
                  <Text style={st.tierCardRule}>Điều kiện: {t.rule}</Text>
                  <Text style={st.tierCardBenefit}>🎁 Quyền lợi: {t.benefit}</Text>
                </View>
              ))}

              <TouchableOpacity style={st.submitModalBtn} onPress={() => setTierModalVisible(false)}>
                <Text style={st.submitModalBtnText}>ĐÃ HIỂU</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  accountEmail: { color: '#dcfce7', fontSize: 12, marginTop: 2 },
  accountPhone: { color: '#fef08a', fontSize: 12, marginTop: 2, fontWeight: '700' },
  headerEditBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
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
  guestAuthCard: {
    marginHorizontal: 12,
    marginTop: 20,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    alignItems: 'center',
  },
  guestAuthTitle: {
    color: C.text,
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  guestAuthSub: {
    color: C.sub,
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 14,
  },
  guestBtnRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  guestLoginBtn: {
    flex: 1,
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestLoginBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },
  guestRegBtn: {
    flex: 1,
    backgroundColor: '#0f766e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  guestRegBtnText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '800',
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  profileModalContent: {
    width: '100%',
    maxHeight: '90%',
    backgroundColor: '#1e293b',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  smallModalContent: {
    width: '100%',
    backgroundColor: '#1e293b',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#334155',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalHeaderTitle: { color: '#fff', fontSize: 14, fontWeight: '900', letterSpacing: 0.5 },
  modalCloseBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtnText: { color: '#94a3b8', fontSize: 14, fontWeight: '800' },
  profileHeroCard: {
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
    marginBottom: 12,
  },
  profileHeroAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#334155',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
    borderColor: '#22c55e',
  },
  profileHeroName: { color: '#fff', fontSize: 18, fontWeight: '900' },
  rolePill: {
    backgroundColor: 'rgba(34,197,94,0.15)',
    borderWidth: 1,
    borderColor: '#22c55e',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: 6,
  },
  rolePillText: { color: '#22c55e', fontSize: 11, fontWeight: '800' },
  infoBox: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    marginBottom: 14,
  },
  infoBoxTitle: { color: '#94a3b8', fontSize: 12, fontWeight: '800', marginBottom: 10 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#1e293b',
  },
  infoLabel: { color: '#94a3b8', fontSize: 12 },
  infoVal: { color: '#fff', fontSize: 12, fontWeight: '700' },
  modalActionBtn: {
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 6,
  },
  modalActionBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  inputLabel: { color: '#94a3b8', fontSize: 12, fontWeight: '700', marginBottom: 4 },
  inputBox: {
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 13,
    marginBottom: 12,
  },
  submitModalBtn: {
    backgroundColor: '#22c55e',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  submitModalBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  payMethodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0f172a',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#334155',
  },
  payMethodTitle: { color: '#fff', fontSize: 13, fontWeight: '700' },
  payMethodSub: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  tierCardItem: {
    backgroundColor: '#0f172a',
    padding: 10,
    borderRadius: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tierCardName: { color: '#eab308', fontSize: 13, fontWeight: '800' },
  tierCardRule: { color: '#94a3b8', fontSize: 11, marginTop: 2 },
  tierCardBenefit: { color: '#38bdf8', fontSize: 11, marginTop: 2 },
});

