import { useState } from 'react';
import {
    Target, Zap, Brain, Heart, Moon,
    Scale, Shield, Activity, Check, Star,
    ArrowRight
} from 'lucide-react';
import { HEALTH_GOAL_OPTIONS, GoalCategory } from '../../types/HealthData';

interface PrioritiesStepProps {
    primaryGoals: string[];
    secondaryGoals: string[];
    onChangePrimary: (goals: string[]) => void;
    onChangeSecondary: (goals: string[]) => void;
    onNext: () => void;
    onBack: () => void;
}

const iconMap: Record<GoalCategory, React.ElementType> = {
    longevity: Heart,
    performance: Zap,
    cognitive: Brain,
    energy: Activity,
    sleep: Moon,
    weight: Scale,
    immunity: Shield,
    stress: Star, // Fallback
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
                // Remove from secondary if present
                if (secondaryGoals.includes(id)) {
                    onChangeSecondary(secondaryGoals.filter(g => g !== id));
                }
            }
        }
    };

    const toggleSecondary = (id: string) => {
        if (primaryGoals.includes(id)) return; // Can't be both

        if (secondaryGoals.includes(id)) {
            onChangeSecondary(secondaryGoals.filter(g => g !== id));
        } else {
            onChangeSecondary([...secondaryGoals, id]);
        }
    };

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Define Your Mission</h2>
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
                            disabled={isDisabled && !isSecondary} // Allow clicking if it's secondary to promote it? No, keep simple.
                            className={`relative group p-6 rounded-2xl border text-left transition-all duration-300 overflow-hidden
                ${isPrimary
                                    ? 'bg-primary/10 border-primary shadow-[0_0_30px_rgba(6,182,212,0.2)]'
                                    : isSecondary
                                        ? 'bg-white/5 border-white/10 opacity-50 hover:opacity-100'
                                        : isDisabled
                                            ? 'bg-white/5 border-white/5 opacity-30 cursor-not-allowed'
                                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                }`}
                        >
                            {/* Background Gradient for Primary */}
                            {isPrimary && (
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-50" />
                            )}

                            <div className="relative z-10 flex items-start justify-between">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className={`p-3 rounded-xl transition-colors
                    ${isPrimary ? 'bg-primary text-background' : 'bg-white/10 text-foreground/70'}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    {isPrimary && (
                                        <span className="px-3 py-1 bg-primary text-background text-xs font-bold rounded-full animate-in zoom-in">
                                            PRIMARY
                                        </span>
                                    )}
                                </div>
                                {isPrimary && <Check className="w-6 h-6 text-primary" />}
                            </div>

                            <div className="relative z-10">
                                <h3 className={`text-lg font-bold mb-1 ${isPrimary ? 'text-white' : 'text-foreground'}`}>
                                    {goal.label}
                                </h3>
                                <p className="text-sm text-foreground/60 leading-relaxed">
                                    {goal.description}
                                </p>
                            </div>

                            {/* Hover Effect: Show details */}
                            <div className={`mt-4 pt-4 border-t border-white/10 text-xs space-y-2 transition-all duration-300
                ${isPrimary || (document.body.style.cursor === 'pointer') ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden group-hover:opacity-100 group-hover:h-auto'}`}>
                                <div className="flex items-center gap-2 text-primary">
                                    <ArrowRight className="w-3 h-3" />
                                    <span>Signal: {goal.shortTermSignal}</span>
                                </div>
                                <div className="flex items-center gap-2 text-secondary">
                                    <Star className="w-3 h-3" />
                                    <span>Outcome: {goal.longTermOutcome}</span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Secondary Goals Section */}
            {primaryGoals.length > 0 && (
                <div className="glass-card p-6 animate-fade-in">
                    <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4">
                        Secondary Objectives (Optional)
                    </h3>
                    <div className="flex flex-wrap gap-3">
                        {HEALTH_GOAL_OPTIONS
                            .filter(g => !primaryGoals.includes(g.id))
                            .map(goal => {
                                const isSelected = secondaryGoals.includes(goal.id);
                                return (
                                    <button
                                        key={goal.id}
                                        onClick={() => toggleSecondary(goal.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium border transition-all
                      ${isSelected
                                                ? 'bg-secondary/20 border-secondary text-secondary shadow-[0_0_10px_rgba(99,102,241,0.2)]'
                                                : 'bg-white/5 border-white/10 text-foreground/60 hover:bg-white/10 hover:text-foreground'
                                            }`}
                                    >
                                        {isSelected && <span className="mr-2">✓</span>}
                                        {goal.label}
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
                    className="flex-1 py-4 px-6 rounded-xl border border-white/10 text-foreground/70 hover:bg-white/5 transition-all font-medium"
                >
                    Back
                </button>
                <button
                    onClick={onNext}
                    disabled={primaryGoals.length === 0}
                    className={`flex-1 py-4 px-6 font-bold rounded-xl transition-all shadow-lg
            ${primaryGoals.length > 0
                            ? 'bg-primary text-background hover:bg-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.3)]'
                            : 'bg-white/5 text-foreground/30 cursor-not-allowed'
                        }`}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}
