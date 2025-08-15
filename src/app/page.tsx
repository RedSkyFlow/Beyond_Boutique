'use client';

import { useState, useMemo } from 'react';
import { guests as initialGuests, hotels } from '@/lib/mock-data';
import type { Guest } from '@/types';
import { GuestList } from '@/components/guest-list';
import { GuestDetails } from '@/components/guest-details';
import { Card, CardContent } from '@/components/ui/card';

export default function Home() {
  const [allGuests, setAllGuests] = useState<Guest[]>(initialGuests);
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(initialGuests[0]?.id || null);
  const [filters, setFilters] = useState({
    search: '',
    hotelId: 'all',
    status: 'all',
  });

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };

  const handlePreferencesChange = (guestId: string, newPreferences: string) => {
    setAllGuests(prevGuests => 
      prevGuests.map(guest => 
        guest.id === guestId ? { ...guest, preferences: newPreferences } : guest
      )
    );
  };
  
  const filteredGuests = useMemo(() => {
    return allGuests.filter((guest) => {
      const searchMatch = guest.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                          guest.email.toLowerCase().includes(filters.search.toLowerCase());
      const hotelMatch = filters.hotelId === 'all' || guest.hotelId === filters.hotelId;
      const statusMatch = filters.status === 'all' || guest.status === filters.status;
      return searchMatch && hotelMatch && statusMatch;
    });
  }, [allGuests, filters]);

  const selectedGuest = useMemo(() => {
    return allGuests.find((guest) => guest.id === selectedGuestId);
  }, [allGuests, selectedGuestId]);


  const handleSelectGuest = (guestId: string) => {
    setSelectedGuestId(guestId);
  };

  return (
    <main className="h-screen w-screen bg-secondary/30 flex flex-col font-body">
      <header className="p-4 border-b bg-card">
          <h1 className="text-2xl font-bold font-headline tracking-tight">Boutique CRM</h1>
      </header>
      <div className="flex-1 grid grid-cols-[350px_1fr] overflow-hidden">
        <GuestList
          guests={filteredGuests}
          hotels={hotels}
          selectedGuestId={selectedGuestId}
          onSelectGuest={handleSelectGuest}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
        <div className="p-4 bg-background overflow-y-auto">
          {selectedGuest ? (
            <GuestDetails guest={selectedGuest} onPreferencesChange={handlePreferencesChange} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <Card className="w-full max-w-md">
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
  );
}
