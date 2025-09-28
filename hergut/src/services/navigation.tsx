import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

import { RootStackParamList, MainTabParamList } from '../types';
import { theme } from '../constants/theme';

// Import screens (we'll create these next)
import OnboardingScreen from '../screens/onboarding/OnboardingScreen';
import DailyCheckInScreen from '../screens/daily/DailyCheckInScreen';
import GamificationScreen from '../screens/gamification/GamificationScreen';
import InsightsScreen from '../screens/insights/InsightsScreen';
import CommunityScreen from '../screens/community/CommunityScreen';
import PrivacyScreen from '../screens/privacy/PrivacyScreen';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Daily':
              iconName = 'today';
              break;
            case 'Gamification':
              iconName = 'emoji-events';
              break;
            case 'Insights':
              iconName = 'insights';
              break;
            case 'Community':
              iconName = 'people';
              break;
            case 'Privacy':
              iconName = 'security';
              break;
            default:
              iconName = 'help';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.grayText,
        tabBarStyle: {
          backgroundColor: theme.colors.white,
          borderTopColor: theme.colors.grayDark,
          borderTopWidth: 1,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSizes.xs,
          fontWeight: '500',
        },
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: theme.colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: theme.fontSizes.lg,
        },
      })}
    >
      <Tab.Screen 
        name="Daily" 
        component={DailyCheckInScreen}
        options={{ title: 'Daily Check-in' }}
      />
      <Tab.Screen 
        name="Gamification" 
        component={GamificationScreen}
        options={{ title: 'Progress' }}
      />
      <Tab.Screen 
        name="Insights" 
        component={InsightsScreen}
        options={{ title: 'Insights' }}
      />
      <Tab.Screen 
        name="Community" 
        component={CommunityScreen}
        options={{ title: 'Community' }}
      />
      <Tab.Screen 
        name="Privacy" 
        component={PrivacyScreen}
        options={{ title: 'Privacy' }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerStyle: {
            backgroundColor: theme.colors.primary,
          },
          headerTintColor: theme.colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: theme.fontSizes.lg,
          },
        }}
      >
        <Stack.Screen 
          name="Onboarding" 
          component={OnboardingScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
