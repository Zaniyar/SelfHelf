import { useState, useEffect } from 'react';
import { Mars, Venus, User, ChevronRight, Sparkles } from 'lucide-react';
import { DataAvailabilityStep } from './onboarding/DataAvailabilityStep';
import { TrackingPreferencesStep } from './onboarding/TrackingPreferencesStep';
import { PrioritiesStep } from './onboarding/PrioritiesStep';
import { IntegrationsStep } from './onboarding/IntegrationsStep';
import { ExtendedUserData } from '../stores/healthStore';
import {
    DataSource,
    TrackingPreferences,
    AVAILABLE_DATA_SOURCES
} from '../types/HealthData';

interface OnboardingWizardProps {
    onComplete: (userData: ExtendedUserData) => void;
}

type Step = 'basics' | 'data' | 'preferences' | 'priorities' | 'integrations';

const steps: { id: Step; label: string; number: number }[] = [
    { id: 'basics', label: 'Identity', number: 1 },
    { id: 'data', label: 'Sources', number: 2 },
    { id: 'preferences', label: 'Tracking', number: 3 },
    { id: 'priorities', label: 'Goals', number: 4 },
    { id: 'integrations', label: 'Connect', number: 5 },
];

const defaultTrackingPreferences: TrackingPreferences = {
    burdenTolerance: 'moderate',
    passiveTracking: true,
    activeReportFrequency: 'daily',
    eventTriggeredReports: true,
    reminderFrequency: 'normal',
};

