import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, User, Bell } from 'lucide-react-native';
import { colors } from '../theme/colors';
import { useNavigation } from '@react-navigation/native';

interface MobileHeaderProps {
  onMenuPress?: () => void;
}

export function MobileHeader({ onMenuPress }: MobileHeaderProps) {
  const navigation = useNavigation<any>();

  return (
    <View className="absolute top-0 inset-x-0 z-40 bg-[#09090be6] border-b border-[#27272a]">
      <SafeAreaView edges={['top']}>
        <View className="h-14 flex-row items-center justify-between px-4">
          <TouchableOpacity onPress={onMenuPress} className="p-1.5 -ml-1.5">
            <Menu size={22} color={colors.textMuted} />
          </TouchableOpacity>
          
          <View className="absolute inset-0 items-center justify-center pointer-events-none">
            <Text className="font-semibold text-[#f4f4f5] text-base tracking-tight">LifeTrackr</Text>
          </View>

          <View className="flex-row items-center gap-3">
            <TouchableOpacity 
              onPress={() => navigation.navigate('Notifications')}
              className="p-1.5"
            >
              <Bell size={20} color={colors.textMuted} />
              <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-[#09090b]" />
            </TouchableOpacity>

            <TouchableOpacity className="w-8 h-8 rounded-full bg-[#10b981]/20 border border-[#10b981]/30 items-center justify-center">
              <User size={14} color={colors.primary} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}
