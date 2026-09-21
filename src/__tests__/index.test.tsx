import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import ReactTestRenderer, { act } from 'react-test-renderer';
import type {
  BiometricsStatus,
  AuthenticateResult,
} from '../index';

interface MockState {
  status: BiometricsStatus;
  authResult: AuthenticateResult;
}

const mockState: MockState = {
  status: {
    isAvailable: true,
    biometryType: 'faceId',
    biometryTypes: ['faceId'],
    enrolled: true,
    isDeviceSecure: true,
    error: undefined,
  },
  authResult: {
    success: true,
    biometryType: 'faceId',
    error: undefined,
    warning: undefined,
  },
};

const mockCanAuthenticate = jest.fn(async (_allowDeviceCredentials?: boolean) => mockState.status);
const mockAuthenticate = jest.fn(async (_options: any) => mockState.authResult);

jest.mock('react-native-nitro-modules', () => {
  return {
    NitroModules: {
      createHybridObject: jest.fn(() => ({
        name: 'NitroBiometrics',
        equals: jest.fn(() => true),
        dispose: jest.fn(),
        canAuthenticate: (allow?: boolean) => mockCanAuthenticate(allow),
        authenticate: (options: any) => mockAuthenticate(options),
      })),
    },
  };
});

import {
  canAuthenticate,
  authenticate,
  getBiometryType,
  isSensorAvailable,
  useBiometrics,
  NitroBiometrics,
} from '../index';

function renderHook<T>(hookFn: () => T) {
  let value!: T;
  function Harness() {
    value = hookFn();
    return null;
  }
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  act(() => {
    renderer = ReactTestRenderer.create(<Harness />);
  });
  return {
    get current() {
      return value;
    },
    rerender() {
      act(() => {
        renderer.update(<Harness />);
      });
    },
    unmount() {
      act(() => {
        renderer.unmount();
      });
    },
  };
}

describe('react-native-nitro-biometrics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockState.status = {
      isAvailable: true,
      biometryType: 'faceId',
      biometryTypes: ['faceId'],
      enrolled: true,
      isDeviceSecure: true,
      error: undefined,
    };
    mockState.authResult = {
      success: true,
      biometryType: 'faceId',
      error: undefined,
      warning: undefined,
    };
  });

  describe('Core API functions', () => {
    it('should export NitroBiometrics object', () => {
      expect(NitroBiometrics).toBeDefined();
      expect(typeof NitroBiometrics.canAuthenticate).toBe('function');
      expect(typeof NitroBiometrics.authenticate).toBe('function');
    });

    it('canAuthenticate returns status from native hybrid object', async () => {
      const status = await canAuthenticate(false);
      expect(status).toBeDefined();
      expect(status.isAvailable).toBe(true);
      expect(status.biometryType).toBe('faceId');
      expect(status.biometryTypes).toEqual(['faceId']);
      expect(status.enrolled).toBe(true);
      expect(status.isDeviceSecure).toBe(true);
      expect(status.error).toBeUndefined();
      expect(mockCanAuthenticate).toHaveBeenCalledWith(false);
    });

    it('authenticate forwards options and returns result', async () => {
      const result = await authenticate({
        promptMessage: 'Authenticate to unlock secret',
        allowDeviceCredentials: true,
      });
      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.biometryType).toBe('faceId');
      expect(mockAuthenticate).toHaveBeenCalledWith({
        promptMessage: 'Authenticate to unlock secret',
        allowDeviceCredentials: true,
      });
    });

    it('getBiometryType returns primary biometry type', async () => {
      const type = await getBiometryType();
      expect(type).toBe('faceId');
    });

    it('isSensorAvailable returns boolean indicating availability', async () => {
      const available = await isSensorAvailable();
      expect(available).toBe(true);
    });

    it('handles authentication failure result correctly', async () => {
      mockState.authResult = {
        success: false,
        error: 'userCanceled',
      };

      const result = await authenticate({
        promptMessage: 'Test prompt',
      });
      expect(result.success).toBe(false);
      expect(result.error).toBe('userCanceled');
    });
  });

  describe('useBiometrics Hook', () => {
    it('initializes and autoChecks status on mount', async () => {
      const hook = renderHook(() => useBiometrics({ autoCheck: true }));

      await act(async () => {
        await Promise.resolve();
      });

      expect(hook.current.isLoading).toBe(false);
      expect(hook.current.isAvailable).toBe(true);
      expect(hook.current.biometryType).toBe('faceId');
      expect(hook.current.enrolled).toBe(true);
      expect(hook.current.status).not.toBeNull();
    });

    it('supports manual status checking via checkStatus()', async () => {
      const hook = renderHook(() => useBiometrics({ autoCheck: false }));

      await act(async () => {
        const updatedStatus = await hook.current.checkStatus();
        expect(updatedStatus).toBeDefined();
        expect(updatedStatus.biometryType).toBe('faceId');
      });

      expect(hook.current.isAvailable).toBe(true);
      expect(hook.current.biometryType).toBe('faceId');
    });

    it('supports authenticate() call from hook', async () => {
      const hook = renderHook(() => useBiometrics({ autoCheck: false }));

      let authResult: AuthenticateResult | undefined;
      await act(async () => {
        authResult = await hook.current.authenticate({
          promptMessage: 'Authenticate test',
        });
      });

      expect(authResult).toBeDefined();
      expect(authResult?.success).toBe(true);
      expect(authResult?.biometryType).toBe('faceId');
    });

    it('handles authentication failure gracefully in hook', async () => {
      mockState.authResult = {
        success: false,
        error: 'userCanceled',
      };

      const hook = renderHook(() => useBiometrics({ autoCheck: false }));

      let authResult: AuthenticateResult | undefined;
      await act(async () => {
        authResult = await hook.current.authenticate({
          promptMessage: 'Authenticate test',
        });
      });

      expect(authResult?.success).toBe(false);
      expect(authResult?.error).toBe('userCanceled');
      expect(hook.current.error).toBe('userCanceled');
    });
  });
});
