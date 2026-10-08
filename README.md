<div align="center">

  <h1>⚡️ react-native-nitro-biometrics</h1>

  <p>
    <strong>Modern, type-safe biometric authentication for React Native, powered by Nitro Modules.</strong>
  </p>

  <p>
    Face ID &bull; Touch ID &bull; Optic ID &bull; Fingerprint &bull; Face &bull; Iris &bull; Device Credentials
  </p>

  <p>
    <a href="https://www.npmjs.com/package/react-native-nitro-biometrics">
      <img src="https://img.shields.io/npm/v/react-native-nitro-biometrics?style=for-the-badge&logo=npm&color=CB3837&logoColor=white" alt="NPM Version" />
    </a>
    <a href="https://www.npmjs.com/package/react-native-nitro-biometrics">
      <img src="https://img.shields.io/npm/dm/react-native-nitro-biometrics?style=for-the-badge&logo=npm&color=2088FF&logoColor=white" alt="NPM Downloads" />
    </a>
    <a href="https://github.com/yashnandha/react-native-nitro-biometrics">
      <img src="https://img.shields.io/github/stars/yashnandha/react-native-nitro-biometrics?style=for-the-badge&logo=github" alt="GitHub Stars" />
    </a>
    <a href="./LICENSE">
      <img src="https://img.shields.io/npm/l/react-native-nitro-biometrics?style=for-the-badge&color=28A745" alt="MIT License" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/Platforms-iOS%20%7C%20Android-4E5D6C?style=for-the-badge&logo=apple&logoColor=white" alt="Platforms iOS and Android" />
    <img src="https://img.shields.io/badge/Native-Swift%20%26%20Kotlin-F05138?style=for-the-badge&logo=swift&logoColor=white" alt="Swift and Kotlin" />
    <img src="https://img.shields.io/badge/TypeScript-Strict%20Types-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <a href="https://nitro.margelo.com">
      <img src="https://img.shields.io/badge/Powered%20by-Nitro%20Modules-FF5722?style=for-the-badge&logo=react&logoColor=white" alt="Powered by Nitro Modules" />
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
- [When Should You Use This?](#-when-should-you-use-this)
- [Features](#-features)
- [Supported Biometrics](#-supported-biometrics)
- [Installation](#-installation)
- [Platform Setup](#-platform-setup)
  - [iOS Configuration](#ios-configuration)
  - [Android Configuration](#android-configuration)

- [Quick Start](#-quick-start)
  - [Functional API](#1-functional-api)
  - [React Hook](#2-react-hook-usebiometrics)

- [Production Recipes](#-production-recipes)
- [API Reference](#-api-reference)
- [Security & Privacy](#-security--privacy)
- [Jest Testing & Mocking](#-jest-testing--mocking)
- [Example App](#-example-app)
- [Contributing](#-collaborating--contributing)
- [License](#-license)

---

## 🚀 Overview

`react-native-nitro-biometrics` is a modern biometric authentication library for React Native applications using the **New Architecture**.

It provides a simple, TypeScript-first API over native biometric frameworks:

- **iOS:** Apple `LocalAuthentication`
- **Android:** AndroidX `BiometricPrompt`
- **JS/native integration:** Nitro Modules / JSI
- **API:** Strict TypeScript types
- **Authentication:** Native OS biometric and device credential prompts

The library does **not** expose raw biometric images, templates, or biometric sensor data to JavaScript.

---

## ⚡ Why Nitro Modules?

`react-native-nitro-biometrics` is built around React Native's **New Architecture** and uses **Nitro Modules** for JavaScript-to-native communication.

| Capability                    |   `react-native-nitro-biometrics`   |
| :---------------------------- | :---------------------------------: |
| **React Native Architecture** |          New Architecture           |
| **Native Integration**        |         Nitro Modules / JSI         |
| **TypeScript**                |         Strictly typed API          |
| **iOS Authentication**        |         LocalAuthentication         |
| **Android Authentication**    |           BiometricPrompt           |
| **Device Credentials**        | Passcode / PIN / Pattern / Password |
| **React Hook**                |          `useBiometrics()`          |
| **Jest Testing**              |                 ✅                  |

> The library delegates biometric matching and authentication decisions to the native operating system APIs.

---

## 🎯 When Should You Use This?

Use `react-native-nitro-biometrics` when your React Native application needs native biometric authentication.

Common use cases include:

- 🔐 Secure app login
- 🔒 App lock and screen protection
- 💳 Transaction authorization
- 🏦 Banking and fintech authentication
- 👤 Re-authentication before sensitive actions
- 🛡️ Security settings confirmation
- 📱 Passwordless authentication flows
- 🔑 Device credential fallback

---

## ✨ Features

### ⚡ Nitro Modules

Uses Nitro Modules / JSI for JavaScript-to-native integration in React Native's New Architecture.

### 📱 Native Biometric Authentication

Built on the platform authentication APIs:

- iOS `LocalAuthentication`
- AndroidX `BiometricPrompt`

### 🎣 Built-in React Hook

Use `useBiometrics()` to manage biometric state and authentication inside React components.

### 🛡️ Zero Raw Biometric Access

Your JavaScript application does not receive:

- Biometric images
- Biometric templates
- Raw fingerprint data
- Raw facial data
- Sensor data

Authentication is handled by the native operating system.

### 🔑 Device Credential Fallback

Support platform device credentials such as:

- iOS Passcode
- Android PIN
- Android Pattern
- Android Password

### 🎯 TypeScript First

Strictly typed:

- Authentication options
- Authentication results
- Biometric types
- Availability status
- Error codes

### 🧪 Jest Friendly

The API can be mocked easily for unit tests without requiring biometric hardware.

---

## 🔍 Supported Biometrics

| Modality               |               Platform               | Availability                        |
| :--------------------- | :----------------------------------: | :---------------------------------- |
| **Face ID**            |                 iOS                  | Supported Face ID devices           |
| **Touch ID**           |             iOS / iPadOS             | Supported Touch ID devices          |
| **Optic ID**           | visionOS / supported Apple platforms | Where supported by the platform API |
| **Fingerprint**        |               Android                | Device and OS dependent             |
| **Face Unlock**        |               Android                | Device and OS dependent             |
| **Iris**               |               Android                | Device and OS dependent             |
| **Device Credentials** |            iOS / Android             | Passcode, PIN, Pattern, Password    |

> Actual biometric availability depends on device hardware, OS version, enrollment state, and platform security policy.

---

## 📦 Installation

Install the package together with the required Nitro Modules dependency.

### npm

```bash
npm install react-native-nitro-biometrics react-native-nitro-modules
```

### Yarn

```bash
yarn add react-native-nitro-biometrics react-native-nitro-modules
```

### pnpm

```bash
pnpm add react-native-nitro-biometrics react-native-nitro-modules
```

### Bun

```bash
bun add react-native-nitro-biometrics react-native-nitro-modules
```

> [!NOTE]
> This library is intended for React Native projects using the **New Architecture**.

---

# 🛠 Platform Setup

## iOS Configuration

Add the Face ID usage description to your application's `Info.plist`:

```xml
<key>NSFaceIDUsageDescription</key>
<string>We use Face ID to securely authenticate you and protect your account.</string>
```

Install CocoaPods:

```bash
cd ios
pod install
cd ..
```

### iOS Simulator

You can test biometric authentication using the simulator's biometric controls.

In the Simulator menu:

**Features → Face ID / Touch ID**

---

## Android Configuration

Verify that your application has the required biometric permissions if your project manages them explicitly:

```xml
<uses-permission android:name="android.permission.USE_BIOMETRIC" />

<uses-permission
    android:name="android.permission.USE_FINGERPRINT"
    android:maxSdkVersion="28" />
```

### Android Activity

Android biometric authentication requires a compatible `FragmentActivity` host.

### Android Emulator

You can simulate fingerprint authentication with:

```bash
adb -e emu finger touch 1
```

---

# 🏁 Quick Start

## 1. Functional API

```tsx
import {
  canAuthenticate,
  authenticate,
  getBiometryType,
} from 'react-native-nitro-biometrics';

async function checkSupport() {
  const status = await canAuthenticate();

  console.log('Available:', status.isAvailable);
  console.log('Primary Biometry:', status.biometryType);
  console.log('All Modalities:', status.biometryTypes);
  console.log('Enrolled:', status.enrolled);
  console.log('Device Secure:', status.isDeviceSecure);
}

async function handleBiometricAuth() {
  const result = await authenticate({
    promptMessage: 'Unlock your encrypted vault',
    subtitle: 'Confirm your biometric identity',
    cancelButtonText: 'Cancel',
    fallbackButtonText: 'Use Passcode',
    allowDeviceCredentials: true,
  });

  if (result.success) {
    console.log('Authenticated via:', result.biometryType);
  } else {
    console.warn('Authentication failed:', result.error);
  }
}
```

---

## 2. React Hook (`useBiometrics`)

```tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { useBiometrics } from 'react-native-nitro-biometrics';

export function BiometricLoginScreen() {
  const {
    isAvailable,
    biometryType,
    enrolled,
    isLoading,
    error,
    authenticate,
  } = useBiometrics({
    autoCheck: true,
    allowDeviceCredentials: true,
  });

  const onAuthenticatePress = async () => {
    const result = await authenticate({
      promptMessage: 'Sign in to Your App',
      subtitle: 'Biometric verification required',
      cancelButtonText: 'Cancel',
      allowDeviceCredentials: true,
    });

    if (result.success) {
      console.log('Authentication successful');
    }
  };

  if (isLoading) {
    return <Text>Checking biometric hardware...</Text>;
  }

  return (
    <View>
      <Text>
        Sensor: {biometryType !== 'none' ? biometryType : 'Unavailable'}
      </Text>

      {error ? <Text>{error}</Text> : null}

      <TouchableOpacity
        onPress={onAuthenticatePress}
        disabled={!isAvailable || !enrolled}
      >
        <Text>Authenticate with Biometrics</Text>
      </TouchableOpacity>
    </View>
  );
}
```

---

# 💡 Production Recipes

## Recipe 1: App Lock / Screen Gate

Authenticate when the application returns to the foreground:

```tsx
import { useEffect, useRef } from 'react';
import { AppState, type AppStateStatus } from 'react-native';

import { authenticate } from 'react-native-nitro-biometrics';

export function useAppLock(onUnlock: () => void) {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      async (nextState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextState === 'active'
        ) {
          const result = await authenticate({
            promptMessage: 'Unlock App',
            allowDeviceCredentials: true,
          });

          if (result.success) {
            onUnlock();
          }
        }

        appState.current = nextState;
      }
    );

    return () => subscription.remove();
  }, [onUnlock]);
}
```

---

## Recipe 2: Sensitive Transaction Authorization

For sensitive operations, authenticate immediately before performing the action:

```tsx
import { authenticate } from 'react-native-nitro-biometrics';

async function authorizeTransfer(amount: number, recipient: string) {
  const result = await authenticate({
    promptMessage: `Authorize Transfer of $${amount}`,
    subtitle: `Sending to ${recipient}`,
    description: 'Confirm your identity to authorize this transaction.',
    cancelButtonText: 'Cancel Transfer',
    allowDeviceCredentials: false,
    confirmationRequired: true,
  });

  if (!result.success) {
    throw new Error(`Authentication failed: ${result.error}`);
  }

  return api.sendTransfer({
    amount,
    recipient,
  });
}
```

> Authentication should be performed as close as practical to the sensitive operation. Your backend should independently authorize and validate high-value transactions.

---

## Recipe 3: Device Credential Fallback

Allow biometric authentication with device credential fallback:

```tsx
import { canAuthenticate, authenticate } from 'react-native-nitro-biometrics';

async function unlockWithFlexibleSecurity() {
  const status = await canAuthenticate(true);

  if (!status.isAvailable && !status.isDeviceSecure) {
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

# 📖 API Reference

## `canAuthenticate()`

Checks whether biometric authentication and/or device credentials are available.

```ts
const status = await canAuthenticate();
```

You can optionally include device credentials:

```ts
const status = await canAuthenticate(true);
```

Example result:

```ts
{
  isAvailable: true,
  biometryType: 'faceId',
  biometryTypes: ['faceId'],
  enrolled: true,
  isDeviceSecure: true
}
```

---

## `authenticate(options)`

Displays the native operating system authentication prompt.

Example:

```ts
const result = await authenticate({
  promptMessage: 'Authenticate',
  allowDeviceCredentials: true,
});
```

### Options

| Option                   | Type      | Default          | Platform |
| :----------------------- | :-------- | :--------------- | :------- |
| `promptMessage`          | `string`  | Required         | All      |
| `subtitle`               | `string`  | `undefined`      | Android  |
| `description`            | `string`  | `undefined`      | Android  |
| `cancelButtonText`       | `string`  | `"Cancel"`       | All      |
| `fallbackButtonText`     | `string`  | `"Use Passcode"` | iOS      |
| `allowDeviceCredentials` | `boolean` | `false`          | All      |
| `confirmationRequired`   | `boolean` | `false`          | Android  |

---

## `getBiometryType()`

Returns the primary biometric type detected on the current device.

```ts
const type = await getBiometryType();
```

Device credentials can optionally be considered:

```ts
const type = await getBiometryType(true);
```

---

## `isSensorAvailable()`

Returns whether authentication is currently available.

```ts
const available = await isSensorAvailable();
```

With device credential support:

```ts
const available = await isSensorAvailable(true);
```

---

# 🎣 `useBiometrics()`

A React hook for biometric state and authentication.

```ts
const {
  isAvailable,
  biometryType,
  biometryTypes,
  enrolled,
  isDeviceSecure,
  isLoading,
  error,
  status,
  checkStatus,
  authenticate,
} = useBiometrics({
  autoCheck: true,
  allowDeviceCredentials: true,
});
```

### Options

| Option                   | Type      | Default | Description                                            |
| :----------------------- | :-------- | :------ | :----------------------------------------------------- |
| `autoCheck`              | `boolean` | `true`  | Check biometric status on mount.                       |
| `allowDeviceCredentials` | `boolean` | `false` | Include device credentials when checking availability. |

### Return Values

| Property         | Type                       | Description                                         |
| :--------------- | :------------------------- | :-------------------------------------------------- |
| `isAvailable`    | `boolean`                  | Whether authentication is available.                |
| `biometryType`   | `BiometryType`             | Primary biometric type.                             |
| `biometryTypes`  | `BiometryType[]`           | Detected biometric modalities.                      |
| `enrolled`       | `boolean`                  | Whether biometric credentials are enrolled.         |
| `isDeviceSecure` | `boolean`                  | Whether a device lock is configured.                |
| `isLoading`      | `boolean`                  | Whether a status check or authentication is active. |
| `error`          | `string \| undefined`      | Last error encountered.                             |
| `status`         | `BiometricsStatus \| null` | Full biometric status.                              |
| `checkStatus`    | `function`                 | Refresh biometric status.                           |
| `authenticate`   | `function`                 | Start authentication.                               |

---

# 🧩 Types

```ts
type BiometryType =
  | 'none'
  | 'touchId'
  | 'faceId'
  | 'opticId'
  | 'fingerprint'
  | 'face'
  | 'iris';

interface BiometricsStatus {
  isAvailable: boolean;
  biometryType: BiometryType;
  biometryTypes: BiometryType[];
  enrolled: boolean;
  isDeviceSecure: boolean;
  error?: string;
}

interface AuthenticateResult {
  success: boolean;
  biometryType?: BiometryType;
  error?: string;
  warning?: string;
}
```

> Refer to the package source for the exact exported types and the latest API surface.

---

# ⚠️ Standardized Error Codes

| Error Code            | Meaning                                                |
| :-------------------- | :----------------------------------------------------- |
| `userCanceled`        | User cancelled or dismissed authentication.            |
| `userFallback`        | User selected the fallback authentication option.      |
| `systemCanceled`      | OS interrupted the authentication prompt.              |
| `notEnrolled`         | No biometric credentials are enrolled.                 |
| `passcodeNotSet`      | No device lock credential is configured.               |
| `lockout`             | Temporary biometric lockout.                           |
| `lockoutPermanent`    | Strong device authentication is required.              |
| `hardwareUnavailable` | Biometric hardware is unavailable.                     |
| `notSupported`        | Device does not support the requested authentication.  |
| `activityUnavailable` | Android host activity is incompatible with the prompt. |
| `unknown`             | Unexpected OS-level error.                             |

---

# 🔒 Security & Privacy

`react-native-nitro-biometrics` delegates biometric authentication to the native operating system APIs.

## What the library does not access

The library does not directly access:

- ❌ Biometric images
- ❌ Fingerprint images
- ❌ Facial images used for biometric matching
- ❌ Biometric templates
- ❌ Raw biometric sensor data

The application receives an authentication result from the platform API rather than the user's biometric data.

## No Network Transmission

The library does not send biometric information to a remote server.

Your application's own networking behavior is outside the scope of this package.

## Recommended High-Security Architecture

For high-value authentication flows, consider combining:

1. Native biometric user authentication
2. Hardware-backed cryptographic keys
3. Server-generated challenges
4. Cryptographic challenge signing
5. Server-side authorization and validation

> Biometric security ultimately depends on the operating system, device hardware, enrollment state, and platform security configuration.

---

# 🧪 Jest Testing & Mocking

The package APIs can be mocked for unit tests.

Create:

```text
__mocks__/react-native-nitro-biometrics.ts
```

Example:

```ts
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
  authenticate: jest.fn().mockResolvedValue({
    success: true,
    biometryType: 'faceId',
  }),
});
```

---

# 📱 Example App

A showcase application is available in the repository's [`example/`](./example/) directory.

The example demonstrates:

- Biometric availability
- Biometric type detection
- Authentication
- Device credential fallback
- Error handling
- `useBiometrics()` usage
- Platform-specific behavior

Example commands:

```bash
yarn
yarn example start
yarn example ios
```

Android:

```bash
yarn example android
```

---

# 🏗️ Architecture

The library follows a simple architecture:

```text
React Native Application
          │
          ▼
 TypeScript API / Hook
          │
          ▼
    Nitro Modules
          │
       JSI / Native
       ┌────┴────┐
       ▼         ▼
     iOS      Android
       │         │
       ▼         ▼
LocalAuth   BiometricPrompt
       │         │
       ▼         ▼
 Native OS Authentication
```

This keeps platform-specific biometric handling inside the native authentication frameworks.

---

# 🤝 Collaborating & Contributing

Contributions are welcome.

You can help by:

- Reporting bugs
- Proposing features
- Improving documentation
- Adding tests
- Improving Swift implementations
- Improving Kotlin implementations
- Testing on different devices
- Sharing integration feedback

Before contributing, review:

- [`COLLABORATION.md`](./COLLABORATION.md)
- [`CONTRIBUTING.md`](./CONTRIBUTING.md)

---

# 🐛 Reporting Issues

If you find a bug, please open an issue with:

- React Native version
- Package version
- iOS / Android version
- Device model
- New Architecture status
- Steps to reproduce
- Expected behavior
- Actual behavior
- Relevant logs

Please avoid posting sensitive authentication information or personal data.

---

# ⭐ Support the Project

If this package is useful in your project, consider:

- ⭐ Starring the repository
- 🐛 Reporting issues
- 💡 Suggesting improvements
- 🔧 Contributing pull requests
- 📣 Sharing the package with other React Native developers

Every contribution helps improve the project.

---

# 📄 License

This project is licensed under the **MIT License**.

See [`LICENSE`](./LICENSE) for details.

---

<div align="center">

  <sub>
    Built by
    <a href="https://github.com/yashnandha">Yash Nandha</a>
    and the open-source community.
  </sub>

  <br />

  <sub>
    Powered by
    <a href="https://nitro.margelo.com">Nitro Modules</a>.
  </sub>

</div>
