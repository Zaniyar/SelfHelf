import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Edit2 } from 'lucide-react';

interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  isEditing: boolean;
  onStartEdit: () => void;
  onEndEdit: () => void;
  onTextChange: (text: string) => void;
  onDelete: () => void;
  onStatusChange: (status: 'not-started' | 'in-progress' | 'reached') => void;
}

export const SortableItem = ({ 
  id, 
  children,
  isEditing,
  onStartEdit,
  onEndEdit,
  onDelete,
}: SortableItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group">
      <div
        {...attributes}
        {...listeners}
        className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <GripVertical className="h-4 w-4 text-neon-blue/50" />
      </div>
      <div className="pl-8 relative">
        {children}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={onStartEdit}
            className="p-1 rounded hover:bg-neon-blue/10 text-neon-blue/70 hover:text-neon-blue"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded hover:bg-red-500/10 text-red-500/70 hover:text-red-500"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}; 