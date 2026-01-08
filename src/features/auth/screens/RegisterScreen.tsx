import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen, Button, Input } from '../../../shared/components';
import { theme } from '../../../shared/styles';
import { RootStackParamList } from '../../../navigation/types';
import { authService, userService } from '../../../services';
import { UserType } from '../../../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const [userType, setUserType] = useState<UserType>('client');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!displayName.trim()) {
      newErrors.displayName = 'El nombre es requerido';
    }

    if (!email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email inválido';
    }

    if (!password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      // Create Firebase Auth user
      const firebaseUser = await authService.signUp({
        email: email.trim(),
        password,
        displayName: displayName.trim(),
      });

      // Create user document in Firestore
      await userService.createUser({
        uid: firebaseUser.uid,
        email: email.trim(),
        userType,
        displayName: displayName.trim(),
      });

      // Navigate to Profile Setup
      navigation.replace('ProfileSetup');
    } catch (error: any) {
      console.error('Registration error:', error);
      let errorMessage = 'Error al registrarse. Intenta de nuevo.';

      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email ya está registrado';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'La contraseña es muy débil';
      }

      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <Screen scrollable style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Crear Cuenta</Text>
        <Text style={styles.subtitle}>Únete a InkLink</Text>

        {/* User Type Selector */}
        <View style={styles.userTypeContainer}>
          <Text style={styles.label}>¿Qué tipo de cuenta quieres?</Text>
          <View style={styles.userTypeButtons}>
            <TouchableOpacity
              style={[styles.userTypeButton, userType === 'client' && styles.userTypeButtonActive]}
              onPress={() => setUserType('client')}
            >
              <Text
                style={[
                  styles.userTypeButtonText,
                  userType === 'client' && styles.userTypeButtonTextActive,
                ]}
              >
                Cliente
              </Text>
              <Text style={styles.userTypeDescription}>Busco un tatuador</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.userTypeButton,
                userType === 'tattoo_artist' && styles.userTypeButtonActive,
              ]}
              onPress={() => setUserType('tattoo_artist')}
            >
              <Text
                style={[
                  styles.userTypeButtonText,
                  userType === 'tattoo_artist' && styles.userTypeButtonTextActive,
                ]}
              >
                Tatuador
              </Text>
              <Text style={styles.userTypeDescription}>Ofrezco mis servicios</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Form */}
        <Input
          label="Nombre completo"
          value={displayName}
          onChangeText={text => {
            setDisplayName(text);
            setErrors({ ...errors, displayName: '' });
          }}
          error={errors.displayName}
          autoCapitalize="words"
        />

        <Input
          label="Email"
          value={email}
          onChangeText={text => {
            setEmail(text);
            setErrors({ ...errors, email: '' });
          }}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Contraseña"
          value={password}
          onChangeText={text => {
            setPassword(text);
            setErrors({ ...errors, password: '' });
          }}
          error={errors.password}
          secureTextEntry
        />

        <Input
          label="Confirmar contraseña"
          value={confirmPassword}
          onChangeText={text => {
            setConfirmPassword(text);
            setErrors({ ...errors, confirmPassword: '' });
          }}
          error={errors.confirmPassword}
          secureTextEntry
        />

        <Button
          title="Registrarse"
          onPress={handleRegister}
          loading={loading}
          style={styles.registerButton}
        />

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>¿Ya tienes cuenta? </Text>
          <TouchableOpacity onPress={handleLogin}>
            <Text style={styles.loginLink}>Inicia sesión</Text>
          </TouchableOpacity>
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
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xl,
  },
  userTypeContainer: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.sm,
  },
  userTypeButtons: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  userTypeButton: {
    flex: 1,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    alignItems: 'center',
  },
  userTypeButtonActive: {
    borderColor: theme.colors.primary[500],
    backgroundColor: theme.colors.primary[50],
  },
  userTypeButtonText: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  userTypeButtonTextActive: {
    color: theme.colors.primary[600],
  },
  userTypeDescription: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    textAlign: 'center',
  },
  registerButton: {
    marginTop: theme.spacing.md,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  loginText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  loginLink: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary[600],
    fontWeight: theme.typography.fontWeight.semibold,
  },
});
