import { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { OrganSystem, HappinessLevel } from '../../types/HealthData';
import {
    Heart, Activity, Moon, Zap, Brain, Apple,
    TrendingUp, TrendingDown, Minus, AlertCircle
} from 'lucide-react';

interface OrganHappinessOverlayProps {
    organSystems: OrganSystem[];
    onOrganClick?: (organ: OrganSystem) => void;
}

const iconMap: Record<string, React.ElementType> = {
    cardiac: Heart,
    metabolic: Activity,
    sleep: Moon,
    hormonal: Zap,
    stress: Brain,
    gut: Apple,
};

const happinessColors: Record<HappinessLevel, string> = {
    thriving: '#22c55e',
    good: '#84cc16',
    neutral: '#eab308',
    stressed: '#f97316',
    critical: '#ef4444',
};

const happinessEmoji: Record<HappinessLevel, string> = {
    thriving: '',
    good: '',
    neutral: '',
    stressed: '',
    critical: '',
};

const trendIcons = {
    improving: TrendingUp,
    stable: Minus,
    declining: TrendingDown,
};

export function OrganHappinessOverlay({
    organSystems,
    onOrganClick
}: OrganHappinessOverlayProps) {
    return (
        <>
            {organSystems.map((organ) => {
                if (!organ.position) return null;

                const Icon = iconMap[organ.type] || Heart;
                const color = happinessColors[organ.happiness];
                const emoji = happinessEmoji[organ.happiness];
                const TrendIcon = trendIcons[organ.forecast];
                const isAlertState = organ.happiness === 'stressed' || organ.happiness === 'critical';

                return (
                    <Html
                        key={organ.type}
                        position={[organ.position.x, organ.position.y, organ.position.z]}
                        center
                        distanceFactor={5}
                        style={{ pointerEvents: 'auto' }}
                    >
                        <button
                            onClick={() => onOrganClick?.(organ)}
                            className="group relative"
                            style={{ transform: 'scale(0.8)' }}
                        >
                            {/* Glow effect for alert states */}
                            {isAlertState && (
                                <div
                                    className="absolute inset-0 rounded-full animate-ping opacity-50"
                                    style={{
                                        backgroundColor: color,
                                        animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
                                    }}
                                />
                            )}

                            {/* Main indicator */}
                            <div
                                className="relative flex items-center justify-center w-10 h-10 rounded-full 
                         border-2 backdrop-blur-sm transition-all duration-300
                         group-hover:scale-110 group-hover:shadow-lg"
                                style={{
                                    backgroundColor: `${color}30`,
                                    borderColor: color,
                                    boxShadow: `0 0 15px ${color}40`
                                }}
                            >
                                <span className="text-lg">{emoji}</span>
                            </div>

                            {/* Expanded tooltip on hover */}
                            <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 
                            opacity-0 group-hover:opacity-100 transition-all duration-200
                            pointer-events-none z-50">
                                <div
                                    className="px-3 py-2 rounded-lg backdrop-blur-md border min-w-[140px]"
                                    style={{
                                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                        borderColor: `${color}50`
                                    }}
                                >
                                    <div className="flex items-center gap-2 mb-1">
                                        <Icon className="w-4 h-4" style={{ color }} />
                                        <span className="text-white text-sm font-medium">{organ.label}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            <div
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: color }}
                                            />
                                            <span className="text-xs text-white/70 capitalize">{organ.happiness}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendIcon
                                                className={`w-3 h-3 ${organ.forecast === 'improving' ? 'text-green-400' :
                                                        organ.forecast === 'declining' ? 'text-red-400' :
                                                            'text-white/40'
                                                    }`}
                                            />
                                            <span className="text-xs text-white/50">{organ.score}%</span>
                                        </div>
                                    </div>
                                    {organ.suggestedAction && (
                                        <p className="text-[10px] text-white/50 mt-1 border-t border-white/10 pt-1">
                                            💡 {organ.suggestedAction}
                                        </p>
                                    )}
                                </div>
                                {/* Arrow */}
                                <div
                                    className="w-2 h-2 rotate-45 absolute left-1/2 -translate-x-1/2 -bottom-1"
                                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                                />
                            </div>
                        </button>
                    </Html>
                );
            })}
        </>
    );
}

// ===== STANDALONE 2D ORGAN PANEL (for non-3D view) =====
interface OrganPanelProps {
    organSystems: OrganSystem[];
    onOrganClick?: (organ: OrganSystem) => void;
}

export function OrganPanel({ organSystems, onOrganClick }: OrganPanelProps) {
    // Sort by score (worst first)
    const sortedOrgans = useMemo(() =>
        [...organSystems].sort((a, b) => a.score - b.score),
        [organSystems]
    );

    return (
        <div className="space-y-2">
            {sortedOrgans.map(organ => {
                const Icon = iconMap[organ.type] || Heart;
                const color = happinessColors[organ.happiness];
                const TrendIcon = trendIcons[organ.forecast];
                const isAlertState = organ.happiness === 'stressed' || organ.happiness === 'critical';

                return (
                    <button
                        key={organ.type}
                        onClick={() => onOrganClick?.(organ)}
                        className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all
              ${isAlertState
                                ? 'border-red-500/30 bg-red-500/5 hover:bg-red-500/10'
                                : 'border-foreground/10 bg-foreground/5 hover:bg-primary/5 hover:border-primary/30'
                            }`}
                    >
                        {/* Icon */}
                        <div
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: `${color}20` }}
                        >
                            <Icon className="w-5 h-5" style={{ color }} />
                        </div>

                        {/* Label & Status */}
                        <div className="flex-1 text-left">
                            <div className="flex items-center gap-2">
                                <span className="font-medium text-foreground">{organ.label}</span>
                                <span className="text-lg">{happinessEmoji[organ.happiness]}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                                <div
                                    className="h-1.5 flex-1 rounded-full bg-foreground/10 overflow-hidden"
                                >
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${organ.score}%`,
                                            backgroundColor: color
                                        }}
                                    />
                                </div>
                                <span className="text-xs text-foreground/50 w-8">{organ.score}%</span>
                            </div>
                        </div>

                        {/* Trend */}
                        <div className={`p-1.5 rounded-lg ${organ.forecast === 'improving' ? 'bg-green-500/10' :
                                organ.forecast === 'declining' ? 'bg-red-500/10' :
                                    'bg-foreground/5'
                            }`}>
                            <TrendIcon className={`w-4 h-4 ${organ.forecast === 'improving' ? 'text-green-400' :
                                    organ.forecast === 'declining' ? 'text-red-400' :
                                        'text-foreground/40'
                                }`} />
                        </div>

                        {/* Alert icon for critical states */}
                        {isAlertState && (
                            <AlertCircle className="w-4 h-4 text-red-400 animate-pulse" />
                        )}
                    </button>
                );
            })}
        </div>
    );
}
