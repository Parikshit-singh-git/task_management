'use client';
import React, { useState, useEffect } from 'react';
import AppLayout from '@/components/AppLayout';
import DailyTasksSection from '../dashboard/components/DailyTasksSection';
import PendingBacklogTable from '../dashboard/components/PendingBacklogTable';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

export default function TasksPage() {
    const { user, supabase } = useAuth();
    const [activeTasksCount, setActiveTasksCount] = useState<number | null>(null);
    const [loadingCount, setLoadingCount] = useState(true);

    useEffect(() => {
        if (!user || !supabase) {
            setLoadingCount(false);
            return;
        }

        const fetchActiveTasksCount = async () => {
            try {
                const { count, error } = await supabase
                    .from('tasks')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .neq('status', 'done');

                if (error) throw error;
                if (count !== null) {
                    setActiveTasksCount(count);
                }
            } catch (err) {
                console.error('Error fetching active tasks count:', err);
            } finally {
                setLoadingCount(false);
            }
        };

        fetchActiveTasksCount();

        // Listen to changes in the tasks table to update the count dynamically in real time
        const channel = supabase
            .channel('tasks-header-count')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'tasks', filter: `user_id=eq.${user.id}` },
                () => {
                    fetchActiveTasksCount();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, supabase]);

    return (
        <AppLayout currentPath="/tasks">
            <div className="space-y-8 animate-in fade-in duration-500 p-6 md:p-8">
                
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Task Manager</h1>
                        <p className="text-zinc-500 text-sm mt-1">Organize and track your daily productivity</p>
                    </div>
                    <div className="flex items-center shrink-0">
                        {loadingCount ? (
                            <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                                <Loader2 size={12} className="animate-spin text-emerald-500" />
                                Syncing tasks...
                            </div>
                        ) : activeTasksCount !== null ? (
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold font-mono tracking-tight shadow-sm shadow-emerald-500/5">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                {activeTasksCount} {activeTasksCount === 1 ? 'task' : 'tasks'} remaining
                            </div>
                        ) : null}
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-8">
                    <DailyTasksSection />
                    <PendingBacklogTable />
                </div>
            </div>
        </AppLayout>
    );
}
