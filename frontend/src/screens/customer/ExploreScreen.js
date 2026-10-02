import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  StyleSheet,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { CLUBS } from '../../constants/initialData';

export function ExploreScreen({ navigate, favorites, onToggleFavorite }) {
  const [search, setSearch] = useState('');
  const filtered = search.trim()
    ? CLUBS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : CLUBS;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      {/* Search Header */}
      <View style={st.exploreSearchRow}>
        <TouchableOpacity onPress={() => navigate('home')} style={{ padding: 8 }}>
          <Text style={{ color: C.accent, fontSize: 22 }}>←</Text>
        </TouchableOpacity>
        <View style={[st.searchBox, { flex: 1 }]}>
          <Text style={st.searchIcon}>🔍</Text>
          <TextInput
            style={st.searchInput}
            placeholder="Tìm sự kiện, CLB nổi bật..."
            placeholderTextColor="#94a3b8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={{ padding: 8 }}>
          <Text style={{ fontSize: 18 }}>⚙️</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 14 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={st.clubCard}
            onPress={() => navigate('booking')}
            activeOpacity={0.8}
          >
            <View style={st.clubCardImg}>
              <Text style={{ fontSize: 28 }}>🏸</Text>
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
              <Text style={st.clubOpen}>
                ⏰ {item.open} · 📏 {item.distance}
              </Text>
            </View>
            <View style={st.clubCardActions}>
              <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
                <Text style={{ fontSize: 20 }}>{favorites.includes(item.id) ? '❤️' : '🤍'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={st.bookSmallBtn} onPress={() => navigate('booking')}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>ĐẶT LỊCH</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const st = StyleSheet.create({
  exploreSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: C.primaryDark,
    paddingHorizontal: 8,
    paddingVertical: 10,
    gap: 6,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 38,
  },
  searchIcon: { fontSize: 14, marginRight: 6 },
  searchInput: { flex: 1, color: '#1e293b', fontSize: 13 },
  clubCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  clubCardImg: { width: 75, backgroundColor: '#166534', alignItems: 'center', justifyContent: 'center' },
  clubCardBody: { flex: 1, padding: 10 },
  clubCardActions: { padding: 10, alignItems: 'center', justifyContent: 'space-between' },
  clubName: { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 3 },
  clubAddr: { color: C.sub, fontSize: 11, marginBottom: 2 },
  clubOpen: { color: C.sub, fontSize: 11 },
  tagBadge: { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
  tagText: { color: '#fff', fontSize: 10, fontWeight: '700' },
  bookSmallBtn: { backgroundColor: C.primary, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5, marginTop: 6 },
});
