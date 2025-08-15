
'use client';

import { useState, useMemo, useEffect } from 'react';
import { guests as initialGuests } from '@/lib/mock-data';
import type { Guest, GuestSource } from '@/types';
import { GuestList } from '@/components/guest-list';
import { GuestDetails } from '@/components/guest-details';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AppTour } from '@/components/app-tour';
import { GuestImportDialog } from '@/components/guest-import-dialog';
import { format } from 'date-fns';

const hotels = [
  'Last Word Madikwe',
  'Last Word Kitara',
  'Last Word Constantia',
  'Last Word Franschhoek',
  'Last Word Long Beach',
  'Last Word Kalahari',
];

export default function Home() {
  const [allGuests, setAllGuests] = useState<Guest[]>([]);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    hotel: 'all',
  });
  const [isClient, setIsClient] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);

  useEffect(() => {
    const guestsData = initialGuests();
    setAllGuests(guestsData);
    if (guestsData.length > 0) {
      setSelectedGuestId(guestsData[0].id);
    }
    setIsClient(true);
  }, []);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };
  
  const filteredGuests = useMemo(() => {
    return allGuests.filter((guest) => {
      const searchMatch = guest.name.toLowerCase().includes(filters.search.toLowerCase());
      const statusMatch = filters.status === 'all' || guest.status === filters.status;
      const hotelMatch = filters.hotel === 'all' || guest.stayHistory.some(stay => stay.hotelName === filters.hotel);
      return searchMatch && statusMatch && hotelMatch;
    });
  }, [allGuests, filters]);

  const selectedGuest = useMemo(() => {
    return allGuests.find((guest) => guest.id === selectedGuestId);
  }, [allGuests, selectedGuestId]);


  const handleSelectGuest = (guestId: string) => {
    setSelectedGuestId(guestId);
  };
  
  const handleImportGuests = (csvText: string, source: GuestSource) => {
    const newGuests: Guest[] = [];
    const rows = csvText.split('\n').filter(row => row.trim() !== '');
    const today = new Date();

    rows.forEach((row, index) => {
        try {
            const [name, email, phone, hotelName, roomNumber, checkIn, checkOut] = row.split(',').map(item => item.trim());
            
            // A simple way to determine status based on dates
            const checkInDate = new Date(checkIn);
            let status: 'Checked-in' | 'Arriving Soon' | 'Checked-out';
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
                    hotelName,
                    roomNumber,
                    checkInDate: format(checkInDate, 'yyyy-MM-dd'),
                    checkOutDate: format(new Date(checkOut), 'yyyy-MM-dd'),
                }],
                onSiteActivity: {
                    firstSeen: 'N/A',
                    lastSeen: 'N/A',
                    connectedDevices: [],
                },
                communicationHistory: [],
            };
            newGuests.push(guest);
        } catch (e) {
            console.error(`Could not parse row ${index + 1}: ${row}`, e);
        }
    });

    setAllGuests(prevGuests => [...prevGuests, ...newGuests]);
    setIsImportOpen(false);
};


  if (!isClient) {
    return (
        <main className="h-screen w-screen bg-secondary/30 flex flex-col font-body">
            <div className="flex-1 grid grid-cols-[350px_1fr] overflow-hidden">
                {/* Skeleton for GuestList */}
                <div className="flex flex-col h-full bg-card border-r p-4 space-y-4">
                    <Skeleton className="h-8 w-2/3" />
                    <Skeleton className="h-10 w-full" />
                    <div className="grid grid-cols-2 gap-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2 pt-2">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </div>
                {/* Skeleton for GuestDetails */}
                <div className="p-4 space-y-4">
                    <Skeleton className="h-32 w-full" />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Skeleton className="h-40 w-full" />
                        <Skeleton className="h-40 w-full" />
                    </div>
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-32 w-full" />
                </div>
            </div>
        </main>
    )
  }

  return (
    <>
      <main className="h-screen w-screen bg-secondary/30 flex flex-col font-body">
        <div className="flex-1 grid grid-cols-[350px_1fr] overflow-hidden">
          <GuestList
            guests={filteredGuests}
            selectedGuestId={selectedGuestId}
            onSelectGuest={handleSelectGuest}
            filters={filters}
            onFilterChange={handleFilterChange}
            hotels={hotels}
            onStartTour={() => setIsTourOpen(true)}
            onImportClick={() => setIsImportOpen(true)}
          />
          <div className="p-4 bg-background overflow-y-auto" id="guest-details-panel">
            {selectedGuest ? (
              <GuestDetails guest={selectedGuest} />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Card className="w-full max-w-md shadow-soft">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold">No Guest Selected</h3>
                    <p className="text-muted-foreground mt-2">
                      Please select a guest from the list to view their details.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </main>
      <AppTour isOpen={isTourOpen} onOpenChange={setIsTourOpen} />
      <GuestImportDialog 
        isOpen={isImportOpen} 
        onOpenChange={setIsImportOpen}
        onImport={handleImportGuests}
      />
    </>
  );
}
