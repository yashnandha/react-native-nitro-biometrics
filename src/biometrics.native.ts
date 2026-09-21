import { NitroModules } from 'react-native-nitro-modules';
import type {
  NitroBiometrics as NitroBiometricsType,
  BiometricsStatus,
  AuthenticateOptions,
  AuthenticateResult,
  BiometryType,
} from './NitroBiometrics.nitro';

/**
 * The native Nitro HybridObject instance for NitroBiometrics.
 */
export const NitroBiometrics =
  NitroModules.createHybridObject<NitroBiometricsType>('NitroBiometrics');

/**
 * Checks if biometric authentication is available and enrolled on this device.
 *
 * @param allowDeviceCredentials If true, also checks if device passcode / credentials can authenticate.
 * @returns A promise resolving to the BiometricsStatus details.
 */
export function canAuthenticate(
  allowDeviceCredentials?: boolean
): Promise<BiometricsStatus> {
  return NitroBiometrics.canAuthenticate(allowDeviceCredentials);
}

/**
 * Prompts the user to authenticate using biometrics (Face ID, Touch ID, Fingerprint, Face).
 *
 * @param options Configuration for the biometric prompt (promptMessage, subtitle, allowDeviceCredentials, etc.).
 * @returns A promise resolving to the AuthenticateResult with success status and potential error details.
 */
export function authenticate(
  options: AuthenticateOptions
): Promise<AuthenticateResult> {
  return NitroBiometrics.authenticate(options);
}

/**
 * Convenience helper to quickly get the primary biometric type available on the device.
 *
 * @param allowDeviceCredentials If true, checks status with device passcode fallback included.
 * @returns A promise resolving to the primary BiometryType ('faceId' | 'touchId' | 'opticId' | 'fingerprint' | 'face' | 'iris' | 'none').
 */
export async function getBiometryType(
  allowDeviceCredentials?: boolean
): Promise<BiometryType> {
  const status = await canAuthenticate(allowDeviceCredentials);
  return status.biometryType;
}

/**
 * Convenience helper to quickly check if biometric hardware is available and enrolled.
 *
 * @param allowDeviceCredentials If true, returns true if either biometrics or device passcode is available.
 * @returns A promise resolving to a boolean indicating availability.
 */
export async function isSensorAvailable(
  allowDeviceCredentials?: boolean
): Promise<boolean> {
  const status = await canAuthenticate(allowDeviceCredentials);
  return status.isAvailable;
}
