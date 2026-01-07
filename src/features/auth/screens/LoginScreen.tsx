import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Screen, Button } from '../../../shared/components';
import { theme } from '../../../shared/styles';

export const LoginScreen: React.FC = () => {
  const handleLogin = () => {
    // TODO: Implement login logic
    console.log('Login pressed');
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to InkLink</Text>
        <Text style={styles.subtitle}>Please login to continue</Text>

        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} style={styles.button} />
        </View>
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
    marginBottom: theme.spacing.xl,
  },
  buttonContainer: {
    width: '100%',
    marginTop: theme.spacing.xl,
  },
  button: {
    width: '100%',
  },
});
