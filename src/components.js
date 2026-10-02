import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet, Platform,
} from 'react-native';
import { COLORS as C } from './data';

export function Input({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, icon }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={cs.label}>{label}</Text> : null}
      <View style={cs.inputWrap}>
        {icon ? <Text style={cs.inputIcon}>{icon}</Text> : null}
        <TextInput
          style={[cs.input, icon && { paddingLeft: 42 }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.sub}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType || 'default'}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

export function Btn({ title, onPress, style, textStyle, outline, danger, loading, color }) {
  const bg = danger ? C.danger : color || C.primary;
  return (
    <TouchableOpacity
      style={[cs.btn, { backgroundColor: outline ? 'transparent' : bg },
        outline && { borderWidth: 2, borderColor: bg }, style]}
      onPress={onPress} activeOpacity={0.8}>
      {loading
        ? <ActivityIndicator color="#fff" />
        : <Text style={[cs.btnText, outline && { color: bg }, textStyle]}>{title}</Text>}
    </TouchableOpacity>
  );
}

export function Header({ title, onBack, right, green }) {
  return (
    <View style={[cs.header, green && { backgroundColor: C.primary }]}>
      {onBack
        ? <TouchableOpacity onPress={onBack} style={cs.backBtn}>
            <Text style={[cs.backIcon, green && { color: '#fff' }]}>←</Text>
          </TouchableOpacity>
        : <View style={{ width: 40 }} />}
      <Text style={[cs.headerTitle, green && { color: '#fff' }]}>{title}</Text>
      <View style={{ width: 40, alignItems: 'center' }}>{right}</View>
    </View>
  );
}

export function Badge({ label, color, style }) {
  return (
    <View style={[cs.badge, { backgroundColor: color || C.primary }, style]}>
      <Text style={cs.badgeText}>{label}</Text>
    </View>
  );
}

const cs = StyleSheet.create({
  label: { color: C.sub, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  inputWrap: { position: 'relative' },
  input: { backgroundColor: C.card2, borderWidth: 1, borderColor: C.border, borderRadius: 10,
    padding: 13, paddingLeft: 44, color: C.text, fontSize: 15 },
  inputIcon: { position: 'absolute', left: 12, top: 13, fontSize: 16, zIndex: 1 },
  btn: { borderRadius: 12, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  btnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: C.card, paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: C.border },
  headerTitle: { color: C.text, fontSize: 17, fontWeight: '700', flex: 1, textAlign: 'center' },
  backBtn: { width: 40, height: 40, justifyContent: 'center' },
  backIcon: { color: C.accent, fontSize: 24 },
  badge: { borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
