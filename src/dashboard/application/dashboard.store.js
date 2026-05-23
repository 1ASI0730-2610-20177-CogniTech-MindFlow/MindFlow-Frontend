import { defineStore } from 'pinia'
import { dashboardApi } from '../infrastructure/dashboard.endpoint'
import { JournalEntry, DailyHabit } from '../domain/model/dashboard.model'
import { analyticsApi } from '@/analytics/infrastructure/analytics.endpoint'
import { HabitsAPI } from '@/habits/infrastructure/habits-api'
import { JournalAPI } from '@/journal/infrastructure/journal-api'
import { useSettingsStore } from '@/settings/application/settings.store'

export const useDashboardStore = defineStore('dashboard', {
    state: () => ({
        isLoading: true,
        isAnalyzing: false,
        aiFeedback: null,
        recentEntries: [],
        habits: [],
        weeklySummary: null,
    }),

    actions: {
        async fetchDashboardData() {
            this.isLoading = true;
            const settingsStore = useSettingsStore();

            try {
                let userId = settingsStore.currentUserId;

                if (!userId) {
                    // Dashboard usa u1 como usuario demo cuando no existe sesión activa.
                    await settingsStore.fetchProfile('u1');
                    userId = settingsStore.currentUserId || 'u1';
                }

                // Helper to robustly extract array data
                const extractArrayData = (response, expectedKey) => {
                    if (!response) return [];
                    if (Array.isArray(response)) return response;
                    if (response.data && Array.isArray(response.data)) return response.data;
                    if (expectedKey && response[expectedKey] && Array.isArray(response[expectedKey])) return response[expectedKey];
                    if (typeof response === 'object' && !Array.isArray(response)) return [response];
                    return [];
                };

                // --- Sequential API Calls to avoid rate limiting ---

                // 1. Fetch Analytics
                const analyticsResponse = await (userId ? analyticsApi.getByUserId(userId) : analyticsApi.getAll());
                const analyticsData = extractArrayData(analyticsResponse, 'analyticsCache');
                this.weeklySummary = null;
                if (analyticsData.length > 0) {
                    const analyticsWithTrend = analyticsData.find(a => a && a.trend_data);
                    if (analyticsWithTrend) {
                        this.weeklySummary = analyticsWithTrend.trend_data;
                    }
                }

                // 2. Fetch Habits
                const habitsResponse = await (userId ? HabitsAPI.getByUserId(userId) : HabitsAPI.getAll());
                const allHabits = extractArrayData(habitsResponse, 'habits');
                this.habits = [];
                if (allHabits.length > 0) {
                    const sortedHabits = allHabits.sort((a, b) => {
                        const statusA = a.status || (a.completed ? 'completed' : 'pending');
                        const statusB = b.status || (b.completed ? 'completed' : 'pending');
                        if (statusA === statusB) return (a.streak || 0) - (b.streak || 0);
                        return statusA === 'pending' ? -1 : 1;
                    });
                    this.habits = sortedHabits.slice(0, 3).map(habit => new DailyHabit({
                        id: habit.id,
                        title: habit.name || habit.title || 'Hábito',
                        completed: (habit.status === 'completed') || habit.completed === true,
                        streak: habit.streak || 0
                    }));
                }

                // 3. Fetch Journal Entries
                const entriesResponse = await (userId 
                    ? JournalAPI.search({ user_id: userId, _sort: 'date', _order: 'desc', _limit: 3 })
                    : JournalAPI.search({ _sort: 'date', _order: 'desc', _limit: 3 }));
                const entriesData = extractArrayData(entriesResponse, 'journalEntries');
                this.recentEntries = [];
                if (entriesData.length > 0) {
                    this.recentEntries = entriesData.slice(0, 3).map(entry => new JournalEntry({
                        id: entry.id,
                        time: new Date(entry.created_at || entry.date || Date.now()).toLocaleString('es-ES', { weekday: 'long', hour: 'numeric', minute: 'numeric' }),
                        text: entry.content || entry.text || '',
                        tag: entry.category || entry.tag || 'General'
                    }));
                }

            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            } finally {
                this.isLoading = false;
            }
        },

        async submitJournalEntry(text, tag) {
            this.isAnalyzing = true
            this.aiFeedback = null

            try {
                const response = await dashboardApi.processJournalEntry(text, tag)
                const newEntry = new JournalEntry({ text, tag })
                this.recentEntries.unshift(newEntry)
                this.aiFeedback = response.aiFeedback
            } catch (error) {
                console.error("Error al procesar el registro con IA:", error)
                this.aiFeedback = "Hubo un problema al procesar tu registro. Por favor, intenta de nuevo."
            } finally {
                this.isAnalyzing = false
            }
        },

        toggleHabit(id) {
            const habit = this.habits.find(h => h.id === id)
            if (habit) {
                habit.completed = !habit.completed
                if (habit.completed) habit.streak++
                else habit.streak--
            }
        }
    }
})