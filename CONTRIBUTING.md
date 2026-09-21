# Contributing to react-native-nitro-biometrics

First off, thank you for taking the time to contribute! 🎉

All contributions are welcome, whether it's fixing bugs, improving documentation, submitting feature proposals, or optimizing native Swift and Kotlin implementations.

Please read our [Code of Conduct](./CODE_OF_CONDUCT.md) and [Collaboration Guide](./COLLABORATION.md) to get the most out of working with our team and community.

---

## 🧭 Collaboration & RFCs

For extensive guidelines on how we work together, proposing architectural changes, pair programming, and our core development philosophy, please read our **[Collaboration Guide (COLLABORATION.md)](./COLLABORATION.md)**.

---

## 💻 Development Workflow

This project is a monorepo managed with **Yarn workspaces (Yarn Berry v4)**. It contains:
- The core library package in the root directory.
- An interactive example app in the `example/` directory.

### 1. Prerequisites

- **Node.js**: `>= 18.0.0` (see [`.nvmrc`](./.nvmrc))
- **Yarn**: `4.x`
- **macOS** with Xcode 15+ (for iOS / visionOS development)
- **Android Studio** with SDK 34+ and NDK (for Android development)

### 2. Setup

Install dependencies across the monorepo:

```sh
yarn
```

> [!NOTE]
> Since this monorepo relies on Yarn workspaces, avoid running `npm install` directly in this repo.

---

## ⚡ Working with Nitro Modules

This project uses **Nitro Modules**. The C++ JSI glue code is generated automatically from our TypeScript specification by Nitrogen.

Run Nitrogen whenever you make changes to `src/NitroBiometrics.nitro.ts` or when bootstrapping a new clone:

```sh
yarn nitrogen
```

> [!IMPORTANT]
> Never manually edit files inside `nitrogen/` or `cpp/`. Nitrogen will overwrite them on the next run. Always modify the TypeScript spec in `src/NitroBiometrics.nitro.ts`.

---

## 📱 Running the Example App

The example app in [`example/`](./example/) is preconfigured with the local library package.

- **Start Metro:**
  ```sh
  yarn example start
  ```
- **Run on iOS:**
  ```sh
  yarn example ios
  ```
- **Run on Android:**
  ```sh
  yarn example android
  ```
- **Run on Web:**
  ```sh
  yarn example web
  ```

### Native IDE Setup

- **iOS (Xcode)**: Open `example/ios/NitroBiometricsExample.xcworkspace`. You can find and edit the native Swift files at `Pods > Development Pods > react-native-nitro-biometrics`.
- **Android (Android Studio)**: Open the `example/android` directory. Source files are located under `react-native-nitro-biometrics`.

---

## 🧪 Testing & Code Quality

Before creating a pull request, ensure all checks pass:

```sh
# Type-check TypeScript code
yarn typecheck

# Check and fix linting & formatting issues
yarn lint
yarn lint --fix

# Run unit test suite
yarn test
```

---

## 📝 Commit Convention

We follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) specification:

- `feat`: New features or API additions (e.g. `feat: add biometric crypto object support`)
- `fix`: Bug fixes (e.g. `fix: handle Android activity recreation gracefully`)
- `docs`: Documentation updates or corrections
- `refactor`: Internal code structure changes without functional differences
- `perf`: Performance improvements
- `test`: Adding or updating test cases
- `chore`: Build tooling, dependency, or CI changes

Pre-commit hooks configured via `lefthook` and `commitlint` will automatically validate commit messages before they are created.

---

## 🚀 Creating a Pull Request

1. Fork the repo and create your feature branch:
   ```sh
   git checkout -b feat/my-awesome-feature
   ```
2. Commit your changes following conventional commits.
3. Verify that `yarn typecheck`, `yarn lint`, and `yarn test` pass cleanly.
4. Push your branch to GitHub and open a Pull Request.
5. Provide a clear description of your changes, referencing any relevant issues.

Thank you for helping make `react-native-nitro-biometrics` even better! 🚀
