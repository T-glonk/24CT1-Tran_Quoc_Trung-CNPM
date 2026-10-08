import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  Modal,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';
import { APP_ASSETS } from '../../constants/assets';
import { INITIAL_CLUBS } from '../../constants/initialData';

const { width } = Dimensions.get('window');

export function AdminHomeScreen({
  user,
  navigate,
  bookings = [],
  courts = [],
  clubs = INITIAL_CLUBS,
  selectedClub,
  onSelectClub,
  services = [],
  transactions = [],
  onUpdateCourtStatus,
  onApproveBooking,
  onLogout,
}) {
  const [guideModal, setGuideModal] = useState(false);
  const [logoutModal, setLogoutModal] = useState(false);
  const [slotModal, setSlotModal] = useState(null); // { court, slotHour, booking }
  const [activeClubId, setActiveClubId] = useState(selectedClub?.id || clubs[0]?.id || 'c1');

  const activeClub = clubs.find((c) => c.id === activeClubId) || clubs[0] || INITIAL_CLUBS[0];

  const TIME_SLOTS = [
    '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
    '12:00', '13:00', '14:00', '15:00', '16:00', '17:00',
    '18:00', '19:00', '20:00', '21:00', '22:00',
  ];

  // Lấy danh sách sân CHỈ THUỘC CƠ SỞ ĐANG CHỌN (Không gộp chung các cơ sở khác)
  const facilityCourts = courts.filter((c) => c.clubId === activeClub.id);
  const displayCourts =
    facilityCourts.length > 0
      ? facilityCourts
      : Array.from({ length: activeClub.totalCourts || 6 }, (_, i) => ({
          id: `${activeClub.id}_${i + 1}`,
          name: `Sân ${i + 1}`,
          clubId: activeClub.id,
          clubName: activeClub.name,
          location: activeClub.address,
          price: 80000,
          status: 'available',
        }));

  const handleConfirmLogout = () => {
    setLogoutModal(false);
    if (onLogout) {
      onLogout();
    }
  };

  const handleSelectFacility = (club) => {
    setActiveClubId(club.id);
    if (onSelectClub) {
      onSelectClub(club);
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

          <Image
            source={APP_ASSETS.logo}
            style={st.aloboLogoCircle}
            resizeMode="contain"
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <TouchableOpacity style={st.headerIconBtn} onPress={() => navigate('adminBookings')}>
              <Text style={{ fontSize: 16, color: '#fff' }}>💬</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.guideBtnPill} onPress={() => setGuideModal(true)}>
              <Text style={{ fontSize: 12, marginRight: 2 }}>💡</Text>
              <Text style={st.guideBtnText}>HD</Text>
            </TouchableOpacity>
            <TouchableOpacity style={st.logoutHeaderBtn} onPress={() => setLogoutModal(true)}>
              <Text style={{ fontSize: 13, marginRight: 3 }}>🚪</Text>
              <Text style={st.logoutHeaderText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Admin Profile & Active Facility Banner */}
        <View style={st.adminSessionCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={st.adminAvatarSmall}>
              <Text style={{ fontSize: 16 }}>👑</Text>
            </View>
            <View style={{ marginLeft: 8, flex: 1 }}>
              <Text style={st.adminSessionName} numberOfLines={1}>
                {user?.name || 'Trần Quốc Trung'} (Super Admin)
              </Text>
              <Text style={st.adminSessionRole} numberOfLines={1}>
                📍 Đang quản lý: <Text style={{ fontWeight: '900', color: '#facc15' }}>{activeClub.name}</Text>
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

      {/* Facility Switcher Tabs (Quản lý riêng biệt từng cơ sở) */}
      <View style={st.facilitySection}>
        <View style={st.facilityHeaderRow}>
          <Text style={st.facilitySectionTitle}>🏢 CHỌN CƠ SỞ QUẢN LÝ SÂN:</Text>
          <Text style={st.facilityCountText}>{displayCourts.length} Sân hoạt động</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={st.facilityScrollContent}
        >
          {clubs.map((club, idx) => {
            const isSelected = club.id === activeClub.id;
            return (
              <TouchableOpacity
                key={club.id}
                style={[st.facilityChip, isSelected && st.facilityChipActive]}
                onPress={() => handleSelectFacility(club)}
                activeOpacity={0.8}
              >
                <Text style={[st.facilityChipIcon, isSelected && { color: '#fff' }]}>
                  {idx === 0 ? '🥇' : idx === 1 ? '🥈' : '🏸'}
                </Text>
                <View style={{ marginLeft: 6 }}>
                  <Text
                    style={[st.facilityChipName, isSelected && st.facilityChipNameActive]}
                    numberOfLines={1}
                  >
                    {club.name.replace('QT Sport - ', '')}
                  </Text>
                  <Text style={[st.facilityChipSub, isSelected && { color: '#dcfce7' }]}>
                    {club.totalCourts || 6} Sân đấu · {club.district}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Live Timeline Matrix Widget (Chỉ hiển thị sân của cơ sở đã chọn) */}
      <View style={st.matrixWidgetCard}>
        <View style={st.matrixCardTop}>
          <View>
            <Text style={st.matrixCardTitle}>
              📊 Ma Trận Lịch Trực Tiếp: {activeClub.name.replace('QT Sport - ', '')}
            </Text>
            <Text style={st.matrixCardSubtitle}>
              Chỉ hiển thị các sân thuộc cơ sở này ({displayCourts.map((c) => c.name).join(', ')})
            </Text>
          </View>
        </View>

        {/* Legend Ribbon Bar */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.legendRow}>
          {[
            { label: 'Trống', color: '#ffffff', border: true },
            { label: 'Lịch ngày', color: '#10b981' },
            { label: 'Đang dùng', color: '#0284c7' },
            { label: 'Cố định', color: '#7c3aed' },
            { label: 'Chờ cọc', color: '#f59e0b' },
            { label: 'Bảo trì', color: '#64748b' },
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

            {displayCourts.map((court, courtIdx) => (
              <View key={court.id} style={st.matrixBodyRow}>
                <View style={st.matrixCourtLabelCol}>
                  <Text style={st.matrixCourtLabelText}>{court.name}</Text>
                  <Text style={st.matrixCourtPriceText}>{((court.price || 80000) / 1000)}k</Text>
                </View>

                {TIME_SLOTS.map((slot, hourIdx) => {
                  const hourNum = parseInt(slot.split(':')[0]);
                  // Match real booking or simulate facility-based patterns
                  const matchedBooking = bookings.find(
                    (b) =>
                      (b.courtId === court.id || b.court?.id === court.id) &&
                      b.slot &&
                      b.slot.includes(slot)
                  );

                  // Unique mock occupancy pattern per facility court
                  const isSimInUse = (courtIdx + hourIdx) % 7 === 2 && hourNum >= 17 && hourNum <= 20;
                  const isSimBooked = (courtIdx * 3 + hourIdx) % 8 === 3 && hourNum >= 14 && hourNum <= 21;
                  const isSimFixed = courtIdx === 0 && hourNum >= 18 && hourNum <= 20;

                  if (matchedBooking) {
                    return (
                      <TouchableOpacity
                        key={slot}
                        style={[st.matrixBookingBlock, { backgroundColor: '#10b981' }]}
                        onPress={() =>
                          setSlotModal({
                            court,
                            slotHour: slot,
                            booking: matchedBooking,
                          })
                        }
                      >
                        <Text style={st.matrixBookingText} numberOfLines={1}>
                          {matchedBooking.userName || 'Khách đặt'}
                        </Text>
                      </TouchableOpacity>
                    );
                  }

                  if (isSimFixed) {
                    return (
                      <TouchableOpacity
                        key={slot}
                        style={[st.matrixBookingBlock, { backgroundColor: '#7c3aed' }]}
                        onPress={() =>
                          setSlotModal({
                            court,
                            slotHour: slot,
                            title: 'Lịch cố định tháng',
                            guest: 'CLB Cầu Lông Đôi Nam Nữ (#8921)',
                          })
                        }
                      >
                        <Text style={st.matrixBookingText} numberOfLines={1}>
                          Cố định #8921
                        </Text>
                      </TouchableOpacity>
                    );
                  }

                  if (isSimInUse) {
                    return (
                      <TouchableOpacity
                        key={slot}
                        style={[st.matrixBookingBlock, { backgroundColor: '#0284c7' }]}
                        onPress={() =>
                          setSlotModal({
                            court,
                            slotHour: slot,
                            title: 'Khách đang chơi tại sân',
                            guest: 'Anh Tuấn - 0905 112 233',
                          })
                        }
                      >
                        <Text style={st.matrixBookingText} numberOfLines={1}>
                          Đang chơi 🏸
                        </Text>
                      </TouchableOpacity>
                    );
                  }

                  if (isSimBooked) {
                    return (
                      <TouchableOpacity
                        key={slot}
                        style={[st.matrixBookingBlock, { backgroundColor: '#f59e0b' }]}
                        onPress={() =>
                          setSlotModal({
                            court,
                            slotHour: slot,
                            title: 'Khách đặt chờ cọc',
                            guest: 'Chị Mai - 0988 554 433',
                          })
                        }
                      >
                        <Text style={st.matrixBookingText} numberOfLines={1}>
                          Chờ cọc ⏳
                        </Text>
                      </TouchableOpacity>
                    );
                  }

                  return (
                    <TouchableOpacity
                      key={slot}
                      style={st.matrixEmptySlot}
                      onPress={() =>
                        setSlotModal({
                          court,
                          slotHour: slot,
                          isAvailable: true,
                        })
                      }
                    >
                      <Text style={{ color: '#cbd5e1', fontSize: 11, fontWeight: '700' }}>＋</Text>
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
            <Text style={st.featureBigSub}>Xếp sân {activeClub.district}</Text>
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
          <Text style={st.extraBtnText}>Sân cơ sở</Text>
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

      {/* Slot Details / Quick Action Modal */}
      <Modal visible={!!slotModal} transparent animationType="fade">
        <View style={st.modalBackdrop}>
          <View style={st.modalCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={st.modalTitleText}>
                🏸 {slotModal?.court?.name} · {slotModal?.slotHour}
              </Text>
              <TouchableOpacity onPress={() => setSlotModal(null)} style={{ padding: 4 }}>
                <Text style={{ color: '#94a3b8', fontSize: 18, fontWeight: '800' }}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={st.slotModalBody}>
              <Text style={st.slotModalFacilityText}>
                🏢 {activeClub.name}
              </Text>
              <Text style={st.slotModalDetailText}>
                📍 Địa chỉ: {activeClub.address}
              </Text>

              {slotModal?.booking ? (
                <View style={st.slotDetailCard}>
                  <Text style={st.slotDetailTitle}>👤 Khách đặt: {slotModal.booking.userName}</Text>
                  <Text style={st.slotDetailSub}>📞 SĐT: {slotModal.booking.userPhone || '0905 591 379'}</Text>
                  <Text style={st.slotDetailSub}>💰 Giá thuê: {(slotModal.booking.grandTotal || 80000).toLocaleString('vi-VN')} đ</Text>
                  <Text style={st.slotDetailSub}>💳 Phương thức: {slotModal.booking.paymentMethod || 'Chuyển khoản QR'}</Text>
                </View>
              ) : slotModal?.guest ? (
                <View style={st.slotDetailCard}>
                  <Text style={st.slotDetailTitle}>ℹ️ {slotModal.title || 'Lịch đã có khách'}</Text>
                  <Text style={st.slotDetailSub}>👤 {slotModal.guest}</Text>
                </View>
              ) : (
                <View style={st.slotFreeCard}>
                  <Text style={{ fontSize: 24, marginBottom: 4 }}>✅</Text>
                  <Text style={st.slotFreeTitle}>Khung giờ hiện đang TRỐNG</Text>
                  <Text style={st.slotFreeSub}>Giá thuê: {(slotModal?.court?.price || 80000).toLocaleString('vi-VN')} đ/h</Text>
                </View>
              )}
            </View>

            <View style={st.slotModalBtnRow}>
              {slotModal?.isAvailable ? (
                <TouchableOpacity
                  style={st.slotBookBtn}
                  onPress={() => {
                    setSlotModal(null);
                    navigate('adminSchedule');
                  }}
                >
                  <Text style={st.slotBookBtnText}>＋ Đặt Lịch Cho Khách Tại Quầy</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={st.slotCancelBtn}
                  onPress={() => {
                    Alert.alert('Thành công', 'Đã cập nhật trạng thái khung giờ.');
                    setSlotModal(null);
                  }}
                >
                  <Text style={st.slotCancelBtnText}>Đóng</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Guide Modal */}
      <Modal visible={guideModal} transparent animationType="fade">
        <View style={st.modalBackdrop}>
          <View style={st.modalCard}>
            <Text style={st.modalTitleText}>💡 Hướng Dẫn Quản Lý Cơ Sở QT Sport</Text>
            <Text style={st.guideStepText}>1. Chọn từng Cơ sở ở thanh trên để xem riêng danh sách sân của cơ sở đó.</Text>
            <Text style={st.guideStepText}>2. Ma trận lịch chỉ hiển thị các Sân 1, Sân 2... thuộc riêng cơ sở đang chọn.</Text>
            <Text style={st.guideStepText}>3. Chạm vào ô giờ trống để đặt khách vãng lai trực tiếp tại quầy.</Text>
            <Text style={st.guideStepText}>4. Nhấn nút "Đăng xuất" ở góc trên để thoát phiên làm việc.</Text>
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
              Bạn có chắc chắn muốn kết thúc phiên làm việc và đăng xuất khỏi tài khoản Quản trị viên không?
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
    paddingBottom: 16,
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
    width: 52,
    height: 52,
    borderRadius: 26,
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
    paddingVertical: 10,
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
  adminSessionRole: { color: 'rgba(255,255,255,0.9)', fontSize: 11, marginTop: 2 },
  quickLogoutBadge: {
    backgroundColor: 'rgba(239,68,68,0.25)',
    borderWidth: 1,
    borderColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  quickLogoutBadgeText: { color: '#fca5a5', fontSize: 10, fontWeight: '800' },

  // Facility Switcher
  facilitySection: {
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: AL.border,
  },
  facilityHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  facilitySectionTitle: { color: AL.textDark, fontSize: 12, fontWeight: '900', letterSpacing: 0.5 },
  facilityCountText: { color: AL.primary, fontSize: 11, fontWeight: '800' },
  facilityScrollContent: { paddingHorizontal: 12, gap: 8 },
  facilityChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  facilityChipActive: {
    backgroundColor: AL.headerGreen,
    borderColor: AL.primaryDark,
    shadowColor: AL.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  facilityChipIcon: { fontSize: 16 },
  facilityChipName: { color: AL.textDark, fontSize: 12, fontWeight: '800' },
  facilityChipNameActive: { color: '#ffffff' },
  facilityChipSub: { color: AL.textSub, fontSize: 10, marginTop: 1 },

  // Matrix Card
  matrixWidgetCard: {
    backgroundColor: '#ffffff',
    marginHorizontal: 12,
    marginTop: 12,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: AL.border,
    elevation: 4,
  },
  matrixCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  matrixCardTitle: { fontSize: 13, fontWeight: '900', color: AL.textDark },
  matrixCardSubtitle: { fontSize: 11, color: AL.textSub, marginTop: 2 },
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
  matrixCourtHeaderCol: { width: 70, padding: 6, justifyContent: 'center' },
  matrixHeaderText: { fontSize: 10, fontWeight: '800', color: '#475569' },
  matrixHourCell: {
    width: 64,
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
    height: 38,
    alignItems: 'center',
  },
  matrixCourtLabelCol: { width: 70, paddingLeft: 6 },
  matrixCourtLabelText: { fontSize: 11, fontWeight: '900', color: '#1e293b' },
  matrixCourtPriceText: { fontSize: 9, color: AL.primary, fontWeight: '700' },
  matrixEmptySlot: {
    width: 64,
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  matrixBookingBlock: {
    width: 62,
    height: 30,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    marginHorizontal: 1,
  },
  matrixBookingText: { color: '#ffffff', fontSize: 9, fontWeight: '800' },

  // 4 Main Feature Cards
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

  // Modals
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
  modalTitleText: { fontSize: 15, fontWeight: '900', color: AL.textDark },
  slotModalBody: { marginVertical: 10 },
  slotModalFacilityText: { fontSize: 13, fontWeight: '800', color: AL.headerGreen, marginBottom: 2 },
  slotModalDetailText: { fontSize: 11, color: AL.textSub, marginBottom: 10 },
  slotDetailCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  slotDetailTitle: { color: AL.textDark, fontSize: 13, fontWeight: '800', marginBottom: 4 },
  slotDetailSub: { color: '#475569', fontSize: 12, marginTop: 2 },
  slotFreeCard: {
    backgroundColor: '#f0fdf4',
    borderRadius: 10,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  slotFreeTitle: { color: '#166534', fontSize: 13, fontWeight: '800' },
  slotFreeSub: { color: '#15803d', fontSize: 12, marginTop: 2 },
  slotModalBtnRow: { marginTop: 12 },
  slotBookBtn: {
    backgroundColor: '#ea580c',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  slotBookBtnText: { color: '#ffffff', fontSize: 13, fontWeight: '900' },
  slotCancelBtn: {
    backgroundColor: '#f1f5f9',
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  slotCancelBtnText: { color: '#475569', fontSize: 12, fontWeight: '800' },

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
