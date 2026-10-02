import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS as C } from '../../constants/theme';

export function Badge({ label, color, style }) {
  return (
    <View style={[st.badge, { backgroundColor: color || C.primary }, style]}>
      <Text style={st.badgeText}>{label}</Text>
    </View>
  );
}

const st = StyleSheet.create({
  badge: {
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
});
