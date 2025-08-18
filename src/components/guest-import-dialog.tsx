
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Guest, GuestSource, GuestStatus } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { format } from 'date-fns';


interface GuestImportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImport: (newGuests: Guest[]) => void;
}

const importSources: GuestSource[] = ['Booking.com', 'Manual Entry', 'PANstrat', 'Purple WiFi', 'Tourism Expo'];

export function GuestImportDialog({ isOpen, onOpenChange, onImport }: GuestImportDialogProps) {
  const [csvText, setCsvText] = useState('');
  const [source, setSource] = useState<GuestSource>('Booking.com');

  const handleImportClick = () => {
    if (!csvText.trim() || !source) return;

    const newGuests: Guest[] = [];
    const rows = csvText.split('\n').filter(row => row.trim() !== '');
    const today = new Date();

    rows.forEach((row, index) => {
        try {
            const columns = row.split(',').map(item => item.trim());
            const [name, email, phone] = columns;

            if (columns.length === 3) {
                // Prospect format: name,email,phone
                const guest: Guest = {
                    id: `imported-${Date.now()}-${index}`,
                    name,
                    email,
                    phone,
                    source,
                    status: 'Prospect',
                    totalStays: 0,
                    loyaltyTier: 'Member',
                    preferences: 'Newly imported prospect.',
                    stayHistory: [],
                    onSiteActivity: {
                        firstSeen: 'N/A',
                        lastSeen: 'N/A',
                        connectedDevices: [],
                    },
                    communicationHistory: [],
                    feedback: [],
                };
                newGuests.push(guest);
            } else if (columns.length >= 7) {
                // Guest with stay format: name,email,phone,hotel,room,checkIn,checkOut
                const [,,, hotel, room, checkIn, checkOut] = columns;
                const checkInDate = new Date(checkIn);
                let status: GuestStatus;
                if (checkInDate > today) {
                    status = 'Arriving Soon';
                } else {
                    status = 'Checked-in'; // Simplified for demo
                }

                const guest: Guest = {
                    id: `imported-${Date.now()}-${index}`,
                    name,
                    email,
                    phone,
                    source,
                    status,
                    totalStays: 1,
                    loyaltyTier: 'Member',
                    preferences: 'Newly imported guest.',
                    stayHistory: [{
                        hotelName: hotel,
                        roomNumber: room,
                        checkInDate: format(checkInDate, 'yyyy-MM-dd'),
                        checkOutDate: format(new Date(checkOut), 'yyyy-MM-dd'),
                    }],
                    onSiteActivity: {
                        firstSeen: 'N/A',
                        lastSeen: 'N/A',
                        connectedDevices: [],
                    },
                    communicationHistory: [],
                    feedback: [],
                };
                newGuests.push(guest);
            } else {
                throw new Error('Invalid CSV format');
            }
        } catch (e) {
            console.error(`Could not parse row ${index + 1}: ${row}`, e);
        }
    });

    onImport(newGuests);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Import Guests or Prospects</DialogTitle>
          <DialogDescription>
            Paste CSV data below. The system will automatically detect the format.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs">
              <b>Guest Format:</b> <code className="bg-muted p-1 rounded">name,email,phone,hotel,room,checkIn,checkOut</code>
              <br/>
              <b>Prospect Format:</b> <code className="bg-muted p-1 rounded">name,email,phone</code>
            </AlertDescription>
          </Alert>
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
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
