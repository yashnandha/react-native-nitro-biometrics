export {
  NitroBiometrics,
  canAuthenticate,
  authenticate,
  getBiometryType,
  isSensorAvailable,
} from './biometrics';

export { useBiometrics } from './useBiometrics';
export type { UseBiometricsOptions, UseBiometricsReturn } from './useBiometrics';

export type {
  BiometryType,
  BiometricsStatus,
  AuthenticateOptions,
  AuthenticateResult,
  NitroBiometrics as NitroBiometricsInterface,
} from './NitroBiometrics.nitro';
