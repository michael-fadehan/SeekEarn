// Polyfills
import 'react-native-get-random-values';
import { Buffer } from 'buffer';
global.Buffer = Buffer;

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar />
        <AppNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
