import React from 'react';
import './global.css';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { LayoutDashboard, CalendarDays, CheckSquare, Plus } from 'lucide-react-native';

import { colors } from './src/theme/colors';
import { MobileHeader } from './src/components/MobileHeader';
import { GlassCard } from './src/components/GlassCard';

// Dummy Screen Components
function DashboardScreen() {
  return (
    <View className="flex-1 bg-[#09090b] pt-24 px-4">
      <Text className="text-[#a1a1aa] uppercase text-xs font-bold mb-4 tracking-wider">Today's Priorities</Text>
      <GlassCard className="mb-4">
        <Text className="text-[#f4f4f5] font-semibold text-lg">Finish Mobile UI Build</Text>
        <Text className="text-[#a1a1aa] text-sm mt-1">Due Today • High Priority</Text>
      </GlassCard>
      
      <Text className="text-[#a1a1aa] uppercase text-xs font-bold mb-4 mt-4 tracking-wider">Upcoming Exams</Text>
      <GlassCard>
        <Text className="text-[#f4f4f5] font-semibold text-lg">CS 404 Final</Text>
        <Text className="text-emerald-400 text-sm mt-1">Tomorrow, 10:00 AM</Text>
      </GlassCard>
    </View>
  );
}

function CalendarScreen() {
  return <View className="flex-1 bg-[#09090b] items-center justify-center"><Text className="text-[#f4f4f5]">Calendar</Text></View>;
}

function TasksScreen() {
  return <View className="flex-1 bg-[#09090b] items-center justify-center"><Text className="text-[#f4f4f5]">Tasks</Text></View>;
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <View className="flex-1 bg-[#09090b]">
          <MobileHeader />
          <Tab.Navigator
            screenOptions={{
              headerShown: false,
              tabBarStyle: {
                backgroundColor: 'rgba(9, 9, 11, 0.9)',
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
              name="Calendar" 
              component={CalendarScreen} 
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

          {/* Quick Add FAB */}
          <TouchableOpacity 
            className="absolute bottom-20 right-6 w-14 h-14 rounded-full bg-emerald-500 items-center justify-center shadow-lg shadow-emerald-500/50"
            activeOpacity={0.8}
          >
            <Plus color="#09090b" size={28} strokeWidth={3} />
          </TouchableOpacity>
        </View>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
