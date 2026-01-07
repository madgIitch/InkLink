import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen } from '../../../shared/components';
import { theme } from '../../../shared/styles';

export const HomeScreen: React.FC = () => {
  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Home Screen</Text>
        <Text style={styles.subtitle}>Welcome to InkLink!</Text>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
});
