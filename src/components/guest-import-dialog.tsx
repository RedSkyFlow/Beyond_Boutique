
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Guest, GuestSource, GuestStatus } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, FileText } from 'lucide-react';
import { format, isValid } from 'date-fns';


interface GuestImportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImport: (newGuests: Guest[]) => void;
}

const importSources: GuestSource[] = ['Booking.com', 'Manual Entry', 'PANstrat', 'Purple WiFi', 'Tourism Expo'];

export function GuestImportDialog({ isOpen, onOpenChange, onImport }: GuestImportDialogProps) {
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [source, setSource] = useState<GuestSource>('Booking.com');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileContent(text);
      };
      reader.readAsText(file);
    }
  };

  const handleImportClick = () => {
    if (!fileContent.trim() || !source) return;

    const newGuests: Guest[] = [];
    const rows = fileContent.split('\n').filter(row => row.trim() !== '');
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
                const [,,, hotel, room, checkInStr, checkOutStr] = columns;
                const checkInDate = new Date(checkInStr);
                const checkOutDate = new Date(checkOutStr);

                if (!isValid(checkInDate) || !isValid(checkOutDate)) {
                  throw new Error(`Invalid date format in row. Check-in: "${checkInStr}", Check-out: "${checkOutStr}"`);
                }
                
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
                        checkOutDate: format(checkOutDate, 'yyyy-MM-dd'),
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
            Select a CSV file to import. The system will automatically detect the format.
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
            <Label htmlFor="csv-file">CSV File</Label>
            <Input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="pt-2 text-sm"
            />
            {selectedFile && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <FileText className="h-4 w-4" />
                    <span>{selectedFile.name}</span>
                </div>
            )}
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
          <Button type="button" onClick={handleImportClick} disabled={!selectedFile}>
            Import Data
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
