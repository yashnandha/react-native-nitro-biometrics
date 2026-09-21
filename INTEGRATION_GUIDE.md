# Integration Guide: react-native-nitro-biometrics

This guide covers how to install, configure, and integrate `react-native-nitro-biometrics` into any React Native application.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Native Setup](#native-setup)
   - [iOS Setup](#ios-setup)
   - [Android Setup](#android-setup)
4. [Core Concepts & API Overview](#core-concepts--api-overview)
5. [Common Integration Scenarios](#common-integration-scenarios)
   - [Scenario 1: Checking Biometric Availability & Hardware Type](#scenario-1-checking-biometric-availability--hardware-type)
   - [Scenario 2: App Launch Biometric Lock Screen](#scenario-2-app-launch-biometric-lock-screen)
   - [Scenario 3: Enabling / Disabling Biometrics in Settings](#scenario-3-enabling--disabling-biometrics-in-settings)
   - [Scenario 4: Authorizing High-Security Actions (Payments / Transfers)](#scenario-4-authorizing-high-security-actions-payments--transfers)
   - [Scenario 5: Using the React Hook](#scenario-5-using-the-react-hook)
6. [Migrating from react-native-biometrics](#migrating-from-react-native-biometrics)
7. [Error Handling & Status Codes](#error-handling--status-codes)
8. [Troubleshooting & FAQs](#troubleshooting--faqs)

---

## Prerequisites

- React Native `>= 0.75.0`
- React Native New Architecture enabled
- Node `>= 18`
- iOS 13.0+ / Android API 24+

---

## Installation

Install `react-native-nitro-biometrics` alongside `react-native-nitro-modules`:

```bash
# Using Yarn
yarn add react-native-nitro-biometrics react-native-nitro-modules

# Using npm
npm install react-native-nitro-biometrics react-native-nitro-modules
```

### Local Testing / Monorepo Setup

If you are developing locally without publishing to npm:

```bash
# Option A: Install from local tarball
yarn add /path/to/react-native-nitro-biometrics/package.tgz react-native-nitro-modules

# Option B: Install via relative path
yarn add file:../path-to/react-native-nitro-biometrics react-native-nitro-modules
```

---

## Native Setup

### iOS Setup

1. Open your project's `ios/<YourAppName>/Info.plist` and add the `NSFaceIDUsageDescription` entry:

```xml
<key>NSFaceIDUsageDescription</key>
<string>Allow $(PRODUCT_NAME) to use Face ID for biometric authentication.</string>
```

2. Run CocoaPods:

```bash
cd ios && pod install && cd ..
```

---

### Android Setup

1. Permissions are automatically merged via the library's `AndroidManifest.xml`. If your project overrides manifest merger behavior, ensure the following permissions exist:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.USE_BIOMETRIC" />
    <uses-permission android:name="android.permission.USE_FINGERPRINT" android:maxSdkVersion="28" />
</manifest>
```

2. Ensure your `MainActivity` extends `ReactActivity` (standard in React Native).

---

## Core Concepts & API Overview

The library exports both direct utility functions and a React hook:

```typescript
import {
  canAuthenticate,
  authenticate,
  getBiometryType,
  isSensorAvailable,
  useBiometrics,
  NitroBiometrics,
} from 'react-native-nitro-biometrics';

import type {
  BiometryType,
  BiometricsStatus,
  AuthenticateOptions,
  AuthenticateResult,
} from 'react-native-nitro-biometrics';
```

---

## Common Integration Scenarios

### Scenario 1: Checking Biometric Availability & Hardware Type

Check if the device has biometric sensors and if the user has enrolled biometrics:

```typescript
import { canAuthenticate, getBiometryType } from 'react-native-nitro-biometrics';

async function verifyBiometricCapabilities() {
  const status = await canAuthenticate();

  if (!status.isAvailable) {
    if (status.error === 'notEnrolled') {
      console.log('Biometric hardware present, but user has no enrolled biometrics.');
    } else if (status.error === 'notSupported') {
      console.log('Device lacks biometric hardware.');
    }
    return false;
  }

  console.log('Primary biometry:', status.biometryType); // 'faceId' | 'touchId' | 'fingerprint' | 'face' | 'none'
  console.log('Detected biometry types:', status.biometryTypes);
  console.log('Device has secure lock screen:', status.isDeviceSecure);

  return true;
}
```

---

### Scenario 2: App Launch Biometric Lock Screen

When the app returns from background or launches, prompt the user for biometrics:

```typescript
import { authenticate } from 'react-native-nitro-biometrics';

export async function promptAppUnlock(): Promise<boolean> {
  const result = await authenticate({
    promptMessage: 'Unlock Application',
    subtitle: 'Scan your biometric to access your account',
    cancelButtonText: 'Cancel',
    fallbackButtonText: 'Use Passcode',
    allowDeviceCredentials: true, // Allows user to enter device PIN/Pattern if biometrics fail
  });

  if (result.success) {
    console.log('Unlocked with biometry type:', result.biometryType);
    return true;
  }

  if (result.error === 'userCanceled') {
    console.log('User dismissed prompt');
  } else if (result.error === 'lockout') {
    console.warn('Biometrics temporarily locked out due to too many failed attempts');
  }

  return false;
}
```

---

### Scenario 3: Enabling / Disabling Biometrics in Settings

When a user toggles "Enable Biometrics" in your Security or Settings screen:

```typescript
import { canAuthenticate, authenticate } from 'react-native-nitro-biometrics';

export async function toggleBiometricsSetting(enable: boolean): Promise<boolean> {
  if (enable) {
    // 1. Verify sensor availability
    const status = await canAuthenticate();
    if (!status.isAvailable) {
      throw new Error(`Biometrics unavailable: ${status.error || 'Unknown reason'}`);
    }

    // 2. Perform a test authentication to confirm user identity
    const authResult = await authenticate({
      promptMessage: 'Confirm biometric enrollment',
      cancelButtonText: 'Cancel',
      allowDeviceCredentials: false,
    });

    if (!authResult.success) {
      return false;
    }

    // 3. Save preference in secure storage (e.g. MMKV / Keychain / EncryptedSharedPreferences)
    // await SecureStorage.setItem('biometrics_enabled', 'true');
    return true;
  } else {
    // Disable biometric flag
    // await SecureStorage.setItem('biometrics_enabled', 'false');
    return true;
  }
}
```

---

### Scenario 4: Authorizing High-Security Actions (Payments / Transfers)

Prompt biometrics immediately before finalizing sensitive transactions:

```typescript
import { authenticate } from 'react-native-nitro-biometrics';

export async function authorizePayment(amount: number, recipientName: string): Promise<boolean> {
  const result = await authenticate({
    promptMessage: `Authorize Transfer of $${amount}`,
    subtitle: `Sending to ${recipientName}`,
    description: 'Please confirm your identity using biometrics',
    cancelButtonText: 'Cancel',
    fallbackButtonText: 'Enter Passcode',
    allowDeviceCredentials: true,
  });

  return result.success;
}
```

---

### Scenario 5: Using the React Hook

For declarative components that need reactive biometric state and loading indicators:

```tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useBiometrics } from 'react-native-nitro-biometrics';

export function SecurityCenterCard() {
  const {
    isAvailable,
    biometryType,
    enrolled,
    isDeviceSecure,
    isLoading,
    authenticate,
    checkStatus,
  } = useBiometrics({ autoCheck: true, allowDeviceCredentials: true });

  const handleAuth = async () => {
    const result = await authenticate({
      promptMessage: 'Authenticate with ' + biometryType,
      allowDeviceCredentials: true,
    });

    if (result.success) {
      alert('Authentication successful!');
    } else {
      alert(`Authentication failed: ${result.error}`);
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="small" />;
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Biometric Protection</Text>
      <Text style={styles.info}>Hardware: {biometryType}</Text>
      <Text style={styles.info}>Enrolled: {enrolled ? 'Yes' : 'No'}</Text>
      <Text style={styles.info}>Device Secured: {isDeviceSecure ? 'Yes' : 'No'}</Text>

      <TouchableOpacity
        style={[styles.button, !isAvailable && styles.disabledButton]}
        onPress={handleAuth}
        disabled={!isAvailable}
      >
        <Text style={styles.buttonText}>Test {biometryType}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, backgroundColor: '#1E293B' },
  title: { fontSize: 18, fontWeight: '700', color: '#F8FAFC', marginBottom: 8 },
  info: { fontSize: 14, color: '#94A3B8', marginBottom: 4 },
  button: { marginTop: 12, padding: 12, backgroundColor: '#0284C7', borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#475569' },
  buttonText: { color: '#FFFFFF', fontWeight: '600' },
});
```

---

## Migrating from react-native-biometrics

If you are replacing `react-native-biometrics`, here is the direct translation:

| Legacy `react-native-biometrics` | `react-native-nitro-biometrics` |
| :--- | :--- |
| `new ReactNativeBiometrics()` | Direct function imports (`canAuthenticate`, `authenticate`) or `NitroBiometrics` |
| `rnBiometrics.isSensorAvailable()` | `const status = await canAuthenticate()` |
| `status.available` | `status.isAvailable` |
| `status.biometryType` (`BiometryTypes.FaceID`) | `status.biometryType` (`'faceId' \| 'touchId' \| 'fingerprint' \| 'face' \| 'none'`) |
| `rnBiometrics.simplePrompt({ promptMessage })` | `await authenticate({ promptMessage, allowDeviceCredentials: true })` |
| `result.success` | `result.success` |

### Before (Legacy):
```typescript
import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';

const rnBiometrics = new ReactNativeBiometrics();
const { available, biometryType } = await rnBiometrics.isSensorAvailable();

if (available && biometryType === BiometryTypes.FaceID) {
  const { success } = await rnBiometrics.simplePrompt({ promptMessage: 'Confirm Face ID' });
}
```

### After (Nitro):
```typescript
import { canAuthenticate, authenticate } from 'react-native-nitro-biometrics';

const { isAvailable, biometryType } = await canAuthenticate();

if (isAvailable && biometryType === 'faceId') {
  const { success } = await authenticate({ promptMessage: 'Confirm Face ID' });
}
```

---

## Error Handling & Status Codes

All errors return clean, standardized string codes on both iOS and Android:

| Error Code | Description | Recommended Handling |
| :--- | :--- | :--- |
| `userCanceled` | User tapped Cancel or dismissed the dialog. | Ignore or allow user to retry. |
| `userFallback` | User chose fallback credential button. | Show app-level passcode input screen. |
| `systemCanceled` | OS interrupted prompt (incoming call, app backgrounded). | Re-prompt when app returns to foreground. |
| `notEnrolled` | Hardware present, but no biometrics enrolled. | Prompt user to set up biometrics in OS Settings. |
| `passcodeNotSet` | No lock screen passcode/PIN set up on device. | Inform user to secure their device. |
| `lockout` | Temporarily locked out (5+ failed attempts). | Fall back to account password or wait 30s. |
| `lockoutPermanent` | Device requires device passcode unlock before re-enabling biometrics. | Direct user to device lock screen. |
| `hardwareUnavailable` | Sensor busy, initialization error, or camera unavailable. | Retry after brief delay. |
| `notSupported` | Hardware has no biometric sensor. | Hide biometric UI elements. |
| `activityUnavailable` | Android activity is not ready or not a `FragmentActivity`. | Ensure prompt is called after screen mounts. |
| `unknown` | Unspecified native framework error. | Log error and offer password fallback. |

---

## Troubleshooting & FAQs

### 1. iOS: App crashes with `NSFaceIDUsageDescription` missing
**Solution**: Make sure `<key>NSFaceIDUsageDescription</key>` is added to `ios/<AppName>/Info.plist`, then re-run `pod install`.

### 2. Android: Prompt doesn't appear
**Solution**: Ensure your `MainActivity` inherits from `ReactActivity` (which extends `AppCompatActivity` / `FragmentActivity`). Android `BiometricPrompt` requires `FragmentActivity`.

### 3. Simulator Testing
- **iOS Simulator**: Use the simulator top menu: `Features -> Face ID -> Enrolled` and `Features -> Face ID -> Matching / Non-matching Face`.
- **Android Emulator**: In Extended Controls (`...` menu) -> `Fingerprint`, touch the simulated sensor.
