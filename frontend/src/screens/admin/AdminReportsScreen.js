import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';

export function AdminReportsScreen({ bookings = [], courts = [] }) {
  const activeCourts = courts.filter((c) => c.status === 'in_use').length;
  const occupancyRate = courts.length ? Math.round((activeCourts / courts.length) * 100) : 0;

  return (
    <ScrollView style={st.container} contentContainerStyle={{ padding: 14 }}>
      <Text style={st.headerTitle}>📊 Báo Cáo Doanh Thu & Công Suất Hoạt Động</Text>

      {/* 3 KPI Cards */}
      <View style={st.kpiRow}>
        <View style={st.kpiCard}>
          <Text style={st.kpiNum}>1.85M</Text>
          <Text style={st.kpiLabel}>Hôm nay</Text>
        </View>
        <View style={st.kpiCard}>
          <Text style={[st.kpiNum, { color: '#10b981' }]}>12.4M</Text>
          <Text style={st.kpiLabel}>Tuần này</Text>
        </View>
        <View style={st.kpiCard}>
          <Text style={[st.kpiNum, { color: '#0284c7' }]}>48.9M</Text>
          <Text style={st.kpiLabel}>Tháng này</Text>
        </View>
      </View>

      {/* Operational Metrics Card */}
      <View style={st.metricsCard}>
        <Text style={st.metricsTitle}>Công Suất Khai Thác Sân Hiện Tại</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <View style={st.progressBarTrack}>
            <View style={[st.progressBarFill, { width: `${occupancyRate}%` }]} />
          </View>
          <Text style={st.progressPercentText}>{occupancyRate}%</Text>
        </View>
        <Text style={st.metricsSub}>
          ● Đang sử dụng: {activeCourts}/{courts.length} Sân · {courts.length - activeCourts} Sân trống
        </Text>
      </View>

      {/* Summary table */}
      <View style={st.metricsCard}>
        <Text style={st.metricsTitle}>Thống Kê Đơn Đặt Sân</Text>
        <View style={st.row}>
          <Text style={st.rowLabel}>Tổng số đơn tiếp nhận:</Text>
          <Text style={st.rowVal}>{bookings.length} đơn</Text>
        </View>
        <View style={st.row}>
          <Text style={st.rowLabel}>Đơn đã duyệt & hoàn tất:</Text>
          <Text style={[st.rowVal, { color: '#16a34a' }]}>
            {bookings.filter((b) => b.status === 'confirmed' || b.status === 'completed' || b.status === 'in_use').length} đơn
          </Text>
        </View>
        <View style={st.row}>
          <Text style={st.rowLabel}>Đơn đã hủy:</Text>
          <Text style={[st.rowVal, { color: '#ef4444' }]}>
            {bookings.filter((b) => b.status === 'cancelled').length} đơn
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: AL.bg },
  headerTitle: { fontSize: 14, fontWeight: '800', color: AL.textDark, marginBottom: 12 },
  kpiRow: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  kpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AL.border,
  },
  kpiNum: { fontSize: 18, fontWeight: '900', color: AL.textDark },
  kpiLabel: { fontSize: 11, fontWeight: '700', color: AL.textSub, marginTop: 2 },
  metricsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: AL.border,
  },
  metricsTitle: { fontSize: 13, fontWeight: '800', color: AL.textDark },
  progressBarTrack: {
    flex: 1,
    height: 12,
    backgroundColor: '#e2e8f0',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: AL.primary,
    borderRadius: 6,
  },
  progressPercentText: { marginLeft: 10, fontSize: 13, fontWeight: '800', color: AL.primaryDark },
  metricsSub: { color: AL.textSub, fontSize: 11, marginTop: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6, borderBottomWidth: 1, borderColor: '#f1f5f9' },
  rowLabel: { color: AL.textSub, fontSize: 12 },
  rowVal: { color: AL.textDark, fontSize: 12, fontWeight: '800' },
});
