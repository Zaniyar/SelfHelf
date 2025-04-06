import { useState } from 'react';
import { Target, Clock, Check, Circle, ArrowUpDown } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';

export interface HealthGoal {
  id: string;
  text: string;
  status: 'not-started' | 'in-progress' | 'completed';
  createdAt: Date;
}

interface HealthGoalsProps {
  goals: HealthGoal[];
  onChange: (goals: HealthGoal[]) => void;
}

interface SortableGoalItemProps {
  goal: HealthGoal;
  onStatusChange: (id: string) => void;
  onDelete: (id: string) => void;
}

const statusIcons = {
  'not-started': Circle,
  'in-progress': Clock,
  'completed': Check,
};

const statusColors = {
  'not-started': 'text-gray-400',
  'in-progress': 'text-blue-400',
  'completed': 'text-green-400',
};

const nextStatus = {
  'not-started': 'in-progress',
  'in-progress': 'completed',
  'completed': 'not-started',
} as const;

function SortableGoalItem({ goal, onStatusChange, onDelete }: SortableGoalItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: goal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const StatusIcon = statusIcons[goal.status];

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-3 p-3 bg-background/50 rounded-lg border border-primary/20 mb-2 group"
    >
      <button
        className="cursor-move touch-none"
        {...attributes}
        {...listeners}
      >
        <ArrowUpDown className="w-4 h-4 text-primary/50 hover:text-primary" />
      </button>
      
      <button
        onClick={() => onStatusChange(goal.id)}
        className={`transition-colors ${statusColors[goal.status]} hover:text-primary`}
        title={`Status: ${goal.status}`}
      >
        <StatusIcon className="w-5 h-5" />
      </button>

      <span className="flex-1">{goal.text}</span>

      <button
        onClick={() => onDelete(goal.id)}
        className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-500 transition-opacity"
      >
        ×
      </button>
    </div>
  );
}

export function HealthGoals({ goals, onChange }: HealthGoalsProps) {
  const [newGoal, setNewGoal] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = goals.findIndex((goal) => goal.id === active.id);
      const newIndex = goals.findIndex((goal) => goal.id === over.id);
      
      onChange(arrayMove(goals, oldIndex, newIndex));
    }
  };

  const handleStatusChange = (id: string) => {
    onChange(
      goals.map((goal) =>
        goal.id === id
          ? { ...goal, status: nextStatus[goal.status] }
          : goal
      )
    );
  };

  const handleDelete = (id: string) => {
    onChange(goals.filter((goal) => goal.id !== id));
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGoal.trim()) {
      onChange([
        ...goals,
        {
          id: uuidv4(),
          text: newGoal.trim(),
          status: 'not-started',
          createdAt: new Date(),
        },
      ]);
      setNewGoal('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddGoal} className="flex gap-2">
        <input
          type="text"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Add a new health goal..."
          className="flex-1 rounded-md border border-primary/20 
            bg-background text-foreground
            focus:border-primary focus:ring focus:ring-primary/20"
        />
        <button
          type="submit"
          disabled={!newGoal.trim()}
          className="px-4 py-2 bg-primary/10 text-primary rounded-md
            hover:bg-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </form>

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
            <SortableGoalItem
              key={goal.id}
              goal={goal}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  );
} 