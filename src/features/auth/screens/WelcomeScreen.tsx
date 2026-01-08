import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, Button } from '../../../shared/components';
import { theme } from '../../../shared/styles';
import { RootStackParamList } from '../../../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export const WelcomeScreen: React.FC<Props> = ({ navigation }) => {
  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <Screen style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>InkLink</Text>
          <Text style={styles.subtitle}>Conecta con tatuadores independientes</Text>
        </View>

        <View style={styles.illustration}>
          {/* Placeholder for illustration/logo */}
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>🎨</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Button title="Iniciar Sesión" onPress={handleLogin} style={styles.button} />
          <Button
            title="Registrarse"
            onPress={handleRegister}
            variant="outline"
            style={styles.button}
          />
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  header: {
    marginTop: theme.spacing.xxl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl + 8,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary[600],
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  illustration: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 80,
  },
  footer: {
    gap: theme.spacing.md,
  },
  button: {
    width: '100%',
  },
});
