import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { COLORS as C } from '../../constants/theme';

export function Btn({ title, onPress, style, textStyle, outline, danger, loading, color }) {
  const bg = danger ? C.danger : color || C.primary;
  return (
    <TouchableOpacity
      style={[
        st.btn,
        { backgroundColor: outline ? 'transparent' : bg },
        outline && { borderWidth: 2, borderColor: bg },
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[st.btnText, outline && { color: bg }, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}

const st = StyleSheet.create({
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});
