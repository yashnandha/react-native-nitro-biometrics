<div align="center">

  <h1>⚡️ react-native-nitro-biometrics</h1>

  <p><strong>Blazing-fast, type-safe Biometric Authentication for React Native powered by Nitro Modules.</strong></p>

  <p>
    Face ID &bull; Touch ID &bull; Optic ID &bull; BiometricPrompt (Fingerprint, Face, Iris) &bull; Device Passcode Fallback
  </p>

  <!-- NPM Chips / Badges -->
  <p>
    <a href="https://www.npmjs.com/package/react-native-nitro-biometrics">
      <img src="https://img.shields.io/npm/v/react-native-nitro-biometrics?style=for-the-badge&logo=npm&color=CB3837&logoColor=white" alt="NPM Version" />
    </a>
    <a href="https://www.npmjs.com/package/react-native-nitro-biometrics">
      <img src="https://img.shields.io/npm/dm/react-native-nitro-biometrics?style=for-the-badge&logo=npm&color=2088FF&logoColor=white" alt="NPM Downloads" />
    </a>
    <a href="https://www.npmjs.com/package/react-native-nitro-biometrics">
      <img src="https://img.shields.io/npm/dt/react-native-nitro-biometrics?style=for-the-badge&logo=npm&color=007ACC&logoColor=white" alt="NPM Total Downloads" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/npm/l/react-native-nitro-biometrics?style=for-the-badge&color=28A745" alt="License" />
    </a>
  </p>

  <p>
    <a href="https://nitro.margelo.com">
      <img src="https://img.shields.io/badge/Powered%20by-Nitro%20Modules-FF5722?style=for-the-badge&logo=react&logoColor=white" alt="Powered by Nitro Modules" />
    </a>
    <img src="https://img.shields.io/badge/Platforms-iOS%20%7C%20Android-4E5D6C?style=for-the-badge&logo=apple&logoColor=white" alt="Platforms iOS & Android" />
    <img src="https://img.shields.io/badge/Native-Swift%20%26%20Kotlin-F05138?style=for-the-badge&logo=swift&logoColor=white" alt="Swift & Kotlin" />
    <a href="https://www.typescriptlang.org">
      <img src="https://img.shields.io/badge/TypeScript-Strict%20Types-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    </a>
    <a href="./COLLABORATION.md">
      <img src="https://img.shields.io/badge/PRs-welcome-brightgreen?style=for-the-badge" alt="PRs Welcome" />
    </a>
  </p>

