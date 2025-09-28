# HerGut - Women's Health Tracking App

A Duolingo-meets-wellness app for tracking gut health, cycles, mood, and more. Built with React Native and designed with a playful, minimal, pastel-friendly aesthetic.

## 🎯 Features

### Core Screens
- **Onboarding**: Category selection for personalized tracking
- **Daily Check-In**: Quick-entry UI with sliders and emojis
- **Gamification**: XP meter, streak counter, and badges
- **Insights**: Health pattern analysis and AI-generated stories
- **Community**: Hashtag-based discussions with privacy options
- **Privacy**: Comprehensive privacy controls and data management

### Key Features
- 🎨 **Pastel-friendly design** - Clean, minimal, non-clinical UI
- 🔒 **Privacy-first** - Your data stays private, always
- 🎮 **Gamification** - XP points, streaks, and achievement badges
- 📊 **Smart insights** - Pattern recognition and health correlations
- 👥 **Community support** - Anonymous sharing with like-minded users
- 📱 **Cross-platform** - Works on iOS and Android

## 🛠 Tech Stack

- **Framework**: React Native with TypeScript
- **Navigation**: React Navigation (Stack + Bottom Tabs)
- **Backend**: Firebase (Auth, Realtime DB, Push Notifications)
- **Styling**: Custom theme system with pastel colors
- **Icons**: React Native Vector Icons
- **Charts**: Custom chart components
- **State Management**: React hooks and context

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Common components
│   ├── forms/          # Form components
│   └── charts/         # Chart components
├── constants/          # App constants and theme
├── hooks/              # Custom React hooks
├── screens/            # Screen components
│   ├── onboarding/     # Onboarding flow
│   ├── daily/          # Daily check-in
│   ├── gamification/   # XP and badges
│   ├── insights/       # Health insights
│   ├── community/      # Community features
│   └── privacy/        # Privacy controls
├── services/           # External services
│   ├── firebase/       # Firebase configuration
│   └── navigation.tsx  # Navigation setup
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hergut
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **iOS Setup** (macOS only)
   ```bash
   cd ios
   bundle install
   bundle exec pod install
   cd ..
   ```

4. **Run the app**
   ```bash
   # iOS
   npx react-native run-ios
   
   # Android
   npx react-native run-android
   ```

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com)
2. Enable Authentication, Realtime Database, and Cloud Messaging
3. Update `src/services/firebase/config.ts` with your Firebase credentials
4. Add your Firebase config files:
   - `ios/GoogleService-Info.plist` (iOS)
   - `android/app/google-services.json` (Android)

### Environment Variables
Create a `.env` file in the root directory:
```
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
FIREBASE_PROJECT_ID=your_project_id
```

## 🎨 Design System

### Color Palette
- **Primary**: Light Pink (#FFB6C1)
- **Secondary**: Light Purple (#B19CD9)
- **Accent**: Very Light Pink (#FFD1DC)
- **Success**: Pale Green (#98FB98)
- **Warning**: Moccasin (#FFE4B5)
- **Background**: Off-white (#FEFEFE)

### Typography
- **Font Family**: System fonts (iOS/Android native)
- **Sizes**: 12px to 32px scale
- **Weights**: Regular, Medium, Bold, Light

## 📱 Screens Overview

### Onboarding
- Welcome message with privacy promise
- Category selection (gut, cycle, mood, energy, misc)
- Clean checkbox interface with icons

### Daily Check-In
- Slider-based pain and bloating tracking
- Mood and energy level sliders
- Emoji mood selector
- Optional notes field

### Gamification
- XP meter and level progression
- Streak counter with motivational messages
- Achievement badges (earned and locked)
- XP earning sources explanation

### Insights
- Timeframe selector (week/month/quarter)
- Monthly health story generation
- Simple chart visualizations
- Pattern recognition insights

### Community
- Hashtag-based post filtering
- Anonymous posting options
- Like and comment interactions
- Community guidelines

### Privacy
- Comprehensive privacy statement
- Data usage transparency
- Export and deletion options
- Contact information for privacy concerns

## 🔒 Privacy & Security

- **End-to-end encryption** for sensitive data
- **No data selling** policy
- **Anonymous community** options
- **Local storage** for sensitive information
- **HIPAA compliance** considerations
- **User data control** with export/deletion

## 🧪 Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## 📦 Building for Production

### iOS
```bash
# Build for iOS
npx react-native run-ios --configuration Release
```

### Android
```bash
# Build APK
cd android
./gradlew assembleRelease

# Build AAB (for Play Store)
./gradlew bundleRelease
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Duolingo's gamification approach
- Built with privacy-first principles
- Designed for women's health empowerment

## 📞 Support

For support, email privacy@hergut.app or create an issue in this repository.

---

**Remember**: Your health data belongs to you. We're just here to help you understand it better. 💜