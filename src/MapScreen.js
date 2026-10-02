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
import { COLORS as C, CLUBS } from './data';

// Google Maps API Key
export const GOOGLE_MAPS_API_KEY =
  process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || 'AIzaSyD3UuZuxYXIWwi7BH6YyUXLkh3RELCqHkY';

// Import WebView safely for iOS / Android
let WebView = null;
try {
  WebView = require('react-native-webview').WebView;
} catch (e) {
  // WebView fallback
}

// ═══════════════════════════════════════════════════════════════════════════════
// 1. SMART MAP HTML BUILDER (GOOGLE MAPS + AUTO-FAILOVER)
// ═══════════════════════════════════════════════════════════════════════════════
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
      <!-- Leaflet CSS for Failover -->
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body, html { width: 100%; height: 100%; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #0f172a; }
        #map { width: 100%; height: 100%; background: #0f172a; }
        
        /* Custom InfoWindow */
        .gm-style .gm-style-iw-c {
          background-color: #1e293b !important;
          color: #f1f5f9 !important;
          border-radius: 14px !important;
          padding: 10px 14px !important;
          border: 1.5px solid #22c55e !important;
          box-shadow: 0 10px 25px rgba(0,0,0,0.6) !important;
        }
        .gm-style .gm-style-iw-tc::after {
          background-color: #1e293b !important;
          border-color: #22c55e !important;
        }
        .gm-style .gm-style-iw-d { overflow: hidden !important; }
        .gm-ui-hover-effect { filter: invert(1); margin: 4px !important; }
        
        .iw-content { padding: 2px; min-width: 170px; }
        .iw-title { font-weight: 800; color: #22c55e; font-size: 13px; margin-bottom: 4px; }
        .iw-addr { color: #94a3b8; font-size: 11px; margin-bottom: 6px; }
        .iw-meta { display: flex; align-items: center; gap: 6px; font-size: 11px; }
        .iw-badge {
          background: #15803d;
          color: #ffffff;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
        }

        /* Leaflet Marker Styles for Fallback */
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
          transition: transform 0.2s;
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
      <!-- Leaflet JS for Failover -->
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    </head>
    <body>
      <div id="map"></div>
      <script>
        const clubs = ${clubsJson};
        let selectedId = "${selectedId}";
        let googleMap = null;
        let leafletMap = null;
        const gMarkers = {};
        const lMarkers = {};
        let infoWindow;
        let isUsingGoogle = false;

        // Custom Dark / Night Style for Google Maps
        const darkMapStyle = [
          { "elementType": "geometry", "stylers": [{ "color": "#1e293b" }] },
          { "elementType": "labels.text.stroke", "stylers": [{ "color": "#0f172a" }] },
          { "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
          { "featureType": "administrative.locality", "elementType": "labels.text.fill", "stylers": [{ "color": "#cbd5e1" }] },
          { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#64748b" }] },
          { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#14532d" }] },
          { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#86efac" }] },
          { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#334155" }] },
          { "featureType": "road", "elementType": "geometry.stroke", "stylers": [{ "color": "#1e293b" }] },
          { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#94a3b8" }] },
          { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#475569" }] },
          { "featureType": "road.highway", "elementType": "geometry.stroke", "stylers": [{ "color": "#0f172a" }] },
          { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#f8fafc" }] },
          { "featureType": "transit", "elementType": "geometry", "stylers": [{ "color": "#27272a" }] },
          { "featureType": "transit.station", "elementType": "labels.text.fill", "stylers": [{ "color": "#cbd5e1" }] },
          { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0369a1" }] },
          { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#38bdf8" }] },
          { "featureType": "water", "elementType": "labels.text.stroke", "stylers": [{ "color": "#0f172a" }] }
        ];

        function notifyRN(msgObj) {
          const str = JSON.stringify(msgObj);
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(str);
          } else if (window.parent) {
            window.parent.postMessage(msgObj, '*');
          }
        }

        // ── 1. FALLBACK ENGINE (LEAFLET HIGH RES TILE MAP) ──
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
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(leafletMap);

          // User Marker
          const userIcon = L.divIcon({
            className: 'user-marker',
            iconSize: [22, 22],
            iconAnchor: [11, 11]
          });
          L.marker([16.0350, 108.2100], { icon: userIcon })
            .addTo(leafletMap)
            .bindPopup('<b style="color:#3b82f6;">📍 Vị trí của bạn</b>');

          // Club Markers
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
            
            const popupHtml = \`
              <div class="iw-content">
                <div class="iw-title">\${club.name}</div>
                <div class="iw-addr">📍 \${club.address}</div>
                <div class="iw-meta">
                  <span class="iw-badge">\${club.rating} ⭐ (\${club.reviewsCount || 80})</span>
                  <span style="color:#94a3b8; font-size:11px; margin-left:6px;">📏 \${club.distance}</span>
                </div>
              </div>
            \`;
            marker.bindPopup(popupHtml);
            
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

          setTimeout(() => leafletMap.invalidateSize(), 300);
        }

        // ── 2. GOOGLE MAPS ENGINE ──
        function initGoogleMap() {
          try {
            if (!window.google || !window.google.maps) {
              initLeafletMap();
              return;
            }

            googleMap = new google.maps.Map(document.getElementById("map"), {
              center: { lat: 16.0350, lng: 108.2100 },
              zoom: 13,
              styles: darkMapStyle,
              disableDefaultUI: true,
              gestureHandling: 'greedy',
            });

            infoWindow = new google.maps.InfoWindow();

            // User Location
            new google.maps.Marker({
              position: { lat: 16.0350, lng: 108.2100 },
              map: googleMap,
              title: "Vị trí của bạn",
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#3b82f6",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2.5,
              }
            });

            const getMarkerIcon = (isActive) => ({
              url: isActive
                ? 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42"><circle cx="21" cy="21" r="19" fill="%23eab308" stroke="%23ffffff" stroke-width="3"/><text x="21" y="27" font-size="20" text-anchor="middle">🏸</text></svg>'
                : 'data:image/svg+xml;utf-8,<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36"><circle cx="18" cy="18" r="16" fill="%2316a34a" stroke="%23ffffff" stroke-width="2.5"/><text x="18" y="23" font-size="16" text-anchor="middle">🏸</text></svg>',
              scaledSize: isActive ? new google.maps.Size(42, 42) : new google.maps.Size(36, 36),
              anchor: isActive ? new google.maps.Point(21, 21) : new google.maps.Point(18, 18),
            });

            clubs.forEach(club => {
              const isActive = club.id === selectedId;
              const marker = new google.maps.Marker({
                position: { lat: club.lat, lng: club.lng },
                map: googleMap,
                title: club.name,
                icon: getMarkerIcon(isActive),
                zIndex: isActive ? 999 : 1,
              });

              marker.addListener("click", () => {
                Object.keys(gMarkers).forEach(k => {
                  gMarkers[k].setIcon(getMarkerIcon(false));
                  gMarkers[k].setZIndex(1);
                });
                marker.setIcon(getMarkerIcon(true));
                marker.setZIndex(999);

                const content = \`
                  <div class="iw-content">
                    <div class="iw-title">\${club.name}</div>
                    <div class="iw-addr">📍 \${club.address}</div>
                    <div class="iw-meta">
                      <span class="iw-badge">\${club.rating} ⭐ (\${club.reviewsCount || 80})</span>
                      <span style="color:#94a3b8;">📏 \${club.distance}</span>
                    </div>
                  </div>
                \`;
                infoWindow.setContent(content);
                infoWindow.open(googleMap, marker);
                notifyRN({ type: 'SELECT_CLUB', clubId: club.id });
              });

              gMarkers[club.id] = marker;
            });

            isUsingGoogle = true;

            if (selectedId && gMarkers[selectedId]) {
              const target = clubs.find(c => c.id === selectedId);
              if (target) {
                googleMap.setCenter({ lat: target.lat, lng: target.lng });
                googleMap.setZoom(14);
              }
            }
          } catch(e) {
            initLeafletMap();
          }
        }

        // ── GOOGLE AUTH ERROR CATCHER (If Billing / Maps JS API is not active on Google Cloud) ──
        window.gm_authFailure = function() {
          console.warn("Google Maps Auth Error - Failover to High-Res Tile Map");
          isUsingGoogle = false;
          initLeafletMap();
        };

        // Command handler
        function handleCommand(data) {
          if (isUsingGoogle && googleMap) {
            if (data.type === 'PAN_TO_CLUB') {
              const target = clubs.find(c => c.id === data.clubId);
              if (target) {
                googleMap.panTo({ lat: target.lat, lng: target.lng });
                googleMap.setZoom(15);
                if (gMarkers[data.clubId]) {
                  google.maps.event.trigger(gMarkers[data.clubId], 'click');
                }
              }
            } else if (data.type === 'ZOOM_IN') {
              googleMap.setZoom(googleMap.getZoom() + 1);
            } else if (data.type === 'ZOOM_OUT') {
              googleMap.setZoom(googleMap.getZoom() - 1);
            } else if (data.type === 'RESET_VIEW') {
              googleMap.panTo({ lat: 16.0350, lng: 108.2100 });
              googleMap.setZoom(13);
            } else if (data.type === 'SET_MAP_TYPE') {
              googleMap.setMapTypeId(data.mapType);
            }
          } else if (leafletMap) {
            if (data.type === 'PAN_TO_CLUB') {
              const target = clubs.find(c => c.id === data.clubId);
              if (target) {
                leafletMap.setView([target.lat, target.lng], 15, { animate: true });
                if (lMarkers[data.clubId]) lMarkers[data.clubId].openPopup();
              }
            } else if (data.type === 'ZOOM_IN') {
              leafletMap.zoomIn();
            } else if (data.type === 'ZOOM_OUT') {
              leafletMap.zoomOut();
            } else if (data.type === 'RESET_VIEW') {
              leafletMap.setView([16.0350, 108.2100], 13, { animate: true });
            }
          }
        }

        window.addEventListener('message', (event) => {
          try {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            handleCommand(data);
          } catch(e){}
        });

        document.addEventListener('message', (event) => {
          try {
            const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
            handleCommand(data);
          } catch(e){}
        });

        // Load Google Maps Script
        const script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places";
        script.async = true;
        script.defer = true;
        script.onload = initGoogleMap;
        script.onerror = function() {
          console.warn("Failed to load Google Maps SDK script - Loading Tile Map");
          initLeafletMap();
        };
        document.head.appendChild(script);

        // Backup timer: if Google Maps doesn't load within 2.5s, activate Map
        setTimeout(() => {
          if (!isUsingGoogle && !leafletMap) {
            initLeafletMap();
          }
        }, 2500);
      </script>
    </body>
    </html>
  `;
}

// ═══════════════════════════════════════════════════════════════════════════════
// 2. MINI GOOGLE MAP WIDGET FOR HOMESCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export function MiniMapWidget({ navigate }) {
  const [activeClub, setActiveClub] = useState(CLUBS[0]);

  return (
    <View style={mm.container}>
      <View style={mm.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Text style={{ fontSize: 18 }}>📍</Text>
          <Text style={mm.title}>Bản đồ sân quanh bạn</Text>
          <View style={mm.liveDot} />
          <Text style={mm.liveText}>Trực tiếp</Text>
        </View>
        <TouchableOpacity style={mm.expandBtn} onPress={() => navigate('mapTab')}>
          <Text style={mm.expandText}>Mở rộng ›</Text>
        </TouchableOpacity>
      </View>

      {/* Map Container */}
      <View style={mm.mapBox}>
        {Platform.OS === 'web' ? (
          <iframe
            srcDoc={getMapHTML(CLUBS.slice(0, 4), activeClub?.id)}
            style={{
              width: '100%',
              height: 170,
              border: 'none',
              borderRadius: 12,
            }}
            title="Maps Mini"
          />
        ) : WebView ? (
          <View style={{ height: 170, borderRadius: 12, overflow: 'hidden' }}>
            <WebView
              originWhitelist={['*']}
              source={{ html: getMapHTML(CLUBS.slice(0, 4), activeClub?.id) }}
              style={{ flex: 1, backgroundColor: '#1e293b' }}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowsInlineMediaPlayback={true}
              scalesPageToFit={true}
              mixedContentMode="always"
              onMessage={(event) => {
                try {
                  const data = JSON.parse(event.nativeEvent.data);
                  if (data.type === 'SELECT_CLUB') {
                    const c = CLUBS.find((item) => item.id === data.clubId);
                    if (c) setActiveClub(c);
                  }
                } catch (e) {}
              }}
            />
          </View>
        ) : (
          <View style={mm.fallbackBox}>
            <Text style={{ fontSize: 32 }}>🗺️</Text>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700', marginTop: 4 }}>
              Bản đồ thể thao
            </Text>
          </View>
        )}
      </View>

      {/* Quick Club Action Bar */}
      {activeClub && (
        <TouchableOpacity
          style={mm.quickClubBar}
          onPress={() => navigate('booking')}
          activeOpacity={0.85}
        >
          <View style={mm.quickClubLeft}>
            <Text style={mm.quickClubName} numberOfLines={1}>
              {activeClub.name}
            </Text>
            <Text style={mm.quickClubAddr} numberOfLines={1}>
              📍 {activeClub.address} · 📏 {activeClub.distance}
            </Text>
          </View>
          <View style={mm.quickBookBtn}>
            <Text style={mm.quickBookText}>Đặt ngay 🏸</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// 3. FULL MAP SCREEN
// ═══════════════════════════════════════════════════════════════════════════════
export function MapScreen({ navigate, favorites = [], onToggleFavorite = () => {} }) {
  const [selectedClub, setSelectedClub] = useState(CLUBS[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [viewMode, setViewMode] = useState('map'); // 'map' | 'list'
  const [mapType, setMapType] = useState('roadmap'); // 'roadmap' | 'satellite'

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

  // Web event listener
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleMessage = (e) => {
        if (e.data && e.data.type === 'SELECT_CLUB') {
          const club = CLUBS.find((c) => c.id === e.data.clubId);
          if (club) setSelectedClub(club);
        }
      };
      window.addEventListener('message', handleMessage);
      return () => window.removeEventListener('message', handleMessage);
    }
  }, []);

  const sendMapCommand = (commandObj) => {
    if (Platform.OS === 'web' && iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(commandObj, '*');
    } else if (webViewRef.current) {
      webViewRef.current.postMessage(JSON.stringify(commandObj));
    }
  };

  const handleSelectClub = (club) => {
    setSelectedClub(club);
    sendMapCommand({ type: 'PAN_TO_CLUB', clubId: club.id });
  };

  const handleZoom = (type) => {
    sendMapCommand({ type: type === 'in' ? 'ZOOM_IN' : 'ZOOM_OUT' });
  };

  const handleResetLocation = () => {
    sendMapCommand({ type: 'RESET_VIEW' });
  };

  const handleToggleMapType = () => {
    const nextType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(nextType);
    sendMapCommand({ type: 'SET_MAP_TYPE', mapType: nextType });
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
      {/* ─── TOP SEARCH & CONTROLS ─── */}
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

      {/* ─── DISTRICT FILTER CHIPS ─── */}
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

      {/* ─── MAP / LIST CONTENT ─── */}
      {viewMode === 'map' ? (
        <View style={ms.mapWrapper}>
          {/* MAP ENGINE */}
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
              allowsInlineMediaPlayback={true}
              scalesPageToFit={true}
              mixedContentMode="always"
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
                Đang tải bản đồ...
              </Text>
            </View>
          )}

          {/* Floating Controls */}
          <View style={ms.mapControls}>
            <TouchableOpacity style={ms.controlBtn} onPress={() => handleZoom('in')}>
              <Text style={ms.controlBtnText}>＋</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ms.controlBtn} onPress={() => handleZoom('out')}>
              <Text style={ms.controlBtnText}>－</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[ms.controlBtn, { marginTop: 6 }]} onPress={handleResetLocation}>
              <Text style={{ fontSize: 16 }}>🎯</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[ms.controlBtn, { marginTop: 6 }, mapType === 'satellite' && { backgroundColor: C.primary }]}
              onPress={handleToggleMapType}
            >
              <Text style={{ fontSize: 14 }}>{mapType === 'roadmap' ? '🛰️' : '🗺️'}</Text>
            </TouchableOpacity>
          </View>

          {/* Sân gần bạn Badge */}
          <View style={ms.courtCountBadge}>
            <Text style={ms.courtCountText}>📍 {filteredClubs.length} Sân quanh bạn</Text>
          </View>

          {/* ─── BOTTOM CLUB CARD ─── */}
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
                    <Text style={ms.metaValRating}>⭐ {selectedClub.rating} ({selectedClub.reviewsCount || 80})</Text>
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

                {/* Price */}
                {selectedClub.priceRange && (
                  <View style={ms.priceTagRow}>
                    <Text style={ms.priceTagLabel}>💵 Giá: </Text>
                    <Text style={ms.priceTagVal}>{selectedClub.priceRange}</Text>
                  </View>
                )}

                {/* Action Buttons */}
                <View style={ms.cardActionsRow}>
                  {selectedClub.phone ? (
                    <TouchableOpacity
                      style={ms.actionCallBtn}
                      onPress={() => handleCallPhone(selectedClub.phone)}
                    >
                      <Text style={{ fontSize: 15 }}>📞</Text>
                      <Text style={ms.actionCallText}>Gọi</Text>
                    </TouchableOpacity>
                  ) : null}

                  <TouchableOpacity
                    style={ms.actionDirBtn}
                    onPress={() => handleOpenDirections(selectedClub)}
                  >
                    <Text style={{ fontSize: 15 }}>🧭</Text>
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
        /* ─── LIST VIEW ─── */
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

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════
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
  toggleViewBtnActive: {
    backgroundColor: C.primary,
    borderColor: '#fff',
  },
  toggleViewIcon: { color: '#fff', fontSize: 12, fontWeight: '700' },

  filterChipsContainer: { backgroundColor: C.primaryDark, paddingBottom: 8 },
  filterChipsScroll: { paddingHorizontal: 12, gap: 8 },
  chip: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  chipActive: { backgroundColor: '#fff', borderColor: C.primary },
  chipText: { color: '#dcfce7', fontSize: 11, fontWeight: '600' },
  chipTextActive: { color: C.primaryDark, fontWeight: '800' },

  mapWrapper: { flex: 1, position: 'relative' },
  fallbackBox: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapControls: { position: 'absolute', top: 14, right: 14, gap: 6, zIndex: 10 },
  controlBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: C.border,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  controlBtnText: { color: '#fff', fontSize: 20, fontWeight: '800' },

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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
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
    borderWidth: 1.5,
    borderColor: C.accent,
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

  priceTagRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 2 },
  priceTagLabel: { color: '#94a3b8', fontSize: 11 },
  priceTagVal: { color: C.accent, fontSize: 11, fontWeight: '800' },

  cardActionsRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  actionCallBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
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
    justifyContent: 'center',
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

  // List View
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

// Mini Map Styles
const mm = StyleSheet.create({
  container: {
    marginHorizontal: 12,
    marginVertical: 10,
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: { color: C.text, fontSize: 14, fontWeight: '800' },
  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22c55e',
  },
  liveText: { color: '#22c55e', fontSize: 11, fontWeight: '700' },
  expandBtn: { paddingVertical: 2, paddingHorizontal: 6 },
  expandText: { color: C.accent, fontSize: 12, fontWeight: '700' },
  mapBox: { borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#334155' },
  fallbackBox: {
    height: 170,
    backgroundColor: '#1e293b',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickClubBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0f172a',
    marginTop: 8,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.primary,
  },
  quickClubLeft: { flex: 1, marginRight: 8 },
  quickClubName: { color: '#fff', fontSize: 12, fontWeight: '800' },
  quickClubAddr: { color: C.sub, fontSize: 10, marginTop: 2 },
  quickBookBtn: {
    backgroundColor: C.primary,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  quickBookText: { color: '#fff', fontSize: 11, fontWeight: '800' },
});
