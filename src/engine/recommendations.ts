import {
    Intervention,
    SystemState,
    ExtendedUserData,
    HealthPillarType,
    InterventionCategory,
    UrgencyLevel
} from '../types/HealthData';

// Library of potential interventions
const INTERVENTION_LIBRARY: Omit<Intervention, 'id' | 'urgency'>[] = [
    // SLEEP INTERVENTIONS
    {
        title: 'Blue Light Protocol',
        description: 'Wear blue-light blocking glasses 2 hours before bed.',
        category: 'sleep',
        icon: 'Glasses',
        cost: { effort: 2, timeMinutes: 0, psychologicalFriction: 2 },
        benefit: { expectedImprovement: 15, affectedPillars: ['sleep', 'recovery'], timeToBenefit: 'days', confidence: 85 }
    },
    {
        title: 'Temperature Drop',
        description: 'Set bedroom temperature to 18°C (65°F) for optimal sleep.',
        category: 'sleep',
        icon: 'Thermometer',
        cost: { effort: 1, timeMinutes: 1, psychologicalFriction: 1 },
        benefit: { expectedImprovement: 10, affectedPillars: ['sleep'], timeToBenefit: 'immediate', confidence: 90 }
    },
    {
        title: 'Magnesium Glycinate',
        description: 'Take 200-400mg of Magnesium Glycinate 1 hour before sleep.',
        category: 'supplement',
        icon: 'Pill',
        cost: { effort: 1, timeMinutes: 1, monetaryCost: 20, psychologicalFriction: 1 },
        benefit: { expectedImprovement: 12, affectedPillars: ['sleep', 'recovery', 'mentalHealth'], timeToBenefit: 'days', confidence: 80 }
    },

    // NUTRITION INTERVENTIONS
    {
        title: 'Hydration Front-loading',
        description: 'Drink 500ml of water immediately upon waking.',
        category: 'nutrition',
        icon: 'Droplets',
        cost: { effort: 2, timeMinutes: 2, psychologicalFriction: 2 },
        benefit: { expectedImprovement: 8, affectedPillars: ['nutrition', 'mentalHealth'], timeToBenefit: 'immediate', confidence: 95 }
    },
    {
        title: 'Protein First',
        description: 'Eat 30g of protein within 30 minutes of waking.',
        category: 'nutrition',
        icon: 'Beef',
        cost: { effort: 4, timeMinutes: 15, psychologicalFriction: 3 },
        benefit: { expectedImprovement: 15, affectedPillars: ['nutrition', 'recovery', 'movement'], timeToBenefit: 'weeks', confidence: 85 }
    },

    // MOVEMENT INTERVENTIONS
    {
        title: 'Morning Sunlight',
        description: 'Get 10 minutes of direct sunlight within 1 hour of waking.',
        category: 'movement',
        icon: 'Sun',
        cost: { effort: 3, timeMinutes: 10, psychologicalFriction: 2 },
        benefit: { expectedImprovement: 20, affectedPillars: ['sleep', 'mentalHealth', 'movement'], timeToBenefit: 'days', confidence: 95 }
    },
    {
        title: 'Zone 2 Walk',
        description: 'Take a brisk 20-minute walk after lunch.',
        category: 'movement',
        icon: 'Footprints',
        cost: { effort: 3, timeMinutes: 20, psychologicalFriction: 3 },
        benefit: { expectedImprovement: 12, affectedPillars: ['movement', 'metabolic', 'mentalHealth'], timeToBenefit: 'weeks', confidence: 90 }
    },

    // MENTAL HEALTH
    {
        title: 'Box Breathing',
        description: 'Perform 5 minutes of box breathing (4-4-4-4) when stressed.',
        category: 'mindfulness',
        icon: 'Wind',
        cost: { effort: 2, timeMinutes: 5, psychologicalFriction: 2 },
        benefit: { expectedImprovement: 15, affectedPillars: ['mentalHealth', 'recovery'], timeToBenefit: 'immediate', confidence: 90 }
    },
    {
        title: 'Digital Sunset',
        description: 'No screens 1 hour before bed.',
        category: 'lifestyle',
        icon: 'Smartphone',
        cost: { effort: 5, timeMinutes: 0, psychologicalFriction: 5 },
        benefit: { expectedImprovement: 25, affectedPillars: ['sleep', 'mentalHealth'], timeToBenefit: 'days', confidence: 90 }
    }
];

export function generateRecommendations(
    systemState: SystemState,
    userData: ExtendedUserData | null
): Intervention[] {
    if (!userData) return [];

    // 1. Identify Weak Pillars (Score < MinRecommended)
    const weakPillars = systemState.pillars.filter(p => p.score < p.minRecommended);

    // 2. Identify Critical Pillars (Score < MinRecommended - 15)
    const criticalPillars = systemState.pillars.filter(p => p.score < p.minRecommended - 15);

    // 3. Filter and Score Interventions
    const scoredInterventions = INTERVENTION_LIBRARY.map(template => {
        let score = 0;
        let urgency: UrgencyLevel = 'optional';

        // A. Relevance Score
        const targetsWeakPillar = template.benefit.affectedPillars.some(p =>
            weakPillars.some(wp => wp.type === p)
        );
        const targetsCriticalPillar = template.benefit.affectedPillars.some(p =>
            criticalPillars.some(cp => cp.type === p)
        );

        if (targetsCriticalPillar) {
            score += 50;
            urgency = 'acute';
        } else if (targetsWeakPillar) {
            score += 30;
            urgency = 'strong';
        }

        // B. ROI Score (Benefit / Cost)
        // Normalize effort (1-5) to avoid division by zero
        const effort = Math.max(1, template.cost.effort);
        const roi = template.benefit.expectedImprovement / effort;
        score += roi * 5;

        // C. User Preference Adjustment
        // If user wants 'minimal' burden, penalize high effort
        if (userData.trackingPreferences.burdenTolerance === 'minimal' && template.cost.effort > 2) {
            score -= 20;
        }
        // If user wants 'detailed', boost high confidence
        if (userData.trackingPreferences.burdenTolerance === 'detailed' && template.benefit.confidence > 90) {
            score += 10;
        }

        // D. Goal Alignment
        // If intervention helps a primary goal
        // (This would require mapping goals to pillars/interventions more explicitly, skipping for now)

        return {
            ...template,
            id: `rec-${Math.random().toString(36).substr(2, 9)}`,
            urgency,
            score // Internal scoring for sorting
        };
    });

    // 4. Sort by Score and Return Top 5
    return scoredInterventions
        .filter(i => i.score > 10) // Filter out irrelevant ones
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map(({ score, ...intervention }) => intervention); // Remove internal score
}
