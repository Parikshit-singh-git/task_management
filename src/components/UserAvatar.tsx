'use client';
import React from 'react';
import { User } from 'lucide-react';

interface UserAvatarProps {
  avatarUrl?: string;
  displayName?: string;
  className?: string;
  iconSize?: number;
}

export const AVATAR_PRESETS = [
  { id: 'preset:rocket', emoji: '🚀', label: 'Rocket', gradient: 'from-indigo-600 to-purple-500' },
  { id: 'preset:target', emoji: '🎯', label: 'Target', gradient: 'from-rose-600 to-orange-500' },
  { id: 'preset:runner', emoji: '🏃', label: 'Runner', gradient: 'from-emerald-600 to-teal-500' },
  { id: 'preset:laptop', emoji: '💻', label: 'Developer', gradient: 'from-zinc-700 to-slate-600' },
  { id: 'preset:palette', emoji: '🎨', label: 'Artist', gradient: 'from-fuchsia-600 to-pink-500' },
  { id: 'preset:book', emoji: '📚', label: 'Student', gradient: 'from-amber-600 to-yellow-500' },
  { id: 'preset:meditation', emoji: '🧘', label: 'Mindful', gradient: 'from-violet-600 to-purple-400' },
  { id: 'preset:pizza', emoji: '🍕', label: 'Foodie', gradient: 'from-orange-600 to-amber-400' },
];

export default function UserAvatar({ avatarUrl, displayName, className = 'w-7 h-7', iconSize = 14 }: UserAvatarProps) {
  // 1. Check if it matches a preset
  const preset = AVATAR_PRESETS.find(p => p.id === avatarUrl);
  if (preset) {
    return (
      <div className={`rounded-full flex items-center justify-center bg-gradient-to-tr ${preset.gradient} shrink-0 text-white select-none ${className}`}>
        <span style={{ fontSize: `${iconSize + 2}px`, lineHeight: 1 }}>{preset.emoji}</span>
      </div>
    );
  }

  // 2. Check if it is a standard URL (http, https, data URL, local path)
  const isImageUrl = avatarUrl && (
    avatarUrl.startsWith('http://') ||
    avatarUrl.startsWith('https://') ||
    avatarUrl.startsWith('/') ||
    avatarUrl.startsWith('data:')
  );

  if (isImageUrl) {
    return (
      <img
        src={avatarUrl}
        alt={displayName || 'User avatar'}
        className={`rounded-full object-cover shrink-0 ${className}`}
        onError={(e) => {
          // If image fails to load, fallback to initials or default icon
          (e.target as HTMLImageElement).style.display = 'none';
        }}
      />
    );
  }

  // 3. Fallback: Initials of the user name if available
  if (displayName && displayName.trim().length > 0) {
    const initials = displayName
      .split(' ')
      .filter(Boolean)
      .map(part => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();

    if (initials) {
      return (
        <div className={`rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold tracking-tight select-none shrink-0 ${className}`}>
          <span style={{ fontSize: `${iconSize - 2}px` }}>{initials}</span>
        </div>
      );
    }
  }

  // 4. Default: Emerald User icon container
  return (
    <div className={`rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 ${className}`}>
      <User size={iconSize} className="text-emerald-400" />
    </div>
  );
}
