import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { CLUBS } from '../../constants/initialData';

export function FavoritesScreen({ favorites, navigate }) {
  const favClubs = CLUBS.filter((c) => favorites.includes(c.id));

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={st.header}>
        <Text style={st.headerTitle}>❤️ Câu Lạc Bộ Yêu Thích</Text>
      </View>

      {favClubs.length === 0 ? (
        <View style={st.centerEmpty}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🤍</Text>
          <Text style={{ color: C.sub, fontSize: 15 }}>Chưa có sân yêu thích</Text>
          <Text style={{ color: C.sub, fontSize: 12, marginTop: 4 }}>
            Nhấn vào biểu tượng trái tim ở danh sách CLB để lưu lại
          </Text>
          <TouchableOpacity style={st.exploreBtn} onPress={() => navigate('home')}>
            <Text style={{ color: '#fff', fontWeight: '800' }}>Khám phá ngay</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={favClubs}
          keyExtractor={(item) => item.id}
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
                <Text style={st.clubName}>{item.name}</Text>
                <Text style={st.clubAddr} numberOfLines={1}>
                  📍 {item.address}
                </Text>
                <Text style={st.clubOpen}>⏰ {item.open}</Text>
              </View>
              <View style={{ alignItems: 'center', paddingRight: 10, justifyContent: 'center' }}>
                <Text style={{ fontSize: 22 }}>❤️</Text>
                <Text style={{ color: C.warning, fontSize: 11, fontWeight: '800', marginTop: 4 }}>
                  ⭐ {item.rating}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const st = StyleSheet.create({
  header: {
    backgroundColor: C.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  headerTitle: { color: '#fff', fontSize: 16, fontWeight: '800' },
  centerEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  exploreBtn: {
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginTop: 16,
  },
  clubCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  clubCardImg: {
    width: 70,
    backgroundColor: '#166534',
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubCardBody: { flex: 1, padding: 10 },
  clubName: { color: C.text, fontSize: 13, fontWeight: '700', marginBottom: 3 },
  clubAddr: { color: C.sub, fontSize: 11, marginBottom: 2 },
  clubOpen: { color: C.sub, fontSize: 11 },
});
