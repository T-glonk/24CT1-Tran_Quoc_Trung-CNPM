import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';

export function BookingPaymentStep({ user, orderInfo, onBack, onDone }) {
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [imageUploaded, setImageUploaded] = useState(false);
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
  const orderCode = '#BK-' + Math.floor(1000 + Math.random() * 9000);

  const bankInfo = {
    name: 'CLB CẦU LÔNG TPT SPORT',
    bank: 'MB Bank (Ngân hàng Quân Đội)',
    account: '0905591379',
  };

  const handleComplete = () => {
    if (!imageUploaded) {
      Alert.alert('Lưu ý', 'Vui lòng xác nhận tải ảnh bill chuyển khoản trước khi hoàn tất');
      return;
    }
    onDone();
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f0fdf4' }}>
      {/* Header */}
      <View style={st.gridHeader}>
        <TouchableOpacity onPress={onBack} style={{ padding: 8 }}>
          <Text style={{ color: '#fff', fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <Text style={st.gridHeaderTitle}>THANH TOÁN ĐƠN ĐẶT SÂN</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Countdown Timer Bar */}
      <View style={st.countdownBar}>
        <Text style={st.countdownLabel}>Đơn giữ chỗ tự động sẽ hết hạn trong:</Text>
        <Text style={[st.countdownTime, countdown < 60 && { color: '#fef08a' }]}>
          ⏱️ {minutes}:{seconds}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 14 }}>
        {/* Order Details Card */}
        <View style={st.payCard}>
          <TouchableOpacity style={st.payCardHeader} onPress={() => setExpanded(!expanded)}>
            <Text style={st.payCardTitle}>Thông tin lịch đặt</Text>
            <Text style={{ color: C.primary, fontSize: 18 }}>{expanded ? '∧' : '∨'}</Text>
          </TouchableOpacity>
          {expanded && (
            <View style={{ paddingTop: 8 }}>
              {[
                { icon: '👤', label: 'Tên người đặt', value: orderInfo.name },
                { icon: '📞', label: 'Số điện thoại', value: orderInfo.phone },
                { icon: '🏆', label: 'Mã đơn giữ chỗ', value: orderCode },
                { icon: '💰', label: 'Tổng tiền sân', value: `${orderInfo.totalPrice.toLocaleString('vi-VN')} đ` },
              ].map((row) => (
                <View key={row.label} style={st.payRow}>
                  <View style={st.payRowIcon}>
                    <Text style={{ fontSize: 16 }}>{row.icon}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={st.payRowLabel}>{row.label}</Text>
                    <Text style={st.payRowValue}>{row.value}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bank Transfer QR Card */}
        <Text style={st.sectionHeading}>Phương thức thanh toán: Chuyển khoản QR</Text>
        <View style={st.bankCard}>
          <View style={st.qrBox}>
            <Text style={st.qrMock}>▪▪▪{'\n'}▪ 🏸 ▪{'\n'}▪▪▪</Text>
          </View>
          <View style={{ flex: 1, paddingLeft: 12 }}>
            <Text style={st.bankName}>{bankInfo.name}</Text>
            <Text style={st.bankDetail}>STK: {bankInfo.account}</Text>
            <Text style={st.bankDetail}>{bankInfo.bank}</Text>
          </View>
        </View>

        {/* Upload Receipt Bill */}
        <Text style={st.formFieldLabel}>Ảnh hóa đơn chuyển khoản (Bắt buộc) *</Text>
        <TouchableOpacity
          style={[st.uploadBox, imageUploaded && { borderColor: C.primary, backgroundColor: '#f0fdf4' }]}
          onPress={() => {
            setImageUploaded(true);
            Alert.alert('✅', 'Đã đính kèm ảnh xác nhận chuyển khoản!');
          }}
        >
          {imageUploaded ? (
            <>
              <Text style={{ fontSize: 36, color: C.primary }}>✅</Text>
              <Text style={{ color: C.primary, fontSize: 14, fontWeight: '800', marginTop: 6 }}>
                Đã tải ảnh biên lai thành công
              </Text>
            </>
          ) : (
            <>
              <Text style={{ fontSize: 36, color: C.primary }}>📸</Text>
              <Text style={{ color: C.primary, fontSize: 14, fontWeight: '800', marginTop: 6 }}>
                Chạm để tải ảnh chuyển khoản
              </Text>
              <Text style={{ color: '#94a3b8', fontSize: 11, marginTop: 2 }}>
                Hỗ trợ PNG, JPG, Biên lai ngân hàng
              </Text>
            </>
          )}
        </TouchableOpacity>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Complete Button */}
      <View style={st.confirmBottomBar}>
        <TouchableOpacity style={st.confirmPayBtn} onPress={handleComplete}>
          <Text style={st.confirmPayBtnText}>HOÀN TẤT & ĐẶT SÂN</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  gridHeader: {
    backgroundColor: C.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  gridHeaderTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '800',
    flex: 1,
    textAlign: 'center',
  },
  countdownBar: {
    backgroundColor: '#15803d',
    paddingVertical: 10,
    alignItems: 'center',
  },
  countdownLabel: { color: '#dcfce7', fontSize: 12 },
  countdownTime: { color: '#ffffff', fontSize: 22, fontWeight: '900', marginTop: 2 },
  payCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  payCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0fdf4',
  },
  payCardTitle: { color: '#1e293b', fontSize: 14, fontWeight: '800' },
  payRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  payRowIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#dcfce7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  payRowLabel: { color: '#64748b', fontSize: 12 },
  payRowValue: { color: '#1e293b', fontSize: 13, fontWeight: '700' },
  sectionHeading: {
    color: '#0f172a',
    fontSize: 13,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 6,
  },
  bankCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 12,
  },
  qrBox: {
    width: 60,
    height: 60,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  qrMock: { fontSize: 16, textAlign: 'center', color: '#1e293b' },
  bankName: { color: '#1e293b', fontSize: 13, fontWeight: '800' },
  bankDetail: { color: '#64748b', fontSize: 12, marginTop: 2 },
  formFieldLabel: {
    color: '#374151',
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 6,
    marginTop: 4,
  },
  uploadBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: C.primary,
    borderStyle: 'dashed',
    paddingVertical: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  confirmBottomBar: {
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
  },
  confirmPayBtn: {
    backgroundColor: C.warning,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  confirmPayBtnText: {
    color: '#1e293b',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
