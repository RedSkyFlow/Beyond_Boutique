'use client';

import { useState, useEffect } from 'react';
import type { Guest } from '@/types';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface PreferencesEditorProps {
  guest: Guest;
  onPreferencesChange: (guestId: string, newPreferences: string) => void;
}

export function PreferencesEditor({ guest, onPreferencesChange }: PreferencesEditorProps) {
  const [preferences, setPreferences] = useState(guest.preferences);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setPreferences(guest.preferences);
    setIsSaved(false);
  }, [guest.id, guest.preferences]);

  const handleBlur = () => {
    if (preferences !== guest.preferences) {
      setIsSaving(true);
      // Simulate API call
      setTimeout(() => {
        onPreferencesChange(guest.id, preferences);
        setIsSaving(false);
        setIsSaved(true);
        toast({
          title: "Preferences Saved",
          description: `Preferences for ${guest.name} have been updated.`,
        });
        setTimeout(() => setIsSaved(false), 2000);
      }, 500);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label htmlFor="preferences" className="font-headline">Guest Preferences</Label>
        <span
          className={cn(
            'text-xs transition-opacity duration-300',
            isSaving || isSaved ? 'opacity-100' : 'opacity-0'
          )}
        >
          {isSaving ? 'Saving...' : isSaved ? 'Saved!' : ''}
        </span>
      </div>
      <Textarea
        id="preferences"
        value={preferences}
        onChange={(e) => setPreferences(e.target.value)}
        onBlur={handleBlur}
        placeholder="e.g., Prefers a high floor, requires extra towels..."
        className="min-h-[120px]"
        rows={5}
      />
    </div>
  );
}
