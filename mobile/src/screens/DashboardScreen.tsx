import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { CheckCircle2, TrendingUp, AlertCircle, Clock } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function DashboardScreen() {
  return (
    <ScrollView className="flex-1 bg-[#09090b] pt-20 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
      {/* Welcome Header */}
      <View className="mb-6">
        <Text className="text-[#a1a1aa] text-sm">Good morning,</Text>
        <Text className="text-[#f4f4f5] text-2xl font-bold tracking-tight">Alex</Text>
      </View>

      {/* KPI Cards Row (Using wrap for mobile) */}
      <View className="flex-row flex-wrap justify-between mb-8 gap-y-4">
        {/* KPI 1 */}
        <View className="w-[48%] bg-[#18181b] border border-[#27272a] rounded-xl p-4">
          <View className="w-8 h-8 rounded-full bg-emerald-500/10 items-center justify-center mb-3">
            <CheckCircle2 color={colors.primary} size={16} />
          </View>
          <Text className="text-3xl font-bold text-[#f4f4f5]">12</Text>
          <Text className="text-xs text-[#a1a1aa] mt-1">Tasks Completed</Text>
        </View>
        
        {/* KPI 2 */}
        <View className="w-[48%] bg-[#18181b] border border-[#27272a] rounded-xl p-4">
          <View className="w-8 h-8 rounded-full bg-blue-500/10 items-center justify-center mb-3">
            <TrendingUp color="#3b82f6" size={16} />
          </View>
          <Text className="text-3xl font-bold text-[#f4f4f5]">85%</Text>
          <Text className="text-xs text-[#a1a1aa] mt-1">Productivity Score</Text>
        </View>
      </View>

      {/* Today's Priorities */}
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-[#f4f4f5] font-semibold text-lg">Today's Priorities</Text>
        <TouchableOpacity>
          <Text className="text-emerald-400 text-xs font-medium">See all</Text>
        </TouchableOpacity>
      </View>

      <GlassCard className="mb-3 px-4 py-4 flex-row items-center">
        <View className="w-5 h-5 rounded border border-[#a1a1aa] mr-3" />
        <View className="flex-1">
          <Text className="text-[#f4f4f5] font-medium">Review Q3 Marketing Deck</Text>
          <View className="flex-row mt-1 items-center">
            <Clock size={12} color={colors.textMuted} />
            <Text className="text-[#a1a1aa] text-xs ml-1 mr-3">2:00 PM</Text>
            <View className="bg-red-500/10 px-2 py-0.5 rounded">
              <Text className="text-red-400 text-[10px] font-medium uppercase">High</Text>
            </View>
          </View>
        </View>
      </GlassCard>

      <GlassCard className="mb-8 px-4 py-4 flex-row items-center">
        <View className="w-5 h-5 rounded border border-[#a1a1aa] mr-3" />
        <View className="flex-1">
          <Text className="text-[#f4f4f5] font-medium">Weekly Team Sync</Text>
          <View className="flex-row mt-1 items-center">
            <Clock size={12} color={colors.textMuted} />
            <Text className="text-[#a1a1aa] text-xs ml-1 mr-3">4:30 PM</Text>
            <View className="bg-blue-500/10 px-2 py-0.5 rounded">
              <Text className="text-blue-400 text-[10px] font-medium uppercase">Normal</Text>
            </View>
          </View>
        </View>
      </GlassCard>


      {/* Upcoming Exams */}
      <View className="flex-row items-center justify-between mb-4">
         <Text className="text-[#f4f4f5] font-semibold text-lg">Upcoming Exams</Text>
      </View>

      <GlassCard className="p-0 overflow-hidden">
        <View className="h-2 bg-emerald-500 w-full" />
        <View className="p-4">
          <Text className="text-[#f4f4f5] font-bold text-lg mb-1">CS 404 Data Structures</Text>
          <Text className="text-[#a1a1aa] text-sm mb-3">Final Examination</Text>
          <View className="flex-row items-center">
            <AlertCircle size={14} color={colors.primary} />
            <Text className="text-emerald-400 text-xs font-medium ml-1">In 3 Days (Monday)</Text>
          </View>
        </View>
      </GlassCard>

    </ScrollView>
  );
}