export function OnboardingWizard({ onComplete }: OnboardingWizardProps) {
    const [currentStep, setCurrentStep] = useState<Step>('basics');
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Form state
    const [userData, setUserData] = useState<Partial<ExtendedUserData>>({
        gender: 'male',
        age: 30,
        weight: 70,
        height: 170,
        activityLevel: 'moderate',
        dataSources: [...AVAILABLE_DATA_SOURCES],
        primaryGoals: [],
        secondaryGoals: [],
        trackingPreferences: defaultTrackingPreferences,
        onboardingCompleted: false,
        onboardingStep: 0,
    });

    const currentStepIndex = steps.findIndex(s => s.id === currentStep);

    const handleStepChange = (nextStep: Step) => {
        setIsTransitioning(true);
        setTimeout(() => {
            setCurrentStep(nextStep);
            setIsTransitioning(false);
        }, 300);
    };

    const goNext = () => {
        const nextIndex = currentStepIndex + 1;
        if (nextIndex < steps.length) {
            handleStepChange(steps[nextIndex].id);
        }
    };

    const goBack = () => {
        const prevIndex = currentStepIndex - 1;
        if (prevIndex >= 0) {
            handleStepChange(steps[prevIndex].id);
        }
    };

    const handleComplete = () => {
        const completeData: ExtendedUserData = {
            gender: userData.gender || 'other',
            age: userData.age || 30,
            weight: userData.weight || 70,
            height: userData.height || 170,
            activityLevel: userData.activityLevel || 'moderate',
            dataSources: userData.dataSources || AVAILABLE_DATA_SOURCES,
            primaryGoals: userData.primaryGoals || [],
            secondaryGoals: userData.secondaryGoals || [],
            trackingPreferences: userData.trackingPreferences || defaultTrackingPreferences,
            onboardingCompleted: true,
            onboardingStep: 5,
        };
        onComplete(completeData);
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[100px] animate-float" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-secondary/10 blur-[100px] animate-float" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-4xl relative z-10 flex flex-col h-[90vh] md:h-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-gradient mb-2 tracking-tight">Setup Your Profile</h1>
                    <p className="text-foreground/60">Let's calibrate your health optimization engine.</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8 px-4">
                    <div className="flex items-center justify-between relative">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
                        <div
                            className="absolute top-1/2 left-0 h-0.5 bg-gradient-to-r from-primary to-secondary -z-10 transition-all duration-500"
                            style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                        />

                        {steps.map((step, index) => {
                            const isComplete = index < currentStepIndex;
                            const isCurrent = step.id === currentStep;

                            return (
                                <div key={step.id} className="flex flex-col items-center gap-2">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300
                      ${isComplete
                                                ? 'bg-primary text-background shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                                : isCurrent
                                                    ? 'bg-background border-2 border-primary text-primary shadow-[0_0_15px_rgba(6,182,212,0.3)] scale-110'
                                                    : 'bg-background/50 border-2 border-white/10 text-foreground/30'
                                            }`}
                                    >
                                        {isComplete ? '✓' : step.number}
                                    </div>
                                    <span className={`text-xs font-medium transition-colors duration-300 hidden sm:block
                    ${isCurrent ? 'text-primary' : 'text-foreground/40'}`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Main Card */}
                <div className="flex-1 glass-card p-6 md:p-10 overflow-y-auto relative">
                    <div className={`transition-all duration-300 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>

                        {/* Step: Basics */}
                        {currentStep === 'basics' && (
                            <BasicsStep
                                userData={userData}
                                onChange={setUserData}
                                onNext={goNext}
                            />
                        )}

                        {/* Step: Data Availability */}
                        {currentStep === 'data' && (
                            <DataAvailabilityStep
                                dataSources={userData.dataSources || AVAILABLE_DATA_SOURCES}
                                onChange={(sources) => setUserData({ ...userData, dataSources: sources })}
                                onNext={goNext}
                                onBack={goBack}
                            />
                        )}

                        {/* Step: Tracking Preferences */}
                        {currentStep === 'preferences' && (
                            <TrackingPreferencesStep
                                preferences={userData.trackingPreferences || defaultTrackingPreferences}
                                onChange={(prefs) => setUserData({ ...userData, trackingPreferences: prefs })}
                                onNext={goNext}
                                onBack={goBack}
                            />
                        )}

                        {/* Step: Priorities */}
                        {currentStep === 'priorities' && (
                            <PrioritiesStep
                                primaryGoals={userData.primaryGoals || []}
                                secondaryGoals={userData.secondaryGoals || []}
                                onChangePrimary={(goals) => setUserData({ ...userData, primaryGoals: goals })}
                                onChangeSecondary={(goals) => setUserData({ ...userData, secondaryGoals: goals })}
                                onNext={goNext}
                                onBack={goBack}
                            />
                        )}

                        {/* Step: Integrations */}
                        {currentStep === 'integrations' && (
                            <IntegrationsStep
                                onNext={handleComplete}
                                onBack={goBack}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ===== BASICS STEP =====
interface BasicsStepProps {
    userData: Partial<ExtendedUserData>;
    onChange: (data: Partial<ExtendedUserData>) => void;
    onNext: () => void;
}

function BasicsStep({ userData, onChange, onNext }: BasicsStepProps) {
    const update = <K extends keyof ExtendedUserData>(key: K, value: ExtendedUserData[K]) => {
        onChange({ ...userData, [key]: value });
    };

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">Who are you?</h2>
                <p className="text-foreground/60">Basic metrics to calibrate your digital twin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column: Gender & Activity */}
                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Gender</label>
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { value: 'male', label: 'Male', Icon: Mars },
                                { value: 'female', label: 'Female', Icon: Venus },
                                { value: 'other', label: 'Other', Icon: User },
                            ].map(({ value, label, Icon }) => (
                                <button
                                    key={value}
                                    onClick={() => update('gender', value as ExtendedUserData['gender'])}
                                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300
                    ${userData.gender === value
                                            ? 'border-primary bg-primary/20 shadow-[0_0_15px_rgba(6,182,212,0.2)] scale-105'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <Icon className={`w-6 h-6 ${userData.gender === value ? 'text-primary' : 'text-foreground/50'}`} />
                                    <span className={`text-sm ${userData.gender === value ? 'text-primary font-medium' : 'text-foreground/70'}`}>
                                        {label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Activity Level</label>
                        <div className="space-y-2">
                            {[
                                { value: 'sedentary', label: 'Sedentary', desc: 'Office job, little exercise' },
                                { value: 'moderate', label: 'Moderate', desc: 'Light exercise 1-3 days/week' },
                                { value: 'active', label: 'Active', desc: 'Exercise 4-5+ days/week' },
                            ].map(({ value, label, desc }) => (
                                <button
                                    key={value}
                                    onClick={() => update('activityLevel', value as ExtendedUserData['activityLevel'])}
                                    className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left group
                    ${userData.activityLevel === value
                                            ? 'border-primary bg-primary/10'
                                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <div>
                                        <span className={`block font-medium ${userData.activityLevel === value ? 'text-primary' : 'text-foreground'}`}>
                                            {label}
                                        </span>
                                        <span className="text-xs text-foreground/50">{desc}</span>
                                    </div>
                                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                    ${userData.activityLevel === value ? 'border-primary bg-primary' : 'border-foreground/20'}`}>
                                        {userData.activityLevel === value && <div className="w-2 h-2 rounded-full bg-black" />}
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Sliders */}
                <div className="space-y-8">
                    {/* Age */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Age</label>
                            <span className="text-3xl font-bold text-primary">{userData.age}</span>
                        </div>
                        <input
                            type="range"
                            min={16}
                            max={100}
                            value={userData.age || 30}
                            onChange={(e) => update('age', parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-cyan-400 transition-all"
                        />
                    </div>

                    {/* Weight */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Weight</label>
                            <span className="text-3xl font-bold text-secondary">{userData.weight} <span className="text-sm text-foreground/50 font-normal">kg</span></span>
                        </div>
                        <input
                            type="range"
                            min={30}
                            max={200}
                            value={userData.weight || 70}
                            onChange={(e) => update('weight', parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-secondary hover:accent-indigo-400 transition-all"
                        />
                    </div>

                    {/* Height */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-sm font-medium text-foreground/70 uppercase tracking-wider">Height</label>
                            <span className="text-3xl font-bold text-accent">{userData.height} <span className="text-sm text-foreground/50 font-normal">cm</span></span>
                        </div>
                        <input
                            type="range"
                            min={120}
                            max={220}
                            value={userData.height || 170}
                            onChange={(e) => update('height', parseInt(e.target.value))}
                            className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent hover:accent-pink-400 transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Continue Button */}
            <div className="pt-6 flex justify-end">
                <button
                    onClick={onNext}
                    className="group relative px-8 py-4 bg-primary text-background font-bold rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    <div className="relative flex items-center gap-2">
                        Initialize Profile
                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>
        </div>
    );
}

// Re-export for backward compatibility
export type { ExtendedUserData as UserData } from '../stores/healthStore';
