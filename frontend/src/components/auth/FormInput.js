import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

export function FormInput({ value, onChangeText, placeholder, secureTextEntry, rightIcon, onRightPress }) {
  return (
    <View style={st.inputBox}>
      <TextInput
        style={st.inputField}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
      {rightIcon ? (
        <TouchableOpacity style={st.inputRight} onPress={onRightPress}>
          <Text style={{ fontSize: 18 }}>{rightIcon}</Text>
        </TouchableOpacity>
      ) : value ? (
        <TouchableOpacity style={st.inputRight} onPress={() => onChangeText('')}>
          <View style={st.clearCircle}>
            <Text style={{ color: '#fff', fontSize: 12 }}>✕</Text>
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const st = StyleSheet.create({
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    paddingHorizontal: 12,
    height: 52,
    marginBottom: 14,
  },
  inputField: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
  },
  inputRight: {
    padding: 6,
  },
  clearCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#94a3b8',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
