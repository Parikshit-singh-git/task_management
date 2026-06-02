'use client';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import { 
  User, 
  Shield, 
  Bell, 
  Palette, 
  Globe, 
  Database, 
  LogOut, 
  ChevronLeft, 
  Save, 
  Key, 
  Loader2, 
  Check, 
  Mail, 
  Calendar, 
  Edit3, 
  Image as ImageIcon,
  CheckCircle,
  HelpCircle,
  Info
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import UserAvatar, { AVATAR_PRESETS } from '@/components/UserAvatar';

type SettingsTab = 'profile' | 'account' | 'notifications' | 'appearance' | 'language' | 'data' | 'about';

export default function SettingsPage() {
    const { user, signOut, supabase, updatePassword } = useAuth();
    const router = useRouter();
    
    // Tab switching state
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [mobileShowDetail, setMobileShowDetail] = useState(false);

    // Profile editing states
    const [isEditingProfile, setIsEditingProfile] = useState(false);
    const [fullName, setFullName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

    // Security password change states
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

    // Appearance state (Mock)
    const [theme, setTheme] = useState('dark');
    // Language state (Mock)
    const [language, setLanguage] = useState('en');
    // Notification state (Mock)
    const [notifications, setNotifications] = useState({
        emailUpdates: true,
        taskReminders: true,
        examAlerts: true,
        dailyDigest: false
    });

    // Populate profile inputs when user loads or isEditing changes
    useEffect(() => {
        if (user) {
            setFullName(user.user_metadata?.full_name || '');
            setAvatarUrl(user.user_metadata?.avatar_url || '');
        }
    }, [user, isEditingProfile]);

    const handleSignOut = async () => {
        try {
            await signOut();
            toast.success('Signed out successfully');
            router.push('/sign-up-login');
        } catch (error: any) {
            toast.error('Sign out failed', { description: error.message });
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName.trim()) {
            toast.error('Display Name cannot be empty');
            return;
        }

        setIsUpdatingProfile(true);
        try {
            // 1. Update Auth User Metadata
            const { error: authError } = await supabase.auth.updateUser({
                data: {
                    full_name: fullName,
                    avatar_url: avatarUrl
                }
            });

            if (authError) throw authError;

            // 2. Fallback: Update user_profiles database table if it exists
            try {
                await supabase
                    .from('user_profiles')
                    .update({
                        full_name: fullName,
                        avatar_url: avatarUrl,
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', user.id);
            } catch (dbErr) {
                // Silently warn, as some schemas might not have user_profiles set up or might rely on db triggers
                console.warn('Database profiles table update skipped/failed:', dbErr);
            }

            toast.success('Profile updated successfully');
            setIsEditingProfile(false);
        } catch (error: any) {
            toast.error('Failed to update profile', { description: error.message });
        } finally {
            setIsUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters long');
            return;
        }
        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setIsUpdatingPassword(true);
        try {
            await updatePassword(newPassword);
            toast.success('Password updated successfully');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error('Failed to update password', { description: error.message });
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const handleSaveNotifications = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Notification preferences updated');
    };

    const handleSaveAppearance = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Appearance settings saved', { description: `Applied ${theme} theme.` });
    };

    const handleSaveLanguage = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Language & region settings updated');
    };

    const settingSections = [
        { id: 'profile', icon: <User size={18} />, label: 'User Profile', desc: 'Manage your name, avatar, and personal info' },
        { id: 'account', icon: <Shield size={18} />, label: 'Account Security', desc: 'Update password and security methods' },
        { id: 'notifications', icon: <Bell size={18} />, label: 'Notification Preferences', desc: 'Configure email and push alerts' },
        { id: 'appearance', icon: <Palette size={18} />, label: 'Appearance', desc: 'Customize themes and app look' },
        { id: 'language', icon: <Globe size={18} />, label: 'Language & Region', desc: 'Set your preferred localization' },
        { id: 'data', icon: <Database size={18} />, label: 'Data Management', desc: 'Export or delete your application data' },
        { id: 'about', icon: <Info size={18} />, label: 'About LifeTrackr', desc: 'Learn more about LifeTrackr and its features' },
    ] as const;

    // Helper to format metadata dates
    const memberSince = user?.created_at 
        ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) 
        : 'N/A';

    const providerType = user?.app_metadata?.provider === 'google' || user?.identities?.[0]?.provider === 'google'
        ? 'Google Account'
        : 'Email / Password';

    // Renders the details card based on the active tab
    const renderActivePanel = () => {
        switch (activeTab) {
            case 'profile':
                return (
                    <div className="space-y-6">
                        <div className="border-b border-zinc-800 pb-4">
                            <h2 className="text-lg font-semibold text-zinc-100">User Profile</h2>
                            <p className="text-zinc-500 text-xs mt-0.5">Update your personal identification details and profile appearance.</p>
                        </div>

                        {!isEditingProfile ? (
                            // View Mode
                            <div className="space-y-6">
                                <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-zinc-900/40 border border-zinc-800/80 rounded-xl">
                                    <UserAvatar 
                                        avatarUrl={user?.user_metadata?.avatar_url} 
                                        displayName={user?.user_metadata?.full_name || user?.email?.split('@')[0]} 
                                        className="w-20 h-20 text-3xl"
                                        iconSize={40}
                                    />
                                    <div className="text-center sm:text-left flex-1 space-y-1">
                                        <h3 className="text-xl font-bold text-zinc-100">{user?.user_metadata?.full_name || 'User'}</h3>
                                        <p className="text-sm text-zinc-400 font-mono flex items-center justify-center sm:justify-start gap-1.5">
                                            <Mail size={14} className="text-zinc-500" />
                                            {user?.email}
                                        </p>
                                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1.5">
                                            <span className="badge badge-done text-[10px] py-0.5 px-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center gap-1">
                                                <CheckCircle size={10} /> Active
                                            </span>
                                            <span className="badge badge-low text-[10px] py-0.5 px-2 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-full">
                                                {providerType}
                                            </span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setIsEditingProfile(true)}
                                        className="btn-secondary text-xs px-3.5 py-2 min-h-[38px] flex items-center gap-1.5"
                                    >
                                        <Edit3 size={14} />
                                        Edit Profile
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-zinc-900/30 border border-zinc-800/60 rounded-xl space-y-1">
                                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Account Credentials</p>
                                        <p className="text-sm font-semibold text-zinc-200">{user?.email}</p>
                                        <p className="text-xs text-zinc-500">Primary login method: {providerType}</p>
                                    </div>
                                    <div className="p-4 bg-zinc-900/30 border border-zinc-800/60 rounded-xl space-y-1">
                                        <p className="text-zinc-500 text-[10px] uppercase font-bold tracking-wider">Member Since</p>
                                        <p className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
                                            <Calendar size={14} className="text-emerald-500" />
                                            {memberSince}
                                        </p>
                                        <p className="text-xs text-zinc-500">Your account is fully synchronized</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            // Edit Mode
                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-300">Display Name</label>
                                    <input 
                                        type="text" 
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="input-field"
                                        required
                                    />
                                    <p className="text-[10px] text-zinc-500">This name will be displayed in the sidebar and dashboard header.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-300">Email Address (Read-only)</label>
                                    <input 
                                        type="email" 
                                        value={user?.email || ''} 
                                        disabled 
                                        className="input-field opacity-60 cursor-not-allowed bg-zinc-800/30" 
                                    />
                                    <p className="text-[10px] text-zinc-500">Email address is linked to authentication credentials and cannot be edited.</p>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-semibold text-zinc-300">Choose Profile Avatar</label>
                                        <p className="text-[10px] text-zinc-500 mt-0.5">Select a built-in emoji preset or use a custom image URL below.</p>
                                    </div>

                                    {/* Preset selection grid */}
                                    <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 p-3 bg-zinc-900/30 border border-zinc-800 rounded-xl">
                                        {AVATAR_PRESETS.map((preset) => {
                                            const isSelected = avatarUrl === preset.id;
                                            return (
                                                <button
                                                    key={preset.id}
                                                    type="button"
                                                    onClick={() => setAvatarUrl(preset.id)}
                                                    className={`aspect-square rounded-full flex items-center justify-center bg-gradient-to-tr ${preset.gradient} relative group hover:scale-105 transition-all focus:outline-none`}
                                                    title={preset.label}
                                                >
                                                    <span className="text-2xl">{preset.emoji}</span>
                                                    {isSelected && (
                                                        <div className="absolute -inset-1 border-2 border-emerald-500 rounded-full flex items-center justify-center bg-black/20">
                                                            <Check size={16} className="text-emerald-400 font-bold" />
                                                        </div>
                                                    )}
                                                </button>
                                            );
                                        })}
                                        {/* Preset: none (initials) option */}
                                        <button
                                            type="button"
                                            onClick={() => setAvatarUrl('')}
                                            className={`aspect-square rounded-full flex items-center justify-center bg-zinc-800 border border-zinc-700 relative hover:scale-105 transition-all focus:outline-none`}
                                            title="Initials Fallback"
                                        >
                                            <span className="text-xs font-bold text-zinc-400">
                                                {fullName ? fullName.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase() : '?'}
                                            </span>
                                            {avatarUrl === '' && (
                                                <div className="absolute -inset-1 border-2 border-emerald-500 rounded-full flex items-center justify-center bg-black/20">
                                                    <Check size={16} className="text-emerald-400 font-bold" />
                                                </div>
                                            )}
                                        </button>
                                    </div>

                                    {/* Custom URL Option */}
                                    <div className="space-y-2 pt-2">
                                        <label className="text-[11px] font-semibold text-zinc-400 flex items-center gap-1.5">
                                            <ImageIcon size={12} />
                                            Or use a Custom Image URL
                                        </label>
                                        <div className="flex gap-3">
                                            <input 
                                                type="url" 
                                                value={avatarUrl.startsWith('preset:') ? '' : avatarUrl}
                                                onChange={(e) => setAvatarUrl(e.target.value)}
                                                placeholder="https://images.unsplash.com/photo-..."
                                                className="input-field flex-1"
                                            />
                                            {avatarUrl && !avatarUrl.startsWith('preset:') && (
                                                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden shrink-0">
                                                    <img 
                                                        src={avatarUrl} 
                                                        alt="Custom Preview" 
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="red" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>';
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 pt-4 border-t border-zinc-800/80">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingProfile}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {isUpdatingProfile ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsEditingProfile(false)}
                                        disabled={isUpdatingProfile}
                                        className="btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                );
            case 'account':
                return (
                    <div className="space-y-6">
                        <div className="border-b border-zinc-800 pb-4">
                            <h2 className="text-lg font-semibold text-zinc-100">Account Security</h2>
                            <p className="text-zinc-500 text-xs mt-0.5">Manage your credentials, change password, and secure your session.</p>
                        </div>

                        {providerType === 'Google Account' ? (
                            <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-xl flex items-start gap-4">
                                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg shrink-0">
                                    <Shield size={20} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-sm font-semibold text-zinc-200">Google Authentication Active</h3>
                                    <p className="text-xs text-zinc-400 leading-relaxed">
                                        Your account is authenticated via Google. Password updates are managed directly through Google Accounts. If you want to change login settings, configure them on Google security dashboard.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form onSubmit={handleUpdatePassword} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-300">New Password</label>
                                    <input 
                                        type="password" 
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="At least 6 characters"
                                        className="input-field"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-xs font-semibold text-zinc-300">Confirm New Password</label>
                                    <input 
                                        type="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Repeat new password"
                                        className="input-field"
                                        required
                                        minLength={6}
                                    />
                                </div>

                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={isUpdatingPassword || !newPassword || newPassword !== confirmPassword}
                                        className="btn-primary flex items-center gap-2"
                                    >
                                        {isUpdatingPassword ? <Loader2 size={16} className="animate-spin" /> : <Key size={16} />}
                                        Update Password
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                );
            case 'notifications':
                return (
                    <form onSubmit={handleSaveNotifications} className="space-y-6">
                        <div className="border-b border-zinc-800 pb-4">
                            <h2 className="text-lg font-semibold text-zinc-100">Notification Preferences</h2>
                            <p className="text-zinc-500 text-xs mt-0.5">Control how and when LifeTrackr contacts you.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                { id: 'emailUpdates', label: 'Email Newsletter & Updates', desc: 'Receive info about product features, releases, and weekly digests.' },
                                { id: 'taskReminders', label: 'Task Reminders', desc: 'Get notified via browser or email when tasks are about to expire.' },
                                { id: 'examAlerts', label: 'Exam & Deadline Alerts', desc: 'Urgent alerts for academic deadlines and scheduled examinations.' },
                                { id: 'dailyDigest', label: 'Daily Agenda Digest', desc: 'A summary email sent every morning at 7:00 AM listing today\'s tasks.' },
                            ].map((item) => (
                                <div key={item.id} className="flex items-start justify-between p-4 bg-zinc-900/30 border border-zinc-850 rounded-xl">
                                    <div className="space-y-0.5 pr-4">
                                        <label className="text-sm font-semibold text-zinc-200 cursor-pointer" htmlFor={item.id}>
                                            {item.label}
                                        </label>
                                        <p className="text-xs text-zinc-500 leading-normal">{item.desc}</p>
                                    </div>
                                    <input 
                                        type="checkbox"
                                        id={item.id}
                                        checked={notifications[item.id as keyof typeof notifications]}
                                        onChange={(e) => setNotifications({
                                            ...notifications,
                                            [item.id]: e.target.checked
                                        })}
                                        className="w-4 h-4 mt-1 accent-emerald-500 rounded bg-zinc-900 border-zinc-700 text-emerald-500 focus:ring-emerald-500/30"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="btn-primary">
                                Save Notification Preferences
                            </button>
                        </div>
                    </form>
                );
            case 'appearance':
                return (
                    <form onSubmit={handleSaveAppearance} className="space-y-6">
                        <div className="border-b border-zinc-800 pb-4">
                            <h2 className="text-lg font-semibold text-zinc-100">Appearance Settings</h2>
                            <p className="text-zinc-500 text-xs mt-0.5">Customize the color scheme and layout themes of the app.</p>
                        </div>

                        <div className="space-y-4">
                            <label className="text-xs font-semibold text-zinc-300">Choose Theme Theme</label>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { id: 'dark', name: 'Dark Mode', desc: 'Sleek zinc layout (Default)', preview: 'bg-zinc-950 border-zinc-800' },
                                    { id: 'emerald', name: 'Emerald Forest', desc: 'Deep green accent highlights', preview: 'bg-emerald-950/40 border-emerald-900' },
                                    { id: 'midnight', name: 'Midnight Blue', desc: 'Rich indigo workspace colors', preview: 'bg-indigo-950/30 border-indigo-900' },
                                    { id: 'oled', name: 'OLED Jet Black', desc: 'Pure pitch black styling', preview: 'bg-black border-zinc-900' },
                                ].map((t) => (
                                    <button
                                        key={t.id}
                                        type="button"
                                        onClick={() => setTheme(t.id)}
                                        className={`p-4 rounded-xl border text-left flex flex-col gap-3 transition-all ${t.preview} ${theme === t.id ? 'ring-2 ring-emerald-500 border-emerald-500' : 'hover:border-zinc-700'}`}
                                    >
                                        <div className="w-full h-8 bg-zinc-900/60 rounded-md border border-zinc-800/40 flex items-center px-2 gap-1.5">
                                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                                            <div className="h-1.5 w-12 bg-zinc-700 rounded-full" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-zinc-200">{t.name}</p>
                                            <p className="text-xs text-zinc-500 mt-0.5">{t.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="btn-primary">
                                Save Appearance Theme
                            </button>
                        </div>
                    </form>
                );
            case 'language':
                return (
                    <form onSubmit={handleSaveLanguage} className="space-y-6">
                        <div className="border-b border-zinc-800 pb-4">
                            <h2 className="text-lg font-semibold text-zinc-100">Language & Region</h2>
                            <p className="text-zinc-500 text-xs mt-0.5">Select localization settings and synchronize your local timezone.</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-300">App Language</label>
                                <select 
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="input-field bg-zinc-900 border-zinc-700 focus:border-emerald-500"
                                >
                                    <option value="en">English (US)</option>
                                    <option value="es">Español (ES)</option>
                                    <option value="fr">Français (FR)</option>
                                    <option value="de">Deutsch (DE)</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-zinc-300">Timezone</label>
                                <select className="input-field bg-zinc-900 border-zinc-700 opacity-80" disabled>
                                    <option>Local Browser Timezone (UTC +05:30)</option>
                                </select>
                                <p className="text-[10px] text-zinc-500">Synchronized automatically from your active browser session.</p>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button type="submit" className="btn-primary">
                                Save Regional Settings
                            </button>
                        </div>
                    </form>
                );
            case 'data':
                return (
                    <div className="space-y-6">
                        <div className="border-b border-zinc-800 pb-4">
                            <h2 className="text-lg font-semibold text-zinc-100">Data Management</h2>
                            <p className="text-zinc-500 text-xs mt-0.5">Export your task data or manage account deletion options.</p>
                        </div>

                        <div className="space-y-4">
                            <div className="p-5 bg-zinc-900/30 border border-zinc-800 rounded-xl space-y-3">
                                <h3 className="text-sm font-semibold text-zinc-200">Export Application Data</h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    Download all your tasks, exams, schedules, and reminders in a structured JSON layout. You can use this file as a manual backup.
                                </p>
                                <button 
                                    onClick={() => toast.success('JSON file export started')}
                                    className="btn-secondary text-xs px-3.5 py-2 min-h-[38px]"
                                >
                                    Export Tasks as JSON
                                </button>
                            </div>

                            <div className="p-5 bg-red-950/10 border border-red-900/20 rounded-xl space-y-3">
                                <h3 className="text-sm font-semibold text-red-400">Danger Zone: Delete Account</h3>
                                <p className="text-xs text-red-500/80 leading-relaxed font-medium">
                                    Permanently wipe out your LifeTrackr profile along with all associated database tables (tasks, calendar connections, reminders, exams). This action is irreversible.
                                </p>
                                <button 
                                    onClick={() => {
                                        const confirmDelete = window.confirm('Are you absolutely sure you want to delete your LifeTrackr account? This action is completely permanent.');
                                        if (confirmDelete) {
                                            toast.error('Account deletion not available in preview mode.');
                                        }
                                    }}
                                    className="px-4 py-2 bg-red-500/15 border border-red-500/30 text-red-400 hover:bg-red-500/20 rounded-lg text-xs font-semibold transition-all active:scale-95"
                                >
                                    Delete My LifeTrackr Account
                                </button>
                            </div>
                        </div>
                    </div>
                );
            case 'about':
                return (
                    <div className="space-y-6 animate-in fade-in duration-200">
                        <div className="border-b border-zinc-800 pb-4">
                            <h2 className="text-lg font-semibold text-zinc-100">About LifeTrackr</h2>
                            <p className="text-zinc-500 text-xs mt-0.5">Version 1.0.0 · All-in-one productivity suite</p>
                        </div>

                        <div className="flex flex-col items-center text-center p-6 bg-zinc-900/30 border border-zinc-800/80 rounded-2xl space-y-4">
                            <div className="w-16 h-16 bg-gradient-to-tr from-emerald-600 to-emerald-450 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/10 border border-emerald-500/20">
                                <span className="text-3xl font-extrabold text-zinc-950 tracking-tighter select-none">LT</span>
                            </div>
                            <div className="space-y-1.5 max-w-md">
                                <h3 className="text-lg font-bold text-zinc-100">LifeTrackr Dashboard</h3>
                                <p className="text-xs text-zinc-400 leading-relaxed">
                                    LifeTrackr is built to streamline your academic and personal schedules, optimize your study goals, and keep your tasks organized in a single unified workspace.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="p-4 bg-zinc-900/20 border border-zinc-800/60 rounded-xl space-y-1.5">
                                <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">📅 Smart Calendar Integration</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Seamlessly link and synchronize Google Calendar access to coordinate classes, exams, study periods, and daily events without scheduling conflicts.
                                </p>
                            </div>
                            <div className="p-4 bg-zinc-900/20 border border-zinc-800/60 rounded-xl space-y-1.5">
                                <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">✅ Dynamic Task Management</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Prioritize your agenda, track backlog workloads, log exam timelines, and view daily task analytics inside a custom dashboard system.
                                </p>
                            </div>
                            <div className="p-4 bg-zinc-900/20 border border-zinc-800/60 rounded-xl space-y-1.5">
                                <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">📚 Academic Targets</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Define upcoming syllabus exams, allocate study intervals, categorize difficulty ratings, and ensure timely completion of crucial deadlines.
                                </p>
                            </div>
                            <div className="p-4 bg-zinc-900/20 border border-zinc-800/60 rounded-xl space-y-1.5">
                                <h4 className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">⚡ Highly Custom Workspace</h4>
                                <p className="text-xs text-zinc-500 leading-relaxed">
                                    Tailor your notifications, toggle workspace themes, specify timezone synchronization, and manage profile properties in an interactive glassmorphic layout.
                                </p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-500">
                            <p>© {new Date().getFullYear()} LifeTrackr. All rights reserved.</p>
                            <div className="flex gap-4">
                                <button type="button" onClick={() => toast.info('Documentation is coming soon!')} className="hover:text-zinc-300 transition-colors">Documentation</button>
                                <span className="text-zinc-800">·</span>
                                <button type="button" onClick={() => toast.info('Privacy Policy details coming soon!')} className="hover:text-zinc-300 transition-colors">Privacy Policy</button>
                                <span className="text-zinc-800">·</span>
                                <button type="button" onClick={() => toast.info('Terms of Service details coming soon!')} className="hover:text-zinc-300 transition-colors">Terms of Service</button>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <AppLayout currentPath="/settings">
            <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-300">
                
                {/* Header */}
                <div className="flex items-center gap-3">
                    {mobileShowDetail && (
                        <button 
                            onClick={() => setMobileShowDetail(false)}
                            className="md:hidden p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 rounded-lg"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">
                            {mobileShowDetail ? 'Tab Settings' : 'App Settings'}
                        </h1>
                        <p className="text-zinc-500 text-xs mt-0.5">
                            {mobileShowDetail ? 'Adjust selection details below' : 'Configure your personal preferences and account security'}
                        </p>
                    </div>
                </div>

                {/* Main Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
                    
                    {/* Left Pane Settings Menu (hidden on mobile detail view) */}
                    <div className={`${mobileShowDetail ? 'hidden' : 'block'} md:block md:col-span-4 bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden divide-y divide-zinc-800/50`}>
                        {settingSections.map((section) => {
                            const isTabActive = activeTab === section.id;
                            return (
                                <button 
                                    key={section.id}
                                    onClick={() => {
                                        setActiveTab(section.id);
                                        setMobileShowDetail(true);
                                    }}
                                    className={`w-full flex items-center gap-3.5 p-4 text-left hover:bg-zinc-800/30 transition-colors group ${isTabActive ? 'bg-zinc-800/20' : ''}`}
                                >
                                    <div className={`p-2 rounded-lg transition-colors ${isTabActive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-500 group-hover:text-zinc-300'}`}>
                                        {section.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-xs font-semibold tracking-tight ${isTabActive ? 'text-emerald-400 font-bold' : 'text-zinc-200 group-hover:text-zinc-100'}`}>
                                            {section.label}
                                        </p>
                                        <p className="text-[10px] text-zinc-500 mt-0.5 truncate leading-tight">{section.desc}</p>
                                    </div>
                                    <div className="text-zinc-600 group-hover:text-zinc-400 translate-x-0 group-hover:translate-x-1 transition-all md:block hidden">
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Right Pane Settings Details (hidden on mobile menu list view) */}
                    <div className={`${mobileShowDetail ? 'block' : 'hidden'} md:block md:col-span-8 bg-zinc-900/30 border border-zinc-800/60 rounded-2xl p-6`}>
                        {renderActivePanel()}
                    </div>
                </div>

                {/* Sign Out Action (hidden on mobile detail view to reduce noise) */}
                {!mobileShowDetail && (
                    <div className="pt-2">
                        <button 
                            onClick={handleSignOut}
                            className="w-full flex items-center justify-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/15 border border-red-500/20 rounded-xl text-red-400 text-xs font-semibold transition-all"
                        >
                            <LogOut size={16} />
                            Sign Out from LifeTrackr
                        </button>
                    </div>
                )}

            </div>
        </AppLayout>
    );
}
