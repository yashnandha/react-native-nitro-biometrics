import type { HybridObject } from 'react-native-nitro-modules';

export type BiometryType =
  | 'none'
  | 'touchId'
  | 'faceId'
  | 'opticId'
  | 'fingerprint'
  | 'face'
  | 'iris';

export interface BiometricsStatus {
  /**
   * Whether biometric authentication is supported and currently available on this device.
   */
  isAvailable: boolean;
  /**
   * The primary biometric type available on the device.
   */
  biometryType: BiometryType;
  /**
   * List of all biometric types supported/detected on the device.
   */
  biometryTypes: BiometryType[];
  /**
   * Whether the user has enrolled at least one biometric credential.
   */
  enrolled: boolean;
  /**
   * Whether the device has a secure lock screen passcode / PIN / pattern set up.
   */
  isDeviceSecure: boolean;
  /**
   * Error message or code if biometrics are not available.
   */
  error?: string;
}

export interface AuthenticateOptions {
  /**
   * The title/reason for biometric authentication displayed to the user.
   */
  promptMessage: string;
  /**
   * Subtitle text displayed below the prompt (primarily Android).
   */
  subtitle?: string;
  /**
   * Detailed description text for the biometric prompt (primarily Android).
   */
  description?: string;
  /**
   * Label for the cancel / negative button (default: "Cancel").
   */
  cancelButtonText?: string;
  /**
   * Label for fallback button on iOS.
   */
  fallbackButtonText?: string;
  /**
   * Allow fallback to device credentials (PIN, pattern, or passcode).
   */
  allowDeviceCredentials?: boolean;
  /**
   * Whether user confirmation is required after passive biometric matching (Android).
   */
  confirmationRequired?: boolean;
}

export interface AuthenticateResult {
  /**
   * Whether the biometric authentication succeeded.
   */
  success: boolean;
  /**
   * The biometry type used during authentication, if known.
   */
  biometryType?: BiometryType;
  /**
   * Error code/message if authentication failed or was cancelled.
   */
  error?: string;
  /**
   * Warning message if non-fatal issues occurred during authentication.
   */
  warning?: string;
}

export interface NitroBiometrics extends HybridObject<{
  ios: 'swift';
  android: 'kotlin';
}> {
  /**
   * Checks the status and availability of biometric sensors on the device.
   */
  canAuthenticate(allowDeviceCredentials?: boolean): Promise<BiometricsStatus>;

  /**
   * Prompts the user for biometric authentication.
   */
  authenticate(options: AuthenticateOptions): Promise<AuthenticateResult>;
}
