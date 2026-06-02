import React from 'react';
import { View, ViewProps } from 'react-native';

interface GlassCardProps extends ViewProps {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...props }: GlassCardProps) {
  return (
    <View 
      className={`bg-[#18181b] border border-[#27272a] rounded-xl p-5 ${className || ''}`}
      {...props}
    >
      {children}
    </View>
  );
}
