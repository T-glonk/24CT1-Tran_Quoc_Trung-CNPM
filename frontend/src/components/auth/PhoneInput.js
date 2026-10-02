import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

export function PhoneInput({ value, onChangeText }) {
  return (
    <View style={st.phoneRow}>
      <TouchableOpacity style={st.prefixBox}>
        <Text style={{ fontSize: 18 }}>🇻🇳</Text>
        <Text style={st.prefixText}>+84</Text>
        <Text style={st.prefixArrow}>▾</Text>
      </TouchableOpacity>
      <View style={st.phoneDivider} />
      <TextInput
        style={st.phoneInput}
        value={value}
        onChangeText={onChangeText}
        placeholder="Nhập số điện thoại"
        placeholderTextColor="#94a3b8"
        keyboardType="phone-pad"
        autoCapitalize="none"
      />
    </View>
  );
}

const st = StyleSheet.create({
  phoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 12,
  },
  prefixBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 8,
    gap: 4,
  },
  prefixText: {
    color: '#0f172a',
    fontSize: 15,
    fontWeight: '700',
  },
  prefixArrow: {
    color: '#94a3b8',
    fontSize: 12,
  },
  phoneDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#cbd5e1',
    marginRight: 10,
  },
  phoneInput: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
});
