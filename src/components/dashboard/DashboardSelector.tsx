import { Flower2, User, LayoutGrid } from 'lucide-react';

type DashboardView = 'pillars' | 'avatar' | 'combined';

interface DashboardSelectorProps {
    currentView: DashboardView;
    onChange: (view: DashboardView) => void;
}

const views: { id: DashboardView; label: string; icon: React.ElementType; description: string }[] = [
    { id: 'pillars', label: 'Pillars', icon: Flower2, description: 'Six-Pillars Flower chart' },
    { id: 'avatar', label: 'Avatar', icon: User, description: '3D body with organ indicators' },
    { id: 'combined', label: 'Combined', icon: LayoutGrid, description: 'Both views together' },
];

export function DashboardSelector({ currentView, onChange }: DashboardSelectorProps) {
    return (
        <div className="flex items-center gap-1 p-1 bg-foreground/5 rounded-xl border border-foreground/10">
            {views.map(view => {
                const Icon = view.icon;
                const isActive = currentView === view.id;

                return (
                    <button
                        key={view.id}
                        onClick={() => onChange(view.id)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all
              ${isActive
                                ? 'bg-primary/20 text-primary shadow-sm'
                                : 'text-foreground/50 hover:text-foreground hover:bg-foreground/5'
                            }`}
                        title={view.description}
                    >
                        <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : ''}`} />
                        <span className="text-sm font-medium hidden sm:inline">{view.label}</span>
                    </button>
                );
            })}
        </div>
    );
}
