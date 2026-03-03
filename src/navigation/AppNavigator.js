import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, StyleSheet } from 'react-native';

import HomeScreen from '../screens/HomeScreen';
import EarnScreen from '../screens/EarnScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WithdrawScreen from '../screens/WithdrawScreen';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: '#6C5CE7',
          tabBarInactiveTintColor: '#b2bec3',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 0,
            height: 90, 
            paddingBottom: 30, 
            paddingTop: 10,
            elevation: 0, 
          },
          tabBarIcon: ({ focused, color, size }) => {
            const iconMap = {
              Home: focused ? 'home' : 'home-outline',
              Earn: focused ? 'play-circle' : 'play-circle-outline',
              Withdraw: focused ? 'wallet' : 'wallet-outline',
              Profile: focused ? 'person' : 'person-outline',
            };
            const iconName = iconMap[route.name];
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Earn" component={EarnScreen} />
        <Tab.Screen name="Withdraw" component={WithdrawScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f6f8',
  },
  placeholderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#636e72',
  },
});

export default AppNavigator;