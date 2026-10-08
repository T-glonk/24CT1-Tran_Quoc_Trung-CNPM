import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { INITIAL_CLUBS } from '../../constants/initialData';

export function BookingPaymentStep({
  user,
  activeClub = INITIAL_CLUBS[0],
  orderInfo = {},
  onBack,
  onDone,
}) {
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [receiptUploaded, setReceiptUploaded] = useState(false);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const minutes = Math.floor(countdown / 60)
    .toString()
    .padStart(2, '0');
  const seconds = (countdown % 60).toString().padStart(2, '0');
  const orderCode = 'BK' + Math.floor(1000 + Math.random() * 9000);

  const amount = orderInfo.grandTotal || orderInfo.totalPrice || 80000;
  const qrUrl = `https://img.vietqr.io/image/MB-0905591379-compact2.png?amount=${amount}&addInfo=QTSPORT%20${orderInfo.phone || '0905591379'}&accountName=TRAN%20QUOC%20TRUNG`;

  const bankInfo = {
    name: 'TRẦN QUỐC TRUNG (SUPER ADMIN)',
    bank: 'MB Bank (Ngân hàng Quân Đội)',
    account: '0905591379',
    branch: 'Chi nhánh Đà Nẵng',
  };

  const handleComplete = () => {
    onDone();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <View style={st.gridHeader}>
        <TouchableOpacity onPress={onBack} style={st.backBtn}>
          <Text style={{ color: '#fff', fontSize: 20 }}>←</Text>
        </TouchableOpacity>
        <Text style={st.gridHeaderTitle}>THANH TOÁN CHUYỂN KHOẢN QR</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Countdown Timer Bar */}
      <View style={st.countdownBar}>
        <Text style={st.countdownLabel}>Đơn giữ sân sẽ tự động hoàn tất trong:</Text>
        <Text style={[st.countdownTime, countdown < 120 && { color: '#ef4444' }]}>
          ⏱️ {minutes}:{seconds}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14, paddingBottom: 110 }}>
        {/* 1. Tóm tắt đơn đặt sân */}
        <View style={st.payCard}>
          <TouchableOpacity style={st.payCardHeader} onPress={() => setExpanded(!expanded)}>
            <View>
              <Text style={st.payCardTitle}>Chi tiết đơn đặt sân</Text>
              <Text style={st.payCardSubTitle}>{activeClub.name}</Text>
            </View>
            <Text style={{ color: '#059669', fontSize: 18, fontWeight: '900' }}>{expanded ? '▲' : '▼'}</Text>
          </TouchableOpacity>

          {expanded && (
            <View style={{ paddingTop: 10, borderTopWidth: 1, borderColor: '#f1f5f9', marginTop: 8 }}>
              <View style={st.payRow}>
                <Text style={st.payRowLabel}>👤 Người đặt:</Text>
                <Text style={st.payRowValue}>{orderInfo.name || user?.name || 'Khách đặt sân'}</Text>
              </View>
              <View style={st.payRow}>
                <Text style={st.payRowLabel}>📞 Số điện thoại:</Text>
                <Text style={st.payRowValue}>{orderInfo.phone || '0905591379'}</Text>
              </View>
              <View style={st.payRow}>
                <Text style={st.payRowLabel}>📅 Ngày chơi:</Text>
                <Text style={st.payRowValue}>{orderInfo.selectedDate || '28/08/2026'}</Text>
              </View>
              <View style={st.payRow}>
                <Text style={st.payRowLabel}>⏱️ Tổng thời lượng:</Text>
                <Text style={st.payRowValue}>{orderInfo.totalHours || 1} giờ</Text>
              </View>
              {orderInfo.servicesAdded && orderInfo.servicesAdded.length > 0 && (
                <View style={st.payRow}>
                  <Text style={st.payRowLabel}>🥤 Tiện ích thêm:</Text>
                  <Text style={st.payRowValue}>
                    {orderInfo.servicesAdded.map((s) => `${s.name} (x${s.qty})`).join(', ')}
                  </Text>
                </View>
              )}
              <View style={[st.payRow, { marginTop: 6, paddingTop: 6, borderTopWidth: 1, borderColor: '#f1f5f9' }]}>
                <Text style={[st.payRowLabel, { fontWeight: '800', color: '#0f172a' }]}>💰 TỔNG CỘNG:</Text>
                <Text style={st.payRowGrandTotal}>{amount.toLocaleString('vi-VN')} đ</Text>
              </View>
            </View>
          )}
        </View>

        {/* 2. Mã QR Thanh Toán VietQR */}
        <View style={st.qrCard}>
          <Text style={st.qrCardTitle}>QUÉT MÃ VIETQR ĐỂ THANH TOÁN</Text>
          <Text style={st.qrCardSub}>Hệ thống tự động nhận diện và kích hoạt vé ngay lập tức</Text>

          <View style={st.qrBox}>
            <Image
              source={{ uri: qrUrl }}
              style={{ width: 220, height: 220, borderRadius: 8 }}
              resizeMode="contain"
            />
          </View>

          <View style={st.bankInfoBox}>
            <View style={st.bankRow}>
              <Text style={st.bankLabel}>Ngân hàng:</Text>
              <Text style={st.bankVal}>{bankInfo.bank}</Text>
            </View>
            <View style={st.bankRow}>
              <Text style={st.bankLabel}>Số tài khoản:</Text>
              <Text style={[st.bankVal, { color: '#059669', fontSize: 15 }]}>{bankInfo.account}</Text>
            </View>
            <View style={st.bankRow}>
              <Text style={st.bankLabel}>Chủ tài khoản:</Text>
              <Text style={st.bankVal}>{bankInfo.name}</Text>
            </View>
            <View style={st.bankRow}>
              <Text style={st.bankLabel}>Số tiền:</Text>
              <Text style={[st.bankVal, { color: '#059669', fontWeight: '900' }]}>{amount.toLocaleString('vi-VN')} đ</Text>
            </View>
            <View style={st.bankRow}>
              <Text style={st.bankLabel}>Nội dung CK:</Text>
              <Text style={[st.bankVal, { color: '#d97706' }]}>QTSPORT {orderInfo.phone || '0905591379'}</Text>
            </View>
          </View>
        </View>

        {/* 3. Tùy chọn xác nhận bill */}
        <TouchableOpacity
          style={[st.receiptBtn, receiptUploaded && st.receiptBtnActive]}
          onPress={() => setReceiptUploaded(!receiptUploaded)}
        >
          <Text style={{ fontSize: 18, marginRight: 8 }}>{receiptUploaded ? '✅' : '📷'}</Text>
          <Text style={[st.receiptBtnText, receiptUploaded && { color: '#065f46' }]}>
            {receiptUploaded ? 'Đã tải ảnh hóa đơn giao dịch' : 'Chạm để đính kèm bill chuyển khoản'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={st.bottomBar}>
        <View style={{ flex: 1 }}>
          <Text style={st.bottomTotalLabel}>TỔNG TIỀN THANH TOÁN</Text>
          <Text style={st.bottomTotalVal}>{amount.toLocaleString('vi-VN')} đ</Text>
        </View>
        <TouchableOpacity style={st.confirmPayBtn} onPress={handleComplete}>
          <Text style={st.confirmPayBtnText}>HOÀN TẤT ĐẶT SÂN ✓</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  gridHeader: {
    backgroundColor: '#065f46',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  backBtn: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  gridHeaderTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  countdownBar: {
    backgroundColor: '#0f172a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  countdownLabel: { color: '#94a3b8', fontSize: 11 },
  countdownTime: { color: '#34d399', fontSize: 13, fontWeight: '900' },
  payCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  payCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  payCardTitle: { color: '#0f172a', fontSize: 14, fontWeight: '800' },
  payCardSubTitle: { color: '#059669', fontSize: 12, fontWeight: '700', marginTop: 2 },
  payRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  payRowLabel: { color: '#64748b', fontSize: 12 },
  payRowValue: { color: '#1e293b', fontSize: 12, fontWeight: '700' },
  payRowGrandTotal: { color: '#059669', fontSize: 16, fontWeight: '900' },
  qrCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  qrCardTitle: { color: '#064e3b', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
  qrCardSub: { color: '#64748b', fontSize: 11, textAlign: 'center', marginTop: 2, marginBottom: 12 },
  qrBox: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#059669',
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    marginBottom: 14,
  },
  bankInfoBox: {
    width: '100%',
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  bankRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
  },
  bankLabel: { color: '#64748b', fontSize: 11 },
  bankVal: { color: '#0f172a', fontSize: 12, fontWeight: '800' },
  receiptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#94a3b8',
    marginBottom: 12,
  },
  receiptBtnActive: {
    backgroundColor: '#ecfdf5',
    borderColor: '#059669',
  },
  receiptBtnText: { color: '#475569', fontSize: 12, fontWeight: '700' },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    padding: 12,
    paddingBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
    elevation: 8,
  },
  bottomTotalLabel: { color: '#64748b', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  bottomTotalVal: { color: '#059669', fontSize: 18, fontWeight: '900' },
  confirmPayBtn: {
    backgroundColor: '#059669',
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmPayBtnText: { color: '#fff', fontSize: 13, fontWeight: '900', letterSpacing: 0.5 },
});
