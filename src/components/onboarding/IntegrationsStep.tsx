import { useState } from 'react';
import {
    Watch, Smartphone, Activity, Heart,
    CheckCircle2, AlertCircle, ArrowRight, Loader2
} from 'lucide-react';

interface IntegrationsStepProps {
    onNext: () => void;
    onBack: () => void;
}

interface Integration {
    id: string;
    name: string;
    type: 'device' | 'app';
    icon: React.ElementType;
    status: 'available' | 'coming_soon';
    connected?: boolean;
}

const integrations: Integration[] = [
    { id: 'apple', name: 'Apple Health', type: 'app', icon: Heart, status: 'available' },
    { id: 'google', name: 'Google Fit', type: 'app', icon: Activity, status: 'available' },
    { id: 'oura', name: 'Oura Ring', type: 'device', icon: CircleIcon, status: 'coming_soon' },
    { id: 'whoop', name: 'Whoop', type: 'device', icon: Watch, status: 'coming_soon' },
    { id: 'garmin', name: 'Garmin', type: 'device', icon: Watch, status: 'coming_soon' },
    { id: 'myfitnesspal', name: 'MyFitnessPal', type: 'app', icon: Smartphone, status: 'coming_soon' },
];

function CircleIcon(props: any) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <circle cx="12" cy="12" r="10" />
        </svg>
    );
}

export function IntegrationsStep({ onNext, onBack }: IntegrationsStepProps) {
    const [connecting, setConnecting] = useState<string | null>(null);
    const [connected, setConnected] = useState<string[]>([]);

    const handleConnect = (id: string) => {
        setConnecting(id);
        // Simulate connection delay
        setTimeout(() => {
            setConnecting(null);
            setConnected(prev => [...prev, id]);
        }, 1500);
    };

    return (
        <div className="space-y-8 animate-slide-up">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Connect Ecosystem</h2>
                <p className="text-foreground/60">
                    Sync with your existing digital health infrastructure.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {integrations.map((item) => {
                    const isConnected = connected.includes(item.id);
                    const isConnecting = connecting === item.id;
                    const isAvailable = item.status === 'available';

                    return (
                        <div
                            key={item.id}
                            className={`relative p-5 rounded-2xl border transition-all duration-300 flex items-center justify-between
                ${isConnected
                                    ? 'bg-primary/10 border-primary shadow-[0_0_20px_rgba(6,182,212,0.15)]'
                                    : 'bg-white/5 border-white/10'
                                }
                ${!isAvailable && 'opacity-60'}
              `}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`p-3 rounded-xl ${isConnected ? 'bg-primary text-background' : 'bg-white/10 text-foreground'}`}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-foreground">{item.name}</h3>
                                    <p className="text-xs text-foreground/50 capitalize">{item.type}</p>
                                </div>
                            </div>

                            {isAvailable ? (
                                <button
                                    onClick={() => !isConnected && !isConnecting && handleConnect(item.id)}
                                    disabled={isConnected || isConnecting}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${isConnected
                                            ? 'text-primary bg-transparent cursor-default'
                                            : isConnecting
                                                ? 'bg-white/10 text-foreground/50 cursor-wait'
                                                : 'bg-white/10 hover:bg-white/20 text-foreground'
                                        }`}
                                >
                                    {isConnected ? (
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-4 h-4" />
                                            <span>Linked</span>
                                        </div>
                                    ) : isConnecting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        'Connect'
                                    )}
                                </button>
                            ) : (
                                <span className="px-3 py-1 rounded-full bg-white/5 text-xs text-foreground/30 font-medium border border-white/5">
                                    Soon
                                </span>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-secondary flex-shrink-0 mt-0.5" />
                <div className="text-sm">
                    <p className="text-foreground/90 font-medium mb-1">Privacy First</p>
                    <p className="text-foreground/60">
                        All data is processed locally on your device. We do not store your health metrics on our servers without explicit encryption consent.
                    </p>
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
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-2 group"
                >
                    <span>Launch Dashboard</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
}
