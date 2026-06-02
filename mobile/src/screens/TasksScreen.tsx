import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { GlassCard } from '../components/GlassCard';
import { Check, Calendar } from 'lucide-react-native';
import { colors } from '../theme/colors';

const MOCK_TASKS = [
  { id: 1, title: 'Write Project Proposal', date: 'Today', tag: 'Work', done: false },
  { id: 2, title: 'Buy Groceries', date: 'Tomorrow', tag: 'Personal', done: true },
  { id: 3, title: 'Call Mom', date: 'Oct 25', tag: 'Personal', done: false },
  { id: 4, title: 'Pay Electricity Bill', date: 'Oct 28', tag: 'Finance', done: false },
];

export default function TasksScreen() {
  const [tasks, setTasks] = useState(MOCK_TASKS);

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  return (
    <View className="flex-1 bg-[#09090b] pt-20">
      <View className="px-4 flex-row items-center justify-between mb-6">
        <Text className="text-[#f4f4f5] text-2xl font-bold tracking-tight">All Tasks</Text>
        <TouchableOpacity className="bg-[#18181b] border border-[#27272a] px-3 py-1.5 rounded-full">
           <Text className="text-[#a1a1aa] text-xs font-medium">Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 100 }}>
        {tasks.map((task) => (
          <TouchableOpacity 
            key={task.id} 
            activeOpacity={0.7}
            onPress={() => toggleTask(task.id)}
            className={`flex-row items-center p-4 mb-3 rounded-xl border ${task.done ? 'bg-[#18181b]/50 border-[#27272a]/50' : 'bg-[#18181b] border-[#27272a]'}`}
          >
            <View className={`w-6 h-6 rounded-full border mr-3 items-center justify-center ${task.done ? 'bg-emerald-500 border-emerald-500' : 'border-[#a1a1aa]'}`}>
              {task.done && <Check size={14} color="#09090b" />}
            </View>
            
            <View className="flex-1">
              <Text className={`font-medium ${task.done ? 'text-[#a1a1aa] line-through' : 'text-[#f4f4f5]'}`}>
                {task.title}
              </Text>
              <View className="flex-row items-center mt-1">
                <Calendar size={12} color={task.done ? colors.border : colors.textMuted} />
                <Text className={`text-xs ml-1 mr-3 ${task.done ? 'text-[#27272a]' : 'text-[#a1a1aa]'}`}>{task.date}</Text>
                <Text className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${task.done ? 'text-[#27272a] bg-transparent' : 'text-emerald-400 bg-emerald-500/10'}`}>
                  {task.tag}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
