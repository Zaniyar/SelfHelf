import {
    Battery, BatteryMedium, BatteryFull,
    Bell, Clock, Zap, Sparkles
} from 'lucide-react';
import { TrackingPreferences, BurdenTolerance, TrackingFrequency } from '../../types/HealthData';

interface TrackingPreferencesStepProps {
    preferences: TrackingPreferences;
    onChange: (prefs: TrackingPreferences) => void;
    onNext: () => void;
    onBack: () => void;
}

export function TrackingPreferencesStep({
    preferences,
    onChange,
    onNext,
    onBack
}: TrackingPreferencesStepProps) {

    const update = <K extends keyof TrackingPreferences>(key: K, value: TrackingPreferences[K]) => {
        onChange({ ...preferences, [key]: value });
    };

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gradient mb-2">Tracking Intensity</h2>
                <p className="text-foreground/60">
                    How much effort do you want to put into data collection?
                </p>
            </div>

            {/* Burden Tolerance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        value: 'minimal',
                        label: 'Minimal',
                        icon: Battery,
                        desc: 'Passive only. No manual logging.',
                        gradient: 'from-emerald-500 to-teal-500',
                        bgGlow: 'shadow-[0_0_40px_rgba(16,185,129,0.2)]'
                    },
                    {
                        value: 'balanced',
                        label: 'Balanced',
                        icon: BatteryMedium,
                        desc: 'Passive + quick daily check-ins.',
                        gradient: 'from-cyan-500 to-blue-500',
                        bgGlow: 'shadow-[0_0_40px_rgba(6,182,212,0.2)]'
                    },
                    {
                        value: 'detailed',
                        label: 'Detailed',
                        icon: BatteryFull,
                        desc: 'Full quantification. Max insights.',
                        gradient: 'from-violet-500 to-purple-500',
                        bgGlow: 'shadow-[0_0_40px_rgba(139,92,246,0.2)]'
                    },
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => update('burdenTolerance', option.value as BurdenTolerance)}
                        className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-4 group overflow-hidden
              ${preferences.burdenTolerance === option.value
                                ? `bg-gradient-to-br ${option.gradient} border-white/30 ${option.bgGlow} scale-[1.02]`
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]'
                            }`}
                    >
                        {preferences.burdenTolerance === option.value && (
                            <div className="absolute top-2 right-2">
                                <Sparkles className="w-4 h-4 text-white/70" />
                            </div>
                        )}

                        <div className={`p-4 rounded-2xl transition-all duration-500 group-hover:scale-110
              ${preferences.burdenTolerance === option.value
                                ? 'bg-white/20 backdrop-blur-sm'
                                : 'bg-gradient-to-br ' + option.gradient + ' opacity-80'}`}>
                            <option.icon className="w-8 h-8 text-white" />
                        </div>

                        <div className="relative z-10">
                            <h3 className={`font-bold text-lg mb-1 ${preferences.burdenTolerance === option.value ? 'text-white' : 'text-foreground'}`}>
                                {option.label}
                            </h3>
                            <p className={`text-xs leading-relaxed ${preferences.burdenTolerance === option.value ? 'text-white/80' : 'text-foreground/50'}`}>
                                {option.desc}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Toggles Section */}
            <div className="glass-card p-6 space-y-4">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    Data Collection Methods
                </h3>

                {/* Passive Tracking */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.3)]">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">Passive Tracking</h4>
                            <p className="text-xs text-foreground/50">Background data from connected devices</p>
                        </div>
                    </div>
                    <button
                        onClick={() => update('passiveTracking', !preferences.passiveTracking)}
                        className={`w-14 h-8 rounded-full transition-all duration-300 relative
              ${preferences.passiveTracking
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 shadow-[0_0_20px_rgba(6,182,212,0.5)]'
                                : 'bg-white/20'}`}
                    >
                        <div className={`absolute top-1 bottom-1 w-6 rounded-full bg-white transition-all duration-300 shadow-lg
              ${preferences.passiveTracking ? 'left-7' : 'left-1'}`}
                        />
                    </button>
                </div>

                {/* Event Triggered */}
                <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-semibold text-foreground">Smart Prompts</h4>
                            <p className="text-xs text-foreground/50">Ask for context when anomalies are detected</p>
                        </div>
                    </div>
                    <button
                        onClick={() => update('eventTriggeredReports', !preferences.eventTriggeredReports)}
                        className={`w-14 h-8 rounded-full transition-all duration-300 relative
              ${preferences.eventTriggeredReports
                                ? 'bg-gradient-to-r from-violet-500 to-purple-500 shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                                : 'bg-white/20'}`}
                    >
                        <div className={`absolute top-1 bottom-1 w-6 rounded-full bg-white transition-all duration-300 shadow-lg
              ${preferences.eventTriggeredReports ? 'left-7' : 'left-1'}`}
                        />
                    </button>
                </div>
            </div>

            {/* Frequency Slider */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 text-white">
                            <Clock className="w-5 h-5" />
                        </div>
                        <span className="font-semibold text-foreground">Check-in Frequency</span>
                    </div>
                    <span className={`text-sm font-bold px-4 py-1.5 rounded-full border transition-all
                        ${preferences.reminderFrequency === 'low'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : preferences.reminderFrequency === 'normal'
                                ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                                : 'bg-violet-500/20 text-violet-400 border-violet-500/30'}`}>
                        {preferences.reminderFrequency === 'low' ? 'RELAXED' :
                            preferences.reminderFrequency === 'normal' ? 'BALANCED' : 'INTENSIVE'}
                    </span>
                </div>

                <input
                    type="range"
                    min="0"
                    max="2"
                    step="1"
                    value={['low', 'normal', 'high'].indexOf(preferences.reminderFrequency)}
                    onChange={(e) => {
                        const val = parseInt(e.target.value);
                        const freq = ['low', 'normal', 'high'][val] as TrackingFrequency;
                        update('reminderFrequency', freq);
                    }}
                    className="w-full h-3 rounded-lg appearance-none cursor-pointer transition-all"
                    style={{
                        accentColor: '#2F687D',
                        background: '#5485ad'
                    }}
                />
                <div className="flex justify-between mt-4 text-xs font-medium uppercase tracking-wide">
                    <span className={`transition-colors ${preferences.reminderFrequency === 'low' ? 'text-emerald-400' : 'text-foreground/40'}`}>
                        Weekly
                    </span>
                    <span className={`transition-colors ${preferences.reminderFrequency === 'normal' ? 'text-cyan-400' : 'text-foreground/40'}`}>
                        Daily
                    </span>
                    <span className={`transition-colors ${preferences.reminderFrequency === 'high' ? 'text-violet-400' : 'text-foreground/40'}`}>
                        Multiple/Day
                    </span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 px-6 rounded-xl border border-white/20 text-foreground/70 hover:bg-white/10 hover:border-white/30 transition-all font-medium"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold rounded-xl hover:from-cyan-400 hover:to-blue-400 transition-all shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
