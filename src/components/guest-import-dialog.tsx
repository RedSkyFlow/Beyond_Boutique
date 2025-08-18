
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import type { Guest, GuestSource, GuestStatus, OnSiteActivity } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, FileText } from 'lucide-react';
import { format, isValid, parse } from 'date-fns';
import { useToast } from '@/hooks/use-toast';


interface GuestImportDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onImport: (newGuests: Guest[]) => void;
}

const importSources: GuestSource[] = ['Booking.com', 'Manual Entry', 'PANstrat', 'Purple WiFi', 'Tourism Expo'];

const parseCSV = (content: string): { headers: string[], rows: string[][] } => {
  const lines = content.split('\n').filter(line => line.trim() !== '');
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
  const rows = lines.slice(1).map(line => line.split(',').map(item => item.trim()));
  return { headers, rows };
};


export function GuestImportDialog({ isOpen, onOpenChange, onImport }: GuestImportDialogProps) {
  const [fileContent, setFileContent] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [source, setSource] = useState<GuestSource>('Booking.com');
  const { toast } = useToast();

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

    const { headers, rows } = parseCSV(fileContent);
    const newGuests: Guest[] = [];
    const today = new Date();
    
    // Determine format based on headers
    const isGuestWithStayFormat = headers.includes('hotel') && headers.includes('room');
    const isProspectFormat = headers.length === 3 && headers.includes('name') && headers.includes('email') && headers.includes('phone');
    const isWifiFormat = headers.includes('gender') && headers.includes('dob');

    rows.forEach((columns, index) => {
      try {
        let guest: Guest | null = null;
        
        if (isGuestWithStayFormat || (!isProspectFormat && !isWifiFormat && columns.length >= 7)) {
            const [name, email, phone, hotel, room, checkInStr, checkOutStr] = columns;
            const checkInDate = new Date(checkInStr);
            const checkOutDate = new Date(checkOutStr);

            if (!isValid(checkInDate) || !isValid(checkOutDate)) {
                throw new Error(`Invalid date format in row ${index + 2}. Check-in: "${checkInStr}", Check-out: "${checkOutStr}"`);
            }
            
            let status: GuestStatus;
            if (checkInDate > today) {
                status = 'Arriving Soon';
            } else {
                status = 'Checked-in'; // Simplified for demo
            }
            
            guest = {
                id: `imported-${Date.now()}-${index}`,
                name, email, phone, source, status,
                totalStays: 1,
                loyaltyTier: 'Member',
                preferences: 'Newly imported guest.',
                stayHistory: [{
                    hotelName: hotel,
                    roomNumber: room,
                    checkInDate: format(checkInDate, 'yyyy-MM-dd'),
                    checkOutDate: format(checkOutDate, 'yyyy-MM-dd'),
                }],
                onSiteActivity: { firstSeen: 'N/A', lastSeen: 'N/A', connectedDevices: [] },
                communicationHistory: [],
                feedback: [],
            };

        } else if (isWifiFormat) {
            const rowData = headers.reduce((obj, header, i) => ({ ...obj, [header]: columns[i] }), {} as Record<string, string>);
            
            const dob = parse(rowData.dob, 'yyyy-MM-dd', new Date());
            if (!isValid(dob)) {
                 throw new Error(`Invalid date of birth format in row ${index + 2}: "${rowData.dob}"`);
            }

            const onSiteActivity: OnSiteActivity = {
                firstSeen: rowData.first_seen || 'N/A',
                lastSeen: rowData.last_seen || 'N/A',
                connectedDevices: rowData.devices ? rowData.devices.split(';') : [],
                venuesVisited: rowData.venues ? rowData.venues.split(';') : [],
            };

            guest = {
                id: `imported-${Date.now()}-${index}`,
                name: rowData.name,
                email: rowData.email,
                phone: rowData.phone,
                source: 'Purple WiFi',
                status: 'Prospect',
                totalStays: 0,
                loyaltyTier: 'Member',
                preferences: 'Imported from Purple WiFi data.',
                gender: rowData.gender as 'Male' | 'Female' | 'Other',
                dateOfBirth: format(dob, 'yyyy-MM-dd'),
                stayHistory: [],
                onSiteActivity,
                communicationHistory: [],
                feedback: [],
            };
        
        } else if (isProspectFormat || (!isWifiFormat && columns.length === 3)) {
            const [name, email, phone] = columns;
             guest = {
                id: `imported-${Date.now()}-${index}`,
                name, email, phone, source, status: 'Prospect',
                totalStays: 0,
                loyaltyTier: 'Member',
                preferences: 'Newly imported prospect.',
                stayHistory: [],
                onSiteActivity: { firstSeen: 'N/A', lastSeen: 'N/A', connectedDevices: [] },
                communicationHistory: [],
                feedback: [],
            };
        } else {
            throw new Error('Unrecognized CSV format. Please check the headers and column count.');
        }

        if (guest) {
          newGuests.push(guest);
        }

      } catch (e: any) {
        console.error(`Could not parse row ${index + 2}: ${columns.join(',')}`, e);
        toast({
            variant: "destructive",
            title: `Import Error on row ${index + 2}`,
            description: e.message || "An unknown error occurred.",
        });
        return; // Stop processing on first error to avoid spamming toasts
      }
    });

    if (newGuests.length > 0) {
        onImport(newGuests);
        toast({
            title: "Import Successful",
            description: `${newGuests.length} guests/prospects have been imported.`,
        });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Import Guests or Prospects</DialogTitle>
          <DialogDescription>
            Select a CSV file to import. The system will automatically detect the format based on headers.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription className="text-xs space-y-1">
              <p><b>Guest Stay Format:</b> Requires headers including <code className="bg-muted p-1 rounded">name,email,phone,hotel,room,checkIn,checkOut</code></p>
              <p><b>WiFi Data Format:</b> Requires headers including <code className="bg-muted p-1 rounded">name,email,phone,gender,dob</code></p>
              <p><b>Prospect Format:</b> Requires headers <code className="bg-muted p-1 rounded">name,email,phone</code></p>
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
            <Label htmlFor="source">Default Data Source</Label>
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
