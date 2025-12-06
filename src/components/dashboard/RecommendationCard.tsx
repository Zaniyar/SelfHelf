import { Intervention, UrgencyLevel } from '../../types/HealthData';
import {
    Clock, Zap, ArrowRight, Check, X,
    Thermometer, Moon, Pill, Droplets, Beef, Sun, Footprints, Wind, Smartphone,
    Glasses
} from 'lucide-react';

interface RecommendationCardProps {
    intervention: Intervention;
    onAccept: (id: string) => void;
    onDismiss: (id: string) => void;
}

const iconMap: Record<string, React.ElementType> = {
    Thermometer, Moon, Pill, Droplets, Beef, Sun, Footprints, Wind, Smartphone, Glasses
};

export function RecommendationCard({ intervention, onAccept, onDismiss }: RecommendationCardProps) {
    const Icon = iconMap[intervention.icon] || Zap;

    const urgencyColors: Record<UrgencyLevel, string> = {
        acute: 'text-red-400 border-red-400/30 bg-red-400/10',
        strong: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
        optional: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
    };

    const isQuickWin = intervention.cost.timeMinutes < 10 && intervention.benefit.expectedImprovement > 5;
    const isHighImpact = intervention.benefit.expectedImprovement > 15;

    return (
        <div className="glass-card p-5 relative group overflow-hidden animate-slide-up">
            {/* Background Glow */}
            <div className={`absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-10 transition-opacity group-hover:opacity-20
        ${intervention.urgency === 'acute' ? 'bg-red-500' : 'bg-primary'}`}
            />

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-white/5 border border-white/10 text-foreground/80`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${urgencyColors[intervention.urgency]}`}>
                                    {intervention.urgency}
                                </span>
                                {isQuickWin && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-green-400/30 bg-green-400/10 text-green-400">
                                        Quick Win
                                    </span>
                                )}
                                {isHighImpact && (
                                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-purple-400/30 bg-purple-400/10 text-purple-400">
                                        High Impact
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-foreground text-lg leading-tight">
                                {intervention.title}
                            </h3>
                        </div>
                    </div>
                    <button
                        onClick={() => onDismiss(intervention.id)}
                        className="text-foreground/30 hover:text-foreground transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Description */}
                <p className="text-sm text-foreground/60 mb-4 pl-[52px]">
                    {intervention.description}
                </p>

                {/* Metrics */}
                <div className="flex items-center gap-4 pl-[52px] mb-4 text-xs text-foreground/50">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{intervention.cost.timeMinutes} min</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>+{intervention.benefit.expectedImprovement}% Impact</span>
                    </div>
                </div>

                {/* Action Button */}
                <div className="pl-[52px]">
                    <button
                        onClick={() => onAccept(intervention.id)}
                        className="w-full py-2.5 bg-white/5 hover:bg-primary hover:text-background border border-white/10 hover:border-primary/50 rounded-xl transition-all font-medium text-sm flex items-center justify-center gap-2 group/btn"
                    >
                        <span>Accept Protocol</span>
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
}
