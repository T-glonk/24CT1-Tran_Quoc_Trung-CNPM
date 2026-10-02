import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { ALOBO_THEME as AL } from '../../constants/theme';

export function AdminCustomersScreen({ users = [], bookings = [] }) {
  const [search, setSearch] = useState('');

  const MEMBERS = [
    {
      id: 'm1',
      name: 'Bùi Ngọc Hân',
      phone: '+84 567 567 234',
      status: 'Hết hạn',
      statusColor: '#ef4444',
      statusBg: '#fee2e2',
      spent: '10.000.000 đ',
      debt: '10.000.000 đ',
      package: 'Gói hội viên VIP VUI VẺ Tháng 10',
      expire: '01/10/2025 - 31/10/2025',
    },
    {
      id: 'm2',
      name: 'Bùi Ngọc Diệp',
      phone: '+84 567 567 234',
      status: 'Sắp hết hạn',
      statusColor: '#f59e0b',
      statusBg: '#fef3c7',
      spent: '10.000.000 đ',
      debt: '10.000.000 đ',
      package: 'Gói hội viên VIP VUI VẺ Tháng 10',
      expire: '01/10/2025 - 31/10/2025',
    },
    {
      id: 'm3',
      name: 'Hoàng Thanh Hằng',
      phone: '+84 567 567 234',
      status: 'Đang hoạt động',
      statusColor: '#10b981',
      statusBg: '#dcfce7',
      spent: '10.000.000 đ',
      debt: '10.000.000 đ',
      package: 'Gói hội viên Vàng - Cầu lông 6 tháng',
      expire: '01/01/2026 - 30/06/2026',
    },
    {
      id: 'm4',
      name: 'Trung Quốc (Khách VIP)',
      phone: '0905 591 379',
      status: 'Đang hoạt động',
      statusColor: '#10b981',
      statusBg: '#dcfce7',
      spent: '2.850.000 đ',
      debt: '0 đ',
      package: 'Thẻ Hội Viên Kim Cương Thường Niên',
      expire: '01/01/2026 - 31/12/2026',
    },
  ];

  const filtered = search.trim()
    ? MEMBERS.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.phone.includes(search))
    : MEMBERS;

  return (
    <View style={st.container}>
      {/* 4 Top Pills */}
      <View style={st.memberTopIconsRow}>
        {[
          { icon: '👑', label: 'Chương trình\nhội viên' },
          { icon: '📦', label: 'Gói\nhội viên' },
          { icon: '💳', label: 'Thẻ\nhội viên' },
          { icon: '🕒', label: 'Báo cáo\nthống kê' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={st.memberTopPill}>
            <Text style={{ fontSize: 20, marginBottom: 2 }}>{item.icon}</Text>
            <Text style={st.memberTopPillText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search Row */}
      <View style={st.memberSearchRow}>
        <View style={st.memberSearchInputBox}>
          <Text style={{ fontSize: 16, marginRight: 6 }}>🔍</Text>
          <TextInput
            style={{ flex: 1, fontSize: 13, color: '#0f172a' }}
            placeholder="Tìm kiếm hội viên theo tên, SĐT..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={st.memberToolBtn}>
          <Text style={{ fontSize: 16 }}>☰</Text>
        </TouchableOpacity>
        <TouchableOpacity style={st.memberToolBtn}>
          <Text style={{ fontSize: 16 }}>⇅</Text>
        </TouchableOpacity>
      </View>

      {/* 4 KPI Cards */}
      <View style={st.memberKpiGrid}>
        <View style={st.memberKpiCard}>
          <Text style={[st.memberKpiNum, { color: '#0f172a' }]}>120</Text>
          <Text style={st.memberKpiLabel}>Tổng thẻ</Text>
        </View>
        <View style={st.memberKpiCard}>
          <Text style={[st.memberKpiNum, { color: '#10b981' }]}>70</Text>
          <Text style={st.memberKpiLabel}>● Hoạt động</Text>
        </View>
        <View style={st.memberKpiCard}>
          <Text style={[st.memberKpiNum, { color: '#0284c7' }]}>7</Text>
          <Text style={st.memberKpiLabel}>● Gia hạn</Text>
        </View>
        <View style={st.memberKpiCard}>
          <Text style={[st.memberKpiNum, { color: '#f59e0b' }]}>32</Text>
          <Text style={st.memberKpiLabel}>● Sắp hết</Text>
        </View>
      </View>

      {/* Members List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12, paddingBottom: 60 }}
        renderItem={({ item }) => (
          <View style={st.memberItemCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={st.memberAvatarCircle}>
                  <Text style={{ fontSize: 18 }}>👩</Text>
                </View>
                <View style={{ marginLeft: 8 }}>
                  <Text style={st.memberNameText}>{item.name}</Text>
                  <Text style={st.memberPhoneText}>📞 {item.phone}</Text>
                </View>
              </View>

              <View style={[st.memberStatusPill, { backgroundColor: item.statusBg }]}>
                <Text style={[st.memberStatusPillText, { color: item.statusColor }]}>
                  ● {item.status}
                </Text>
              </View>
            </View>

            {/* Financial Numbers */}
            <View style={st.memberFinanceRow}>
              <View style={st.memberFinanceBox}>
                <Text style={{ color: '#10b981', fontSize: 11, fontWeight: '700' }}>
                  📈 Đã chi: {item.spent}
                </Text>
              </View>
              <View style={st.memberFinanceBox}>
                <Text style={{ color: '#ef4444', fontSize: 11, fontWeight: '700' }}>
                  ⚠️ Dư nợ: {item.debt}
                </Text>
              </View>
            </View>

            {/* Package & Renew Button */}
            <View style={st.memberPackageBox}>
              <View style={{ flex: 1 }}>
                <Text style={st.memberPackageTitle} numberOfLines={1}>
                  📦 {item.package}
                </Text>
                <Text style={st.memberPackageTime}>Hạn: {item.expire}</Text>
              </View>
              <TouchableOpacity
                style={st.memberRenewBtn}
                onPress={() => Alert.alert('Gia hạn thẻ', `Gia hạn thẻ thành viên cho ${item.name}`)}
              >
                <Text style={st.memberRenewBtnText}>Gia hạn</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const st = StyleSheet.create({
  container: { flex: 1, backgroundColor: AL.bg },
  memberTopIconsRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    padding: 10,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: AL.border,
  },
  memberTopPill: { alignItems: 'center', flex: 1 },
  memberTopPillText: { fontSize: 10, fontWeight: '700', color: AL.textDark, textAlign: 'center' },
  memberSearchRow: { flexDirection: 'row', padding: 10, gap: 6 },
  memberSearchInputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 38,
    borderWidth: 1,
    borderColor: AL.border,
  },
  memberToolBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AL.border,
  },
  memberKpiGrid: { flexDirection: 'row', paddingHorizontal: 10, gap: 6 },
  memberKpiCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AL.border,
  },
  memberKpiNum: { fontSize: 16, fontWeight: '900' },
  memberKpiLabel: { fontSize: 9, fontWeight: '700', color: AL.textSub, marginTop: 2 },
  memberItemCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: AL.border,
  },
  memberAvatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberNameText: { color: AL.textDark, fontSize: 13, fontWeight: '800' },
  memberPhoneText: { color: AL.textSub, fontSize: 11 },
  memberStatusPill: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2 },
  memberStatusPillText: { fontSize: 10, fontWeight: '800' },
  memberFinanceRow: { flexDirection: 'row', gap: 8, marginVertical: 8 },
  memberFinanceBox: { flex: 1, backgroundColor: '#f8fafc', borderRadius: 8, padding: 6, alignItems: 'center' },
  memberPackageBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeb',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#fef3c7',
  },
  memberPackageTitle: { color: '#b45309', fontSize: 11, fontWeight: '800' },
  memberPackageTime: { color: '#92400e', fontSize: 10, marginTop: 2 },
  memberRenewBtn: { backgroundColor: '#14532d', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 6 },
  memberRenewBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
