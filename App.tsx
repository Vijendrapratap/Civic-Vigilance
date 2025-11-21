import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme, View, Text, StyleSheet } from 'react-native';

// Error Boundary Component
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Something went wrong</Text>
          <Text style={styles.errorText}>{String(this.state.error)}</Text>
          <Text style={styles.errorHint}>Check browser console (F12) for details</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import UsernameSelectionScreen from './screens/UsernameSelectionScreen';
import FeedScreen from './screens/FeedScreen';
import PostDetailScreen from './screens/PostDetailScreen';
// Use new 5-stage reporting flow (PRD Section 5.2)
import ReportIssueScreen from './screens/ReportIssueScreenV2';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';
import MyReportsScreen from './screens/MyReportsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import LinkedAccountsScreen from './screens/LinkedAccountsScreen';
import PolicyScreen from './screens/PolicyScreen';
import DebugScreen from './screens/DebugScreen';
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
      <ProfileStack.Screen name="Debug" component={DebugScreen} options={{ title: 'Debug' }} />
    </ProfileStack.Navigator>
  );
}

function AppTabs() {
  return (
    <Tabs.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        const icon = route.name === 'Home' ? 'home-outline' : route.name === 'Report' ? 'camera' : 'person-circle-outline';
        return <Ionicons name={icon as any} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#00AEEF',
      tabBarInactiveTintColor: '#8a9ab8',
      tabBarStyle: {
        backgroundColor: '#0b1524',
        borderTopWidth: 0,
        height: 72,
        paddingBottom: 10,
        paddingTop: 10,
        position: 'absolute'
      },
      tabBarLabelStyle: { fontWeight: '700', fontSize: 12 },
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

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading Civic Vigilance...</Text>
        <Text style={styles.loadingHint}>Initializing backend...</Text>
      </View>
    );
  }

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
      <AuthStack.Screen
        name="UsernameSelection"
        component={UsernameSelectionScreen}
        options={{ title: 'Choose Your Voice', headerBackVisible: false }}
      />
    </AuthStack.Navigator>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    padding: 20,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorHint: {
    fontSize: 12,
    color: '#888',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b1524',
  },
  loadingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00AEEF',
    marginBottom: 8,
  },
  loadingHint: {
    fontSize: 14,
    color: '#8a9ab8',
  },
});

export default function App() {
  console.log('[App] Starting Civic Vigilance...');
  console.log('[App] Supabase configured:', process.env.EXPO_PUBLIC_SUPABASE_URL ? 'Yes' : 'No');
  console.log('[App] Backend mode:', process.env.EXPO_PUBLIC_BACKEND_MODE);

  return (
    <ErrorBoundary>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </ErrorBoundary>
  );
}
