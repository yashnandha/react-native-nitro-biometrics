import type {
  NitroBiometrics as NitroBiometricsType,
  BiometricsStatus,
  AuthenticateOptions,
  AuthenticateResult,
  BiometryType,
} from './NitroBiometrics.nitro';

const defaultStatus: BiometricsStatus = {
  isAvailable: false,
  biometryType: 'none',
  biometryTypes: [],
  enrolled: false,
  isDeviceSecure: false,
  error: 'notSupported',
};

const defaultResult: AuthenticateResult = {
  success: false,
  error: 'notSupported',
  warning: 'Biometrics are not supported on this platform',
};

/**
 * Fallback NitroBiometrics HybridObject for non-native platforms (e.g. Web or Node/Jest without native mock).
 */
export const NitroBiometrics: NitroBiometricsType = {
  name: 'NitroBiometrics',
  equals: (other) => other === NitroBiometrics,
  dispose: () => {},
  canAuthenticate: async (_allowDeviceCredentials?: boolean): Promise<BiometricsStatus> => {
    return defaultStatus;
  },
  authenticate: async (_options: AuthenticateOptions): Promise<AuthenticateResult> => {
    return defaultResult;
  },
};

/**
 * Checks if biometric authentication is available and enrolled on this device.
 */
export function canAuthenticate(
  _allowDeviceCredentials?: boolean
): Promise<BiometricsStatus> {
  return Promise.resolve(defaultStatus);
}

/**
 * Prompts the user to authenticate using biometrics.
 */
export function authenticate(
  _options: AuthenticateOptions
): Promise<AuthenticateResult> {
  return Promise.resolve(defaultResult);
}

/**
 * Convenience helper to get the primary biometric type available on the device.
 */
export function getBiometryType(
  _allowDeviceCredentials?: boolean
): Promise<BiometryType> {
  return Promise.resolve('none');
}

/**
 * Convenience helper to quickly check if biometric hardware is available.
 */
export function isSensorAvailable(
  _allowDeviceCredentials?: boolean
): Promise<boolean> {
  return Promise.resolve(false);
}
