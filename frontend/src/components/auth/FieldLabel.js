import React from 'react';
import { Text, StyleSheet } from 'react-native';

export function FieldLabel({ text, required }) {
  return (
    <Text style={st.fieldLabel}>
      {text} {required ? <Text style={{ color: '#ef4444' }}>*</Text> : null}
    </Text>
  );
}

const st = StyleSheet.create({
  fieldLabel: {
    color: '#334155',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
});