</div>

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Why Nitro Modules?](#-why-nitro-modules)
- [Features](#-features)
- [Supported Biometrics](#-supported-biometrics)
- [Installation](#-installation)
- [Platform Setup](#-platform-setup)
  - [iOS Configuration](#ios-configuration)
  - [Android Configuration](#android-configuration)
- [Quick Start](#-quick-start)
  - [1. Functional API](#1-functional-api)
  - [2. React Hook (`useBiometrics`)](#2-react-hook-usebiometrics)
- [Production Recipes](#-production-recipes)
  - [App Lock / Screen Gate on Resume](#recipe-1-app-lock--screen-gate-on-resume)
  - [High-Security Transaction Authorization](#recipe-2-high-security-transaction-authorization)
  - [Device Passcode Fallback](#recipe-3-device-passcode-fallback)
- [API Reference](#-api-reference)
  - [`canAuthenticate()`](#canauthenticateallowdevicecredentials-promisebiometricsstatus)
  - [`authenticate()`](#authenticateoptions-promiseauthenticateresult)
  - [`getBiometryType()`](#getbiometrytypeallowdevicecredentials-promisebiometrytype)
  - [`isSensorAvailable()`](#issensoravailableallowdevicecredentials-promiseboolean)
  - [`useBiometrics()`](#usebiometricsoptions-usebiometricsreturn)
  - [Types & Options](#types--options)
  - [Standardized Error Codes](#standardized-error-codes)
- [Security & Privacy](#-security--privacy)
- [Jest Testing & Mocking](#-jest-testing--mocking)
- [Example App](#-example-app)
- [Collaborating & Contributing](#-collaborating--contributing)
- [License](#-license)

---

## 🚀 Overview

`react-native-nitro-biometrics` is a modern, high-performance biometric authentication library designed from the ground up for React Native's **New Architecture**.

By leveraging [Nitro Modules](https://nitro.margelo.com), calls between JavaScript and native code bypass the traditional asynchronous bridge. They execute through **direct, zero-overhead C++ JSI bindings**, connecting your React Native JavaScript thread directly to Apple's **LocalAuthentication** framework on iOS and AndroidX **BiometricPrompt** on Android.

---

## ⚡ Why Nitro Modules?

Traditional React Native biometric packages communicate over the legacy asynchronous JSON bridge, resulting in serialization penalties, unnecessary latency, and thread hops.

`react-native-nitro-biometrics` changes this:

| Feature | Legacy Biometrics Libraries | `react-native-nitro-biometrics` |
| :--- | :---: | :---: |
| **Architecture** | Old Bridge (JSON serialization) | **Nitro Modules (Direct JSI / C++)** |
| **Call Latency** | Milliseconds | **Microseconds (Instantaneous)** |
| **React Native New Architecture** | Partial / Retrofitted | **Native First-Class Citizen** |
| **TypeScript Accuracy** | Manual `.d.ts` definitions | **Spec-Generated Type Safety** |
| **Device Credential Fallback** | Inconsistent across platforms | **Unified iOS Passcode & Android PIN/Pattern** |
| **Built-in React Hook** | ❌ (Must write boilerplate) | **✅ Included (`useBiometrics`)** |
| **Vision Pro / Optic ID Ready** | ❌ | **✅ (`opticId` modality recognized)** |

---

## ✨ Features

- 🏎️ **Ultra-Fast JSI Invocations**: Direct memory access through C++ Nitro bindings.
- 📱 **All Native Modalities**:
  - **iOS**: Apple `LocalAuthentication` (`LAContext`, Face ID, Touch ID, Optic ID, Passcode Fallback).
  - **Android**: AndroidX `BiometricPrompt` (Fingerprint, Face, Iris, Device PIN / Pattern / Passcode).
- 🎣 **Built-in React Hook (`useBiometrics`)**: Reactive state, automatic status checks, loading states, and error handling in one line.
- 🛡️ **Zero Biometric Exposure**: Your app never touches biometric images or raw vectors. Everything is authenticated securely in the hardware enclave (Apple Secure Enclave / Android StrongBox & TEE).
- 🔑 **Passcode / PIN Fallback**: Gracefully fall back to device credentials when biometrics fail or aren't enrolled.
- 🎯 **100% Strict TypeScript**: Clean, well-documented type definitions generated from the Nitro specification.
- 🧪 **Test-Friendly**: Easy-to-mock interfaces for unit and integration testing in Jest.

---

## 🔍 Supported Biometrics

| Modality | Platform | Hardware Example | Fallback Support |
| :--- | :---: | :--- | :---: |
| **Face ID** | iOS | iPhone X and newer, iPad Pro | Passcode |
| **Touch ID** | iOS / iPadOS | iPhone SE, iPad Air/Mini, Mac | Passcode |
| **Optic ID** | visionOS / iOS | Apple Vision Pro | Passcode |
| **Fingerprint** | Android | Pixel, Galaxy, OnePlus, etc. | PIN / Pattern / Password |
| **Face Unlock** | Android | Class 3 / Strong Biometric Sensors | PIN / Pattern / Password |
| **Iris** | Android | Supported Samsung Galaxy devices | PIN / Pattern / Password |
| **Device Credentials** | iOS & Android | System PIN, Lockscreen Pattern, Passcode | N/A |

---

## 📦 Installation

Install `react-native-nitro-biometrics` and its required peer dependency `react-native-nitro-modules`:

```sh
# Using npm
npm install react-native-nitro-biometrics react-native-nitro-modules

# Using Yarn
yarn add react-native-nitro-biometrics react-native-nitro-modules

# Using pnpm
pnpm add react-native-nitro-biometrics react-native-nitro-modules

# Using Bun
bun add react-native-nitro-biometrics react-native-nitro-modules
```

> [!NOTE]
> Ensure your project has the React Native **New Architecture** enabled (standard in React Native 0.76+).

---

## 🛠 Platform Setup

### iOS Configuration

1. Add `NSFaceIDUsageDescription` to your `ios/<YourAppName>/Info.plist`:

```xml
<key>NSFaceIDUsageDescription</key>
<string>We use Face ID to securely authenticate you and protect your account.</string>
```

2. Install CocoaPods:

```sh
cd ios && pod install && cd ..
```

> [!TIP]
> **Testing on iOS Simulator**: In the Simulator menu, go to **Features** ➔ **Face ID** (or **Touch ID**) ➔ check **Enrolled**. Use **Matching Face** or **Non-matching Face** to simulate success or failure.

---

### Android Configuration

1. Biometric permissions are automatically merged from the library's `AndroidManifest.xml`. If you manage permissions explicitly, verify these exist:

```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />
<!-- For backwards compatibility with Android 9 (API 28) and below -->
<uses-permission android:name="android.permission.USE_FINGERPRINT" android:maxSdkVersion="28" />
```

2. Make sure your `MainActivity` extends `ReactActivity` (which inherits from `AppCompatActivity` / `FragmentActivity`). This is standard across all React Native projects.

> [!TIP]
> **Testing on Android Emulator**: Open your emulator and run:
> ```sh
> adb -e emu finger touch 1
> ```

---

## 🏁 Quick Start

### 1. Functional API

The simplest way to check availability and authenticate users imperatively:

```tsx
import {
  canAuthenticate,
  authenticate,
  getBiometryType,
} from 'react-native-nitro-biometrics';

// 1. Check device capabilities & enrollment
async function checkSupport() {
  const status = await canAuthenticate();

  console.log('Available:', status.isAvailable);       // true | false
  console.log('Primary Biometry:', status.biometryType); // 'faceId' | 'touchId' | 'fingerprint' | 'face' | 'none'
  console.log('All Modalities:', status.biometryTypes);  // ['faceId']
  console.log('Enrolled:', status.enrolled);           // true | false
  console.log('Device Passcode Set:', status.isDeviceSecure); // true | false
}

// 2. Request authentication
async function handleBiometricAuth() {
  const result = await authenticate({
    promptMessage: 'Unlock your encrypted vault',
    subtitle: 'Confirm your biometric identity',
    cancelButtonText: 'Cancel',
    fallbackButtonText: 'Use Passcode',
    allowDeviceCredentials: true, // Allow PIN/Passcode if biometrics fail
  });

  if (result.success) {
    console.log('Authenticated via:', result.biometryType);
    // Proceed to sensitive content or user session
  } else {
    console.warn('Authentication failed:', result.error);
  }
}
```

---

### 2. React Hook (`useBiometrics`)

Use the reactive `useBiometrics()` hook to automatically inspect hardware status and manage prompt states declaratively inside your UI:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useBiometrics } from 'react-native-nitro-biometrics';

export function BiometricLoginScreen() {
  const {
    isAvailable,
    biometryType,
    enrolled,
    isLoading,
    error,
    authenticate,
  } = useBiometrics({ autoCheck: true, allowDeviceCredentials: true });

  const onAuthenticatePress = async () => {
    const result = await authenticate({
      promptMessage: 'Sign in to Your App',
      subtitle: 'Biometric verification required',
      cancelButtonText: 'Cancel',
      allowDeviceCredentials: true,
    });

    if (result.success) {
      // User authenticated successfully!
    }
  };

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.label}>Checking biometric hardware...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Sensor: {biometryType !== 'none' ? biometryType.toUpperCase() : 'Unavailable'}
      </Text>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity
        style={[styles.button, (!isAvailable || !enrolled) && styles.buttonDisabled]}
        onPress={onAuthenticatePress}
        disabled={!isAvailable && !enrolled}
      >
        <Text style={styles.buttonText}>
          Authenticate with {biometryType === 'faceId' ? 'Face ID' : 'Biometrics'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 24 },
  button: { backgroundColor: '#007AFF', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 },
  buttonDisabled: { backgroundColor: '#A0C4FF' },
  buttonText: { color: '#FFF', fontSize: 16, fontWeight: '600' },
  errorText: { color: '#FF3B30', marginBottom: 12, textAlign: 'center' },
  label: { marginTop: 12, fontSize: 14, color: '#555' },
});
```

---

## 💡 Production Recipes

### Recipe 1: App Lock / Screen Gate on Resume

Lock sensitive screens whenever the application enters the background and prompt for biometrics upon returning:

```tsx
import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { authenticate } from 'react-native-nitro-biometrics';

export function useAppLock(onUnlock: () => void) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === 'active') {
        // App has returned to foreground
        const result = await authenticate({
          promptMessage: 'Unlock App',
          allowDeviceCredentials: true,
        });

        if (result.success) {
          onUnlock();
        }
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, [onUnlock]);
}
```

---

### Recipe 2: High-Security Transaction Authorization

Prompt the user before performing sensitive actions such as fund transfers or changing security settings:

```tsx
import { authenticate } from 'react-native-nitro-biometrics';

async function authorizeTransfer(amount: number, recipient: string) {
  const result = await authenticate({
    promptMessage: `Authorize Transfer of $${amount}`,
    subtitle: `Sending to ${recipient}`,
    description: 'Confirm your identity with biometrics to authorize this transaction.',
    cancelButtonText: 'Cancel Transfer',
    allowDeviceCredentials: false, // Disallow passcode for strict biometric verification
    confirmationRequired: true,    // Android: require explicit confirmation
  });

  if (!result.success) {
    if (result.error === 'userCanceled') {
      throw new Error('Transaction was cancelled by the user.');
    }
    throw new Error(`Authentication failed: ${result.error}`);
  }

  // Proceed with transaction API call
  return api.sendTransfer({ amount, recipient });
}
```

---

### Recipe 3: Device Passcode Fallback

Provide a seamless fallback to the device lock PIN, pattern, or passcode if biometric enrollment is missing or verification fails:

```tsx
import { canAuthenticate, authenticate } from 'react-native-nitro-biometrics';

async function unlockWithFlexibleSecurity() {
  // Check if either biometrics OR device passcode are set up
  const status = await canAuthenticate(true);

  if (!status.isAvailable && !status.isDeviceSecure) {
    alert('Please set up a device lock passcode in your system Settings.');
    return false;
  }

  const result = await authenticate({
    promptMessage: 'Unlock Application',
    fallbackButtonText: 'Enter Passcode',
    allowDeviceCredentials: true,
  });

  return result.success;
}
```

---

## 📖 API Reference

### `canAuthenticate(allowDeviceCredentials?: boolean): Promise<BiometricsStatus>`

Checks hardware availability, biometric enrollment, and device security configurations.

- **`allowDeviceCredentials`** *(optional, default: `false`)*: When set to `true`, `isAvailable` returns `true` if either biometric sensors or a device lock screen passcode/PIN is available.

---

### `authenticate(options: AuthenticateOptions): Promise<AuthenticateResult>`

Displays the native operating system biometric prompt.

#### `AuthenticateOptions`

| Parameter | Type | Default | Platform | Description |
| :--- | :---: | :---: | :---: | :--- |
| `promptMessage` | `string` | *(Required)* | All | Primary title / reason shown in prompt. |
| `subtitle` | `string` | `undefined` | Android | Subtitle displayed below the title. |
| `description` | `string` | `undefined` | Android | Extended explanatory description. |
| `cancelButtonText` | `string` | `"Cancel"` | All | Label for the negative / cancel button. |
| `fallbackButtonText` | `string` | `"Use Passcode"` | iOS | Label for the alternative fallback button. |
| `allowDeviceCredentials` | `boolean` | `false` | All | Allows fallback to device PIN / Pattern / Passcode. |
| `confirmationRequired` | `boolean` | `false` | Android | Requires explicit button press after passive face match. |

---

### `getBiometryType(allowDeviceCredentials?: boolean): Promise<BiometryType>`

Convenience utility that resolves to the primary `BiometryType` supported on the current device.

---

### `isSensorAvailable(allowDeviceCredentials?: boolean): Promise<boolean>`

Convenience utility that returns a simple boolean indicating whether authentication hardware is functional.

---

### `useBiometrics(options?: UseBiometricsOptions): UseBiometricsReturn`

React hook for reactive biometric state management.

#### `UseBiometricsOptions`
| Option | Type | Default | Description |
| :--- | :---: | :---: | :--- |
| `autoCheck` | `boolean` | `true` | Automatically checks hardware status on mount. |
| `allowDeviceCredentials` | `boolean` | `false` | Considers device passcode when checking availability. |

#### `UseBiometricsReturn`
| Property | Type | Description |
| :--- | :---: | :--- |
| `isAvailable` | `boolean` | `true` if biometrics (or passcode if enabled) can authenticate. |
| `biometryType` | `BiometryType` | Primary biometric type (`'faceId'`, `'touchId'`, etc.). |
| `biometryTypes` | `BiometryType[]` | List of all supported biometric modalities detected. |
| `enrolled` | `boolean` | `true` if at least one biometric record is enrolled. |
| `isDeviceSecure` | `boolean` | `true` if lockscreen passcode/PIN is set. |
| `isLoading` | `boolean` | `true` during status check or active authentication prompt. |
| `error` | `string \| undefined` | Last error encountered. |
| `status` | `BiometricsStatus \| null` | Full raw status object. |
| `checkStatus` | `(allowCredentials?: boolean) => Promise<BiometricsStatus>` | Manually trigger a status refresh. |
| `authenticate` | `(options: AuthenticateOptions) => Promise<AuthenticateResult>` | Prompt user for biometric authentication. |

---

### Types & Options

#### `BiometryType`
```typescript
type BiometryType =
  | 'none'
  | 'touchId'
  | 'faceId'
  | 'opticId'
  | 'fingerprint'
  | 'face'
  | 'iris';
```

#### `BiometricsStatus`
```typescript
interface BiometricsStatus {
  isAvailable: boolean;
  biometryType: BiometryType;
  biometryTypes: BiometryType[];
  enrolled: boolean;
  isDeviceSecure: boolean;
  error?: string;
}
```

#### `AuthenticateResult`
```typescript
interface AuthenticateResult {
  success: boolean;
  biometryType?: BiometryType;
  error?: string;
  warning?: string;
}
```

---

### Standardized Error Codes

Errors are mapped to uniform string identifiers across both iOS and Android:

| Error Code | Explanation | Recommended UX Handling |
| :--- | :--- | :--- |
| `userCanceled` | User clicked Cancel or dismissed dialog. | Do not display error; let user retry when ready. |
| `userFallback` | User chose fallback button (e.g. Passcode). | Present custom PIN input or trigger credentials. |
| `systemCanceled` | OS interrupted prompt (phone call, app switched). | Silently reset authentication state. |
| `notEnrolled` | Hardware present, but no biometrics enrolled. | Prompt user to enroll biometrics in Settings. |
| `passcodeNotSet` | No device lock passcode is configured. | Instruct user to secure device with a passcode. |
| `lockout` | Temporarily locked due to too many failed attempts. | Prompt user to wait 30 seconds or use passcode. |
| `lockoutPermanent` | Permanently locked; requires strong device auth. | Direct user to authenticate via device lock screen. |
| `hardwareUnavailable` | Sensor is busy or temporarily disabled. | Offer alternative login method or retry later. |
| `notSupported` | Device has no biometric hardware capabilities. | Hide biometric toggle; use standard credentials. |
| `activityUnavailable` | Host Android activity is not a `FragmentActivity`. | Ensure `MainActivity` inherits from `ReactActivity`. |
| `unknown` | An unanticipated OS-level error occurred. | Log error diagnostic and provide fallback. |

---

## 🔒 Security & Privacy

1. **Zero Raw Biometric Access**: Biometric templates (fingerprint minutiae, 3D facial depth maps) never leave the hardware's isolated security enclave. The operating system only returns a cryptographically signed Boolean confirmation.
2. **Fresh Authentication Contexts**: Every authentication call creates a clean, ephemeral `LAContext` (iOS) or `BiometricPrompt` session (Android) to prevent replay vulnerabilities.
3. **No Network Transmission**: Biometric data is never serialized or transmitted across network connections.
4. **Defense-in-Depth Recommendation**: Biometrics should authenticate user presence on the device. For critical transactions, sign server challenges with a hardware-backed private key stored in the device Keystore / Keychain.

---

## 🧪 Jest Testing & Mocking

When writing unit tests with Jest, mock `react-native-nitro-biometrics` without needing native binaries:

```typescript
// __mocks__/react-native-nitro-biometrics.ts
export const canAuthenticate = jest.fn().mockResolvedValue({
  isAvailable: true,
  biometryType: 'faceId',
  biometryTypes: ['faceId'],
  enrolled: true,
  isDeviceSecure: true,
});

export const authenticate = jest.fn().mockResolvedValue({
  success: true,
  biometryType: 'faceId',
});

export const getBiometryType = jest.fn().mockResolvedValue('faceId');
export const isSensorAvailable = jest.fn().mockResolvedValue(true);

export const useBiometrics = jest.fn().mockReturnValue({
  isAvailable: true,
  biometryType: 'faceId',
  biometryTypes: ['faceId'],
  enrolled: true,
  isDeviceSecure: true,
  isLoading: false,
  error: undefined,
  checkStatus: jest.fn(),
  authenticate: jest.fn().mockResolvedValue({ success: true, biometryType: 'faceId' }),
});
```

---

## 📱 Example App

A full-featured showcase app demonstrating all modalities, error triggers, and hooks is available in the [`example/`](./example/) directory.

To run the example app:

```sh
# 1. Install dependencies
yarn

# 2. Start Metro bundler
yarn example start

# 3. Run on iOS
yarn example ios

# 4. Run on Android
yarn example android
```

---

## 🤝 Collaborating & Contributing

We welcome contributions of all sizes! Whether you are:
- Reporting a bug
- Proposing new features (e.g., CryptoObject signing, Passkey integration)
- Improving documentation
- Optimizing native Swift or Kotlin implementations

Please check out our **[Collaboration Guide (COLLABORATION.md)](./COLLABORATION.md)** and **[Contributing Guide (CONTRIBUTING.md)](./CONTRIBUTING.md)** to get started with our development workflows, code standards, and PR guidelines.

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

---

<div align="center">
  <sub>Built with ❤️ by <a href="https://github.com/yashnandha">Yash Nandha</a> and the open-source community. Powered by <a href="https://nitro.margelo.com">Nitro Modules</a>.</sub>
</div>
