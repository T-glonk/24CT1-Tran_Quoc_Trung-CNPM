import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { CLUBS } from '../../constants/initialData';

export function MiniMapWidget({ onExpand, selectedClubId }) {
  const selectedClub = CLUBS.find(c => c.id === selectedClubId) || CLUBS[0];

  return (
    <View style={st.card}>
      <View style={st.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 18 }}>🗺️</Text>
          <Text style={st.title}>Bản Đồ Sân Cầu Lông</Text>
        </View>
        <TouchableOpacity style={st.expandBtn} onPress={onExpand}>
          <Text style={st.expandBtnText}>Mở toàn màn hình ↗</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={st.mapPreview} onPress={onExpand} activeOpacity={0.9}>
        <View style={st.mockMapBg}>
          <Text style={{ fontSize: 36 }}>📍</Text>
          <Text style={st.mapHintText}>Đà Nẵng · {CLUBS.length} CLB Cầu Lông Tiêu Chuẩn</Text>
          <View style={st.tapOverlay}>
            <Text style={st.tapText}>Chạm để xem bản đồ tương tác</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={st.footer}>
        <Text style={st.selectedClubName}>📍 {selectedClub.name}</Text>
        <Text style={st.selectedClubAddr} numberOfLines={1}>{selectedClub.address}</Text>
      </View>
    </View>
  );
}

const st = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    marginHorizontal: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  title: {
    color: '#0f172a',
    fontSize: 14,
    fontWeight: '800',
  },
  expandBtn: {
    backgroundColor: '#dcfce7',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  expandBtnText: {
    color: '#15803d',
    fontSize: 11,
    fontWeight: '700',
  },
  mapPreview: {
    height: 120,
    backgroundColor: '#0f172a',
  },
  mockMapBg: {
    flex: 1,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapHintText: {
    color: '#94a3b8',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  tapOverlay: {
    marginTop: 6,
    backgroundColor: 'rgba(22, 163, 74, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  tapText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '800',
  },
  footer: {
    padding: 10,
    backgroundColor: '#f8fafc',
  },
  selectedClubName: {
    color: '#0f172a',
    fontSize: 12,
    fontWeight: '800',
  },
  selectedClubAddr: {
    color: '#64748b',
    fontSize: 11,
    marginTop: 2,
  },
});
