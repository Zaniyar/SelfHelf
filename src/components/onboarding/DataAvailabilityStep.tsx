import { useState } from 'react';
import {
    Moon, UtensilsCrossed, Thermometer, Smile, Brain, Calendar,
    Watch, Activity, Circle, Zap, Heart, TrendingUp,
    TestTube, Pill, FileText, AlertTriangle,
    Dumbbell, Coffee, Wine, Salad,
    CheckCircle2, ChevronDown
} from 'lucide-react';
import { DataSource, AVAILABLE_DATA_SOURCES, DataSourceCategory } from '../../types/HealthData';

interface DataAvailabilityStepProps {
    dataSources: DataSource[];
    onChange: (sources: DataSource[]) => void;
    onNext: () => void;
    onBack: () => void;
}

const iconMap: Record<string, React.ElementType> = {
    Moon, UtensilsCrossed, Thermometer, Smile, Brain, Calendar,
    Watch, Activity, Circle, Zap, Heart, TrendingUp,
    TestTube, Pill, FileText, AlertTriangle,
    Dumbbell, Coffee, Wine, Salad,
    Apple: Circle, // Fallback
};

const categoryLabels: Record<DataSourceCategory, string> = {
    manual: '📝 Manual Tracking',
    device: '⌚ Connected Devices',
    medical: '🏥 Medical Data',
    lifestyle: '🌿 Lifestyle',
};

const categoryDescriptions: Record<DataSourceCategory, string> = {
    manual: 'Data you can log yourself',
    device: 'Connect your wearables and health devices',
    medical: 'Import your medical history',
    lifestyle: 'Track habits and routines',
};

export function DataAvailabilityStep({
    dataSources,
    onChange,
    onNext,
    onBack
}: DataAvailabilityStepProps) {
    const [expandedCategory, setExpandedCategory] = useState<DataSourceCategory | null>('manual');

    const toggleSource = (id: string) => {
        const updated = dataSources.map(ds =>
            ds.id === id ? { ...ds, enabled: !ds.enabled } : ds
        );
        onChange(updated);
    };

    const getSourcesByCategory = (category: DataSourceCategory) =>
        dataSources.filter(ds => ds.category === category);

    const getEnabledCount = (category: DataSourceCategory) =>
        getSourcesByCategory(category).filter(ds => ds.enabled).length;

    const categories: DataSourceCategory[] = ['manual', 'device', 'medical', 'lifestyle'];

    return (
        <div className="space-y-6 animate-slide-up">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Data Sources</h2>
                <p className="text-foreground/60">
                    Select the data streams you can provide. More data = higher fidelity model.
                </p>
            </div>

            <div className="space-y-4">
                {categories.map(category => {
                    const sources = getSourcesByCategory(category);
                    const enabledCount = getEnabledCount(category);
                    const isExpanded = expandedCategory === category;

                    return (
                        <div
                            key={category}
                            className={`rounded-2xl overflow-hidden transition-all duration-300 border
                ${isExpanded
                                    ? 'bg-white/5 border-primary/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }`}
                        >
                            {/* Category Header */}
                            <button
                                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                                className="w-full flex items-center justify-between p-5 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`text-2xl transition-transform duration-300 ${isExpanded ? 'scale-110' : ''}`}>
                                        {categoryLabels[category].split(' ')[0]}
                                    </div>
                                    <div className="text-left">
                                        <h3 className={`font-semibold text-lg ${isExpanded ? 'text-primary' : 'text-foreground'}`}>
                                            {categoryLabels[category].split(' ').slice(1).join(' ')}
                                        </h3>
                                        <p className="text-sm text-foreground/50">{categoryDescriptions[category]}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {enabledCount > 0 && (
                                        <span className="px-3 py-1 text-xs font-bold bg-primary/20 text-primary rounded-full border border-primary/20">
                                            {enabledCount} active
                                        </span>
                                    )}
                                    <ChevronDown className={`w-5 h-5 text-foreground/50 transition-transform duration-300 ${isExpanded ? 'rotate-180 text-primary' : ''}`} />
                                </div>
                            </button>

                            {/* Expanded Sources */}
                            <div className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                <div className="overflow-hidden">
                                    <div className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {sources.map(source => {
                                            const Icon = iconMap[source.icon] || Circle;
                                            return (
                                                <button
                                                    key={source.id}
                                                    onClick={() => toggleSource(source.id)}
                                                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group
                            ${source.enabled
                                                            ? 'border-primary bg-primary/10 shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                                                            : 'border-white/5 bg-black/20 hover:bg-white/5 hover:border-white/10'
                                                        }`}
                                                >
                                                    <div className={`p-2 rounded-lg transition-colors ${source.enabled ? 'bg-primary/20' : 'bg-white/5 group-hover:bg-white/10'}`}>
                                                        <Icon className={`w-5 h-5 ${source.enabled ? 'text-primary' : 'text-foreground/50'}`} />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <h4 className={`font-medium text-sm ${source.enabled ? 'text-primary' : 'text-foreground'}`}>
                                                            {source.name}
                                                        </h4>
                                                        <p className="text-xs text-foreground/40">{source.description}</p>
                                                    </div>
                                                    {source.enabled && (
                                                        <CheckCircle2 className="w-5 h-5 text-primary animate-in zoom-in duration-200" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Summary Bar */}
            <div className="p-5 bg-black/20 rounded-xl border border-white/10 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground/60">Total Coverage</span>
                    <span className="font-bold text-primary">
                        {Math.round((dataSources.filter(ds => ds.enabled).length / dataSources.length) * 100)}%
                    </span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500 relative"
                        style={{ width: `${(dataSources.filter(ds => ds.enabled).length / dataSources.length) * 100}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-pulse" />
                    </div>
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
