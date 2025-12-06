import { useMemo } from 'react';
import { HealthPillar, HealthPillarType } from '../../types/HealthData';
import {
    Moon, Apple, Footprints, Brain, Zap, Stethoscope,
    TrendingUp, TrendingDown, Minus, ChevronRight
} from 'lucide-react';

interface SixPillarsFlowerProps {
    pillars: HealthPillar[];
    size?: number;
    showLabels?: boolean;
    showThreshold?: boolean;
    interactive?: boolean;
    onPillarClick?: (pillar: HealthPillar) => void;
}

const iconMap: Record<HealthPillarType, React.ElementType> = {
    sleep: Moon,
    nutrition: Apple,
    movement: Footprints,
    mentalHealth: Brain,
    recovery: Zap,
    medical: Stethoscope,
};

const trendIcon = {
    improving: TrendingUp,
    stable: Minus,
    declining: TrendingDown,
};

export function SixPillarsFlower({
    pillars,
    size = 340,
    showLabels = true,
    showThreshold = true,
    interactive = true,
    onPillarClick,
}: SixPillarsFlowerProps) {
    const center = size / 2;
    const maxRadius = (size / 2) - 50; // Leave room for labels
    const thresholdRadius = maxRadius * 0.8; // 80% fulfillment ring

    // Calculate points for the radar chart
    const points = useMemo(() => {
        const angleStep = (Math.PI * 2) / pillars.length;
        return pillars.map((pillar, i) => {
            const angle = angleStep * i - Math.PI / 2; // Start from top
            const radius = (pillar.score / 100) * maxRadius;
            const thresholdR = (pillar.minRecommended / 100) * maxRadius;

            return {
                pillar,
                angle,
                x: center + Math.cos(angle) * radius,
                y: center + Math.sin(angle) * radius,
                labelX: center + Math.cos(angle) * (maxRadius + 35),
                labelY: center + Math.sin(angle) * (maxRadius + 35),
                thresholdX: center + Math.cos(angle) * thresholdR,
                thresholdY: center + Math.sin(angle) * thresholdR,
                axisX: center + Math.cos(angle) * maxRadius,
                axisY: center + Math.sin(angle) * maxRadius,
            };
        });
    }, [pillars, center, maxRadius]);

    // Create the polygon path for scores
    const scorePath = useMemo(() => {
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ') + ' Z';
    }, [points]);

    // Create the polygon path for thresholds
    const thresholdPath = useMemo(() => {
        return points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.thresholdX} ${p.thresholdY}`).join(' ') + ' Z';
    }, [points]);

    // Calculate overall health score
    const overallScore = useMemo(() => {
        return Math.round(pillars.reduce((sum, p) => sum + p.score, 0) / pillars.length);
    }, [pillars]);

    // Get weakest pillar
    const weakestPillar = useMemo(() => {
        return pillars.reduce((min, p) => p.score < min.score ? p : min);
    }, [pillars]);

    return (
        <div className="relative flex flex-col items-center">
            <div className="relative">
                {/* Rotating HUD Ring Background */}
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/20 animate-[spin_60s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border-2 border-dotted border-primary/15 animate-[spin_40s_linear_infinite_reverse]" />

                <svg
                    width={size}
                    height={size}
                    className="overflow-visible"
                    style={{ filter: 'drop-shadow(0 0 40px rgba(47, 104, 125, 0.25))' }}
                >
                    <defs>
                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2F687D" stopOpacity="0.4" />
                            <stop offset="100%" stopColor="#4A8BA7" stopOpacity="0.4" />
                        </linearGradient>
                        <linearGradient id="scoreStroke" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2F687D" /> {/* Main accent */}
                            <stop offset="100%" stopColor="#4A8BA7" /> {/* Lighter blue */}
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="6" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Background circles */}
                    {[0.25, 0.5, 0.75, 1].map((scale) => (
                        <circle
                            key={scale}
                            cx={center}
                            cy={center}
                            r={maxRadius * scale}
                            fill="none"
                            stroke="#2F687D"
                            strokeOpacity="0.15"
                            strokeWidth="1.5"
                        />
                    ))}

                    {/* Axis lines */}
                    {points.map((p, i) => (
                        <line
                            key={i}
                            x1={center}
                            y1={center}
                            x2={p.axisX}
                            y2={p.axisY}
                            stroke="#2F687D"
                            strokeOpacity="0.15"
                            strokeWidth="1.5"
                        />
                    ))}

                    {/* 80% threshold ring */}
                    {showThreshold && (
                        <circle
                            cx={center}
                            cy={center}
                            r={thresholdRadius}
                            fill="none"
                            stroke="var(--accent)"
                            strokeOpacity="0.5"
                            strokeWidth="2"
                            strokeDasharray="6 6"
                        />
                    )}

                    {/* Score polygon */}
                    <path
                        d={scorePath}
                        fill="url(#scoreGradient)"
                        stroke="url(#scoreStroke)"
                        strokeWidth={Math.max(2, size / 80)}
                        strokeLinejoin="miter"
                        strokeLinecap="round"
                        filter="url(#glow)"
                        className="transition-all duration-1000 ease-out"
                    />

                    {/* Data points */}
                    {points.map((p, i) => {
                        const isWeak = p.pillar.score < p.pillar.minRecommended;
                        return (
                            <g key={i}>
                                {/* Outer glow for weak pillars */}
                                {isWeak && (
                                    <circle
                                        cx={p.x}
                                        cy={p.y}
                                        r={12}
                                        fill="var(--destructive)"
                                        fillOpacity="0.2"
                                        className="animate-pulse"
                                    />
                                )}
                                {/* Data point */}
                                <circle
                                    cx={p.x}
                                    cy={p.y}
                                    r={5}
                                    fill={isWeak ? 'var(--destructive)' : 'white'}
                                    stroke={isWeak ? 'var(--destructive)' : 'var(--primary)'}
                                    strokeWidth="2"
                                    className={`transition-all duration-300 ${interactive ? 'cursor-pointer hover:r-8' : ''}`}
                                    onClick={() => interactive && onPillarClick?.(p.pillar)}
                                />
                            </g>
                        );
                    })}

                    {/* Labels */}
                    {showLabels && points.map((p, i) => {
                        const Icon = iconMap[p.pillar.type];
                        const isWeak = p.pillar.score < p.pillar.minRecommended;

                        return (
                            <g
                                key={i}
                                className={interactive ? 'cursor-pointer group' : ''}
                                onClick={() => interactive && onPillarClick?.(p.pillar)}
                            >
                                <foreignObject
                                    x={p.labelX - 30}
                                    y={p.labelY - 25}
                                    width={60}
                                    height={50}
                                    className="overflow-visible"
                                >
                                    <div className="flex flex-col items-center transition-transform duration-300 group-hover:scale-110">
                                        <div
                                            className={`p-2 rounded-xl backdrop-blur-md border transition-all duration-300 ${isWeak
                                                ? 'bg-destructive/10 border-destructive/30 text-destructive'
                                                : 'bg-white/5 border-white/10 text-foreground/70 group-hover:bg-primary/20 group-hover:border-primary/50 group-hover:text-primary'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <span className={`text-[10px] font-bold mt-1 tracking-wider ${isWeak ? 'text-destructive' : 'text-foreground/60'
                                            }`}>
                                            {p.pillar.score}%
                                        </span>
                                    </div>
                                </foreignObject>
                            </g>
                        );
                    })}

                    {/* Center score */}
                    <circle
                        cx={center}
                        cy={center}
                        r={40}
                        fill="#2F687D"
                        fillOpacity="0.15"
                        className="drop-shadow-2xl"
                    />
                    <circle
                        cx={center}
                        cy={center}
                        r={40}
                        fill="none"
                        stroke="url(#scoreStroke)"
                        strokeWidth="2"
                        strokeOpacity="0.8"
                    />
                    <text
                        x={center}
                        y={center - 5}
                        textAnchor="middle"
                        className="text-3xl font-bold font-['Outfit']"
                        style={{ fill: 'white', textShadow: '0 0 10px rgba(51, 97, 138, 0.2)' }}
                    >
                        {overallScore}
                    </text>
                    <text
                        x={center}
                        y={center + 15}
                        textAnchor="middle"
                        className="text-[10px] uppercase tracking-[0.2em]"
                        style={{ fill: 'white', opacity: 0.7 }}
                    >
                        Score
                    </text>
                </svg>
            </div>

            {/* Weakest Pillar Callout */}
            {weakestPillar.score < weakestPillar.minRecommended && (
                <div className="mt-6 p-4 glass-card border-l-4 border-l-destructive max-w-xs animate-slide-up">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-destructive/20 rounded-lg">
                                {(() => {
                                    const Icon = iconMap[weakestPillar.type];
                                    return <Icon className="w-4 h-4 text-destructive" />;
                                })()}
                            </div>
                            <div>
                                <span className="text-sm font-bold text-destructive block">
                                    Attention Needed
                                </span>
                                <span className="text-xs text-foreground/60">
                                    {weakestPillar.label} is {weakestPillar.minRecommended - weakestPillar.score}% below target
                                </span>
                            </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-foreground/30" />
                    </div>
                </div>
            )}
        </div>
    );
}
