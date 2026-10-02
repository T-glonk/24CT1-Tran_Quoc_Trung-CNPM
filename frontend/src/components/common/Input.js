import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS as C } from '../../constants/theme';

export function Input({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, icon }) {
  return (
    <View style={{ marginBottom: 14 }}>
      {label ? <Text style={st.label}>{label}</Text> : null}
      <View style={st.inputWrap}>
        {icon ? <Text style={st.inputIcon}>{icon}</Text> : null}
        <TextInput
          style={[st.input, icon && { paddingLeft: 42 }]}
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

const st = StyleSheet.create({
  label: {
    color: C.sub,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 6,
  },
  inputWrap: {
    position: 'relative',
  },
  input: {
    backgroundColor: C.card2,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 10,
    padding: 13,
    paddingLeft: 14,
    color: C.text,
    fontSize: 15,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 13,
    fontSize: 16,
    zIndex: 1,
  },
});
