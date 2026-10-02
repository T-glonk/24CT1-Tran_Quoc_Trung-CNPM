import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { COLORS as C } from '../constants/theme';

export const CUSTOMER_TABS = [
  { key: 'home', label: 'Trang chủ', icon: '🏠' },
  { key: 'mapTab', label: 'Bản đồ', icon: '🗺️' },
  { key: 'booking', label: 'Khám phá', icon: '📋', center: true },
  { key: 'explore', label: 'Nổi bật', icon: '⭐' },
  { key: 'account', label: 'Tài khoản', icon: '👤' },
];

export const ADMIN_TABS = [
  { key: 'adminHome', label: 'Trang Chủ', icon: '🏠' },
  { key: 'adminSchedule', label: 'Đặt lịch', icon: '📅' },
  { key: 'adminBookings', label: 'Duyệt đơn', icon: '📋', badge: 37 },
  { key: 'adminServices', label: 'Bán hàng', icon: '🥤' },
  { key: 'adminCustomers', label: 'Hội viên', icon: '👥' },
];

export function BottomTabBar({ screen, navigate, isAdmin }) {
  const tabs = isAdmin ? ADMIN_TABS : CUSTOMER_TABS;

  return (
    <View style={[st.tabBar, isAdmin && st.aloboTabBar]}>
      {tabs.map((tab) => {
        const active = screen === tab.key;
        if (tab.center) {
          return (
            <TouchableOpacity
              key={tab.key}
              style={st.tabItemCenter}
              onPress={() => navigate(tab.key)}
              activeOpacity={0.8}
            >
              <View style={[st.centerCircle, active && st.centerCircleActive]}>
                <Text style={{ fontSize: 22 }}>{tab.icon}</Text>
              </View>
              <Text style={[st.tabLabel, active && st.tabLabelActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        }
        return (
          <TouchableOpacity
            key={tab.key}
            style={st.tabItem}
            onPress={() => navigate(tab.key)}
            activeOpacity={0.8}
          >
            <View>
              <Text
                style={[
                  st.tabIcon,
                  active && (isAdmin ? st.aloboTabIconActive : st.tabIconActive),
                ]}
              >
                {tab.icon}
              </Text>
              {tab.badge ? (
                <View style={st.tabBadgeCircle}>
                  <Text style={st.tabBadgeText}>{tab.badge}</Text>
                </View>
              ) : null}
            </View>
            <Text
              style={[
                st.tabLabel,
                isAdmin && st.aloboTabLabel,
                active && (isAdmin ? st.aloboTabLabelActive : st.tabLabelActive),
              ]}
            >
              {tab.label}
            </Text>
            {active && <View style={[st.tabDot, isAdmin && { backgroundColor: '#facc15' }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const st = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderTopWidth: 1,
    borderTopColor: C.border,
    paddingBottom: Platform.OS === 'ios' ? 20 : 8,
    paddingTop: 8,
    alignItems: 'center',
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabIcon: { fontSize: 20, marginBottom: 2 },
  tabIconActive: { transform: [{ scale: 1.15 }] },
  tabLabel: { fontSize: 10, color: C.sub, fontWeight: '600' },
  tabLabelActive: { color: C.primary, fontWeight: '800' },
  tabDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: C.primary, marginTop: 2 },
  tabItemCenter: { flex: 1, alignItems: 'center', top: -14 },
  centerCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: C.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: C.bg,
  },
  centerCircleActive: { backgroundColor: C.primaryDark },
  // Alobo Tab Bar Theme
  aloboTabBar: {
    backgroundColor: '#0f5132',
    borderTopWidth: 1,
    borderTopColor: '#14532d',
  },
  aloboTabLabel: {
    color: '#86efac',
    fontWeight: '700',
  },
  aloboTabLabelActive: {
    color: '#facc15',
    fontWeight: '900',
  },
  aloboTabIconActive: {
    transform: [{ scale: 1.15 }],
  },
  tabBadgeCircle: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: '#ef4444',
    borderRadius: 9,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderWidth: 1.5,
    borderColor: '#0f5132',
  },
  tabBadgeText: {
    color: '#ffffff',
    fontSize: 9,
    fontWeight: '900',
  },
});
