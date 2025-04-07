import { useState } from 'react';
import { PainPoint } from '../types/PainPoint';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Calendar } from './ui/calendar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { format } from 'date-fns';

interface PainPointDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (painPoint: Omit<PainPoint, 'id' | 'position'>) => void;
  selectedBone?: string;
}

export const PainPointDrawer = ({ isOpen, onClose, onSave, selectedBone }: PainPointDrawerProps) => {
  const [painData, setPainData] = useState({
    startDate: new Date(),
    painLevel: 5,
    description: '',
    triggers: [] as string[],
    type: 'constant' as PainPoint['type'],
    frequency: 'constant' as PainPoint['frequency'],
    affectedActivities: [] as string[],
  });

  const [showCalendar, setShowCalendar] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(painData);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-neon-blue">Add Pain Point</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {selectedBone && (
            <div className="text-sm text-foreground/70">
              Selected area: {selectedBone}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              When did it start?
            </label>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
                onClick={() => setShowCalendar(!showCalendar)}
                type="button"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(painData.startDate, 'PPP')}
              </Button>
            </div>
            {showCalendar && (
              <Calendar
                mode="single"
                selected={painData.startDate}
                onSelect={(date) => {
                  if (date) {
                    setPainData({ ...painData, startDate: date });
                    setShowCalendar(false);
                  }
                }}
                initialFocus
              />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              Pain Level: {painData.painLevel}
            </label>
            <Slider
              min={1}
              max={10}
              step={1}
              value={[painData.painLevel]}
              onValueChange={(value) => setPainData({ ...painData, painLevel: value[0] })}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-foreground/50">
              <span>Mild</span>
              <span>Severe</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              Pain Type
            </label>
            <Select
              value={painData.type}
              onValueChange={(value) => setPainData({ ...painData, type: value as PainPoint['type'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select pain type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="constant">Constant Pain</SelectItem>
                <SelectItem value="movement">Pain during Movement</SelectItem>
                <SelectItem value="pressure">Pain when Pressed</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              Frequency
            </label>
            <Select
              value={painData.frequency}
              onValueChange={(value) => setPainData({ ...painData, frequency: value as PainPoint['frequency'] })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="constant">Constant</SelectItem>
                <SelectItem value="intermittent">Intermittent</SelectItem>
                <SelectItem value="random">Random</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground/70">
              Description
            </label>
            <Textarea
              value={painData.description}
              onChange={(e) => setPainData({ ...painData, description: e.target.value })}
              placeholder="Describe the pain and any relevant details..."
              className="min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            variant="default"
          >
            Save Pain Point
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}; 