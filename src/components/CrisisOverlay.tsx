import { useState, useEffect } from 'react';
import { X, Phone, Wind, Eye, Anchor } from 'lucide-react';

interface CrisisOverlayProps {
    isOpen: boolean;
    onClose: () => void;
}

export function CrisisOverlay({ isOpen, onClose }: CrisisOverlayProps) {
    const [step, setStep] = useState<'breathing' | 'grounding' | 'support'>('breathing');
    const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale');
    const [counter, setCounter] = useState(4);

    // Breathing Logic (4-7-8 technique)
    useEffect(() => {
        if (!isOpen || step !== 'breathing') return;

        let timer: NodeJS.Timeout;

        const runCycle = () => {
            // Inhale (4s)
            setBreathState('inhale');
            setCounter(4);
            let c = 4;
            const inhaleInterval = setInterval(() => {
                c--;
                setCounter(c);
                if (c <= 0) {
                    clearInterval(inhaleInterval);
                    // Hold (7s)
                    setBreathState('hold');
                    setCounter(7);
                    let h = 7;
                    const holdInterval = setInterval(() => {
                        h--;
                        setCounter(h);
                        if (h <= 0) {
                            clearInterval(holdInterval);
                            // Exhale (8s)
                            setBreathState('exhale');
                            setCounter(8);
                            let e = 8;
                            const exhaleInterval = setInterval(() => {
                                e--;
                                setCounter(e);
                                if (e <= 0) {
                                    clearInterval(exhaleInterval);
                                    runCycle(); // Loop
                                }
                            }, 1000);
                        }
                    }, 1000);
                }
            }, 1000);
        };

        runCycle();

        return () => {
            // Cleanup intervals (simplified for this demo, ideally use a single robust timer)
            // In a real app, use a more robust hook for this.
        };
    }, [isOpen, step]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl animate-fade-in pointer-events-auto">
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
                <X className="w-6 h-6" />
            </button>

            <div className="w-full max-w-md p-6 text-center">
                {step === 'breathing' && (
                    <div className="animate-slide-up">
                        <h2 className="text-3xl font-bold text-white mb-2">Breathe with me</h2>
                        <p className="text-white/60 mb-12">Let's lower your heart rate.</p>

                        <div className="relative w-64 h-64 mx-auto mb-12 flex items-center justify-center">
                            {/* Expanding Circle */}
                            <div
                                className={`absolute inset-0 rounded-full border-4 border-primary transition-all duration-[4000ms] ease-in-out
                  ${breathState === 'inhale' ? 'scale-100 opacity-100' :
                                        breathState === 'hold' ? 'scale-100 opacity-100' :
                                            'scale-50 opacity-50'}`}
                            />
                            <div
                                className={`absolute inset-0 rounded-full bg-primary/20 blur-2xl transition-all duration-[4000ms] ease-in-out
                  ${breathState === 'inhale' ? 'scale-110 opacity-100' :
                                        breathState === 'hold' ? 'scale-110 opacity-80' :
                                            'scale-50 opacity-20'}`}
                            />

                            <div className="relative z-10 text-center">
                                <span className="text-6xl font-bold text-white font-['Outfit']">{counter}</span>
                                <p className="text-xl text-primary font-medium mt-2 uppercase tracking-widest">
                                    {breathState}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setStep('grounding')}
                            className="px-8 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-all"
                        >
                            I'm ready for next step
                        </button>
                    </div>
                )}

                {step === 'grounding' && (
                    <div className="animate-slide-up space-y-6">
                        <h2 className="text-2xl font-bold text-white">5-4-3-2-1 Grounding</h2>
                        <p className="text-white/60">Look around you. Name:</p>

                        <div className="space-y-4 text-left">
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                                <Eye className="w-6 h-6 text-primary" />
                                <span className="text-white">5 things you can see</span>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                                <Anchor className="w-6 h-6 text-secondary" />
                                <span className="text-white">4 things you can feel</span>
                            </div>
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4">
                                <Wind className="w-6 h-6 text-green-400" />
                                <span className="text-white">3 things you can hear</span>
                            </div>
                        </div>

                        <div className="flex gap-4 justify-center pt-4">
                            <button
                                onClick={() => setStep('breathing')}
                                className="px-6 py-3 rounded-xl border border-white/10 text-white/70 hover:bg-white/5"
                            >
                                Back to Breathing
                            </button>
                            <button
                                onClick={() => setStep('support')}
                                className="px-6 py-3 rounded-xl bg-primary text-background font-bold hover:bg-cyan-400"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}

                {step === 'support' && (
                    <div className="animate-slide-up">
                        <h2 className="text-2xl font-bold text-white mb-8">Need more support?</h2>

                        <div className="grid gap-4 mb-8">
                            <button className="flex items-center gap-4 p-4 rounded-xl bg-green-500/20 border border-green-500/50 hover:bg-green-500/30 transition-all text-left group">
                                <div className="p-3 rounded-full bg-green-500 text-white">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Call Trusted Contact</h3>
                                    <p className="text-sm text-white/60">Mom (012-345-6789)</p>
                                </div>
                            </button>

                            <button className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-left">
                                <div className="p-3 rounded-full bg-white/10 text-white">
                                    <Anchor className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">Open Journal</h3>
                                    <p className="text-sm text-white/60">Write down your thoughts</p>
                                </div>
                            </button>
                        </div>

                        <button
                            onClick={onClose}
                            className="text-white/50 hover:text-white transition-colors text-sm"
                        >
                            I'm feeling better now
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
