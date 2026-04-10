# BHC Jobs - React Native App

A job portal mobile application built with React Native (Expo).

## Features
- Landing Page with dynamic data from APIs
- Popular Industries, Recommended Jobs, Popular Companies sections
- Login screen with validation
- Registration screen with OTP verification
- Clean UI with proper error handling

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your Android/iOS phone

### Installation

```bash
# 1. Clone or download the project
cd BhcJobs

# 2. Install dependencies
npm install

# 3. Start the development server
npx expo start
```

### Running the App
1. Run `npx expo start`
2. Scan the QR code with **Expo Go** app on your phone
3. The app will load on your device

### Building APK (Android)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build -p android --profile preview
```

## Project Structure

```
BhcJobs/
├── App.js                    # Navigation setup
├── src/
│   ├── api/
│   │   └── apiService.js     # All API calls
│   ├── screens/
│   │   ├── HomeScreen.js     # Landing page
│   │   ├── LoginScreen.js    # Login screen
│   │   └── RegisterScreen.js # Registration + OTP
│   └── components/
│       ├── IndustryCard.js   # Industry list item
│       ├── JobCard.js        # Job list item
│       └── CompanyCard.js    # Company list item
└── README.md
```

## API Details

- Base URL: `https://dev.bhcjobs.com`
- Image Storage: `https://dev.bhcjobs.com/storage`

## Tech Stack
- React Native (Expo)
- React Navigation
- Axios
- React Hooks (useState, useEffect)