import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { BookOpen, MapPin, Clock } from 'lucide-react-native';
import { colors } from '../theme/colors';

const MOCK_EXAMS = [
  { id: 1, title: 'CS 404 Data Structures', date: 'Tomorrow', time: '10:00 AM', location: 'Hall 3', type: 'Final', urgent: true },
  { id: 2, title: 'MAT 201 Calculus III', date: 'Oct 28', time: '2:30 PM', location: 'Room 412', type: 'Midterm', urgent: false },
];

export default function ExamsScreen() {
  return (
    <View className="flex-1 bg-[#09090b] pt-20">
      <View className="px-4 mb-6">
        <Text className="text-[#f4f4f5] text-2xl font-bold tracking-tight">Exams & Milestones</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {MOCK_EXAMS.map(exam => (
          <GlassCard key={exam.id} className={`mb-4 p-0 overflow-hidden ${exam.urgent ? 'border-emerald-500/40 shadow-emerald-500/10 shadow-lg' : ''}`}>
            {exam.urgent && <View className="absolute top-0 right-0 py-1 px-3 bg-emerald-500 rounded-bl-lg z-10"><Text className="text-[#09090b] text-[10px] font-bold uppercase">Up Next</Text></View>}
            <View className={`h-1.5 w-full ${exam.urgent ? 'bg-emerald-500' : 'bg-[#27272a]'}`} />
            <View className="p-4">
              <View className="flex-row items-center mb-1">
                <BookOpen size={14} color={colors.textMuted} />
                <Text className="text-[#a1a1aa] text-xs font-semibold uppercase tracking-widest ml-2">{exam.type}</Text>
              </View>
              <Text className="text-[#f4f4f5] font-bold text-xl mb-3">{exam.title}</Text>
              
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center">
                  <Clock size={14} color={colors.primary} />
                  <Text className={`text-sm font-medium ml-1.5 ${exam.urgent ? 'text-emerald-400' : 'text-[#f4f4f5]'}`}>{exam.date} • {exam.time}</Text>
                </View>
                <View className="flex-row items-center bg-[#27272a]/50 px-2.5 py-1 rounded-md">
                  <MapPin size={12} color={colors.textMuted} />
                  <Text className="text-[#a1a1aa] text-xs ml-1 font-medium">{exam.location}</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        ))}
      </ScrollView>
    </View>
  );
}
