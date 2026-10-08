import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { APP_ASSETS } from '../../constants/assets';
import { CLUBS } from '../../constants/initialData';
import { MiniMapWidget } from '../../components/map/MiniMapWidget';

export function HomeScreen({ user, navigate, clubs = CLUBS, bookings = [], favorites = [], onToggleFavorite, onSelectClub }) {
  const [search, setSearch] = useState('');
  const today = new Date();
  const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  const dateStr = `${days[today.getDay()]}, ${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const filtered = search.trim()
    ? clubs.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || (c.address && c.address.toLowerCase().includes(search.toLowerCase())))
    : clubs;

  return (
    <ScrollView style={st.screen} showsVerticalScrollIndicator={false}>
      {/* Top Header */}
      <View style={st.topHeader}>
        <View style={st.topHeaderLeft}>
          <Image
            source={APP_ASSETS.logo}
            style={st.avatarGreen}
            resizeMode="contain"
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={st.dateText}>QT SPORT · {dateStr}</Text>
            <Text style={st.userNameTop}>{user?.name || 'Khách hàng'}</Text>
          </View>
        </View>
        <View style={st.topHeaderRight}>
          <TouchableOpacity style={st.iconBtn} onPress={() => navigate('mapTab')}>
            <Text style={{ fontSize: 18 }}>📍</Text>
          </TouchableOpacity>
          <TouchableOpacity style={st.iconBtn} onPress={() => navigate('myBookings')}>
            <Text style={{ fontSize: 18 }}>🔔</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={st.searchRow}>
        <View style={st.searchBox}>
          <Text style={st.searchIcon}>🔍</Text>
          <TextInput
            style={st.searchInput}
            placeholder="Tìm theo cơ sở, quận, tên sân..."
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
        <TouchableOpacity style={st.filterIconBtn} onPress={() => navigate('explore')}>
          <Text style={{ fontSize: 18 }}>⚡</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Nav Ribbon */}
      <View style={st.quickNav}>
        {[
          { icon: '🏸', label: 'Đặt sân nhanh', screen: 'booking' },
          { icon: '🗺️', label: 'Bản đồ sân', screen: 'mapTab' },
          {
            icon: '📅',
            label: 'Lịch của tôi',
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
          <View style={st.badgePill}>
            <Text style={st.badgePillText}>⭐ HỆ THỐNG SÂN CHUẨN THI ĐẤU</Text>
          </View>
          <Text style={st.bannerBrand}>ALOBO SPORT</Text>
          <Text style={st.bannerAcademy}>HỆ THỐNG QT SPORT (CƠ SỞ 1 - 8)</Text>
          <Text style={st.bannerSub}>Thảm BWF tiêu chuẩn quốc tế • Đặt lịch linh hoạt 24/7</Text>
        </View>
      </View>

      {/* Mini Map Widget */}
      <MiniMapWidget onExpand={() => navigate('mapTab')} />

      {/* Clubs List Heading */}
      <View style={st.sectionHeaderRow}>
        <Text style={st.sectionTitle}>Hệ Thống Cơ Sở QT Sport ({filtered.length})</Text>
        <TouchableOpacity onPress={() => navigate('explore')}>
          <Text style={st.viewAllText}>Xem tất cả →</Text>
        </TouchableOpacity>
      </View>

      {filtered.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={st.clubCard}
          onPress={() => onSelectClub ? onSelectClub(item) : navigate('booking')}
          activeOpacity={0.85}
        >
          <View style={st.clubCardImg}>
            <Text style={{ fontSize: 36 }}>🏸</Text>
            <View style={st.courtCountBadge}>
              <Text style={st.courtCountText}>{item.totalCourts || 6} SÂN</Text>
            </View>
          </View>
          <View style={st.clubCardBody}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 4 }}>
              {(item.tag || ['Chuẩn BWF']).map((t) => (
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
            <Text style={st.clubAddr} numberOfLines={2}>
              📍 {item.address}
            </Text>
            <View style={st.metaRow}>
              <Text style={st.clubOpen}>⏰ {item.open}</Text>
              <Text style={st.ratingTag}>⭐ {item.rating} ({item.reviewsCount || 80})</Text>
            </View>
            <Text style={st.clubPrice}>💰 {item.priceRange || '60.000đ - 120.000đ/h'}</Text>
          </View>
          <View style={st.clubCardActions}>
            <TouchableOpacity onPress={() => onToggleFavorite(item.id)} style={st.favBtn}>
              <Text style={{ fontSize: 22 }}>{favorites.includes(item.id) ? '❤️' : '🤍'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={st.bookSmallBtn}
              onPress={() => onSelectClub ? onSelectClub(item) : navigate('booking')}
            >
              <Text style={st.bookSmallBtnText}>ĐẶT SÂN</Text>
            </TouchableOpacity>
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
    borderRadius: 16,
    backgroundColor: '#065f46',
    flexDirection: 'row',
    padding: 18,
    alignItems: 'center',
  },
  badgePill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  badgePillText: { color: '#fef08a', fontSize: 10, fontWeight: '800' },
  bannerBrand: { color: '#fff', fontSize: 18, fontWeight: '900', letterSpacing: 0.5 },
  bannerAcademy: { color: '#34d399', fontSize: 16, fontWeight: '900', marginTop: 2 },
  bannerSub: { color: '#d1fae5', fontSize: 11, marginTop: 4, lineHeight: 16 },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    color: C.text,
    fontSize: 15,
    fontWeight: '800',
  },
  viewAllText: {
    color: C.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  clubCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  clubCardImg: {
    width: 85,
    backgroundColor: '#064e3b',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  courtCountBadge: {
    position: 'absolute',
    bottom: 6,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  courtCountText: { color: '#fff', fontSize: 9, fontWeight: '800' },
  clubCardBody: { flex: 1, padding: 12 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 4, marginBottom: 4 },
  ratingTag: { color: '#d97706', fontSize: 11, fontWeight: '700' },
  clubCardActions: { padding: 12, alignItems: 'center', justifyContent: 'space-between' },
  favBtn: { padding: 4 },
  clubName: { color: C.text, fontSize: 14, fontWeight: '800', marginBottom: 3 },
  clubAddr: { color: '#64748b', fontSize: 12, lineHeight: 16, marginBottom: 2 },
  clubOpen: { color: '#64748b', fontSize: 11 },
  clubPrice: { color: C.primary, fontSize: 12, fontWeight: '800', marginTop: 2 },
  tagBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { color: '#fff', fontSize: 9, fontWeight: '700' },
  bookSmallBtn: {
    backgroundColor: C.primary,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginTop: 6,
  },
  bookSmallBtnText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
