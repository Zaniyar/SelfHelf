import { useState, useMemo } from 'react';
import { SixPillarsFlower } from './SixPillarsFlower';
import { OrganPanel } from './OrganHappinessOverlay';
import { DashboardSelector } from './DashboardSelector';
import { SystemStateGrid } from './SystemStateCard';
import { RecommendationCard } from './RecommendationCard';
import { HealthPillar, OrganSystem } from '../../types/HealthData';
import { ExtendedUserData } from '../../stores/healthStore';
import { generateRecommendations } from '../../engine/recommendations';
import { CrisisOverlay } from '../CrisisOverlay';
import {
    ChevronDown, ChevronUp, Sparkles, Calendar,
    TrendingUp, Bell, Settings, Zap, Lightbulb, HeartPulse, LogOut
} from 'lucide-react';

interface DashboardProps {
    pillars: HealthPillar[];
    organSystems: OrganSystem[];
    overallScore: number;
    dashboardView: 'pillars' | 'avatar' | 'combined';
    userData: ExtendedUserData | null;
    onViewChange: (view: 'pillars' | 'avatar' | 'combined') => void;
    onPillarClick?: (pillar: HealthPillar) => void;
    onOrganClick?: (organ: OrganSystem) => void;
    userName?: string;
}

export function Dashboard({
    pillars,
    organSystems,
    overallScore,
    dashboardView,
    userData,
    onViewChange,
    onPillarClick,
    onOrganClick,
    userName,
}: DashboardProps) {
    const [showDetails, setShowDetails] = useState(false);
    const [dismissedRecs, setDismissedRecs] = useState<string[]>([]);
    const [isCrisisMode, setIsCrisisMode] = useState(false);

    // Generate recommendations
    const recommendations = useMemo(() => {
        if (!userData) return [];
        const systemState = {
            pillars,
            organSystems,
            overallScore,
            lastCalculated: new Date()
        };
        return generateRecommendations(systemState, userData)
            .filter(rec => !dismissedRecs.includes(rec.id));
    }, [pillars, organSystems, overallScore, userData, dismissedRecs]);

    const handleDismissRec = (id: string) => {
        setDismissedRecs(prev => [...prev, id]);
    };

    const handleAcceptRec = (id: string) => {
        console.log('Accepted recommendation:', id);
        // In a real app, this would add to active interventions
        handleDismissRec(id);
    };

    // Get greeting based on time
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good morning!';
        if (hour < 17) return 'Good afternoon!';
        return 'Good evening!';
    };

    // Get overall status message
    const getStatusMessage = () => {
        if (overallScore >= 80) return "Systems optimal. You're thriving! 🌟";
        if (overallScore >= 65) return "Good baseline. Minor optimizations available.";
        if (overallScore >= 50) return "Optimization required. Focus on weak points.";
        return "Critical attention needed. Let's stabilize.";
    };

    return (
        <div className={`h-full flex flex-col relative ${dashboardView === 'pillars' ? 'bg-background' : 'bg-transparent'}`}>
            <CrisisOverlay isOpen={isCrisisMode} onClose={() => setIsCrisisMode(false)} />

            {/* Header - Always interactive */}
            <div className="px-6 py-4 border-b border-primary/20 bg-white/40 backdrop-blur-md sticky top-0 z-20 pointer-events-auto">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                            <span style={{ color: '#33618A' }}>{getGreeting()}</span>{userName ? `, ${userName}` : ''}
                            <span className="text-2xl"></span>
                        </h1>
                        <p className="text-sm text-foreground/60 font-medium">{getStatusMessage()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setIsCrisisMode(true)}
                            className="px-4 py-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all border border-red-500/20 font-bold text-sm flex items-center gap-2"
                        >
                            <HeartPulse className="w-4 h-4" />
                            <span className="hidden sm:inline">Stabilize</span>
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Reset app and start onboarding again?')) {
                                    localStorage.clear();
                                    window.location.reload();
                                }
                            }}
                            className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-all border border-red-500/20 hover:border-red-500/30"
                            title="Logout / Reset"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <DashboardSelector
                    currentView={dashboardView}
                    onChange={onViewChange}
                />
            </div>

            {/* Main Content - Different layouts per view */}
            {dashboardView === 'pillars' && (
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar pointer-events-auto">
                    {/* Pillars Flower Chart */}
                    <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                        <SixPillarsFlower
                            pillars={pillars}
                            size={320}
                            showLabels={true}
                            showThreshold={true}
                            interactive={true}
                            onPillarClick={onPillarClick}
                        />
                    </div>

                    {/* Smart Recommendations Section */}
                    {recommendations.length > 0 && (
                        <div className="animate-slide-up">
                            <h3 className="text-sm font-bold text-primary mb-4 flex items-center gap-2 uppercase tracking-wider">
                                <Lightbulb className="w-4 h-4" />
                                Smart Insights
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {recommendations.slice(0, 4).map(rec => (
                                    <RecommendationCard
                                        key={rec.id}
                                        intervention={rec}
                                        onAccept={handleAcceptRec}
                                        onDismiss={handleDismissRec}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Expandable Details */}
                    <div className="border-t border-white/10 pt-6">
                        <button
                            onClick={() => setShowDetails(!showDetails)}
                            className="w-full flex items-center justify-between p-4 rounded-xl 
                             bg-white/5 hover:bg-white/10 border border-white/5 
                             hover:border-white/10 transition-all group"
                        >
                            <span className="text-sm font-bold text-foreground/70 group-hover:text-foreground">
                                {showDetails ? 'Hide' : 'Show'} Detailed Metrics
                            </span>
                            {showDetails ? (
                                <ChevronUp className="w-4 h-4 text-foreground/50" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-foreground/50" />
                            )}
                        </button>

                        {showDetails && (
                            <div className="mt-6">
                                <SystemStateGrid
                                    pillars={pillars}
                                    onPillarClick={onPillarClick}
                                />
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-center gap-2 text-xs text-foreground/30 font-medium uppercase tracking-widest pb-4">
                        <Calendar className="w-3 h-3" />
                        <span>Last Sync: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>
            )}

            {/* Avatar Mode - Sidebar Layout */}
            {dashboardView === 'avatar' && (
                <div className="flex-1 flex">
                    {/* Left Sidebar - OrganPanel */}
                    <div className="w-80 h-full overflow-y-auto p-4 bg-white/40 backdrop-blur-md border-r border-primary/20 pointer-events-auto custom-scrollbar">
                        <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Biological Systems
                        </h3>
                        <OrganPanel
                            organSystems={organSystems}
                            onOrganClick={onOrganClick}
                        />
                    </div>

                    {/* Center - Empty space for 3D model interaction */}
                    <div className="flex-1" />
                </div>
            )}

            {/* Combined Mode - Overlay Layout */}
            {dashboardView === 'combined' && (
                <div className="flex-1 flex">
                    {/* Left Sidebar - Mini OrganPanel */}
                    <div className="w-72 h-full overflow-y-auto p-4 bg-white/40 backdrop-blur-md border-r border-primary/20 pointer-events-auto custom-scrollbar">
                        <h3 className="text-sm font-bold text-foreground/50 uppercase tracking-wider mb-4 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Biological Systems
                        </h3>
                        <OrganPanel
                            organSystems={organSystems}
                            onOrganClick={onOrganClick}
                        />
                    </div>

                    {/* Center - 3D model area */}
                    <div className="flex-1 flex items-center justify-center" />

                    {/* Right Side - Mini Flower Chart */}
                    <div className="w-80 h-full flex items-center justify-center p-4 bg-white/40 backdrop-blur-md border-l border-primary/20 pointer-events-auto">
                        <SixPillarsFlower
                            pillars={pillars}
                            size={200}
                            showLabels={true}
                            showThreshold={false}
                            interactive={true}
                            onPillarClick={onPillarClick}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper function for quick actions
function getQuickAction(type: string): string {
    const actions: Record<string, string> = {
        sleep: 'Optimize sleep environment',
        nutrition: 'Increase nutrient density',
        movement: 'Initiate active recovery',
        mentalHealth: 'Perform mindfulness protocol',
        recovery: 'Schedule downtime',
        medical: 'Review biomarkers',
    };
    return actions[type] || 'Optimize system';
}
