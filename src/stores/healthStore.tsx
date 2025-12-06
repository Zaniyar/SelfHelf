import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    SystemState,
    HealthPillar,
    OrganSystem,
    DataSource,
    Intervention,
    Reminder,
    TrackingPreferences,
    HealthGoalOption,
    DEFAULT_PILLARS,
    DEFAULT_ORGAN_SYSTEMS,
    AVAILABLE_DATA_SOURCES,
    ExtendedUserData,
} from '../types/HealthData';

// ===== HEALTH STORE STATE =====

// ===== HEALTH STORE STATE =====
interface HealthStoreState {
    // User data
    userData: ExtendedUserData | null;

    // System state
    systemState: SystemState;

    // Interventions
    activeInterventions: Intervention[];
    completedInterventions: Intervention[];

    // Reminders
    reminders: Reminder[];

    // UI state
    dashboardView: 'pillars' | 'avatar' | 'combined';
}

// ===== HEALTH STORE ACTIONS =====
interface HealthStoreActions {
    // User data
    setUserData: (data: ExtendedUserData) => void;
    updateUserData: (updates: Partial<ExtendedUserData>) => void;

    // System state
    updatePillar: (type: string, updates: Partial<HealthPillar>) => void;
    updateOrganSystem: (type: string, updates: Partial<OrganSystem>) => void;
    recalculateSystemState: () => void;

    // Interventions
    addIntervention: (intervention: Intervention) => void;
    completeIntervention: (id: string, feedback?: Intervention['feedback']) => void;
    dismissIntervention: (id: string) => void;

    // Reminders
    addReminder: (reminder: Reminder) => void;
    dismissReminder: (id: string) => void;
    snoozeReminder: (id: string, until: Date) => void;

    // Data sources
    toggleDataSource: (id: string, enabled: boolean) => void;

    // UI
    setDashboardView: (view: 'pillars' | 'avatar' | 'combined') => void;

    // Persistence
    clearAllData: () => void;
}

type HealthStore = HealthStoreState & HealthStoreActions;

// ===== DEFAULT STATE =====
const defaultTrackingPreferences: TrackingPreferences = {
    burdenTolerance: 'moderate',
    passiveTracking: true,
    activeReportFrequency: 'daily',
    eventTriggeredReports: true,
    reminderFrequency: 'normal',
};

const defaultSystemState: SystemState = {
    pillars: DEFAULT_PILLARS,
    organSystems: DEFAULT_ORGAN_SYSTEMS,
    overallScore: 70,
    lastCalculated: new Date(),
};

const defaultState: HealthStoreState = {
    userData: null,
    systemState: defaultSystemState,
    activeInterventions: [],
    completedInterventions: [],
    reminders: [],
    dashboardView: 'pillars',
};

// ===== STORAGE KEYS =====
const STORAGE_KEYS = {
    USER_DATA: 'selfhelf_userData',
    SYSTEM_STATE: 'selfhelf_systemState',
    INTERVENTIONS: 'selfhelf_interventions',
    COMPLETED_INTERVENTIONS: 'selfhelf_completedInterventions',
    REMINDERS: 'selfhelf_reminders',
    DASHBOARD_VIEW: 'selfhelf_dashboardView',
};

// ===== CONTEXT =====
const HealthStoreContext = createContext<HealthStore | null>(null);

// ===== PROVIDER =====
interface HealthStoreProviderProps {
    children: ReactNode;
}

