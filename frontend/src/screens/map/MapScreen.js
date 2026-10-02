import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  TextInput,
  FlatList,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { COLORS as C } from '../../constants/theme';
import { CLUBS } from '../../constants/initialData';

export const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyD3UuZuxYXIWwi7BH6YyUXLkh3RELCqHkY';

let WebView = null;
try {
  WebView = require('react-native-webview').WebView;
} catch (e) {}

function getMapHTML(clubs, selectedClubId) {
  const clubsJson = JSON.stringify(clubs);
  const selectedId = selectedClubId || '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <title>Map - Badminton Courts</title>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { width: 100%; height: 100%; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; }
        #map { width: 100%; height: 100%; background: #0f172a; }
        .custom-marker {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #16a34a;
          border: 2px solid #ffffff;
          border-radius: 50%;
          width: 38px;
          height: 38px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.4);
          cursor: pointer;
          font-size: 18px;
        }
        .custom-marker.active {
          background: #eab308;
          transform: scale(1.2);
          box-shadow: 0 0 0 5px rgba(234, 179, 8, 0.4);
          z-index: 1000 !important;
        }
        .user-marker {
          background: #3b82f6;
          border: 3px solid #ffffff;
          border-radius: 50%;
          width: 22px;
          height: 22px;
          box-shadow: 0 0 0 7px rgba(59, 130, 246, 0.35);
        }
        .leaflet-popup-content-wrapper {
          background: #1e293b;
          color: #f1f5f9;
          border-radius: 12px;
          padding: 4px;
          border: 1.5px solid #22c55e;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }
        .leaflet-popup-tip { background: #1e293b; }
      </style>
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const clubs = ${clubsJson};
        let selectedId = "${selectedId}";
        let leafletMap = null;
        const lMarkers = {};

        function notifyRN(msgObj) {
          const str = JSON.stringify(msgObj);
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(str);
          } else if (window.parent) {
            window.parent.postMessage(msgObj, '*');
          }
        }

        function initLeafletMap() {
          if (leafletMap) return;
          const container = document.getElementById("map");
          container.innerHTML = "";
          
          leafletMap = L.map('map', {
            zoomControl: false,
            attributionControl: true
          }).setView([16.0350, 108.2100], 13);
          
          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            maxZoom: 19,
            subdomains: 'abcd',
            attribution: '&copy; OpenStreetMap'
          }).addTo(leafletMap);

          const userIcon = L.divIcon({
            className: 'user-marker',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });
          L.marker([16.0350, 108.2100], { icon: userIcon })
            .addTo(leafletMap)
            .bindPopup('<b style="color:#3b82f6;">📍 Vị trí của bạn</b>');

          clubs.forEach(club => {
            const isActive = club.id === selectedId;
            const icon = L.divIcon({
              className: 'custom-marker' + (isActive ? ' active' : ''),
              html: '🏸',
              iconSize: [38, 38],
              iconAnchor: [19, 19],
              popupAnchor: [0, -20]
            });
            
            const marker = L.marker([club.lat, club.lng], { icon: icon }).addTo(leafletMap);
            marker.bindPopup(\`
              <div style="padding:4px; min-width:160px;">
                <b style="color:#22c55e; font-size:13px;">\${club.name}</b>
                <div style="color:#94a3b8; font-size:11px; margin-top:2px;">📍 \${club.address}</div>
                <div style="color:#facc15; font-size:11px; margin-top:4px;">⭐ \${club.rating} · 📏 \${club.distance}</div>
              </div>
            \`);
            
            marker.on('click', () => {
              selectedId = club.id;
              notifyRN({ type: 'SELECT_CLUB', clubId: club.id });
            });
            
            lMarkers[club.id] = marker;
          });

          if (selectedId && lMarkers[selectedId]) {
            const sel = clubs.find(c => c.id === selectedId);
            if (sel) leafletMap.setView([sel.lat, sel.lng], 14);
          }
        }

        initLeafletMap();
      </script>
    </body>
    </html>
  `;
}

export function MapScreen({ navigate, favorites = [], onToggleFavorite = () => {} }) {
  const [selectedClub, setSelectedClub] = useState(CLUBS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'

  const iframeRef = useRef(null);
  const webViewRef = useRef(null);

  const DISTRICTS = [
    { key: 'all', label: 'Tất cả' },
    { key: 'Hải Châu', label: 'Hải Châu' },
    { key: 'Cẩm Lệ', label: 'Cẩm Lệ' },
    { key: 'Thanh Khê', label: 'Thanh Khê' },
  ];

  const filteredClubs = CLUBS.filter((club) => {
    const matchSearch =
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchDistrict = selectedDistrict === 'all' || club.district === selectedDistrict;
    return matchSearch && matchDistrict;
  });

  const handleSelectClub = (club) => {
    setSelectedClub(club);
  };

  const handleOpenDirections = (club) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${club.lat},${club.lng}`;
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      Linking.openURL(url).catch(() => Alert.alert('Lỗi', 'Không thể mở ứng dụng bản đồ'));
    }
  };

  const handleCallPhone = (phone) => {
    if (phone) {
      Linking.openURL(`tel:${phone.replace(/\s+/g, '')}`).catch(() =>
        Alert.alert('Liên hệ', `Số điện thoại: ${phone}`)
      );
    }
  };

  return (
    <View style={ms.root}>
      {/* Top Search & Controls */}
      <View style={ms.topBar}>
        <View style={ms.searchBox}>
          <Text style={ms.searchIcon}>🔍</Text>
          <TextInput
            style={ms.searchInput}
            placeholder="Tìm sân cầu lông trên Bản đồ..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')} style={{ padding: 4 }}>
              <Text style={{ color: '#94a3b8', fontSize: 16 }}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <TouchableOpacity
          style={[ms.toggleViewBtn, viewMode === 'list' && ms.toggleViewBtnActive]}
          onPress={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
        >
          <Text style={ms.toggleViewIcon}>{viewMode === 'map' ? '📋 DS' : '🗺️ Map'}</Text>
        </TouchableOpacity>
      </View>

      {/* District Filter Chips */}
      <View style={ms.filterChipsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={ms.filterChipsScroll}>
          {DISTRICTS.map((d) => {
            const active = selectedDistrict === d.key;
            return (
              <TouchableOpacity
                key={d.key}
                style={[ms.chip, active && ms.chipActive]}
                onPress={() => setSelectedDistrict(d.key)}
              >
                <Text style={[ms.chipText, active && ms.chipTextActive]}>{d.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Map / List View */}
      {viewMode === 'map' ? (
        <View style={ms.mapWrapper}>
          {Platform.OS === 'web' ? (
            <iframe
              ref={iframeRef}
              srcDoc={getMapHTML(filteredClubs, selectedClub?.id)}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                backgroundColor: '#0f172a',
              }}
              title="Maps"
            />
          ) : WebView ? (
            <WebView
              ref={webViewRef}
              originWhitelist={['*']}
              source={{ html: getMapHTML(filteredClubs, selectedClub?.id) }}
              style={{ flex: 1, backgroundColor: '#0f172a' }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'SELECT_CLUB') {
                    const club = CLUBS.find((c) => c.id === data.clubId);
                    if (club) setSelectedClub(club);
                  }
                } catch (e) {}
              }}
            />
          ) : (
            <View style={ms.fallbackBox}>
              <Text style={{ fontSize: 40 }}>🗺️</Text>
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '700', marginTop: 8 }}>
                Bản đồ sân cầu lông Đà Nẵng
              </Text>
            </View>
          )}

          {/* Sân quanh bạn count */}
          <View style={ms.courtCountBadge}>
            <Text style={ms.courtCountText}>📍 {filteredClubs.length} Sân quanh bạn</Text>
          </View>

          {/* Bottom Card for Selected Club */}
          {selectedClub && (
            <View style={ms.bottomCardOverlay}>
              <View style={ms.clubDetailCard}>
                <View style={ms.cardHeader}>
                  <View style={ms.clubIconBox}>
                    <Text style={{ fontSize: 26 }}>🏸</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={ms.cardTitle} numberOfLines={1}>
                        {selectedClub.name}
                      </Text>
                      <TouchableOpacity onPress={() => onToggleFavorite(selectedClub.id)}>
                        <Text style={{ fontSize: 20 }}>
                          {favorites.includes(selectedClub.id) ? '❤️' : '🤍'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={ms.cardAddr} numberOfLines={1}>
                      📍 {selectedClub.address}
                    </Text>
                  </View>
                </View>

                {/* Info row */}
                <View style={ms.cardMetaRow}>
                  <View style={ms.metaItem}>
                    <Text style={ms.metaLabel}>Đánh giá</Text>
                    <Text style={ms.metaValRating}>⭐ {selectedClub.rating}</Text>
                  </View>
                  <View style={ms.metaDivider} />
                  <View style={ms.metaItem}>
                    <Text style={ms.metaLabel}>Khoảng cách</Text>
                    <Text style={ms.metaVal}>📏 {selectedClub.distance}</Text>
                  </View>
                  <View style={ms.metaDivider} />
                  <View style={ms.metaItem}>
                    <Text style={ms.metaLabel}>Quy mô</Text>
                    <Text style={ms.metaVal}>🏟️ {selectedClub.totalCourts || 6} Sân</Text>
                  </View>
                  <View style={ms.metaDivider} />
                  <View style={ms.metaItem}>
                    <Text style={ms.metaLabel}>Giờ mở cửa</Text>
                    <Text style={ms.metaValGreen}>⏰ {selectedClub.open}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={ms.cardActionsRow}>
                  {selectedClub.phone ? (
                    <TouchableOpacity
                      style={ms.actionCallBtn}
                      onPress={() => handleCallPhone(selectedClub.phone)}
                    >
                      <Text style={{ fontSize: 14 }}>📞</Text>
                      <Text style={ms.actionCallText}>Gọi</Text>
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={ms.actionDirBtn}
                    onPress={() => handleOpenDirections(selectedClub)}
                  >
                    <Text style={{ fontSize: 14 }}>🧭</Text>
                    <Text style={ms.actionDirText}>Chỉ đường</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={ms.actionBookBtn}
                    onPress={() => navigate && navigate('booking')}
                  >
                    <Text style={ms.actionBookText}>🏸 ĐẶT SÂN NGAY</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
      ) : (
        /* List View */
        <FlatList
          data={filteredClubs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 14, paddingBottom: 30 }}
          renderItem={({ item }) => {
            const isSelected = selectedClub && selectedClub.id === item.id;
            return (
              <TouchableOpacity
                style={[ms.listCard, isSelected && ms.listCardActive]}
                onPress={() => {
                  handleSelectClub(item);
                  setViewMode('map');
                }}
              >
                <View style={ms.listCardImg}>
                  <Text style={{ fontSize: 30 }}>🏸</Text>
                </View>
                <View style={ms.listCardBody}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={ms.listCardTitle} numberOfLines={1}>
                      {item.name}
                    </Text>
                    <TouchableOpacity onPress={() => onToggleFavorite(item.id)}>
                      <Text style={{ fontSize: 18 }}>{favorites.includes(item.id) ? '❤️' : '🤍'}</Text>
                    </TouchableOpacity>
                  </View>
                  <Text style={ms.listCardAddr} numberOfLines={1}>
                    📍 {item.address}
                  </Text>
                  <View style={ms.listMeta}>
                    <Text style={{ color: C.warning, fontSize: 11, fontWeight: '700' }}>⭐ {item.rating}</Text>
                    <Text style={{ color: C.accent, fontSize: 11, fontWeight: '600' }}>📏 {item.distance}</Text>
                    <Text style={{ color: C.sub, fontSize: 11 }}>⏰ {item.open}</Text>
                  </View>
                  <View style={ms.listActionRow}>
                    <TouchableOpacity style={ms.listSmallDirBtn} onPress={() => handleOpenDirections(item)}>
                      <Text style={ms.listSmallDirText}>🧭 Chỉ đường</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={ms.listSmallBookBtn} onPress={() => navigate && navigate('booking')}>
                      <Text style={ms.listSmallBookText}>🏸 Đặt lịch</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}

const ms = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 6,
    backgroundColor: C.primaryDark,
    gap: 8,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 22,
    paddingHorizontal: 12,
    height: 40,
  },
  searchIcon: { fontSize: 16, marginRight: 6 },
  searchInput: { flex: 1, color: '#1e293b', fontSize: 13 },
  toggleViewBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  toggleViewBtnActive: { backgroundColor: C.primary, borderColor: '#fff' },
  toggleViewIcon: { color: '#fff', fontSize: 12, fontWeight: '700' },
  filterChipsContainer: { backgroundColor: C.primaryDark, paddingBottom: 8 },
  filterChipsScroll: { paddingHorizontal: 12, gap: 8 },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
  },
  chipActive: { backgroundColor: '#fff' },
  chipText: { color: '#dcfce7', fontSize: 11, fontWeight: '600' },
  chipTextActive: { color: C.primaryDark, fontWeight: '800' },
  mapWrapper: { flex: 1, position: 'relative' },
  fallbackBox: { flex: 1, backgroundColor: '#0f172a', alignItems: 'center', justifyContent: 'center' },
  courtCountBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    zIndex: 10,
  },
  courtCountText: { color: C.accent, fontSize: 12, fontWeight: '700' },
  bottomCardOverlay: { position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 20 },
  clubDetailCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1.5,
    borderColor: C.primary,
    elevation: 8,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  clubIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#166534',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTitle: { color: '#fff', fontSize: 14, fontWeight: '800', flex: 1, marginRight: 8 },
  cardAddr: { color: C.sub, fontSize: 11, marginTop: 2 },
  cardMetaRow: {
    flexDirection: 'row',
    backgroundColor: '#0f172a',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metaItem: { alignItems: 'center', flex: 1 },
  metaLabel: { color: '#64748b', fontSize: 9, fontWeight: '600', marginBottom: 2 },
  metaValRating: { color: C.warning, fontSize: 11, fontWeight: '800' },
  metaVal: { color: '#f1f5f9', fontSize: 11, fontWeight: '700' },
  metaValGreen: { color: C.accent, fontSize: 11, fontWeight: '700' },
  metaDivider: { width: 1, backgroundColor: '#334155', marginVertical: 2 },
  cardActionsRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  actionCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#334155',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  actionCallText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  actionDirBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#0284c7',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  actionDirText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  actionBookBtn: {
    flex: 1,
    backgroundColor: C.primary,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBookText: { color: '#fff', fontSize: 13, fontWeight: '900' },
  listCard: {
    flexDirection: 'row',
    backgroundColor: C.card,
    borderRadius: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: C.border,
    overflow: 'hidden',
  },
  listCardActive: { borderColor: C.primary, borderWidth: 1.5 },
  listCardImg: { width: 75, backgroundColor: '#166534', alignItems: 'center', justifyContent: 'center' },
  listCardBody: { flex: 1, padding: 12 },
  listCardTitle: { color: C.text, fontSize: 14, fontWeight: '800', flex: 1 },
  listCardAddr: { color: C.sub, fontSize: 11, marginTop: 2, marginBottom: 6 },
  listMeta: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  listActionRow: { flexDirection: 'row', gap: 8 },
  listSmallDirBtn: { backgroundColor: '#334155', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 },
  listSmallDirText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  listSmallBookBtn: { backgroundColor: C.primary, borderRadius: 6, paddingHorizontal: 12, paddingVertical: 5 },
  listSmallBookText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
