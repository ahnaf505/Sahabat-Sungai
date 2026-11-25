<div align="center">
  <img src="./assets/water-drop.png" alt="Sahabat Sungai logo" width="96" />
  <h1>Sahabat Sungai</h1>
  <p>A mobile app for monitoring river water quality and promoting river conservation.</p>
</div>

## Overview

**Sahabat Sungai** is an Expo / React Native mobile application built with Expo Router. It helps community members track local river monitoring dates, submit field observations, and learn practical habits for keeping rivers clean.

## Screens & Features

- **Beranda (`app/index.js`, `App.js`)**: Home dashboard featuring the river location and last monitoring card (`RiverInfoCard.js`) along with quick actions (**Input Pengamatan**, **Lihat Analisis**, and **Belajar Bioindikator**).
- **Input Pengamatan / Pantau (`app/input-observation.js`, `InputObservationScreen.js`)**: Observation input screen accessible from the home action button or bottom navigation.
- **Edukasi (`app/edukasi.js`)**: Educational cards covering everyday river-care habits.
- **Profil (`app/profil.js`)**: User profile overview, activity summary, and settings placeholder.
- **Bottom Navigation (`BottomNavigation.js`)**: Persistent tab bar with safe-area support across all main routes.

## Tech Stack

- **Framework**: Expo (`~58.0.26`) & React Native (`0.88.1`)
- **Navigation**: Expo Router (`~58.0.32`)
- **UI & Styling**: `expo-linear-gradient`, `expo-font`, `react-native-safe-area-context`, `react-native-svg`

## Project Structure

```text
.
├── app/                         # Expo Router screens and root layout
│   ├── _layout.js               # Font loading, Stack navigator, and BottomNavigation
│   ├── index.js                 # Home route
│   ├── input-observation.js     # Observation input route
│   ├── edukasi.js               # Education route
│   └── profil.js                # Profile route
├── assets/
│   ├── fonts/                   # AvantGarde & Poppins font files
│   ├── icons/                   # SVG icons
│   ├── images/                  # River and bush illustrations
│   └── water-drop.png           # App logo
├── .github/workflows/
│   └── release-android.yml      # Automated Android release APK workflow
├── App.js                       # Home screen implementation
├── App.styles.js                # Home screen styles
├── BottomNavigation.js          # Shared bottom tab bar
├── InputObservationScreen.js    # Observation input screen component
├── RiverInfoCard.js             # Reusable river location & monitoring card
├── app.json                     # Expo configuration
└── package.json                 # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js (v24 recommended, matching CI)
- npm
- Android Studio / emulator, Xcode / simulator, or Expo Go

### Installation

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` is used because transitive `react-dom@19.3.1` has a peer dependency range conflict with Expo SDK 58's pinned `react@19.3.0`.

### Running Locally

```bash
npx expo start
```

Platform shortcuts:

```bash
npm run android
npm run ios
npm run web
```

### Linting

```bash
npx expo lint
```

## Android Releases (CI)

Tagging a semantic version on `main` (for example, `v0.1.0`) triggers [`.github/workflows/release-android.yml`](.github/workflows/release-android.yml), which:

1. Validates the semantic version tag and checks that the tagged commit is an ancestor of `origin/main`.
2. Installs dependencies and runs `npx expo lint`.
3. Generates the native Android project (`npx expo prebuild --platform android --no-install`).
4. Builds a release APK (`./gradlew app:assembleRelease`), verifies `assets/index.android.bundle` is packaged inside, and publishes `Sahabat-Sungai-<tag>.apk` to GitHub Releases.

## License

Licensed under the [MIT License](./LICENSE).
