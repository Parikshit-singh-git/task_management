import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Bell, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react-native';
import { colors } from '../theme/colors';

const MOCK_NOTIFS = [
  { id: 1, title: 'Exam Tomorrow', message: 'You have CS 404 in 24 hours. Good luck!', time: '10 mins ago', type: 'alert' },
  { id: 2, title: 'Task Completed', message: 'You checked off "Buy Groceries".', time: '1 hour ago', type: 'success' },
  { id: 3, title: 'Telegram Connected', message: 'Your daily digests will now be sent to your Telegram.', time: 'Yesterday', type: 'info' },
];

export default function NotificationsScreen({ navigation }: any) {
  return (
    <View className="flex-1 bg-[#09090b] pt-14">
      <View className="px-4 py-4 border-b border-[#27272a] flex-row items-center">
        <TouchableOpacity onPress={() => navigation.goBack()} className="mr-3">
          <ArrowLeft color={colors.text} size={24} />
        </TouchableOpacity>
        <Text className="text-[#f4f4f5] text-xl font-bold">Notifications</Text>
      </View>

      <ScrollView className="flex-1">
        {MOCK_NOTIFS.map(notif => (
          <View key={notif.id} className="border-b border-[#27272a] p-4 flex-row">
            <View className={`w-10 h-10 rounded-full items-center justify-center mr-4 
              ${notif.type === 'alert' ? 'bg-amber-500/10' : notif.type === 'success' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}
            >
              {notif.type === 'alert' && <AlertTriangle size={18} color="#f59e0b" />}
              {notif.type === 'success' && <CheckCircle size={18} color={colors.primary} />}
              {notif.type === 'info' && <Bell size={18} color="#3b82f6" />}
            </View>
            <View className="flex-1">
              <Text className="text-[#f4f4f5] font-semibold text-base mb-1">{notif.title}</Text>
              <Text className="text-[#a1a1aa] text-sm leading-5">{notif.message}</Text>
              <Text className="text-[#27272a] text-xs font-medium mt-2">{notif.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
