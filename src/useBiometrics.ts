import { useState, useEffect, useCallback } from 'react';
import { canAuthenticate, authenticate as nativeAuthenticate } from './biometrics';
import type {
  BiometricsStatus,
  AuthenticateOptions,
  AuthenticateResult,
  BiometryType,
} from './NitroBiometrics.nitro';

export interface UseBiometricsOptions {
  /**
   * Automatically check biometric status on hook mount. Default: true.
   */
  autoCheck?: boolean;
  /**
   * Include device credentials (passcode/PIN) when checking status. Default: false.
   */
  allowDeviceCredentials?: boolean;
}

export interface UseBiometricsReturn {
  /**
   * Full status object returned by `canAuthenticate`.
   */
  status: BiometricsStatus | null;
  /**
   * Whether biometric authentication is available on the device.
   */
  isAvailable: boolean;
  /**
   * The primary biometric type (e.g. 'faceId', 'touchId', 'fingerprint', 'face', 'none').
   */
  biometryType: BiometryType;
  /**
   * Array of all biometric types detected on the device.
   */
  biometryTypes: BiometryType[];
  /**
   * Whether biometric credentials have been enrolled by the user.
   */
  enrolled: boolean;
  /**
   * Whether the device lock screen is secured with passcode/PIN/pattern.
   */
  isDeviceSecure: boolean;
  /**
   * Whether status check or authentication is currently in progress.
   */
  isLoading: boolean;
  /**
   * Error message from the last check or authentication attempt.
   */
  error?: string;
  /**
   * Manually re-check the device biometric status.
   */
  checkStatus: (allowDeviceCredentials?: boolean) => Promise<BiometricsStatus>;
  /**
   * Prompt the user for biometric authentication.
   */
  authenticate: (options: AuthenticateOptions) => Promise<AuthenticateResult>;
}

/**
 * A React hook for easy and reactive biometric authentication management.
 *
 * @example
 * ```tsx
 * const { isAvailable, biometryType, authenticate, isLoading } = useBiometrics();
 *
 * const handleLogin = async () => {
 *   const result = await authenticate({ promptMessage: 'Log in with biometrics' });
 *   if (result.success) {
 *     // Proceed with user session
 *   }
 * };
 * ```
 */
export function useBiometrics(
  options: UseBiometricsOptions = {}
): UseBiometricsReturn {
  const { autoCheck = true, allowDeviceCredentials = false } = options;

  const [status, setStatus] = useState<BiometricsStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(autoCheck);
  const [error, setError] = useState<string | undefined>(undefined);

  const checkStatus = useCallback(
    async (allowCredentials?: boolean): Promise<BiometricsStatus> => {
      setIsLoading(true);
      setError(undefined);
      try {
        const result = await canAuthenticate(
          allowCredentials !== undefined ? allowCredentials : allowDeviceCredentials
        );
        setStatus(result);
        if (result.error) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setError(errMsg);
        const fallbackStatus: BiometricsStatus = {
          isAvailable: false,
          biometryType: 'none',
          biometryTypes: [],
          enrolled: false,
          isDeviceSecure: false,
          error: errMsg,
        };
        setStatus(fallbackStatus);
        return fallbackStatus;
      } finally {
        setIsLoading(false);
      }
    },
    [allowDeviceCredentials]
  );

  const authenticate = useCallback(
    async (authOptions: AuthenticateOptions): Promise<AuthenticateResult> => {
      setIsLoading(true);
      setError(undefined);
      try {
        const result = await nativeAuthenticate(authOptions);
        if (!result.success && result.error) {
          setError(result.error);
        }
        return result;
      } catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        setError(errMsg);
        return {
          success: false,
          error: errMsg,
        };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (autoCheck) {
      checkStatus(allowDeviceCredentials);
    }
  }, [autoCheck, allowDeviceCredentials, checkStatus]);

  return {
    status,
    isAvailable: status?.isAvailable ?? false,
    biometryType: status?.biometryType ?? 'none',
    biometryTypes: status?.biometryTypes ?? [],
    enrolled: status?.enrolled ?? false,
    isDeviceSecure: status?.isDeviceSecure ?? false,
    isLoading,
    error,
    checkStatus,
    authenticate,
  };
}
