import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS as C } from '../../constants/theme';

export function Header({ title, onBack, right, green }) {
  return (
    <View style={[st.header, green && { backgroundColor: C.primary }]}>
      {onBack ? (
        <TouchableOpacity onPress={onBack} style={st.backBtn}>
          <Text style={[st.backIcon, green && { color: '#fff' }]}>←</Text>
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
      <Text style={[st.headerTitle, green && { color: '#fff' }]}>{title}</Text>
      <View style={{ width: 40, alignItems: 'center' }}>{right}</View>
    </View>
  );
}

const st = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: C.card,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerTitle: {
    color: C.text,
    fontSize: 17,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    color: C.accent,
    fontSize: 24,
  },
});