export function HealthStoreProvider({ children }: HealthStoreProviderProps) {
    // Initialize state from localStorage
    const [userData, setUserDataState] = useState<ExtendedUserData | null>(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.USER_DATA);
        return stored ? JSON.parse(stored) : null;
    });

    const [systemState, setSystemState] = useState<SystemState>(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.SYSTEM_STATE);
        if (stored) {
            const parsed = JSON.parse(stored);
            return {
                ...parsed,
                lastCalculated: new Date(parsed.lastCalculated),
                pillars: parsed.pillars.map((p: HealthPillar) => ({
                    ...p,
                    lastUpdated: new Date(p.lastUpdated),
                })),
            };
        }
        return defaultSystemState;
    });

    const [activeInterventions, setActiveInterventions] = useState<Intervention[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.INTERVENTIONS);
        return stored ? JSON.parse(stored) : [];
    });

    const [completedInterventions, setCompletedInterventions] = useState<Intervention[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.COMPLETED_INTERVENTIONS);
        return stored ? JSON.parse(stored) : [];
    });

    const [reminders, setReminders] = useState<Reminder[]>(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.REMINDERS);
        return stored ? JSON.parse(stored) : [];
    });

    const [dashboardView, setDashboardViewState] = useState<'pillars' | 'avatar' | 'combined'>(() => {
        const stored = localStorage.getItem(STORAGE_KEYS.DASHBOARD_VIEW);
        return (stored as 'pillars' | 'avatar' | 'combined') || 'pillars';
    });

    // Persist to localStorage on changes
    useEffect(() => {
        if (userData) {
            localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
        }
    }, [userData]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.SYSTEM_STATE, JSON.stringify(systemState));
    }, [systemState]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.INTERVENTIONS, JSON.stringify(activeInterventions));
    }, [activeInterventions]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.COMPLETED_INTERVENTIONS, JSON.stringify(completedInterventions));
    }, [completedInterventions]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(reminders));
    }, [reminders]);

    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.DASHBOARD_VIEW, dashboardView);
    }, [dashboardView]);

    // ===== ACTIONS =====
    const setUserData = (data: ExtendedUserData) => {
        setUserDataState(data);
    };

    const updateUserData = (updates: Partial<ExtendedUserData>) => {
        setUserDataState(prev => prev ? { ...prev, ...updates } : null);
    };

    const updatePillar = (type: string, updates: Partial<HealthPillar>) => {
        setSystemState(prev => ({
            ...prev,
            pillars: prev.pillars.map(p =>
                p.type === type ? { ...p, ...updates, lastUpdated: new Date() } : p
            ),
        }));
    };

    const updateOrganSystem = (type: string, updates: Partial<OrganSystem>) => {
        setSystemState(prev => ({
            ...prev,
            organSystems: prev.organSystems.map(o =>
                o.type === type ? { ...o, ...updates } : o
            ),
        }));
    };

    const recalculateSystemState = () => {
        const avgScore = systemState.pillars.reduce((sum, p) => sum + p.score, 0) / systemState.pillars.length;
        setSystemState(prev => ({
            ...prev,
            overallScore: Math.round(avgScore),
            lastCalculated: new Date(),
        }));
    };

    const addIntervention = (intervention: Intervention) => {
        setActiveInterventions(prev => [...prev, intervention]);
    };

    const completeIntervention = (id: string, feedback?: Intervention['feedback']) => {
        const intervention = activeInterventions.find(i => i.id === id);
        if (intervention) {
            const completed: Intervention = {
                ...intervention,
                isCompleted: true,
                completedAt: new Date(),
                feedback,
            };
            setCompletedInterventions(prev => [...prev, completed]);
            setActiveInterventions(prev => prev.filter(i => i.id !== id));
        }
    };

    const dismissIntervention = (id: string) => {
        setActiveInterventions(prev => prev.filter(i => i.id !== id));
    };

    const addReminder = (reminder: Reminder) => {
        setReminders(prev => [...prev, reminder]);
    };

    const dismissReminder = (id: string) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, dismissed: true } : r
        ));
    };

    const snoozeReminder = (id: string, until: Date) => {
        setReminders(prev => prev.map(r =>
            r.id === id ? { ...r, snoozedUntil: until } : r
        ));
    };

    const toggleDataSource = (id: string, enabled: boolean) => {
        if (userData) {
            const updatedSources = userData.dataSources.map(ds =>
                ds.id === id ? { ...ds, enabled } : ds
            );
            updateUserData({ dataSources: updatedSources });
        }
    };

    const setDashboardView = (view: 'pillars' | 'avatar' | 'combined') => {
        setDashboardViewState(view);
    };

    const clearAllData = () => {
        Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
        setUserDataState(null);
        setSystemState(defaultSystemState);
        setActiveInterventions([]);
        setCompletedInterventions([]);
        setReminders([]);
        setDashboardViewState('pillars');
    };

    const store: HealthStore = {
        userData,
        systemState,
        activeInterventions,
        completedInterventions,
        reminders,
        dashboardView,
        setUserData,
        updateUserData,
        updatePillar,
        updateOrganSystem,
        recalculateSystemState,
        addIntervention,
        completeIntervention,
        dismissIntervention,
        addReminder,
        dismissReminder,
        snoozeReminder,
        toggleDataSource,
        setDashboardView,
        clearAllData,
    };

    return (
        <HealthStoreContext.Provider value={store}>
            {children}
        </HealthStoreContext.Provider>
    );
}

// ===== HOOK =====
export function useHealthStore(): HealthStore {
    const context = useContext(HealthStoreContext);
    if (!context) {
        throw new Error('useHealthStore must be used within a HealthStoreProvider');
    }
    return context;
}

// ===== UTILITY FUNCTIONS =====
export function calculatePillarGap(pillar: HealthPillar): number {
    return Math.max(0, pillar.minRecommended - pillar.score);
}

export function getWeakestPillar(pillars: HealthPillar[]): HealthPillar | null {
    if (pillars.length === 0) return null;
    return pillars.reduce((weakest, pillar) =>
        pillar.score < weakest.score ? pillar : weakest
    );
}

export function happinessToColor(happiness: OrganSystem['happiness']): string {
    const colors = {
        thriving: '#22c55e',
        good: '#84cc16',
        neutral: '#eab308',
        stressed: '#f97316',
        critical: '#ef4444',
    };
    return colors[happiness];
}

export function scoreToHappiness(score: number): OrganSystem['happiness'] {
    if (score >= 85) return 'thriving';
    if (score >= 70) return 'good';
    if (score >= 55) return 'neutral';
    if (score >= 40) return 'stressed';
    return 'critical';
}
