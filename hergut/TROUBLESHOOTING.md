# HerGut App - Troubleshooting Guide

## Common Issues and Solutions

### 1. Build Errors with CocoaPods

**Problem**: Module redefinition errors or build failures
```
error Redefinition of module 'react_runtime'
error Could not build module 'TargetConditionals'
```

**Solution**:
```bash
# Clean everything
cd ios
rm -rf Pods Podfile.lock
cd ..

# Set proper locale
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Reinstall pods
cd ios
pod install
cd ..

# Try building again
npx react-native run-ios
```

### 2. Terminal Encoding Issues

**Problem**: CocoaPods fails with encoding errors
```
Unicode Normalization not appropriate for ASCII-8BIT
```

**Solution**:
```bash
# Add to your ~/.zshrc or ~/.bash_profile
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Then restart terminal or run:
source ~/.zshrc
```

### 3. Metro Bundler Issues

**Problem**: Metro bundler won't start or has cache issues

**Solution**:
```bash
# Clear Metro cache
npx react-native start --reset-cache

# Or clear all caches
npx react-native clean
```

### 4. iOS Simulator Issues

**Problem**: App won't launch on simulator

**Solution**:
```bash
# Reset simulator
xcrun simctl erase all

# Or try a different simulator
npx react-native run-ios --simulator="iPhone 14"
```

### 5. Node Modules Issues

**Problem**: Package conflicts or missing dependencies

**Solution**:
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use yarn
rm -rf node_modules yarn.lock
yarn install
```

### 6. Xcode Build Issues

**Problem**: Xcode build fails with various errors

**Solution**:
```bash
# Clean Xcode build folder
cd ios
xcodebuild clean
cd ..

# Or open in Xcode and clean build folder there
open ios/hergut.xcworkspace
```

### 7. Missing Dependencies

**Problem**: Module not found errors like `@react-native-community/slider could not be found`

**Solution**:
```bash
# Install the missing dependency
npm install @react-native-community/slider

# Reinstall iOS pods
cd ios
pod install
cd ..

# Restart Metro bundler
npx react-native start --reset-cache
```

### 8. React Native CLI Warnings

**Problem**: Warning about `@react-native-community/cli` dependency

**Solution**:
```bash
# Update package.json to use latest CLI versions
# Change in package.json devDependencies:
"@react-native-community/cli": "latest",
"@react-native-community/cli-platform-android": "latest", 
"@react-native-community/cli-platform-ios": "latest",

# Then reinstall
npm install
```

### 9. Firebase Integration Issues

**Problem**: Firebase pods won't install or build

**Solution**:
```bash
# Remove Firebase temporarily
npm uninstall @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/database @react-native-firebase/messaging

# Clean and reinstall
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..

# Add Firebase back when ready
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/database @react-native-firebase/messaging
```

## Quick Fix Script

If you're having multiple issues, run this script:

```bash
#!/bin/bash
echo "🔧 HerGut Troubleshooting Script"

# Set locale
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Clean everything
echo "🧹 Cleaning project..."
rm -rf node_modules package-lock.json
rm -rf ios/Pods ios/Podfile.lock

# Reinstall dependencies
echo "📦 Installing dependencies..."
npm install

# Reinstall pods
echo "🍎 Installing iOS pods..."
cd ios
pod install
cd ..

# Clear Metro cache
echo "🚀 Clearing Metro cache..."
npx react-native start --reset-cache &
METRO_PID=$!
sleep 3
kill $METRO_PID

echo "✅ Done! Try running the app now."
```

## Getting Help

If you're still having issues:

1. Check the [React Native Troubleshooting Guide](https://reactnative.dev/docs/troubleshooting)
2. Run `npx react-native doctor` to check your environment
3. Check the [CocoaPods Troubleshooting Guide](https://guides.cocoapods.org/using/troubleshooting.html)
4. Open an issue in the project repository

## Environment Requirements

Make sure you have:
- Node.js 16+ 
- React Native CLI
- Xcode 14+ (for iOS)
- CocoaPods
- iOS Simulator or physical device
- Android Studio (for Android development)
