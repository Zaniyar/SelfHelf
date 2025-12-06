import { HealthPillar, HealthPillarType } from '../../types/HealthData';
import {
    Moon, Apple, Footprints, Brain, Zap, Stethoscope,
    TrendingUp, TrendingDown, Minus, ChevronRight, Lightbulb
} from 'lucide-react';

interface SystemStateCardProps {
    pillar: HealthPillar;
    onClick?: () => void;
    showRecommendation?: boolean;
}

const iconMap: Record<HealthPillarType, React.ElementType> = {
    sleep: Moon,
    nutrition: Apple,
    movement: Footprints,
    mentalHealth: Brain,
    recovery: Zap,
    medical: Stethoscope,
};

const recommendations: Partial<Record<HealthPillarType, string[]>> = {
    sleep: [
        'Go to bed 30 minutes earlier tonight',
        'Avoid screens 1 hour before bed',
        'Try a 5-minute wind-down routine',
    ],
    nutrition: [
        'Add more vegetables to your next meal',
        'Drink a glass of water now',
        'Try eating without distractions',
    ],
    movement: [
        'Take a 10-minute walk',
        'Do 5 minutes of stretching',
        'Take the stairs today',
    ],
    mentalHealth: [
        'Practice 3 deep breaths right now',
        'Write down 3 things you\'re grateful for',
        'Take a 5-minute mindfulness break',
    ],
    recovery: [
        'Consider a power nap (20 min max)',
        'Try 5 minutes of HRV breathing',
        'Reduce intense activity today',
    ],
    medical: [
        'Check if you took your medications',
        'Schedule that overdue appointment',
        'Review your latest lab results',
    ],
};

const trendIcons = {
    improving: TrendingUp,
    stable: Minus,
    declining: TrendingDown,
};

export function SystemStateCard({
    pillar,
    onClick,
    showRecommendation = true
}: SystemStateCardProps) {
    const Icon = iconMap[pillar.type];
    const TrendIcon = trendIcons[pillar.trend];
    const isWeak = pillar.score < pillar.minRecommended;
    const gap = pillar.minRecommended - pillar.score;

    // Get a random recommendation for this pillar
    const pillarRecs = recommendations[pillar.type] || [];
    const recommendation = pillarRecs[Math.floor(Date.now() / 86400000) % pillarRecs.length];

    return (
        <button
            onClick={onClick}
            className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 group relative overflow-hidden
        ${isWeak
                    ? 'bg-destructive/5 border-destructive/30 hover:bg-destructive/10'
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
        >
            {/* Background Gradient Glow */}
            <div
                className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-[50px] opacity-20 transition-opacity group-hover:opacity-30"
                style={{ backgroundColor: pillar.color }}
            />

            {/* Header */}
            <div className="flex items-start justify-between mb-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div
                        className="p-3 rounded-xl transition-all group-hover:scale-110 shadow-lg"
                        style={{
                            backgroundColor: `${pillar.color}15`,
                            boxShadow: `0 0 15px ${pillar.color}10`
                        }}
                    >
                        <Icon className="w-5 h-5" style={{ color: pillar.color }} />
                    </div>
                    <div>
                        <h3 className="font-bold text-lg text-foreground tracking-tight">{pillar.label}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <TrendIcon className={`w-3 h-3 ${pillar.trend === 'improving' ? 'text-green-400' :
                                    pillar.trend === 'declining' ? 'text-red-400' :
                                        'text-foreground/40'
                                }`} />
                            <span className="text-xs text-foreground/50 capitalize font-medium">{pillar.trend}</span>
                        </div>
                    </div>
                </div>

                <div className="text-right">
                    <span
                        className="text-2xl font-bold font-['Outfit']"
                        style={{ color: pillar.color }}
                    >
                        {pillar.score}
                    </span>
                    <span className="text-foreground/30 text-xs font-medium ml-1">/100</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="relative h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                {/* Threshold marker */}
                <div
                    className="absolute top-0 bottom-0 w-0.5 bg-white/20 z-10"
                    style={{ left: `${pillar.minRecommended}%` }}
                />
                {/* Score fill */}
                <div
                    className="h-full rounded-full transition-all duration-1000 ease-out relative"
                    style={{
                        width: `${pillar.score}%`,
                        backgroundColor: pillar.color,
                    }}
                >
                    <div className="absolute inset-0 bg-white/30 animate-pulse" />
                </div>
            </div>

            {/* Status Text */}
            <div className="flex items-center justify-between text-xs mb-4 relative z-10">
                {isWeak ? (
                    <span className="text-destructive font-medium flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-destructive animate-pulse" />
                        {gap}% below target
                    </span>
                ) : (
                    <span className="text-green-400 font-medium flex items-center gap-1">
                        <CheckIcon className="w-3 h-3" />
                        On track
                    </span>
                )}
                <span className="text-foreground/30 font-medium">
                    {formatTimeAgo(pillar.lastUpdated)}
                </span>
            </div>

            {/* Recommendation */}
            {showRecommendation && recommendation && isWeak && (
                <div className="relative z-10 flex items-start gap-3 p-3 bg-black/20 rounded-xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-foreground/80 leading-snug">{recommendation}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-foreground/30 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                </div>
            )}
        </button>
    );
}

function CheckIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

// ===== GRID OF CARDS =====
interface SystemStateGridProps {
    pillars: HealthPillar[];
    onPillarClick?: (pillar: HealthPillar) => void;
}

export function SystemStateGrid({ pillars, onPillarClick }: SystemStateGridProps) {
    // Sort by score (worst first)
    const sortedPillars = [...pillars].sort((a, b) => a.score - b.score);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-up">
            {sortedPillars.map(pillar => (
                <SystemStateCard
                    key={pillar.type}
                    pillar={pillar}
                    onClick={() => onPillarClick?.(pillar)}
                />
            ))}
        </div>
    );
}

// Helper function
function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}
