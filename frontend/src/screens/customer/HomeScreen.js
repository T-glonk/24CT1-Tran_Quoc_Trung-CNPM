import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { CLUBS } from '../../constants/initialData';
import { MiniMapWidget } from '../../components/map/MiniMapWidget';

export function HomeScreen({ user, navigate, bookings, favorites, onToggleFavorite }) {
  const [search, setSearch] = useState('');
  const today = new Date();
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const filtered = search.trim()
    ? CLUBS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : CLUBS;

  return (
    <ScrollView style={st.screen} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={st.topHeader}>
        <View style={st.topHeaderLeft}>
          <View style={st.avatarGreen}>
            <Text style={{ fontSize: 18 }}>🏸</Text>
          </View>
          <View style={{ marginLeft: 10 }}>
            <Text style={st.dateText}>{dateStr}</Text>
            <Text style={st.userNameTop}>{user?.name || 'Khách hàng'}</Text>
          </View>
        </View>
        <View style={st.topHeaderRight}>
          <TouchableOpacity style={st.iconBtn}>
            <Text style={{ fontSize: 20 }}>🚩</Text>
          </TouchableOpacity>
          <TouchableOpacity style={st.iconBtn}>
            <Text style={{ fontSize: 20 }}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={st.searchRow}>
        <View style={st.searchBox}>
          <Text style={st.searchIcon}>🔍</Text>
          <TextInput
            style={st.searchInput}
            placeholder="Tìm kiếm sân, CLB..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: '#94a3b8', fontSize: 18, paddingRight: 10 }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        <TouchableOpacity style={st.filterIconBtn}>
          <Text style={{ fontSize: 18 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Nav Ribbon */}
      <View style={st.quickNav}>
        {[
          { icon: '🗺️', label: 'Bản đồ', screen: 'mapTab' },
          {
            icon: '📅',
            label: 'Sân đã đặt',
            screen: 'myBookings',
            count: bookings.filter((b) => b.userId === user?.id).length,
          },
          { icon: '❤️', label: 'Yêu thích', screen: 'favorites' },
        ].map((item) => (
          <TouchableOpacity
            key={item.label}
            style={st.quickNavItem}
            onPress={() => navigate(item.screen)}
          >
            <View style={{ position: 'relative' }}>
              <Text style={st.quickNavIcon}>{item.icon}</Text>
              {item.count > 0 && (
                <View style={st.navBadge}>
                  <Text style={st.navBadgeText}>{item.count}</Text>
                </View>
              )}
            </View>
            <Text style={st.quickNavLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Banner */}
      <View style={st.banner}>
        <View style={{ flex: 1 }}>
          <Text style={st.bannerBrand}>NACHI</Text>
          <Text style={st.bannerAcademy}>BADMINTON COURT</Text>
          <Text style={st.bannerSub}>Hệ thống sân tập & thi đấu chuẩn BWF tại Đà Nẵng</Text>
        </View>
        <Text style={{ fontSize: 48 }}>🏸</Text>
      </View>

      {/* Mini Map Widget */}
      <MiniMapWidget onExpand={() => navigate('mapTab')} />

      {/* Clubs List Heading */}
      <Text style={st.sectionTitle}>Danh Sách Câu Lạc Bộ Cầu Lông</Text>

      {filtered.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={st.clubCard}
          onPress={() => navigate('booking')}
          activeOpacity={0.8}
        >
          <View style={st.clubCardImg}>
            <Text style={{ fontSize: 32 }}>🏸</Text>
          </View>
          <View style={st.clubCardBody}>
            <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
              {item.tag.map((t) => (
                <View
                  key={t}
                  style={[
                    st.tagBadge,
                    { backgroundColor: t === 'Sự kiện' ? '#7c3aed' : C.primary },
                  ]}
                >
                  <Text style={st.tagText}>{t}</Text>
                </View>
              ))}
            </View>
            <Text style={st.clubName}>{item.name}</Text>
            <Text style={st.clubAddr} numberOfLines={1}>
              📍 {item.address}
            </Text>
            <Text style={st.clubOpen}>⏰ {item.open}</Text>
            <Text style={st.clubPrice}>💰 {item.priceRange}</Text>
          </View>
          <View style={st.clubCardActions}>
            <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
              <Text style={{ fontSize: 20 }}>{favorites.includes(item.id) ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: C.warning, fontSize: 11, fontWeight: '800' }}>
                ⭐ {item.rating}
              </Text>
              <TouchableOpacity
                style={st.bookSmallBtn}
                onPress={() => navigate('booking')}
              >
                <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>ĐẶT SÂN</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const st = StyleSheet.create({
  screen: { flex: 1, backgroundColor: C.bg },
  topHeader: {
    backgroundColor: C.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  topHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  topHeaderRight: { flexDirection: 'row', gap: 8 },
  avatarGreen: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateText: { color: 'rgba(255,255,255,0.85)', fontSize: 12 },
  userNameTop: { color: '#fff', fontSize: 16, fontWeight: '700' },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: C.primaryDark,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, color: '#1e293b', fontSize: 14 },
  filterIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickNav: {
    flexDirection: 'row',
    backgroundColor: C.primaryDark,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  quickNavItem: { flex: 1, alignItems: 'center', gap: 4 },
  quickNavIcon: { fontSize: 22 },
  quickNavLabel: { color: '#fff', fontSize: 12, fontWeight: '600' },
  navBadge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: C.danger,
    borderRadius: 8,
    paddingHorizontal: 4,
    minWidth: 16,
    alignItems: 'center',
  },
  navBadgeText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  banner: {
    margin: 12,
    borderRadius: 14,
    backgroundColor: '#15803d',
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  bannerBrand: { color: '#fff', fontSize: 20, fontWeight: '900' },
  bannerAcademy: { color: '#facc15', fontSize: 22, fontWeight: '900' },
  bannerSub: { color: '#dcfce7', fontSize: 11, marginTop: 4, lineHeight: 16 },
  sectionTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: '700',
    marginHorizontal: 14,
    marginTop: 10,
    marginBottom: 8,
  },
  clubCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  clubCardImg: {
    width: 80,
    backgroundColor: '#166534',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubCardBody: { flex: 1, padding: 10 },
  clubCardActions: { padding: 10, alignItems: 'center', justifyContent: 'space-between' },
  clubName: { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 3 },
  clubAddr: { color: C.sub, fontSize: 12, marginBottom: 2 },
  clubOpen: { color: C.sub, fontSize: 11 },
  clubPrice: { color: C.accent, fontSize: 11, fontWeight: '700', marginTop: 2 },
  tagBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  bookSmallBtn: {
    backgroundColor: C.primary,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 5,
    marginTop: 6,
  },
});
