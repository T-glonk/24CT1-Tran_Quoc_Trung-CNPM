import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';

const { width } = Dimensions.get('window');

export function AdminHomeScreen({
  user,
  navigate,
  bookings = [],
  courts = [],
  services = [],
  transactions = [],
  onUpdateCourtStatus,
  onApproveBooking,
  onLogout,
}) {
  const [guideModal, setGuideModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('QT Sport - Cơ sở 1: Sân Hoa Thiên Lý');

  const TIME_SLOTS = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30',
  ];

  const MATRIX_COURTS = [
    { id: 'c6', name: 'Sân 6', color: '#10b981', guest: 'Huy - 0969678482', start: 1, span: 3, type: 'Lịch ngày' },
    { id: 'c7', name: 'Sân 7', color: '#f59e0b', guest: 'Ngọc Ngân - 0379241287', start: 5, span: 4, type: 'Chờ cọc' },
    { id: 'c8', name: 'Sân 8', color: '#0284c7', guest: 'Anh Bình An - 0985685956', start: 3, span: 4, type: 'Lịch cố định' },
    { id: 'c9', name: 'Sân 9', color: '#ec4899', guest: '[Xé vé] - Sự kiện cuối tuần (#8746)', start: 3, span: 5, type: 'Sự kiện' },
    { id: 'c10', name: 'Sân 10', color: '#84cc16', guest: '[Xé vé] - aa (#8738)', start: 4, span: 4, type: 'Lịch sinh hoạt' },
    { id: 'c11', name: 'Sân 11', color: '#10b981', guest: 'Trâm - 0708018101', start: 4, span: 5, type: 'Lịch ngày' },
    { id: 'cVIP', name: 'Sân VIP', color: '#0284c7', guest: 'A Bắc - 0984561253', start: 6, span: 4, type: 'Lịch cố định' },
    { id: 'c12', name: 'Sân 12', color: '#64748b', guest: 'Bảo trì hệ thống đèn', start: 0, span: 2, type: 'Khóa' },
  ];

  const handleConfirmLogout = () => {
    setLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <ScrollView style={st.aloboBg} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={st.homeHeader}>
        <View style={st.homeHeaderTop}>
          <TouchableOpacity style={st.headerIconBtn} onPress={() => navigate('adminSettings')}>
            <Text style={{ fontSize: 20, color: '#fff' }}>☰</Text>
          </TouchableOpacity>

          <View style={st.aloboLogoCircle}>
            <Text style={{ fontSize: 32 }}>🏸</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity style={st.headerIconBtn} onPress={() => navigate('adminBookings')}>
              <Text style={{ fontSize: 16, color: '#fff' }}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.guideBtnPill} onPress={() => setGuideModal(true)}>
              <Text style={{ fontSize: 12, marginRight: 2 }}>💡</Text>
              <Text style={st.guideBtnText}>HD</Text>
            </TouchableOpacity>
            {/* Direct Logout Button in Header */}
            <TouchableOpacity style={st.logoutHeaderBtn} onPress={() => setLogoutModal(true)}>
              <Text style={{ fontSize: 13, marginRight: 3 }}>🚪</Text>
              <Text style={st.logoutHeaderText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Admin Quick Profile & Session Strip */}
        <View style={st.adminSessionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={st.adminAvatarSmall}>
              <Text style={{ fontSize: 16 }}>👑</Text>
            </View>
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={st.adminSessionName} numberOfLines={1}>
                {user?.name || 'Trần Quốc Trung'}
              </Text>
              <Text style={st.adminSessionRole}>
                👑 Super Admin · {selectedBranch}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={st.quickLogoutBadge}
            onPress={() => setLogoutModal(true)}
          >
            <Text style={st.quickLogoutBadgeText}>Thoát 🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Live Timeline Matrix Widget */}
      <View style={st.matrixWidgetCard}>
        {/* Legend Ribbon Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.legendRow}>
          {[
            { label: 'Trống', color: '#ffffff', border: true },
            { label: 'Lịch cố định', color: '#0284c7' },
            { label: 'Lịch ngày', color: '#10b981' },
            { label: 'Lịch sinh hoạt', color: '#84cc16' },
            { label: 'Khóa', color: '#64748b' },
            { label: 'Chờ cọc', color: '#f59e0b' },
            { label: 'Sự kiện', color: '#ec4899' },
          ].map((item) => (
            <View key={item.label} style={st.legendPill}>
              <View
                style={[
                  st.legendSquare,
                  { backgroundColor: item.color, borderWidth: item.border ? 1 : 0, borderColor: '#cbd5e1' },
                ]}
              />
              <Text style={st.legendLabelText}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Matrix Table */}
        <ScrollView horizontal showsHorizontalScrollIndicator={true}>
          <View>
            <View style={st.matrixHeaderRow}>
              <View style={st.matrixCourtHeaderCol}>
                <Text style={st.matrixHeaderText}>SÂN</Text>
              </View>
              {TIME_SLOTS.map((slot) => (
                <View key={slot} style={st.matrixHourCell}>
                  <Text style={st.matrixHourText}>{slot}</Text>
                </View>
              ))}
            </View>

            {MATRIX_COURTS.map((row) => (
              <View key={row.id} style={st.matrixBodyRow}>
                <View style={st.matrixCourtLabelCol}>
                  <Text style={st.matrixCourtLabelText}>{row.name}</Text>
                </View>

                {TIME_SLOTS.map((slot, idx) => {
                  if (idx >= row.start && idx < row.start + row.span) {
                    if (idx === row.start) {
                      return (
                        <View
                          key={slot}
                          style={[
                            st.matrixBookingBlock,
                            {
                              backgroundColor: row.color,
                              width: 62 * row.span - 4,
                            },
                          ]}
                        >
                          <Text style={st.matrixBookingText} numberOfLines={1}>
                            {row.guest}
                          </Text>
                        </View>
                      );
                    }
                    return null;
                  }
                  return (
                    <TouchableOpacity
                      key={slot}
                      style={st.matrixEmptySlot}
                      onPress={() => navigate('adminSchedule')}
                    >
                      <Text style={{ color: '#cbd5e1', fontSize: 10 }}>＋</Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* 4 Big Feature Navigation Cards */}
      <View style={st.fourFeaturesGrid}>
        <TouchableOpacity
          style={[st.featureBigCard, { backgroundColor: '#10b981' }]}
          onPress={() => navigate('adminSchedule')}
        >
          <View style={st.featureIconContainer}>
            <Text style={{ fontSize: 24 }}>📅</Text>
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={st.featureBigTitle}>ĐẶT LỊCH</Text>
            <Text style={st.featureBigSub}>Quản lý lịch sân</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[st.featureBigCard, { backgroundColor: '#ea580c' }]}
          onPress={() => navigate('adminServices')}
        >
          <View style={st.featureIconContainer}>
            <Text style={{ fontSize: 24 }}>🥤</Text>
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={st.featureBigTitle}>BÁN HÀNG</Text>
            <Text style={st.featureBigSub}>POS Nước & Vợt</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[st.featureBigCard, { backgroundColor: '#0284c7' }]}
          onPress={() => navigate('adminCustomers')}
        >
          <View style={st.featureIconContainer}>
            <Text style={{ fontSize: 24 }}>👥</Text>
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={st.featureBigTitle}>HỘI VIÊN</Text>
            <Text style={st.featureBigSub}>Quản lý khách hàng</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[st.featureBigCard, { backgroundColor: '#7c3aed' }]}
          onPress={() => navigate('adminReports')}
        >
          <View style={st.featureIconContainer}>
            <Text style={{ fontSize: 24 }}>📊</Text>
          </View>
          <View style={{ marginLeft: 10, flex: 1 }}>
            <Text style={st.featureBigTitle}>BÁO CÁO</Text>
            <Text style={st.featureBigSub}>Doanh thu ca trực</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Extra Shortcuts Row */}
      <View style={st.extraShortcutsRow}>
        <TouchableOpacity style={st.extraBtn} onPress={() => navigate('adminCourts')}>
          <Text style={{ fontSize: 18 }}>🏸</Text>
          <Text style={st.extraBtnText}>Trạng thái sân</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.extraBtn} onPress={() => navigate('adminBookings')}>
          <Text style={{ fontSize: 18 }}>📋</Text>
          <Text style={st.extraBtnText}>Duyệt đơn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.extraBtn} onPress={() => navigate('adminTransactions')}>
          <Text style={{ fontSize: 18 }}>💳</Text>
          <Text style={st.extraBtnText}>Sổ quỹ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.extraBtn} onPress={() => navigate('adminUsers')}>
          <Text style={{ fontSize: 18 }}>🛡️</Text>
          <Text style={st.extraBtnText}>Phân quyền</Text>
        </TouchableOpacity>
      </View>

      {/* Admin Account & Session Management Card */}
      <View style={st.accountCardContainer}>
        <View style={st.accountCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={st.accountIconBox}>
                <Text style={{ fontSize: 20 }}>🛡️</Text>
              </View>
              <View style={{ marginLeft: 10 }}>
                <Text style={st.accountCardTitle}>Tài khoản: {user?.name || 'Trần Quốc Trung'}</Text>
                <Text style={st.accountCardSub}>Email: {user?.email || 'admin@court.vn'}</Text>
              </View>
            </View>
          </View>

          <View style={st.accountActionRow}>
            <TouchableOpacity
              style={st.viewProfileBtn}
              onPress={() => navigate('adminProfile')}
            >
              <Text style={st.viewProfileBtnText}>👤 Xem hồ sơ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={st.logoutPrimaryBtn}
              onPress={() => setLogoutModal(true)}
            >
              <Text style={st.logoutPrimaryBtnText}>🚪 ĐĂNG XUẤT</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Guide Modal */}
      <Modal visible={guideModal} transparent animationType="fade">
        <View style={st.modalBackdrop}>
          <View style={st.modalCard}>
            <Text style={st.modalTitleText}>💡 Hướng Dẫn Sử Dụng Alobo Sport</Text>
            <Text style={st.guideStepText}>1. Xem trực tiếp ma trận sân đấu theo khung giờ.</Text>
            <Text style={st.guideStepText}>2. Bấm vào "BÁN HÀNG" để lên đơn đồ uống hoặc phụ kiện.</Text>
            <Text style={st.guideStepText}>3. Bấm vào "HỘI VIÊN" để quản lý gói cước và gia hạn thẻ.</Text>
            <Text style={st.guideStepText}>4. Nhấn vào nút "Đăng xuất" ở góc trên hoặc thanh tài khoản để thoát quyền Admin.</Text>
            <TouchableOpacity style={st.modalCloseBtn} onPress={() => setGuideModal(false)}>
              <Text style={{ color: '#fff', fontWeight: '800' }}>ĐÃ HIỂU</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  aloboBg: { flex: 1, backgroundColor: AL.bg },
  homeHeader: {
    backgroundColor: AL.headerBg,
    paddingTop: Platform.OS === 'ios' ? 14 : 18,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  homeHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  aloboLogoCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  guideBtnPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f59e0b',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 14,
  },
  guideBtnText: { color: '#ffffff', fontSize: 11, fontWeight: '900' },
  logoutHeaderBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  logoutHeaderText: { color: '#ffffff', fontSize: 11, fontWeight: '900' },
  adminSessionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  adminAvatarSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminSessionName: { color: '#ffffff', fontSize: 13, fontWeight: '900' },
  adminSessionRole: { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginTop: 1 },
  quickLogoutBadge: {
    backgroundColor: 'rgba(239,68,68,0.25)',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quickLogoutBadgeText: { color: '#fca5a5', fontSize: 10, fontWeight: '800' },
  matrixWidgetCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: -8,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: AL.border,
    elevation: 4,
  },
  legendRow: { flexDirection: 'row', gap: 6, paddingBottom: 8 },
  legendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  legendSquare: { width: 8, height: 8, borderRadius: 2, marginRight: 4 },
  legendLabelText: { color: '#475569', fontSize: 9, fontWeight: '700' },
  matrixHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#e2e8f0',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
  },
  matrixCourtHeaderCol: { width: 64, padding: 6, justifyContent: 'center' },
  matrixHeaderText: { fontSize: 10, fontWeight: '800', color: '#475569' },
  matrixHourCell: {
    width: 62,
    paddingVertical: 6,
    alignItems: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#cbd5e1',
  },
  matrixHourText: { fontSize: 10, fontWeight: '800', color: '#475569' },
  matrixBodyRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    height: 34,
    alignItems: 'center',
  },
  matrixCourtLabelCol: { width: 64, paddingLeft: 6 },
  matrixCourtLabelText: { fontSize: 10, fontWeight: '800', color: '#1e293b' },
  matrixEmptySlot: {
    width: 62,
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixBookingBlock: {
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    paddingHorizontal: 4,
    marginHorizontal: 2,
  },
  matrixBookingText: { color: '#ffffff', fontSize: 9, fontWeight: '800' },
  fourFeaturesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    marginTop: 14,
    gap: 10,
    justifyContent: 'space-between',
  },
  featureBigCard: {
    width: (width - 34) / 2,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 3,
  },
  featureIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBigTitle: { color: '#ffffff', fontSize: 13, fontWeight: '900' },
  featureBigSub: { color: 'rgba(255,255,255,0.85)', fontSize: 10, marginTop: 2 },
  extraShortcutsRow: { flexDirection: 'row', paddingHorizontal: 12, marginTop: 14, gap: 8 },
  extraBtn: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AL.border,
  },
  extraBtnText: { color: AL.textDark, fontSize: 10, fontWeight: '800', marginTop: 4 },
  accountCardContainer: {
    paddingHorizontal: 12,
    marginTop: 14,
  },
  accountCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: AL.border,
    elevation: 2,
  },
  accountIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  accountCardTitle: { fontSize: 13, fontWeight: '800', color: AL.textDark },
  accountCardSub: { fontSize: 11, color: AL.textSub, marginTop: 1 },
  accountActionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  viewProfileBtn: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  viewProfileBtnText: { color: AL.textDark, fontSize: 12, fontWeight: '800' },
  logoutPrimaryBtn: {
    flex: 1,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  logoutPrimaryBtnText: { color: '#ffffff', fontSize: 12, fontWeight: '900' },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
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
  modalTitleText: { fontSize: 16, fontWeight: '900', color: AL.textDark, marginBottom: 10 },
  guideStepText: { fontSize: 13, color: '#334155', marginBottom: 8, lineHeight: 18 },
  modalCloseBtn: {
    backgroundColor: AL.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 12,
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
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  confirmLogoutBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '900' },
});
