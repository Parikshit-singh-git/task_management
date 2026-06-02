import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Mail, Lock, ArrowRight, User } from 'lucide-react-native';
import { colors } from '../theme/colors';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Navigate straight to AppGroup for mockup purposes
    navigation.replace('AppGroup');
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-[#09090b]"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        
        <View className="items-center mb-10">
          <View className="mb-6 w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 items-center justify-center">
            <User size={32} color={colors.primary} />
          </View>
          <Text className="text-3xl font-bold text-[#f4f4f5] tracking-tight mb-2">Welcome Back</Text>
          <Text className="text-[#a1a1aa] text-center">Sign in to your LifeTrackr account to continue managing your tasks.</Text>
        </View>

        <View className="space-y-4 mb-8">
          <View>
            <Text className="text-[#a1a1aa] text-xs font-semibold uppercase tracking-wider mb-2">Email Address</Text>
            <View className="flex-row items-center h-14 bg-[#18181b] border border-[#27272a] rounded-xl px-4">
              <Mail color={colors.textMuted} size={20} className="mr-3" />
              <TextInput 
                className="flex-1 text-[#f4f4f5] text-base"
                placeholder="name@example.com"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View>
            <Text className="text-[#a1a1aa] text-xs font-semibold uppercase tracking-wider mb-2">Password</Text>
            <View className="flex-row items-center h-14 bg-[#18181b] border border-[#27272a] rounded-xl px-4">
              <Lock color={colors.textMuted} size={20} className="mr-3" />
              <TextInput 
                className="flex-1 text-[#f4f4f5] text-base"
                placeholder="••••••••"
                placeholderTextColor={colors.textMuted}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>
          </View>

          <TouchableOpacity className="self-end mt-2">
            <Text className="text-emerald-400 text-sm font-medium">Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          onPress={handleLogin}
          className="h-14 bg-emerald-500 rounded-xl items-center justify-center flex-row shadow-lg shadow-emerald-500/20"
          activeOpacity={0.8}
        >
          <Text className="text-[#09090b] font-bold text-base mr-2">Login</Text>
          <ArrowRight color="#09090b" size={20} />
        </TouchableOpacity>

        <View className="flex-row justify-center mt-10">
          <Text className="text-[#a1a1aa]">Don't have an account? </Text>
          <TouchableOpacity>
            <Text className="text-emerald-400 font-semibold">Sign Up</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}
