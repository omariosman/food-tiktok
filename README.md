# Food TikTok 🍕📱

A React Native food-focused social video app built with Expo, inspired by TikTok's short-form video format.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android development)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd food-tiktok
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Fill in your Supabase credentials and other configuration values in `.env`.

4. Start the development server:
```bash
npm start
```

## 📱 Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Run on Android device/emulator
- `npm run ios` - Run on iOS device/simulator (macOS required)
- `npm run web` - Run in web browser
- `npm run typecheck` - Run TypeScript type checking
- `npm run lint` - Run ESLint code linting

## 🏗️ Project Structure

```
src/
├── components/     # Reusable UI components
├── screens/        # App screens/pages
├── services/       # API calls and external services
├── contexts/       # React contexts for state management
├── types/          # TypeScript type definitions
└── utils/          # Utility functions and helpers
```

## 🔧 Tech Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: React Navigation v6
- **Backend**: Supabase (Auth & Database)
- **Media**: Expo AV (video playback/recording)
- **State Management**: React Context API
- **Styling**: React Native StyleSheet

## 🔐 Environment Variables

Create a `.env` file in the root directory with:

```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_project_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
EXPO_PUBLIC_API_URL=http://localhost:3000
EXPO_PUBLIC_APP_ENV=development
```

## 📦 Key Dependencies

- `@react-navigation/native` - Navigation framework
- `@react-navigation/stack` - Stack navigator
- `@react-navigation/bottom-tabs` - Tab navigator
- `@supabase/supabase-js` - Supabase client for backend services
- `expo-av` - Audio/video recording and playback
- `expo-image-picker` - Image and video selection
- `expo-file-system` - File system operations

## 🔄 Development Workflow

1. Make changes to your code
2. Test in Expo Go app or simulator
3. Run type checking: `npm run typecheck`
4. Run linting: `npm run lint`
5. Commit your changes

## 🚨 Troubleshooting

### Common Issues

1. **Metro bundler cache issues**:
   ```bash
   npx expo start --clear
   ```

2. **TypeScript errors**:
   ```bash
   npm run typecheck
   ```

3. **Package version conflicts**:
   ```bash
   npm install
   npx expo install --fix
   ```

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

Built with ❤️ using Expo and React Native
