import {
    Target, Zap, Brain, Heart, Moon,
    Scale, Shield, Activity, Check, Star,
    ArrowRight, Sparkles, Flame, Stethoscope, TrendingUp
} from 'lucide-react';
import { HEALTH_GOAL_OPTIONS } from '../../types/HealthData';

interface PrioritiesStepProps {
    primaryGoals: string[];
    secondaryGoals: string[];
    onChangePrimary: (goals: string[]) => void;
    onChangeSecondary: (goals: string[]) => void;
    onNext: () => void;
    onBack: () => void;
}

// Map categories from HealthData.ts to icons
const iconMap: Record<string, React.ElementType> = {
    sleep: Moon,
    metabolic: TrendingUp,
    mental: Brain,
    cardiovascular: Heart,
    weight: Scale,
    inflammation: Flame,
    chronic: Stethoscope,
    resilience: Shield,
};

export function PrioritiesStep({
    primaryGoals,
    secondaryGoals,
    onChangePrimary,
    onChangeSecondary,
    onNext,
    onBack
}: PrioritiesStepProps) {

    const togglePrimary = (id: string) => {
        if (primaryGoals.includes(id)) {
            onChangePrimary(primaryGoals.filter(g => g !== id));
        } else {
            if (primaryGoals.length < 2) {
                onChangePrimary([...primaryGoals, id]);
                if (secondaryGoals.includes(id)) {
                    onChangeSecondary(secondaryGoals.filter(g => g !== id));
                }
            }
        }
    };

    const toggleSecondary = (id: string) => {
        if (primaryGoals.includes(id)) return;

        if (secondaryGoals.includes(id)) {
            onChangeSecondary(secondaryGoals.filter(g => g !== id));
        } else {
            onChangeSecondary([...secondaryGoals, id]);
        }
    };

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gradient mb-2">Define Your Mission</h2>
                <p className="text-foreground/60">
                    Select up to 2 <span className="text-primary font-bold">Primary Objectives</span>. Everything else is secondary.
                </p>
            </div>

            {/* Primary Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {HEALTH_GOAL_OPTIONS.map((goal) => {
                    const isPrimary = primaryGoals.includes(goal.id);
                    const isSecondary = secondaryGoals.includes(goal.id);
                    const Icon = iconMap[goal.category] || Target;
                    const isDisabled = !isPrimary && primaryGoals.length >= 2;

                    return (
                        <button
                            key={goal.id}
                            onClick={() => togglePrimary(goal.id)}
                            disabled={isDisabled && !isSecondary}
                            className={`relative group p-6 rounded-2xl border text-left transition-all duration-300 overflow-hidden
                ${isPrimary
                                    ? 'border-[#4b789b]/50 shadow-[0_0_40px_rgba(75,120,155,0.3)] scale-[1.02]'
                                    : isSecondary
                                        ? 'bg-white/5 border-[#4b789b]/30 hover:border-[#4b789b]/50'
                                        : isDisabled
                                            ? 'bg-white/5 border-white/5 opacity-40 cursor-not-allowed'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                            style={isPrimary ? {
                                background: 'linear-gradient(135deg, #3a6186 0%, #4b789b 50%, #5a8aad 100%)'
                            } : undefined}
                        >
                            {/* Sparkle indicator for primary */}
                            {isPrimary && (
                                <div className="absolute top-3 right-3">
                                    <Sparkles className="w-5 h-5 text-white/70" />
                                </div>
                            )}

                            <div className="relative z-10 flex items-start justify-between">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`p-3 rounded-xl transition-all shadow-lg`}
                                        style={isPrimary
                                            ? { background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)' }
                                            : { background: 'linear-gradient(135deg, #3a6186 0%, #4b789b 100%)' }
                                        }
                                    >
                                        <Icon className="w-6 h-6 text-white" />
                                    </div>
                                    {isPrimary && (
                                        <span className="px-3 py-1 text-white text-xs font-bold rounded-full border border-white/30"
                                            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
                                        >
                                            PRIMARY
                                        </span>
                                    )}
                                </div>
                                {isPrimary && <Check className="w-6 h-6 text-white" />}
                            </div>

                            <div className="relative z-10">
                                <h3 className={`text-lg font-bold mb-1 ${isPrimary ? 'text-white' : 'text-foreground'}`}>
                                    {goal.title}
                                </h3>
                                <p className={`text-sm leading-relaxed ${isPrimary ? 'text-white/80' : 'text-foreground/60'}`}>
                                    {goal.description}
                                </p>
                            </div>

                            {/* Details - always visible for primary */}
                            {isPrimary && (
                                <div className="mt-4 pt-4 border-t border-white/20 text-xs space-y-2">
                                    <div className="flex items-center gap-2 text-white/90">
                                        <ArrowRight className="w-3 h-3" />
                                        <span>Signal: {goal.shortTermSignals?.[0] || ''}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-white/80">
                                        <Star className="w-3 h-3" />
                                        <span>Outcome: {goal.longTermOutcomes?.[0] || ''}</span>
                                    </div>
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Secondary Goals Section */}
            {primaryGoals.length > 0 && (
                <div className="glass-card p-6 animate-fade-in pointer-events-auto relative z-10">
                    <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2"
                        style={{ color: '#4b789b' }}
                    >
                        <Star className="w-4 h-4" />
                        Secondary Objectives (Optional)
                    </h3>
                    <div className="flex flex-wrap gap-3 pointer-events-auto">
                        {HEALTH_GOAL_OPTIONS
                            .filter(g => !primaryGoals.includes(g.id))
                            .map(goal => {
                                const isSelected = secondaryGoals.includes(goal.id);
                                return (
                                    <button
                                        key={goal.id}
                                        onClick={() => toggleSecondary(goal.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer
                      ${isSelected
                                                ? 'text-white border-white/30 shadow-[0_0_20px_rgba(75,120,155,0.4)]'
                                                : 'bg-white/5 border-white/10 text-foreground/60 hover:bg-white/10 hover:text-foreground hover:border-white/20'
                                            }`}
                                        style={isSelected ? {
                                            background: 'linear-gradient(135deg, #3a6186 0%, #4b789b 100%)'
                                        } : undefined}
                                    >
                                        {isSelected && <span className="mr-2">✓</span>}
                                        {goal.title}
                                    </button>
                                );
                            })}
                    </div>
                </div>
            )}

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
                    disabled={primaryGoals.length === 0}
                    className={`flex-1 py-4 px-6 font-bold rounded-xl transition-all
            ${primaryGoals.length > 0
                            ? 'text-white shadow-[0_0_30px_rgba(75,120,155,0.4)] hover:shadow-[0_0_40px_rgba(75,120,155,0.6)]'
                            : 'bg-white/5 text-foreground/30 cursor-not-allowed'
                        }`}
                    style={primaryGoals.length > 0 ? {
                        background: 'linear-gradient(135deg, #3a6186 0%, #4b789b 50%, #5a8aad 100%)'
                    } : undefined}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
