import { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  ActivityIndicator,
} from 'react-native';
import {
  useBiometrics,
  authenticate,
  type AuthenticateResult,
} from 'react-native-nitro-biometrics';

export default function App() {
  const {
    isAvailable,
    biometryType,
    biometryTypes,
    enrolled,
    isDeviceSecure,
    isLoading,
    error: statusError,
    checkStatus,
  } = useBiometrics({ autoCheck: true, allowDeviceCredentials: true });

  const [authResult, setAuthResult] = useState<AuthenticateResult | null>(null);
  const [authInProgress, setAuthInProgress] = useState<boolean>(false);
  const [lastAction, setLastAction] = useState<string>('None');

  const handleBiometricAuth = async (allowPasscode: boolean) => {
    setAuthInProgress(true);
    setLastAction(
      allowPasscode
        ? 'Authenticate (with Passcode Fallback)'
        : 'Authenticate (Biometrics Only)'
    );
    try {
      const result = await authenticate({
        promptMessage: 'Verify your identity to unlock',
        subtitle: 'Please use biometrics to continue',
        description: 'Testing react-native-nitro-biometrics integration',
        cancelButtonText: 'Cancel',
        fallbackButtonText: 'Enter Passcode',
        allowDeviceCredentials: allowPasscode,
        confirmationRequired: false,
      });
      setAuthResult(result);
    } catch (err) {
      setAuthResult({
        success: false,
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setAuthInProgress(false);
    }
  };

  const handleManualCheck = async () => {
    setLastAction('Manual Status Check');
    await checkStatus(true);
  };

  const getBiometryBadge = () => {
    switch (biometryType) {
      case 'faceId':
        return 'Face ID';
      case 'touchId':
        return 'Touch ID';
      case 'opticId':
        return 'Optic ID';
      case 'fingerprint':
        return 'Fingerprint';
      case 'face':
        return 'Face Unlock';
      case 'iris':
        return 'Iris';
      default:
        return 'None';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#0F172A" />
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.libraryTag}>NITRO MODULES</Text>
          <Text style={styles.title}>Biometrics Demo</Text>
          <Text style={styles.subtitle}>
            Platform: {Platform.OS.toUpperCase()} • Type: {getBiometryBadge()}
          </Text>
        </View>

        {/* Status Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Sensor & Device Status</Text>
            {isLoading && <ActivityIndicator size="small" color="#38BDF8" />}
          </View>

          <View style={styles.statusGrid}>
            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Biometrics Available</Text>
              <Text
                style={[
                  styles.statusValue,
                  isAvailable ? styles.textSuccess : styles.textDanger,
                ]}
              >
                {isAvailable ? 'YES' : 'NO'}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Primary Biometry</Text>
              <Text style={styles.statusValue}>{biometryType}</Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Detected Types</Text>
              <Text style={styles.statusValue}>
                {biometryTypes.length > 0 ? biometryTypes.join(', ') : 'none'}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Enrolled</Text>
              <Text
                style={[
                  styles.statusValue,
                  enrolled ? styles.textSuccess : styles.textDanger,
                ]}
              >
                {enrolled ? 'YES' : 'NO'}
              </Text>
            </View>

            <View style={styles.statusRow}>
              <Text style={styles.statusLabel}>Device Secure (PIN/Passcode)</Text>
              <Text
                style={[
                  styles.statusValue,
                  isDeviceSecure ? styles.textSuccess : styles.textWarning,
                ]}
              >
                {isDeviceSecure ? 'YES' : 'NO'}
              </Text>
            </View>

            {statusError && (
              <View style={styles.statusRow}>
                <Text style={styles.statusLabel}>Sensor Error</Text>
                <Text style={[styles.statusValue, styles.textDanger]}>
                  {statusError}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={() => handleBiometricAuth(false)}
            disabled={authInProgress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {authInProgress ? 'Authenticating...' : 'Authenticate (Biometrics Only)'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => handleBiometricAuth(true)}
            disabled={authInProgress}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              Authenticate (Allow Passcode Fallback)
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.outlineButton]}
            onPress={handleManualCheck}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <Text style={styles.outlineButtonText}>Refresh Device Status</Text>
          </TouchableOpacity>
        </View>

        {/* Result Card */}
        {authResult && (
          <View
            style={[
              styles.card,
              authResult.success ? styles.cardSuccess : styles.cardFailure,
            ]}
          >
            <Text style={styles.cardTitle}>
              {authResult.success
                ? '[Success] Authentication Succeeded'
                : '[Failure] Authentication Failed'}
            </Text>
            <Text style={styles.resultDetails}>Last Action: {lastAction}</Text>
            {authResult.biometryType && (
              <Text style={styles.resultDetails}>
                Biometry: {authResult.biometryType}
              </Text>
            )}
            {authResult.error && (
              <Text style={[styles.resultDetails, styles.textDanger]}>
                Error Code: {authResult.error}
              </Text>
            )}
            {authResult.warning && (
              <Text style={[styles.resultDetails, styles.textWarning]}>
                Warning: {authResult.warning}
              </Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  container: {
    padding: 20,
    alignItems: 'stretch',
  },
  header: {
    alignItems: 'center',
    marginVertical: 24,
  },
  libraryTag: {
    color: '#38BDF8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 6,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 26,
    fontWeight: '800',
    marginBottom: 8,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  cardTitle: {
    color: '#F8FAFC',
    fontSize: 17,
    fontWeight: '700',
  },
  statusGrid: {
    gap: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#334155',
  },
  statusLabel: {
    color: '#94A3B8',
    fontSize: 14,
  },
  statusValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontWeight: '600',
  },
  textSuccess: {
    color: '#4ADE80',
  },
  textDanger: {
    color: '#F87171',
  },
  textWarning: {
    color: '#FBBF24',
  },
  actionsContainer: {
    gap: 12,
    marginBottom: 20,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: '#0284C7',
  },
  secondaryButton: {
    backgroundColor: '#4F46E5',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#475569',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  outlineButtonText: {
    color: '#94A3B8',
    fontSize: 15,
    fontWeight: '600',
  },
  cardSuccess: {
    borderColor: '#22C55E',
    backgroundColor: '#064E3B20',
  },
  cardFailure: {
    borderColor: '#EF4444',
    backgroundColor: '#7F1D1D20',
  },
  resultDetails: {
    color: '#CBD5E1',
    fontSize: 14,
    marginTop: 6,
  },
});
