
'use client';

import { useState, useMemo, useEffect } from 'react';
import { guests as initialGuests } from '@/lib/mock-data';
import type { Guest } from '@/types';
import { GuestList } from '@/components/guest-list';
import { GuestDetails } from '@/components/guest-details';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AppTour } from '@/components/app-tour';

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
    </>
  );
}
