import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';

export function AdminTransactionsScreen({ transactions = [] }) {
  const totalRevenue = transactions
    .filter((t) => t.status === 'completed')
    .reduce((sum, t) => sum + (t.amount || 0), 0);

  return (
    <ScrollView style={st.container} contentContainerStyle={{ padding: 14 }}>
      {/* KPI Balance Card */}
      <View style={st.balanceCard}>
        <Text style={st.balanceLabel}>Tổng Dòng Tiền Ca Trực Hiện Tại</Text>
        <Text style={st.balanceNum}>{totalRevenue.toLocaleString('vi-VN')} VNĐ</Text>
        <Text style={st.balanceSub}>● {transactions.length} Giao dịch đã ghi nhận</Text>
      </View>

      <Text style={st.sectionHeading}>Chi Tiết Sổ Quỹ Thu Chi</Text>
      {transactions.map((t) => {
        const isRefund = t.status === 'refunded';
        return (
          <View key={t.id} style={st.txnCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={st.customerText}>
                👤 {t.customerName} ({t.method})
              </Text>
              <Text style={[st.amountText, isRefund && { color: '#ef4444' }]}>
                {isRefund ? '-' : '+'}{t.amount.toLocaleString('vi-VN')} đ
              </Text>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
              <Text style={st.codeText}>Mã GD: {t.id} {t.ref ? `· Ref: ${t.ref}` : ''}</Text>
              <Text style={st.timeText}>⏰ {t.time}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: AL.bg },
  balanceCard: {
    backgroundColor: AL.headerBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
  },
  balanceLabel: { color: '#dcfce7', fontSize: 12, fontWeight: '700' },
  balanceNum: { color: '#ffffff', fontSize: 24, fontWeight: '900', marginTop: 4 },
  balanceSub: { color: '#facc15', fontSize: 11, fontWeight: '700', marginTop: 4 },
  sectionHeading: { fontSize: 13, fontWeight: '800', color: AL.textDark, marginBottom: 8 },
  txnCard: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: AL.border,
  },
  customerText: { fontWeight: '800', color: AL.textDark, fontSize: 13 },
  amountText: { color: AL.primaryDark, fontWeight: '800', fontSize: 14 },
  codeText: { color: AL.textSub, fontSize: 11 },
  timeText: { color: AL.textSub, fontSize: 11 },
});
