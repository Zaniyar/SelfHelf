import { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { Plus, Check, Clock, Target } from 'lucide-react';

export interface HealthGoal {
  id: string;
  text: string;
  status: 'not-started' | 'in-progress' | 'reached';
  createdAt: Date;
}

interface HealthGoalsProps {
  goals: HealthGoal[];
  onChange: (goals: HealthGoal[]) => void;
}

export const HealthGoals = ({ goals, onChange }: HealthGoalsProps) => {
  const [newGoal, setNewGoal] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = goals.findIndex((goal) => goal.id === active.id);
      const newIndex = goals.findIndex((goal) => goal.id === over.id);
      
      onChange(arrayMove(goals, oldIndex, newIndex));
    }
  };

  const addGoal = () => {
    if (newGoal.trim()) {
      onChange([
        ...goals,
        {
          id: crypto.randomUUID(),
          text: newGoal.trim(),
          status: 'not-started',
          createdAt: new Date(),
        },
      ]);
      setNewGoal('');
    }
  };

  const updateGoalStatus = (id: string, status: HealthGoal['status']) => {
    onChange(
      goals.map((goal) =>
        goal.id === id ? { ...goal, status } : goal
      )
    );
  };

  const updateGoalText = (id: string, text: string) => {
    onChange(
      goals.map((goal) =>
        goal.id === id ? { ...goal, text } : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    onChange(goals.filter((goal) => goal.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addGoal()}
          placeholder="Add a new health goal..."
          className="flex-1 px-3 py-2 rounded-md border border-neon-blue/20 
            bg-neon-darker text-foreground
            focus:border-neon-blue focus:ring focus:ring-neon-blue/20"
        />
        <button
          onClick={addGoal}
          className="p-2 rounded-md bg-neon-blue/10 text-neon-blue hover:bg-neon-blue/20"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={goals}
            strategy={verticalListSortingStrategy}
          >
            {goals.map((goal) => (
              <SortableItem
                key={goal.id}
                id={goal.id}
                isEditing={editingId === goal.id}
                onStartEdit={() => setEditingId(goal.id)}
                onEndEdit={() => setEditingId(null)}
                onTextChange={(text) => updateGoalText(goal.id, text)}
                onDelete={() => deleteGoal(goal.id)}
                onStatusChange={(status) => updateGoalStatus(goal.id, status)}
              >
                <div className="flex items-center gap-3 p-3 bg-neon-darker border border-neon-blue/20 rounded-md">
                  <div className="flex-1">
                    {editingId === goal.id ? (
                      <input
                        type="text"
                        value={goal.text}
                        onChange={(e) => updateGoalText(goal.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        autoFocus
                        className="w-full bg-neon-darker border-none focus:ring-0 text-foreground"
                      />
                    ) : (
                      <span className="text-foreground">{goal.text}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateGoalStatus(goal.id, 'not-started')}
                      className={`p-1 rounded ${
                        goal.status === 'not-started' 
                          ? 'text-neon-blue bg-neon-blue/10' 
                          : 'text-neon-blue/50 hover:text-neon-blue'
                      }`}
                      title="Not Started"
                    >
                      <Target className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateGoalStatus(goal.id, 'in-progress')}
                      className={`p-1 rounded ${
                        goal.status === 'in-progress' 
                          ? 'text-yellow-500 bg-yellow-500/10' 
                          : 'text-neon-blue/50 hover:text-neon-blue'
                      }`}
                      title="In Progress"
                    >
                      <Clock className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => updateGoalStatus(goal.id, 'reached')}
                      className={`p-1 rounded ${
                        goal.status === 'reached' 
                          ? 'text-green-500 bg-green-500/10' 
                          : 'text-neon-blue/50 hover:text-neon-blue'
                      }`}
                      title="Reached"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </SortableItem>
            ))}
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}; 