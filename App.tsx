import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from 'react-native';

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import FeedScreen from './screens/FeedScreen';
import PostDetailScreen from './screens/PostDetailScreen';
import ReportIssueScreen from './screens/ReportIssueScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import MyReportsScreen from './screens/MyReportsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import LinkedAccountsScreen from './screens/LinkedAccountsScreen';
import PolicyScreen from './screens/PolicyScreen';
import { AuthProvider, useAuth } from './hooks/useAuth';

const RootStack = createNativeStackNavigator();
const FeedStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function FeedNavigator() {
  return (
    <FeedStack.Navigator>
      <FeedStack.Screen name="Feed" component={FeedScreen} />
      <FeedStack.Screen name="PostDetail" component={PostDetailScreen} options={{ title: 'Issue' }} />
    </FeedStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator>
      <ProfileStack.Screen name="ProfileHome" component={ProfileScreen} options={{ title: 'Profile' }} />
      <ProfileStack.Screen name="MyReports" component={MyReportsScreen} options={{ title: 'My Reports' }} />
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
      <ProfileStack.Screen name="LinkedAccounts" component={LinkedAccountsScreen} options={{ title: 'Linked Accounts' }} />
      <ProfileStack.Screen name="Policy" component={PolicyScreen} options={{ title: 'Policy' }} />
    </ProfileStack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icon = route.name === 'Home' ? 'home-outline' : route.name === 'Report' ? 'add-circle' : 'person-circle-outline';
        return <Ionicons name={icon as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#111',
      tabBarInactiveTintColor: '#999',
    })}>
      <Tabs.Screen name="Home" component={FeedNavigator} options={{ headerShown: false }} />
      <Tabs.Screen name="Report" component={ReportIssueScreen} />
      <Tabs.Screen name="Profile" component={ProfileNavigator} options={{ headerShown: false }} />
    </Tabs.Navigator>
  );
}

function Root() {
  const { session, isLoading } = useAuth();
  const scheme = useColorScheme();

  if (isLoading) return null;

  return (
    <NavigationContainer theme={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <RootStack.Screen name="AppTabs" component={AppTabs} />
        ) : (
          <RootStack.Screen name="Auth" component={AuthNavigator} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}

const AuthStack = createNativeStackNavigator();
function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} options={{ title: 'Reset Password' }} />
    </AuthStack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Root />
    </AuthProvider>
  );
}
