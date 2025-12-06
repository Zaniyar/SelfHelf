import {
    Battery, BatteryMedium, BatteryCharging,
    Bell, BellOff, Clock, Calendar, Zap
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
                <h2 className="text-2xl font-bold text-white mb-2">Tracking Intensity</h2>
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
                        color: 'text-green-400'
                    },
                    {
                        value: 'balanced',
                        label: 'Balanced',
                        icon: BatteryMedium,
                        desc: 'Passive + quick daily check-ins.',
                        color: 'text-cyan-400'
                    },
                    {
                        value: 'detailed',
                        label: 'Detailed',
                        icon: BatteryCharging,
                        desc: 'Full quantification. Max insights.',
                        color: 'text-purple-400'
                    },
                ].map((option) => (
                    <button
                        key={option.value}
                        onClick={() => update('burdenTolerance', option.value as BurdenTolerance)}
                        className={`relative p-6 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-4 group overflow-hidden
              ${preferences.burdenTolerance === option.value
                                ? 'bg-white/10 border-primary/50 shadow-[0_0_30px_rgba(6,182,212,0.15)]'
                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                            }`}
                    >
                        {preferences.burdenTolerance === option.value && (
                            <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
                        )}

                        <div className={`p-4 rounded-full bg-black/30 backdrop-blur-sm transition-transform duration-500 group-hover:scale-110
              ${preferences.burdenTolerance === option.value ? 'ring-2 ring-primary/50' : ''}`}>
                            <option.icon className={`w-8 h-8 ${option.color}`} />
                        </div>

                        <div className="relative z-10">
                            <h3 className={`font-bold text-lg mb-1 ${preferences.burdenTolerance === option.value ? 'text-white' : 'text-foreground/80'}`}>
                                {option.label}
                            </h3>
                            <p className="text-xs text-foreground/50 leading-relaxed">
                                {option.desc}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            {/* Toggles Section */}
            <div className="glass-card p-6 space-y-6">
                <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4">
                    Data Collection Methods
                </h3>

                {/* Passive Tracking */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-secondary/10 text-secondary group-hover:bg-secondary/20 transition-colors">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-foreground">Passive Tracking</h4>
                            <p className="text-xs text-foreground/50">Background data from connected devices</p>
                        </div>
                    </div>
                    <button
                        onClick={() => update('passiveTracking', !preferences.passiveTracking)}
                        className={`w-14 h-8 rounded-full transition-all duration-300 relative
              ${preferences.passiveTracking ? 'bg-secondary shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-white/10'}`}
                    >
                        <div className={`absolute top-1 bottom-1 w-6 rounded-full bg-white transition-all duration-300 shadow-sm
              ${preferences.passiveTracking ? 'left-7' : 'left-1'}`}
                        />
                    </button>
                </div>

                {/* Event Triggered */}
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-xl bg-accent/10 text-accent group-hover:bg-accent/20 transition-colors">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-medium text-foreground">Smart Prompts</h4>
                            <p className="text-xs text-foreground/50">Ask for context when anomalies are detected</p>
                        </div>
                    </div>
                    <button
                        onClick={() => update('eventTriggeredReports', !preferences.eventTriggeredReports)}
                        className={`w-14 h-8 rounded-full transition-all duration-300 relative
              ${preferences.eventTriggeredReports ? 'bg-accent shadow-[0_0_15px_rgba(236,72,153,0.4)]' : 'bg-white/10'}`}
                    >
                        <div className={`absolute top-1 bottom-1 w-6 rounded-full bg-white transition-all duration-300 shadow-sm
              ${preferences.eventTriggeredReports ? 'left-7' : 'left-1'}`}
                        />
                    </button>
                </div>
            </div>

            {/* Frequency Slider */}
            <div className="glass-card p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Clock className="w-5 h-5 text-primary" />
                        <span className="font-medium">Check-in Frequency</span>
                    </div>
                    <span className="text-sm font-bold text-primary bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
                        {preferences.reminderFrequency.toUpperCase()}
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
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary hover:accent-cyan-400 transition-all"
                />
                <div className="flex justify-between mt-3 text-xs text-foreground/40 font-medium uppercase tracking-wide">
                    <span>Weekly</span>
                    <span>Daily</span>
                    <span>Multiple/Day</span>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-4 pt-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-4 px-6 rounded-xl border border-white/10 text-foreground/70 hover:bg-white/5 transition-all font-medium"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 py-4 px-6 bg-primary text-background font-bold rounded-xl hover:bg-cyan-400 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
