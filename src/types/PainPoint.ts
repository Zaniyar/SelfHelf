export interface PainPoint {
  id: string;
  position: [number, number, number];
  startDate: Date;
  painLevel: number;
  description: string;
  triggers: string[];
  type: 'constant' | 'movement' | 'pressure' | 'other';
  frequency: 'constant' | 'intermittent' | 'random';
  affectedActivities: string[];
} 