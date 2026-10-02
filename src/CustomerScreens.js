import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet,
  TextInput, FlatList, Modal, Alert, Platform, Clipboard,
} from 'react-native';
import { COLORS as C, CLUBS, COURTS_DATA, HOURS, INITIAL_BOOKED } from './data';
import { Btn, Badge } from './components';
import { MiniMapWidget } from './MapScreen';


// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
export function HomeScreen({ user, navigate, bookings, favorites, onToggleFavorite }) {
  const [search, setSearch] = useState('');
  const today = new Date();
  const days = ['Chủ nhật','Thứ hai','Thứ ba','Thứ tư','Thứ năm','Thứ sáu','Thứ bảy'];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}`;
  const filtered = search.trim()
    ? CLUBS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : CLUBS;

  return (
    <ScrollView style={cs.screen} showsVerticalScrollIndicator={false}>
      <View style={cs.topHeader}>
        <View style={cs.topHeaderLeft}>
          <View style={cs.avatarGreen}><Text style={{ fontSize: 18 }}>🏸</Text></View>
          <View style={{ marginLeft: 10 }}>
            <Text style={cs.dateText}>{dateStr}</Text>
            <Text style={cs.userNameTop}>{user.name}</Text>
          </View>
        </View>
        <View style={cs.topHeaderRight}>
          <TouchableOpacity style={cs.iconBtn}><Text style={{ fontSize: 20 }}>🚩</Text></TouchableOpacity>
          <TouchableOpacity style={cs.iconBtn}><Text style={{ fontSize: 20 }}>🔔</Text></TouchableOpacity>
        </View>
      </View>
      <View style={cs.searchRow}>
        <View style={cs.searchBox}>
          <Text style={cs.searchIcon}>🔍</Text>
          <TextInput style={cs.searchInput} placeholder="Tìm kiếm sân, CLB..."
            placeholderTextColor="#94a3b8" value={search} onChangeText={setSearch} />
          {search ? <TouchableOpacity onPress={() => setSearch('')}><Text style={{ color: '#94a3b8', fontSize: 18, paddingRight: 10 }}>✕</Text></TouchableOpacity> : null}
        </View>
        <TouchableOpacity style={cs.filterIconBtn}><Text style={{ fontSize: 18 }}>⚙️</Text></TouchableOpacity>
      </View>
      <View style={cs.quickNav}>
        {[
          { icon: '🗺️', label: 'Bản đồ', screen: 'mapTab' },
          { icon: '📅', label: 'Sân đã đặt', screen: 'myBookings', count: bookings.filter(b=>b.userId===user.id).length },
          { icon: '❤️', label: 'Yêu thích', screen: 'favorites' },
        ].map(item => (
          <TouchableOpacity key={item.label} style={cs.quickNavItem} onPress={() => navigate(item.screen)}>
            <View style={{ position: 'relative' }}>
              <Text style={cs.quickNavIcon}>{item.icon}</Text>
              {item.count > 0 && <View style={cs.navBadge}><Text style={cs.navBadgeText}>{item.count}</Text></View>}
            </View>
            <Text style={cs.quickNavLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={cs.banner}>
        <View style={{ flex: 2 }}>
          <Text style={cs.bannerBrand}>ALOBO{'\n'}<Text style={cs.bannerAcademy}>ACADEMY</Text></Text>
          <Text style={cs.bannerSub}>TÌM KIẾM LỚP HỌC{'\n'}VÀ ĐĂNG KÝ KHOÁ HỌC GẦN BẠN</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 11, color: '#fff', fontWeight: '700', textAlign: 'center' }}>LỚP HỌC ĐA DẠNG{'\n'}KẾT NỐI TRUNG TÂM</Text>
        </View>
      </View>

      {/* 🗺️ BẢN ĐỒ TRỰC TIẾP TRÊN TRANG CHỦ */}
      <MiniMapWidget navigate={navigate} />

      <Text style={cs.sectionTitle}>Câu lạc bộ gần bạn</Text>

      {filtered.map(club => (
        <TouchableOpacity key={club.id} style={cs.clubCard} onPress={() => navigate('booking')}>
          <View style={cs.clubCardImg}><Text style={{ fontSize: 30 }}>🏸</Text></View>
          <View style={cs.clubCardBody}>
            <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
              {club.tag.map(t => (
                <View key={t} style={[cs.tagBadge, { backgroundColor: t === 'Sự kiện' ? '#7c3aed' : C.primary }]}>
                  <Text style={cs.tagText}>{t}</Text>
                </View>
              ))}
            </View>
            <Text style={cs.clubName}>{club.name}</Text>
            <Text style={cs.clubAddr} numberOfLines={1}>📍 {club.address}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={cs.clubOpen}>⏰ {club.open}</Text>
              <Text style={{ color: C.accent, fontSize: 11, fontWeight: '600' }}>📏 {club.distance}</Text>
            </View>
          </View>
          <View style={cs.clubCardActions}>
            <TouchableOpacity onPress={() => onToggleFavorite(club.id)}>
              <Text style={{ fontSize: 20 }}>{favorites.includes(club.id) ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
            <View style={{ backgroundColor: C.card2, borderRadius: 8, paddingHorizontal: 6, paddingVertical: 3, marginTop: 6 }}>
              <Text style={{ color: C.warning, fontSize: 11, fontWeight: '700' }}>⭐ {club.rating}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{ height: 20 }} />
    </ScrollView>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// BOOKING FLOW  (3 steps: grid → confirm → payment)
// ═══════════════════════════════════════════════════════════════════════════════

// Step 1 – Visual grid
function BookingGrid({ user, onNext, onBack }) {
  const [bookedSlots, setBookedSlots] = useState(INITIAL_BOOKED);
  const [selected, setSelected] = useState([]);
  const [selectedDate] = useState('28/08/2026');
  const scrollRef = useRef(null);

  const isBooked = (cid, h) => bookedSlots.some(s => s.courtId === cid && s.hour === h);
  const isSelected = (cid, h) => selected.some(s => s.courtId === cid && s.hour === h);

  const toggleSlot = (cid, h) => {
    if (isBooked(cid, h)) return;
    setSelected(prev => {
      const exists = prev.find(s => s.courtId === cid && s.hour === h);
      return exists ? prev.filter(s => !(s.courtId === cid && s.hour === h)) : [...prev, { courtId: cid, hour: h }];
    });
  };

  const totalHours = selected.length;
  const totalPrice = selected.reduce((sum, s) => {
    const c = COURTS_DATA.find(ct => ct.id === s.courtId);
    return sum + (c ? c.price : 0);
  }, 0);

  const handleNext = () => {
    if (selected.length === 0) { Alert.alert('Lỗi', 'Vui lòng chọn ít nhất 1 khung giờ'); return; }
    onNext(selected, bookedSlots, selectedDate, setBookedSlots);
  };

  const CELL_W = 52;

  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      {/* Header */}
      <View style={cs.gridHeader}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={cs.gridHeaderTitle}>ĐẶT LỊCH THEO SÂN - TRỰC Q...</Text>
        <TouchableOpacity style={cs.datePill}>
          <Text style={cs.datePillText}>{selectedDate} 📅</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={cs.legendRow}>
        {[['#fff','Trống'],['#f87171','Đã đặt'],['#9ca3af','Khoá'],['#a855f7','! Sự kiện']].map(([color, label]) => (
          <View key={label} style={cs.legendItem}>
            <View style={[cs.legendDot, { backgroundColor: color, borderWidth: color==='#fff'?1:0, borderColor:'#ccc' }]} />
            <Text style={cs.legendText}>{label}</Text>
          </View>
        ))}
      </View>
      <TouchableOpacity style={{ paddingHorizontal: 12, paddingBottom: 4 }}>
        <Text style={cs.priceLink}>Xem sân & bảng giá</Text>
      </TouchableOpacity>
      <Text style={cs.noteText}>
        Lưu ý: Nếu bạn cần đặt lịch cố định vui lòng liên hệ: {user.phone} để được hỗ trợ
      </Text>

      {/* Scrollable grid */}
      <ScrollView style={{ flex: 1 }} horizontal showsHorizontalScrollIndicator={true}>
        <View>
          {/* Hour header row */}
          <View style={{ flexDirection: 'row' }}>
            <View style={cs.gridCourtLabelHeader} />
            {HOURS.map(h => (
              <View key={h} style={[cs.gridHourCell, { width: CELL_W }]}>
                <Text style={cs.gridHourText}>{h}</Text>
              </View>
            ))}
          </View>
          {/* Court rows */}
          <ScrollView showsVerticalScrollIndicator={false}>
            {COURTS_DATA.map(court => (
              <View key={court.id} style={{ flexDirection: 'row' }}>
                <View style={cs.gridCourtLabel}>
                  <Text style={cs.gridCourtText}>{court.name}</Text>
                </View>
                {HOURS.map((h, idx) => {
                  const hour = 5 + idx;
                  const booked = isBooked(court.id, hour);
                  const sel = isSelected(court.id, hour);
                  return (
                    <TouchableOpacity key={h}
                      style={[cs.gridCell, { width: CELL_W },
                        booked && cs.gridCellBooked,
                        sel && cs.gridCellSelected,
                      ]}
                      onPress={() => toggleSlot(court.id, hour)}
                      activeOpacity={booked ? 1 : 0.7}>
                      {sel && <Text style={{ color: '#fff', fontSize: 10 }}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={cs.gridBottomBar}>
        <View style={cs.gridBottomInfo}>
          <Text style={cs.gridBottomUp}>∧</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', paddingHorizontal: 4 }}>
            <Text style={cs.gridBottomText}>Tổng giờ: <Text style={cs.gridBottomBold}>{totalHours}h00</Text></Text>
            <Text style={cs.gridBottomText}>Tổng tiền: <Text style={cs.gridBottomBold}>{totalPrice.toLocaleString('vi-VN')} đ</Text></Text>
          </View>
        </View>
        <TouchableOpacity style={[cs.nextBtn, selected.length === 0 && { opacity: 0.5 }]} onPress={handleNext}>
          <Text style={cs.nextBtnText}>TIẾP THEO</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 2 – Confirm order
function BookingConfirm({ user, selected, selectedDate, onBack, onPay }) {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone || '');
  const [note, setNote] = useState('');

  const grouped = {};
  selected.forEach(s => {
    if (!grouped[s.courtId]) grouped[s.courtId] = [];
    grouped[s.courtId].push(s.hour);
  });

  const totalHours = selected.length;
  const totalPrice = selected.reduce((sum, s) => {
    const c = COURTS_DATA.find(ct => ct.id === s.courtId);
    return sum + (c ? c.price : 0);
  }, 0);

  const handlePay = () => {
    if (!name.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập tên'); return; }
    if (!phone.trim()) { Alert.alert('Lỗi', 'Vui lòng nhập SĐT'); return; }
    onPay({ name, phone, note, totalHours, totalPrice });
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      <View style={cs.gridHeader}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={cs.gridHeaderTitle}>ĐẶT LỊCH THEO SÂN - TRỰC Q...</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14 }}>
        {/* Court info */}
        <View style={cs.confirmSection}>
          <View style={cs.confirmSectionTitle}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🗺️</Text>
            <Text style={cs.confirmSectionTitleText}>Thông tin sân</Text>
          </View>
          <Text style={cs.confirmLabel}>Tên CLB: <Text style={cs.confirmValue}>ICON BADMINTON</Text></Text>
          <Text style={[cs.confirmLabel, { marginTop: 6, lineHeight: 20 }]}>
            Địa chỉ: <Text style={cs.confirmValue}>122 Tôn Đản, Phường An Khê, TP Đà Nẵng</Text>
          </Text>
        </View>

        {/* Booking info */}
        <View style={cs.confirmSection}>
          <View style={cs.confirmSectionTitle}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>📋</Text>
            <Text style={cs.confirmSectionTitleText}>Thông tin lịch đặt</Text>
          </View>
          <Text style={cs.confirmLabel}>Ngày: <Text style={cs.confirmValue}>{selectedDate}</Text></Text>
          {Object.entries(grouped).map(([cid, hours]) => {
            const court = COURTS_DATA.find(c => c.id === cid);
            const minH = Math.min(...hours);
            const maxH = Math.max(...hours) + 1;
            const price = hours.reduce((s, h) => {
              const c = COURTS_DATA.find(ct => ct.id === cid);
              return s + (c ? c.price : 0);
            }, 0);
            return (
              <Text key={cid} style={[cs.confirmLabel, { marginTop: 4 }]}>
                {'- '}{court?.name}: <Text style={cs.confirmValue}>{minH}:00 - {maxH}:00</Text>
                {'  |  '}<Text style={{ color: C.primary, fontWeight: '700' }}>{price.toLocaleString('vi-VN')} đ</Text>
              </Text>
            );
          })}
          <Text style={[cs.confirmLabel, { marginTop: 8 }]}>Đối tượng: <Text style={cs.confirmValue}>Cầu Lông</Text></Text>
          <Text style={cs.confirmLabel}>Tổng giờ: <Text style={cs.confirmValue}>{totalHours}h00</Text></Text>
          <Text style={cs.confirmLabel}>Tổng tiền: <Text style={[cs.confirmValue, { color: C.primary, fontSize: 16 }]}>{totalPrice.toLocaleString('vi-VN')} đ</Text></Text>
        </View>

        {/* Discount */}
        <View style={[cs.confirmSection, { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }]}>
          <Text style={{ color: C.primary, fontSize: 14, fontWeight: '700' }}>Ưu đãi</Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={cs.priceLink}>Chọn ưu đãi áp dụng</Text>
            <View style={cs.plusCircle}><Text style={{ color: C.primary, fontSize: 18, fontWeight: '700' }}>+</Text></View>
          </TouchableOpacity>
        </View>
        <View style={[cs.confirmSection, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <Text style={cs.confirmLabel}>Số tiền cần thanh toán</Text>
          <Text style={[cs.confirmValue, { fontSize: 15 }]}>{totalPrice.toLocaleString('vi-VN')} đ</Text>
        </View>

        {/* Form */}
        <Text style={cs.formFieldLabel}>TÊN CỦA BẠN</Text>
        <View style={cs.formFieldWrap}>
          <TextInput style={cs.formField} value={name} onChangeText={setName}
            placeholderTextColor="#94a3b8" />
          {name ? <TouchableOpacity onPress={() => setName('')} style={cs.clearBtn}>
            <Text style={cs.clearBtnText}>✕</Text>
          </TouchableOpacity> : null}
        </View>

        <Text style={cs.formFieldLabel}>SỐ ĐIỆN THOẠI</Text>
        <View style={cs.formFieldWrap}>
          <View style={cs.phonePrefixWrap}>
            <Text style={{ fontSize: 16 }}>🇻🇳</Text>
            <Text style={cs.phonePrefix}>+84 ▾</Text>
          </View>
          <TextInput style={[cs.formField, { flex: 1, paddingLeft: 80 }]}
            value={phone} onChangeText={setPhone}
            keyboardType="phone-pad" placeholderTextColor="#94a3b8" />
          {phone ? <TouchableOpacity onPress={() => setPhone('')} style={cs.clearBtn}>
            <Text style={cs.clearBtnText}>✕</Text>
          </TouchableOpacity> : null}
        </View>

        <Text style={cs.formFieldLabel}>GHI CHÚ CHO CHỦ SÂN</Text>
        <View style={[cs.formFieldWrap, { height: 80, alignItems: 'flex-start' }]}>
          <TextInput style={[cs.formField, { height: 80, textAlignVertical: 'top', paddingTop: 12 }]}
            value={note} onChangeText={setNote} multiline
            placeholder="Nhập ghi chú" placeholderTextColor="#94a3b8" />
        </View>

        {/* Note box */}
        <View style={cs.noteBox}>
          <Text style={cs.noteBoxTitle}>⚠️ Lưu ý:</Text>
          {[
            'Việc thanh toán được thực hiện trực tiếp giữa bạn và chủ sân.',
            'ALOBO đóng vai trò kết nối, hỗ trợ bạn tìm và đặt sân dễ dàng hơn.',
            'Mỗi sân có thể có quy định và chính sách riêng, hãy dành chút thời gian đọc kỹ để đảm bảo quyền lợi cho bạn nhé!',
          ].map((t, i) => <Text key={i} style={cs.noteBoxText}>• {t}</Text>)}
          <Text style={[cs.noteBoxText, { marginTop: 10 }]}>
            Bằng việc bấm Xác nhận và Thanh toán, bạn xác nhận đã đọc và đồng ý với{' '}
            <Text style={cs.priceLink}>Điều khoản đặt sân</Text> và{' '}
            <Text style={cs.priceLink}>Chính sách hoàn tiền và huỷ lịch</Text>.
          </Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom confirm button */}
      <View style={cs.confirmBottomBar}>
        <TouchableOpacity style={cs.confirmPayBtn} onPress={handlePay}>
          <Text style={cs.confirmPayBtnText}>XÁC NHẬN & THANH TOÁN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Step 3 – Payment
function BookingPayment({ user, orderInfo, onBack, onDone }) {
  const [countdown, setCountdown] = useState(6 * 60); // 6 minutes
  const [expanded, setExpanded] = useState(true);
  const [imageUploaded, setImageUploaded] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(countdown / 60).toString().padStart(2, '0');
  const seconds = (countdown % 60).toString().padStart(2, '0');
  const orderCode = '#' + Math.floor(10000 + Math.random() * 90000);

  const bankInfo = {
    name: 'VO VAN DIEP',
    account: '789789179',
    bank: 'MB Bank',
  };

  const handleCopyAccount = () => {
    Clipboard.setString(bankInfo.account);
    Alert.alert('✅', 'Đã sao chép số tài khoản');
  };

  const handleComplete = () => {
    if (!imageUploaded) {
      Alert.alert('Lưu ý', 'Vui lòng tải ảnh chuyển khoản trước khi hoàn tất');
      return;
    }
    onDone();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      {/* Header */}
      <View style={cs.gridHeader}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={[cs.gridHeaderTitle, { fontSize: 18 }]}>Thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Countdown */}
      <View style={cs.countdownBar}>
        <Text style={cs.countdownLabel}>Đơn của bạn còn được giữ chỗ trong</Text>
        <Text style={[cs.countdownTime, countdown < 60 && { color: C.danger }]}>
          {minutes}:{seconds}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14 }}>
        {/* Order info card */}
        <View style={cs.payCard}>
          <TouchableOpacity style={cs.payCardHeader} onPress={() => setExpanded(!expanded)}>
            <Text style={cs.payCardTitle}>Thông tin lịch đặt</Text>
            <Text style={{ color: C.primary, fontSize: 18 }}>{expanded ? '∧' : '∨'}</Text>
          </TouchableOpacity>
          {expanded && (
            <View style={{ paddingTop: 8 }}>
              {[
                { icon: '👤', label: 'Tên', value: orderInfo.name },
                { icon: '📞', label: 'SĐT', value: orderInfo.phone },
                { icon: '🏆', label: 'Mã đơn', value: orderCode },
                { icon: '📅', label: 'Chi tiết đơn', value: orderInfo.detail },
                { icon: '💰', label: 'Tổng đơn', value: `${orderInfo.totalPrice.toLocaleString('vi-VN')} đ` },
                { icon: '💳', label: 'Cần thanh toán', value: `${orderInfo.totalPrice.toLocaleString('vi-VN')} đ` },
              ].map(row => (
                <View key={row.label} style={cs.payRow}>
                  <View style={cs.payRowIcon}>
                    <Text style={{ fontSize: 16 }}>{row.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={cs.payRowLabel}>{row.label}</Text>
                    <Text style={cs.payRowValue}>{row.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Payment method */}
        <Text style={[cs.sectionTitle, { marginHorizontal: 0, marginTop: 16 }]}>Phương thức thanh toán</Text>
        <View style={cs.bankCard}>
          {/* QR mock */}
          <View style={cs.qrBox}>
            <Text style={cs.qrMock}>▪▪▪{'\n'}▪ ▪{'\n'}▪▪▪</Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text style={cs.bankName}>{bankInfo.name}</Text>
            <Text style={cs.bankDetail}>Số tài khoản: {bankInfo.account}</Text>
            <Text style={cs.bankDetail}>{bankInfo.bank}</Text>
          </View>
          <View style={{ gap: 10 }}>
            <TouchableOpacity style={cs.bankActionBtn} onPress={handleCopyAccount}>
              <Text style={{ fontSize: 18 }}>📋</Text>
            </TouchableOpacity>
            <TouchableOpacity style={cs.bankActionBtn}>
              <Text style={{ fontSize: 18 }}>⬇️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transfer note */}
        <View style={cs.transferNote}>
          <Text style={{ fontSize: 18, marginRight: 8 }}>⚠️</Text>
          <Text style={{ flex: 1, color: '#92400e', fontSize: 13, lineHeight: 20 }}>
            Vui lòng chuyển khoản{' '}
            <Text style={{ color: C.primary, fontWeight: '700' }}>{orderInfo.totalPrice.toLocaleString('vi-VN')} đ</Text>
            {' '}và gửi ảnh vào ô bên dưới để hoàn tất đặt lịch!
          </Text>
        </View>

        {/* Upload image */}
        <Text style={[cs.formFieldLabel, { marginTop: 16 }]}>
          Hình ảnh thanh toán <Text style={{ color: C.danger }}>*</Text>
        </Text>
        <TouchableOpacity style={[cs.uploadBox, imageUploaded && { borderColor: C.primary, backgroundColor: '#f0fdf4' }]}
          onPress={() => { setImageUploaded(true); Alert.alert('✅', 'Đã chọn ảnh thành công!'); }}>
          {imageUploaded
            ? <>
                <Text style={{ fontSize: 40, color: C.primary }}>✅</Text>
                <Text style={{ color: C.primary, fontSize: 14, fontWeight: '700', marginTop: 8 }}>Đã tải ảnh thành công</Text>
              </>
            : <>
                <Text style={{ fontSize: 40, color: C.primary }}>🖼️</Text>
                <Text style={{ color: C.primary, fontSize: 14, fontWeight: '700', marginTop: 8 }}>Tải ảnh chuyển khoản</Text>
                <Text style={{ color: '#94a3b8', fontSize: 12, marginTop: 4 }}>PNG, JPG (tối đa 5MB)</Text>
              </>
          }
        </TouchableOpacity>

        {/* Total summary */}
        <View style={cs.totalSummary}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={cs.totalSummaryLabel}>Thanh toán:</Text>
            <Text style={cs.totalSummaryValue}>Tiền sân</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 }}>
            <Text style={[cs.totalSummaryLabel, { fontWeight: '700' }]}>Tổng :</Text>
            <Text style={[cs.totalSummaryValue, { color: C.primary, fontSize: 16, fontWeight: '800' }]}>
              {orderInfo.totalPrice.toLocaleString('vi-VN')} đ
            </Text>
          </View>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Bottom button */}
      <View style={cs.confirmBottomBar}>
        <TouchableOpacity style={cs.confirmPayBtn} onPress={handleComplete}>
          <Text style={cs.confirmPayBtnText}>Tiếp tục thanh toán</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── MAIN BOOKING SCREEN ─────────────────────────────────────────────────────
export function BookingScreen({ user, navigate, onConfirm }) {
  const [step, setStep] = useState('modal'); // modal | grid | confirm | payment
  const [selected, setSelected] = useState([]);
  const [bookedSlotsRef, setBookedSlotsRef] = useState(null);
  const [selectedDate, setSelectedDate] = useState('28/08/2026');
  const [orderInfo, setOrderInfo] = useState(null);

  const handleGridNext = (sel, bookedSlots, date, setBooked) => {
    setSelected(sel);
    setBookedSlotsRef({ bookedSlots, setBooked });
    setSelectedDate(date);
    setStep('confirm');
  };

  const handleConfirmPay = (info) => {
    // Build detail string
    const grouped = {};
    selected.forEach(s => {
      if (!grouped[s.courtId]) grouped[s.courtId] = [];
      grouped[s.courtId].push(s.hour);
    });
    const detail = Object.entries(grouped).map(([cid, hours]) => {
      const court = COURTS_DATA.find(c => c.id === cid);
      const minH = Math.min(...hours);
      const maxH = Math.max(...hours) + 1;
      return `${selectedDate}\n- ${court?.name}: ${minH}:00 - ${maxH}:00`;
    }).join('\n');

    setOrderInfo({ ...info, detail });
    setStep('payment');
  };

  const handleDone = () => {
    // Add booking
    if (bookedSlotsRef) {
      bookedSlotsRef.setBooked(prev => [...prev, ...selected]);
    }
    const court = COURTS_DATA.find(c => c.id === selected[0]?.courtId);
    if (court && orderInfo) {
      const booking = {
        id: Date.now().toString(),
        court, userId: user.id, userName: orderInfo.name, userPhone: orderInfo.phone,
        date: selectedDate,
        slot: selected.map(s => `${s.hour}:00-${s.hour+1}:00`).join(', '),
        note: orderInfo.note, status: 'confirmed',
        createdAt: new Date().toLocaleString('vi-VN'),
      };
      onConfirm(booking);
    }
    Alert.alert('✅ Đặt sân thành công!', 'Chúng tôi sẽ xác nhận lịch của bạn sớm nhất.',
      [{ text: 'Xem lịch của tôi', onPress: () => { setStep('modal'); navigate('myBookings'); } },
       { text: 'Đóng', onPress: () => setStep('modal') }]);
  };

  if (step === 'modal') return (
    <View style={[{ flex: 1, backgroundColor: C.bg }, { justifyContent: 'center', alignItems: 'center', padding: 20 }]}>
      <Modal visible={true} transparent animationType="fade">
        <View style={cs.modalOverlay}>
          <View style={cs.modalBox}>
            <View style={cs.modalHeader}>
              <Text style={cs.modalTitle}>CHỌN HÌNH THỨC ĐẶT</Text>
              <TouchableOpacity onPress={() => navigate('home')}>
                <Text style={{ fontSize: 20, color: '#64748b' }}>✕</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={cs.bookOptionCard} onPress={() => setStep('grid')}>
              <View style={{ flex: 1 }}>
                <Text style={cs.bookOptionTitle}>ĐẶT LỊCH THEO SÂN - TRỰC QUAN</Text>
                <Text style={cs.bookOptionDesc}>Đặt lịch theo sân trên bảng trạng thái sân, có thể lựa chọn nhiều khung giờ, nhiều sân</Text>
              </View>
              <View style={cs.bookOptionArrow}><Text style={{ color: '#fff', fontSize: 18 }}>→</Text></View>
            </TouchableOpacity>
            <TouchableOpacity style={[cs.bookOptionCard, { backgroundColor: '#fdf4ff', borderColor: '#d946ef' }]}
              onPress={() => Alert.alert('Thông báo', 'Tính năng Vé Vãng Lai sẽ sớm ra mắt!')}>
              <View style={{ flex: 1 }}>
                <Text style={[cs.bookOptionTitle, { color: '#a21caf' }]}>MUA VÉ VÃNG LAI</Text>
                <Text style={[cs.bookOptionDesc, { color: '#86198f' }]}>Mua vé ngay hôm nay hoặc các ngày tiếp theo để tham gia sự kiện TUYỂN VÃNG LAI tại sân.</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View style={{ backgroundColor: C.danger, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>New</Text>
                </View>
                <View style={[cs.bookOptionArrow, { backgroundColor: '#d946ef' }]}>
                  <Text style={{ color: '#fff', fontSize: 18 }}>→</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );

  if (step === 'grid') return (
    <BookingGrid user={user} onNext={handleGridNext} onBack={() => setStep('modal')} />
  );

  if (step === 'confirm') return (
    <BookingConfirm user={user} selected={selected} selectedDate={selectedDate}
      onBack={() => setStep('grid')} onPay={handleConfirmPay} />
  );

  if (step === 'payment') return (
    <BookingPayment user={user} orderInfo={orderInfo}
      onBack={() => setStep('confirm')} onDone={handleDone} />
  );

  return null;
}

// ─── BOOKING DETAIL SCREEN ───────────────────────────────────────────────────
function BookingDetailScreen({ booking, user, onBack, onCancel }) {
  const [tab, setTab] = useState('info'); // info | service | team

  const orderCode = '#' + (parseInt(booking.id) % 100000 || 9684);
  const totalHours = booking.slot ? booking.slot.split(',').length : 1;
  const totalPrice = booking.court.price * totalHours;

  return (
    <View style={{ flex: 1, backgroundColor: C.primary }}>
      {/* Header */}
      <View style={cs.detailHeader}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ color: '#fff', fontSize: 28, lineHeight: 32 }}>‹</Text>
        </TouchableOpacity>
        <Text style={cs.detailHeaderTitle}>Chi tiết đặt lịch</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Tabs */}
      <View style={cs.detailTabRow}>
        {[['info','Thông tin'],['service','Dịch vụ'],['team','Đội nhóm']].map(([key, label]) => (
          <TouchableOpacity key={key} style={[cs.detailTab, tab === key && cs.detailTabActive]}
            onPress={() => setTab(key)}>
            <Text style={[cs.detailTabText, tab === key && cs.detailTabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1, backgroundColor: C.primary }} showsVerticalScrollIndicator={false}>
        {tab === 'info' && (
          <View style={{ padding: 14 }}>
            {/* Customer info */}
            <View style={cs.detailCard}>
              <View style={cs.detailCustomerRow}>
                <View style={cs.detailAvatar}>
                  <Text style={{ fontSize: 28 }}>😎</Text>
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={cs.detailKHLabel}>KH: <Text style={cs.detailKHName}>{booking.userName || user.name}</Text></Text>
                  <Text style={cs.detailKHSub}>Đối tượng: <Text style={{ fontWeight: '800', color: '#1e293b' }}>HỌC SINH SINH VIÊN</Text></Text>
                  <Text style={cs.detailKHSub}>Số điện thoại: <Text style={{ color: '#1e293b' }}>{booking.userPhone || user.phone}</Text></Text>
                </View>
              </View>
            </View>

            {/* Booking info */}
            <View style={cs.detailCard}>
              <View style={cs.detailSectionHeader}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>📋</Text>
                <Text style={cs.detailSectionTitle}>Thông tin</Text>
              </View>

              {[
                ['Mã lịch đặt:', orderCode, true],
                ['Trạng thái:', 'Chờ chủ sân xác nhận', false, '#f59e0b'],
                ['Tên CLB:', booking.court?.clubName || 'CLB Cầu Lông TPT Sport', false],
                ['Địa chỉ:', booking.court?.location || '207 Quách Thị Trang, Hòa Xuân, Cẩm Lệ, Đà Nẵng', false],
              ].map(([label, value, bold, color]) => (
                <View key={label} style={cs.detailRow}>
                  <Text style={cs.detailRowLabel}>{label}</Text>
                  <Text style={[cs.detailRowValue, bold && { color: C.primary, fontWeight: '700' }, color && { color }]}>
                    {value}
                  </Text>
                </View>
              ))}

              {/* Phone with call icon */}
              <View style={cs.detailRow}>
                <Text style={cs.detailRowLabel}>Số điện thoại:</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={cs.detailRowValue}>{booking.userPhone || user.phone || '0905 591 379'}</Text>
                  <View style={cs.callBtn}><Text style={{ fontSize: 16 }}>📞</Text></View>
                </View>
              </View>


              <View style={cs.detailDivider} />

              {/* Date and slots */}
              <View style={cs.detailRow}>
                <Text style={cs.detailRowLabel}>Ngày:</Text>
                <Text style={cs.detailRowValue}>{booking.date}</Text>
              </View>

              {booking.slot && booking.slot.split(',').map((s, i) => (
                <View key={i} style={{ paddingVertical: 3 }}>
                  <Text style={[cs.detailRowValue, { color: C.primary }]}>
                    {' - '}{booking.court.name}: {s.trim()}
                  </Text>
                </View>
              ))}

              <View style={cs.detailDivider} />

              {[
                ['Tổng giờ:', `${totalHours}h`],
                ['Tổng giảm giá:', '0 đ'],
                ['Tổng tiền:', `${totalPrice.toLocaleString('vi-VN')} đ`],
              ].map(([label, value]) => (
                <View key={label} style={cs.detailRow}>
                  <Text style={cs.detailRowLabel}>{label}</Text>
                  <Text style={cs.detailRowValue}>{value}</Text>
                </View>
              ))}

              {/* Payment status */}
              <View style={cs.detailRow}>
                <Text style={cs.detailRowLabel}>Trạng thái thanh toán:</Text>
                <Text style={{ color: C.warning, fontWeight: '700', fontSize: 14 }}>Chưa thanh toán</Text>
              </View>
            </View>
          </View>
        )}

        {tab === 'service' && (
          <View style={{ padding: 14 }}>
            <View style={cs.detailCard}>
              <View style={cs.detailSectionHeader}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>🎾</Text>
                <Text style={cs.detailSectionTitle}>Dịch vụ thêm</Text>
              </View>
              <View style={cs.centerEmpty}>
                <Text style={{ fontSize: 40 }}>📦</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 10 }}>Chưa có dịch vụ thêm</Text>
              </View>
            </View>
          </View>
        )}

        {tab === 'team' && (
          <View style={{ padding: 14 }}>
            <View style={cs.detailCard}>
              <View style={cs.detailSectionHeader}>
                <Text style={{ fontSize: 18, marginRight: 8 }}>👥</Text>
                <Text style={cs.detailSectionTitle}>Đội nhóm</Text>
              </View>
              <View style={cs.centerEmpty}>
                <Text style={{ fontSize: 40 }}>👥</Text>
                <Text style={{ color: '#94a3b8', fontSize: 14, marginTop: 10 }}>Chưa có thành viên đội nhóm</Text>
              </View>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Cancel button */}
      <View style={cs.detailBottomBar}>
        <TouchableOpacity style={cs.cancelBtn}
          onPress={() => Alert.alert('Huỷ đặt lịch', 'Bạn có chắc muốn huỷ lịch đặt này?', [
            { text: 'Không' },
            { text: 'Huỷ lịch', style: 'destructive', onPress: () => { onCancel(booking.id); onBack(); } },
          ])}>
          <Text style={cs.cancelBtnText}>HUỶ ĐẶT LỊCH</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// ─── MY BOOKINGS ─────────────────────────────────────────────────────────────
export function MyBookingsScreen({ bookings, user, navigate, onCancelBooking }) {
  const [selectedBooking, setSelectedBooking] = useState(null);
  const mine = bookings.filter(b => b.userId === user.id);

  if (selectedBooking) {
    return (
      <BookingDetailScreen
        booking={selectedBooking}
        user={user}
        onBack={() => setSelectedBooking(null)}
        onCancel={(id) => { onCancelBooking(id); setSelectedBooking(null); }}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={cs.myBookHeader}>
        <Text style={cs.myBookTitle}>Danh sách đặt lịch</Text>
        <TouchableOpacity style={cs.viewAllBtn}>
          <Text style={cs.viewAllText}>Xem tất cả 📅</Text>
        </TouchableOpacity>
      </View>
      {mine.length === 0
        ? <View style={cs.centerEmpty}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>📋</Text>
            <Text style={{ color: C.sub, fontSize: 15 }}>Chưa có lịch đặt sân</Text>
            <TouchableOpacity style={cs.bookNowBtn} onPress={() => navigate('booking')}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Đặt sân ngay</Text>
            </TouchableOpacity>
          </View>
        : <FlatList data={mine} keyExtractor={i => i.id} contentContainerStyle={{ padding: 14 }}
            renderItem={({ item }) => (
              <TouchableOpacity style={cs.bookingItem} onPress={() => setSelectedBooking(item)}>
                <View style={cs.bookingItemLeft}>
                  <View style={cs.bookingTagRow}>
                    <View style={cs.bookingTag}><Text style={cs.bookingTagText}>Đơn ngày</Text></View>
                  </View>
                  <Text style={cs.bookingItemName}>{item.court.name}</Text>
                  <Text style={cs.bookingItemDetail}>Chi tiết: {item.slot} | Ngày {item.date}</Text>
                  <Text style={cs.bookingItemAddr} numberOfLines={1}>📍 {item.court.location}</Text>
                </View>
                <View style={cs.bookingItemRight}>
                  <Text style={cs.bookingStatus}>✅ Đã xác nhận</Text>
                  <View style={cs.bookingActionIcons}>
                    <TouchableOpacity style={cs.actionIconBtn}><Text>🛒</Text></TouchableOpacity>
                    <View style={cs.actionIconBtn}><Text>›</Text></View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
      }
    </View>
  );
}

// ─── FAVORITES ───────────────────────────────────────────────────────────────
export function FavoritesScreen({ favorites, navigate }) {
  const favClubs = CLUBS.filter(c => favorites.includes(c.id));
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={cs.myBookHeader}>
        <Text style={cs.myBookTitle}>❤️ Yêu thích</Text>
      </View>
      {favClubs.length === 0
        ? <View style={cs.centerEmpty}>
            <Text style={{ fontSize: 48, marginBottom: 12 }}>🤍</Text>
            <Text style={{ color: C.sub, fontSize: 15 }}>Chưa có sân yêu thích</Text>
            <TouchableOpacity style={cs.bookNowBtn} onPress={() => navigate('home')}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Khám phá ngay</Text>
            </TouchableOpacity>
          </View>
        : <FlatList data={favClubs} keyExtractor={i => i.id} contentContainerStyle={{ padding: 14 }}
            renderItem={({ item }) => (
              <View style={cs.clubCard}>
                <View style={cs.clubCardImg}><Text style={{ fontSize: 28 }}>🏸</Text></View>
                <View style={cs.clubCardBody}>
                  <Text style={cs.clubName}>{item.name}</Text>
                  <Text style={cs.clubAddr}>📍 {item.address}</Text>
                  <Text style={cs.clubOpen}>⏰ {item.open}</Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 20 }}>❤️</Text>
                  <Text style={{ color: C.warning, fontSize: 11, fontWeight: '700', marginTop: 4 }}>⭐ {item.rating}</Text>
                </View>
              </View>
            )}
          />
      }
    </View>
  );
}

// ─── ACCOUNT SCREEN ──────────────────────────────────────────────────────────
export function AccountScreen({ user, navigate, bookings, onLogout }) {
  const mine = bookings.filter(b => b.userId === user.id);
  return (
    <ScrollView style={cs.screen} showsVerticalScrollIndicator={false}>
      <View style={cs.accountHeader}>
        <TouchableOpacity style={cs.accountProfileRow}>
          <View style={cs.accountAvatar}><Text style={{ fontSize: 28 }}>👤</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={cs.accountName}>{user.name}</Text>
            <Text style={cs.accountEmail}>{user.email}</Text>
          </View>
          <Text style={{ color: '#86efac', fontSize: 20 }}>›</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={cs.memberCard}>
        <Text style={{ fontSize: 20 }}>👑</Text>
        <Text style={cs.memberText}>Hạng thành viên</Text>
        <Text style={{ color: C.sub, fontSize: 20 }}>›</Text>
      </TouchableOpacity>
      <View style={cs.quickActRow}>
        {[
          { icon: '📅', label: 'Lịch đã đặt', screen: 'myBookings', count: mine.length },
          { icon: '🔔', label: 'Thông báo', screen: null, count: 0 },
          { icon: '🎓', label: 'Khoá học', screen: null, count: 0 },
          { icon: '🎁', label: 'Ưu đãi', screen: null, count: 2 },
        ].map(item => (
          <TouchableOpacity key={item.label} style={cs.quickActItem}
            onPress={() => item.screen && navigate(item.screen)}>
            <View style={{ position: 'relative' }}>
              <Text style={{ fontSize: 28 }}>{item.icon}</Text>
              {item.count > 0 && (
                <View style={cs.quickActBadge}>
                  <Text style={cs.quickActBadgeText}>{item.count}</Text>
                </View>
              )}
            </View>
            <Text style={cs.quickActLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={cs.sectionTitle}>Hoạt động</Text>
      {[
        { icon: '👥', label: 'Nhóm của tôi' },
        { icon: '📚', label: 'Danh sách lịch học' },
        { icon: '👑', label: 'Gói hội viên' },
      ].map(item => (
        <TouchableOpacity key={item.label} style={cs.menuRow}>
          <Text style={{ fontSize: 20, marginRight: 14 }}>{item.icon}</Text>
          <Text style={cs.menuLabel}>{item.label}</Text>
          <Text style={{ color: C.sub, fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      ))}
      {mine.length > 0 && (
        <>
          <View style={[cs.myBookHeader, { marginTop: 8 }]}>
            <Text style={cs.myBookTitle}>Danh sách đặt lịch</Text>
            <TouchableOpacity onPress={() => navigate('myBookings')}>
              <Text style={cs.priceLink}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>
          {mine.slice(0, 2).map(item => (
            <View key={item.id} style={cs.bookingItem}>
              <View style={cs.bookingItemLeft}>
                <View style={cs.bookingTagRow}>
                  <View style={cs.bookingTag}><Text style={cs.bookingTagText}>Đơn ngày</Text></View>
                </View>
                <Text style={cs.bookingItemName}>{item.court.name}</Text>
                <Text style={cs.bookingItemDetail}>Chi tiết: {item.slot} | Ngày {item.date}</Text>
                <Text style={cs.bookingItemAddr} numberOfLines={1}>📍 {item.court.location}</Text>
              </View>
              <View style={cs.bookingItemRight}>
                <Text style={cs.bookingStatus}>✅ Đã xác nhận</Text>
              </View>
            </View>
          ))}
        </>
      )}
      <Text style={cs.sectionTitle}>Cài đặt</Text>
      {[
        { icon: '⚙️', label: 'Cài đặt tài khoản' },
        { icon: '🔒', label: 'Bảo mật & Quyền riêng tư' },
        { icon: '❓', label: 'Trợ giúp & Hỗ trợ' },
      ].map(item => (
        <TouchableOpacity key={item.label} style={cs.menuRow}>
          <Text style={{ fontSize: 20, marginRight: 14 }}>{item.icon}</Text>
          <Text style={cs.menuLabel}>{item.label}</Text>
          <Text style={{ color: C.sub, fontSize: 18 }}>›</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={cs.logoutBtn}
        onPress={() => Alert.alert('Xác nhận', 'Bạn muốn đăng xuất?', [
          { text: 'Huỷ' },
          { text: 'Đăng xuất', style: 'destructive', onPress: onLogout },
        ])}>
        <Text style={cs.logoutText}>🚪 Đăng xuất</Text>
      </TouchableOpacity>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

export { MapScreen } from './MapScreen';


export function ExploreScreen({ navigate, favorites, onToggleFavorite }) {
  const [search, setSearch] = useState('');
  const filtered = search.trim()
    ? CLUBS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : CLUBS;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={cs.exploreSearchRow}>
        <TouchableOpacity onPress={() => navigate('home')} style={{ padding: 8 }}>
          <Text style={{ color: C.accent, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <View style={[cs.searchBox, { flex: 1 }]}>
          <Text style={cs.searchIcon}>🔍</Text>
          <TextInput style={cs.searchInput} placeholder="Tìm kiếm..." placeholderTextColor="#94a3b8"
            value={search} onChangeText={setSearch} />
        </View>
        <TouchableOpacity style={{ padding: 8 }}><Text style={{ fontSize: 18 }}>⚙️</Text></TouchableOpacity>
      </View>
      <FlatList data={filtered} keyExtractor={i => i.id} contentContainerStyle={{ padding: 14 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={cs.clubCard} onPress={() => navigate('booking')}>
            <View style={cs.clubCardImg}><Text style={{ fontSize: 28 }}>🏸</Text></View>
            <View style={cs.clubCardBody}>
              <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
                {item.tag.map(t => (
                  <View key={t} style={[cs.tagBadge, { backgroundColor: t === 'Sự kiện' ? '#7c3aed' : C.primary }]}>
                    <Text style={cs.tagText}>{t}</Text>
                  </View>
                ))}
              </View>
              <Text style={cs.clubName}>{item.name}</Text>
              <Text style={cs.clubAddr} numberOfLines={1}>📍 {item.address}</Text>
              <Text style={cs.clubOpen}>⏰ {item.open} · 📏 {item.distance}</Text>
            </View>
            <View style={cs.clubCardActions}>
              <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
                <Text style={{ fontSize: 20 }}>{favorites.includes(item.id) ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={cs.bookSmallBtn} onPress={() => navigate('booking')}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>ĐẶT LỊCH</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const cs = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  centerEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },

  // Top header
  topHeader: { backgroundColor: C.primary, flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  topHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  topHeaderRight: { flexDirection: 'row', gap: 8 },
  avatarGreen: { width: 42, height: 42, borderRadius: 21, backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center' },
  dateText: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  userNameTop: { color: '#fff', fontSize: 16, fontWeight: '700' },
  iconBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center' },

  // Search
  searchRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: C.primaryDark, gap: 8 },
  searchBox: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 24, paddingHorizontal: 12, height: 40 },
  searchIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, color: '#1e293b', fontSize: 14 },
  filterIconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center' },

  // Quick nav
  quickNav: { flexDirection: 'row', backgroundColor: C.primaryDark, paddingBottom: 12,
    paddingHorizontal: 16 },
  quickNavItem: { flex: 1, alignItems: 'center', gap: 4 },
  quickNavIcon: { fontSize: 22 },
  quickNavLabel: { color: '#fff', fontSize: 12, fontWeight: '600' },
  navBadge: { position: 'absolute', top: -4, right: -8, backgroundColor: C.danger,
    borderRadius: 8, paddingHorizontal: 4, minWidth: 16, alignItems: 'center' },
  navBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  // Banner
  banner: { margin: 12, borderRadius: 14, backgroundColor: '#15803d', flexDirection: 'row', padding: 16, minHeight: 100 },
  bannerBrand: { color: '#fff', fontSize: 22, fontWeight: '900' },
  bannerAcademy: { color: '#facc15', fontSize: 24, fontWeight: '900' },
  bannerSub: { color: '#dcfce7', fontSize: 11, marginTop: 4, lineHeight: 16 },

  sectionTitle: { color: C.text, fontSize: 15, fontWeight: '700', marginHorizontal: 14, marginTop: 14, marginBottom: 8 },

  // Club card
  clubCard: { flexDirection: 'row', backgroundColor: C.card, borderRadius: 14, marginHorizontal: 12,
    marginBottom: 10, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  clubCardImg: { width: 80, backgroundColor: '#166534', alignItems: 'center', justifyContent: 'center' },
  clubCardBody: { flex: 1, padding: 10 },
  clubCardActions: { padding: 10, alignItems: 'center', justifyContent: 'space-between' },
  clubName: { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 3 },
  clubAddr: { color: C.sub, fontSize: 12, marginBottom: 2 },
  clubOpen: { color: C.sub, fontSize: 11 },
  tagBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  bookSmallBtn: { backgroundColor: C.primary, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, marginTop: 6 },

  // Booking modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center',
    alignItems: 'center', padding: 20 },
  modalBox: { backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '100%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: '#1e293b', fontSize: 16, fontWeight: '800' },
  bookOptionCard: { backgroundColor: '#f0fdf4', borderRadius: 12, borderWidth: 2,
    borderColor: C.primary, padding: 16, flexDirection: 'row', alignItems: 'center',
    marginBottom: 14, gap: 12 },
  bookOptionTitle: { color: C.primaryDark, fontSize: 13, fontWeight: '800', marginBottom: 6 },
  bookOptionDesc: { color: '#374151', fontSize: 12, lineHeight: 18 },
  bookOptionArrow: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.primary,
    alignItems: 'center', justifyContent: 'center' },

  // Grid
  gridHeader: { backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingHorizontal: 8, paddingVertical: 12 },
  gridHeaderTitle: { color: '#fff', fontSize: 13, fontWeight: '800', flex: 1, textAlign: 'center' },
  datePill: { backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 5 },
  datePillText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  legendRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12,
    paddingVertical: 8, backgroundColor: '#fff', flexWrap: 'wrap', gap: 10 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  legendDot: { width: 16, height: 16, borderRadius: 3 },
  legendText: { color: '#374151', fontSize: 12 },
  priceLink: { color: C.primary, fontSize: 13, fontWeight: '700' },
  noteText: { color: C.danger, fontSize: 12, paddingHorizontal: 12, paddingVertical: 6,
    backgroundColor: '#fef2f2', textAlign: 'center' },

  gridCourtLabelHeader: { width: 68, backgroundColor: '#f8fafc' },
  gridCourtLabel: { width: 68, backgroundColor: '#f8fafc', borderRightWidth: 1, borderColor: '#e2e8f0',
    justifyContent: 'center', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1 },
  gridCourtText: { color: '#374151', fontSize: 11, fontWeight: '700', textAlign: 'center' },
  gridHourCell: { height: 32, alignItems: 'center', justifyContent: 'center',
    borderRightWidth: 1, borderColor: '#e2e8f0', borderBottomWidth: 1, backgroundColor: '#f8fafc' },
  gridHourText: { color: '#64748b', fontSize: 10 },
  gridCell: { height: 38, borderRightWidth: 1, borderColor: '#e2e8f0', borderBottomWidth: 1,
    backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  gridCellBooked: { backgroundColor: '#f87171' },
  gridCellSelected: { backgroundColor: '#bbf7d0', borderWidth: 1, borderColor: '#16a34a' },

  gridBottomBar: { backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e2e8f0' },
  gridBottomInfo: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 4, alignItems: 'center' },
  gridBottomUp: { color: C.primary, fontSize: 16, marginBottom: 4 },
  gridBottomText: { color: '#374151', fontSize: 14 },
  gridBottomBold: { fontWeight: '800', color: '#1e293b' },
  nextBtn: { backgroundColor: C.warning, paddingVertical: 16, alignItems: 'center', margin: 12, borderRadius: 12 },
  nextBtnText: { color: '#1e293b', fontWeight: '900', fontSize: 16, letterSpacing: 1 },

  // Confirm step
  confirmSection: { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10,
    borderWidth: 1, borderColor: '#e2e8f0' },
  confirmSectionTitle: { flexDirection: 'row', alignItems: 'center', marginBottom: 10,
    paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f0fdf4' },
  confirmSectionTitleText: { color: C.primary, fontSize: 15, fontWeight: '800' },
  confirmLabel: { color: '#374151', fontSize: 13 },
  confirmValue: { color: '#1e293b', fontWeight: '600' },
  plusCircle: { width: 28, height: 28, borderRadius: 14, borderWidth: 2, borderColor: C.primary,
    alignItems: 'center', justifyContent: 'center' },
  formFieldLabel: { color: '#374151', fontSize: 12, fontWeight: '800', letterSpacing: 0.5, marginBottom: 6, marginTop: 10 },
  formFieldWrap: { backgroundColor: '#fff', borderRadius: 10, borderWidth: 1, borderColor: '#e2e8f0',
    flexDirection: 'row', alignItems: 'center', marginBottom: 4, overflow: 'hidden' },
  formField: { flex: 1, padding: 14, color: '#1e293b', fontSize: 15 },
  clearBtn: { padding: 14 },
  clearBtnText: { color: '#94a3b8', fontSize: 16 },
  phonePrefixWrap: { position: 'absolute', left: 0, top: 0, bottom: 0, flexDirection: 'row',
    alignItems: 'center', paddingLeft: 14, gap: 4, zIndex: 1 },
  phonePrefix: { color: '#374151', fontSize: 14, fontWeight: '600' },
  noteBox: { backgroundColor: '#fffbeb', borderRadius: 10, padding: 14, borderWidth: 1,
    borderColor: '#fde68a', marginTop: 12 },
  noteBoxTitle: { color: '#92400e', fontSize: 14, fontWeight: '800', marginBottom: 8 },
  noteBoxText: { color: '#92400e', fontSize: 12, lineHeight: 20 },
  confirmBottomBar: { padding: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e2e8f0' },
  confirmPayBtn: { backgroundColor: C.warning, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  confirmPayBtnText: { color: '#1e293b', fontSize: 16, fontWeight: '900', letterSpacing: 0.5 },

  // Payment step
  countdownBar: { backgroundColor: C.primary, paddingVertical: 12, alignItems: 'center' },
  countdownLabel: { color: '#dcfce7', fontSize: 13 },
  countdownTime: { color: '#fff', fontSize: 28, fontWeight: '900', marginTop: 2 },
  payCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10,
    borderWidth: 1, borderColor: '#e2e8f0' },
  payCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#f0fdf4' },
  payCardTitle: { color: '#1e293b', fontSize: 15, fontWeight: '800' },
  payRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 8,
    borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  payRowIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#dcfce7',
    alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  payRowLabel: { color: '#64748b', fontSize: 12 },
  payRowValue: { color: '#1e293b', fontSize: 14, fontWeight: '600', marginTop: 2 },
  bankCard: { backgroundColor: '#fff', borderRadius: 12, padding: 14, flexDirection: 'row',
    alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10 },
  qrBox: { width: 64, height: 64, backgroundColor: '#f8fafc', borderRadius: 8,
    alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  qrMock: { fontSize: 22, textAlign: 'center', color: '#1e293b', lineHeight: 24 },
  bankName: { color: '#1e293b', fontSize: 14, fontWeight: '800' },
  bankDetail: { color: '#64748b', fontSize: 12, marginTop: 2 },
  bankActionBtn: { width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.primary,
    alignItems: 'center', justifyContent: 'center' },
  transferNote: { backgroundColor: '#fffbeb', borderRadius: 10, padding: 12, flexDirection: 'row',
    alignItems: 'flex-start', borderWidth: 1, borderColor: '#fde68a', marginBottom: 10 },
  uploadBox: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 2, borderColor: C.primary,
    borderStyle: 'dashed', paddingVertical: 28, alignItems: 'center', marginBottom: 16 },
  totalSummary: { backgroundColor: '#fff', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#e2e8f0' },
  totalSummaryLabel: { color: '#64748b', fontSize: 13 },
  totalSummaryValue: { color: '#1e293b', fontSize: 13, fontWeight: '600' },

  // My Bookings
  myBookHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: C.primary, paddingHorizontal: 16, paddingVertical: 14 },
  myBookTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  viewAllBtn: {},
  viewAllText: { color: '#dcfce7', fontSize: 13 },
  bookingItem: { flexDirection: 'row', backgroundColor: C.card, marginHorizontal: 12,
    marginBottom: 10, borderRadius: 12, padding: 14, borderWidth: 1, borderColor: C.border },
  bookingItemLeft: { flex: 1 },
  bookingItemRight: { alignItems: 'flex-end', justifyContent: 'space-between' },
  bookingTagRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  bookingTag: { backgroundColor: C.primary, borderRadius: 4, paddingHorizontal: 8, paddingVertical: 3 },
  bookingTagText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  bookingItemName: { color: C.accent, fontSize: 14, fontWeight: '700', marginBottom: 3 },
  bookingItemDetail: { color: C.sub, fontSize: 12, marginBottom: 2 },
  bookingItemAddr: { color: C.sub, fontSize: 12 },
  bookingStatus: { color: C.accent, fontSize: 12, fontWeight: '600' },
  bookingActionIcons: { flexDirection: 'row', gap: 6, marginTop: 6 },
  actionIconBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: C.card2,
    alignItems: 'center', justifyContent: 'center' },
  bookNowBtn: { backgroundColor: C.primary, borderRadius: 10, paddingHorizontal: 20, paddingVertical: 12, marginTop: 16 },

  // Account
  accountHeader: { backgroundColor: C.primary, padding: 16 },
  accountProfileRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12, padding: 14, gap: 12 },
  accountAvatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center', justifyContent: 'center' },
  accountName: { color: '#fff', fontSize: 16, fontWeight: '800' },
  accountEmail: { color: '#dcfce7', fontSize: 12, marginTop: 2 },
  memberCard: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.card,
    marginHorizontal: 12, marginTop: 12, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: C.warning },
  memberText: { flex: 1, color: C.warning, fontSize: 15, fontWeight: '700' },
  quickActRow: { flexDirection: 'row', marginHorizontal: 12, marginTop: 12, gap: 8 },
  quickActItem: { flex: 1, backgroundColor: C.card, borderRadius: 12, padding: 14,
    alignItems: 'center', gap: 6, borderWidth: 1, borderColor: C.border },
  quickActBadge: { position: 'absolute', top: -4, right: -8, backgroundColor: C.danger,
    borderRadius: 8, paddingHorizontal: 4, minWidth: 16, alignItems: 'center' },
  quickActBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  quickActLabel: { color: C.sub, fontSize: 11, textAlign: 'center' },
  menuRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card,
    marginHorizontal: 12, marginBottom: 2, paddingHorizontal: 16, paddingVertical: 16,
    borderRadius: 10, borderWidth: 1, borderColor: C.border },
  menuLabel: { flex: 1, color: C.text, fontSize: 14 },
  logoutBtn: { marginHorizontal: 12, marginTop: 20, backgroundColor: C.danger,
    borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  logoutText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  // Explore
  exploreSearchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.primaryDark,
    paddingHorizontal: 8, paddingVertical: 10, gap: 6 },

  // Booking detail
  detailHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 8, paddingVertical: 10 },
  detailHeaderTitle: { color: '#fff', fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  detailTabRow: { flexDirection: 'row', backgroundColor: C.primary, paddingHorizontal: 14, gap: 0 },
  detailTab: { flex: 1, paddingVertical: 12, alignItems: 'center',
    borderBottomWidth: 3, borderBottomColor: 'transparent' },
  detailTabActive: { borderBottomColor: '#fff' },
  detailTabText: { color: 'rgba(255,255,255,0.6)', fontSize: 14, fontWeight: '600' },
  detailTabTextActive: { color: '#fff', fontWeight: '800' },
  detailCard: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 12 },
  detailCustomerRow: { flexDirection: 'row', alignItems: 'center', paddingBottom: 10,
    borderBottomWidth: 1, borderBottomColor: '#f0fdf4', marginBottom: 4 },
  detailAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fde68a',
    alignItems: 'center', justifyContent: 'center' },
  detailKHLabel: { color: '#64748b', fontSize: 13, marginBottom: 3 },
  detailKHName: { color: '#1e293b', fontWeight: '800', fontSize: 14 },
  detailKHSub: { color: '#64748b', fontSize: 13, marginTop: 2 },
  detailSectionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12,
    paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#f0fdf4' },
  detailSectionTitle: { color: C.primary, fontSize: 15, fontWeight: '800' },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingVertical: 6, flexWrap: 'wrap' },
  detailRowLabel: { color: '#64748b', fontSize: 13, marginRight: 8, flexShrink: 0 },
  detailRowValue: { color: '#1e293b', fontSize: 13, flex: 1, textAlign: 'right' },
  detailDivider: { height: 1, backgroundColor: '#f0fdf4', marginVertical: 8 },
  callBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#dcfce7',
    alignItems: 'center', justifyContent: 'center' },
  detailBottomBar: { padding: 14, backgroundColor: C.primary,
    borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.2)' },
  cancelBtn: { backgroundColor: C.danger, borderRadius: 12, paddingVertical: 16, alignItems: 'center' },
  cancelBtnText: { color: '#fff', fontSize: 16, fontWeight: '900', letterSpacing: 1 },
});
