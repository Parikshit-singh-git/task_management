import React from 'react';
import './global.css'; // NativeWind v4 initialization
import { View, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LayoutDashboard, CalendarDays, CheckSquare, Plus } from 'lucide-react-native';

import { colors } from './src/theme/colors';
import { MobileHeader } from './src/components/MobileHeader';

// Screens
import LoginScreen from './src/screens/LoginScreen';
import DashboardScreen from './src/screens/DashboardScreen';
import TasksScreen from './src/screens/TasksScreen';
import ExamsScreen from './src/screens/ExamsScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab layout for authenticated users
function AppGroup() {
  return (
    <View className="flex-1 bg-[#09090b]">
      <MobileHeader />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: 'rgba(9, 9, 11, 0.95)',
            borderTopColor: colors.border,
            position: 'absolute',
            bottom: 0,
            elevation: 0,
            height: 60,
            paddingBottom: 10,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
        }}
      >
        <Tab.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{
            tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
          }}
        />
        <Tab.Screen 
          name="Exams" 
          component={ExamsScreen} 
          options={{
            tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />
          }}
        />
        <Tab.Screen 
          name="Tasks" 
          component={TasksScreen} 
          options={{
            tabBarIcon: ({ color, size }) => <CheckSquare color={color} size={size} />
          }}
        />
      </Tab.Navigator>

      {/* Floating Action Button for Quick Add Tasks */}
      <TouchableOpacity 
        className="absolute bottom-20 right-6 w-14 h-14 rounded-full bg-emerald-500 items-center justify-center shadow-lg shadow-emerald-500/50"
        activeOpacity={0.8}
      >
        <Plus color="#09090b" size={28} strokeWidth={3} />
      </TouchableOpacity>
    </View>
  );
}

// Main App Router
export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#09090b' } }}
        >
          {/* Auth Stack */}
          <Stack.Screen name="Login" component={LoginScreen} />
          
          {/* Main App (Tabs) */}
          <Stack.Screen name="AppGroup" component={AppGroup} />

          {/* Modals / Full Screens */}
          <Stack.Screen 
            name="Notifications" 
            component={NotificationsScreen} 
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
