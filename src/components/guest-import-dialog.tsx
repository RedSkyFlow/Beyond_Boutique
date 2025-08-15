
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { GuestSource } from '@/types';

interface GuestImportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImport: (csvText: string, source: GuestSource) => void;
}

const importSources: GuestSource[] = ['Booking.com', 'Manual Entry', 'PANstrat', 'Purple WiFi'];

export function GuestImportDialog({ isOpen, onOpenChange, onImport }: GuestImportDialogProps) {
  const [csvText, setCsvText] = useState('');
  const [source, setSource] = useState<GuestSource>('Booking.com');

  const handleImportClick = () => {
    if (csvText.trim() && source) {
      onImport(csvText, source);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Import Guests</DialogTitle>
          <DialogDescription>
            Paste CSV data below. Each line should be a new guest in the format:
            <br />
            <code className="text-xs bg-muted p-1 rounded">
              name,email,phone,hotelName,roomNumber,YYYY-MM-DD,YYYY-MM-DD
            </code>
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="csv-data">Guest Data (CSV)</Label>
            <Textarea
              id="csv-data"
              placeholder="John Doe,j.doe@example.com,555-0199,Last Word Madikwe,10,2024-09-01,2024-09-05"
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              rows={6}
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="source">Data Source</Label>
            <Select value={source} onValueChange={(value) => setSource(value as GuestSource)}>
              <SelectTrigger id="source">
                <SelectValue placeholder="Select a source" />
              </SelectTrigger>
              <SelectContent>
                {importSources.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" onClick={handleImportClick} disabled={!csvText.trim()}>
            Import Guests
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
