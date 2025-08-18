
'use client';

import { useState, useMemo, useEffect } from 'react';
import type { Guest, GuestSource, GuestStatus, LoyaltyTier } from '@/types';
import { GuestList } from '@/components/guest-list';
import { GuestDetails } from '@/components/guest-details';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AppTour } from '@/components/app-tour';
import { GuestImportDialog } from '@/components/guest-import-dialog';
import { EditGuestDialog } from '@/components/edit-guest-dialog';
import type { Filters } from '@/types';
import { cn } from '@/lib/utils';
import { useGuestContext } from '@/context/guest-context';
import { useRouter } from 'next/navigation';


const hotels = [
  'Last Word Madikwe',
  'Last Word Kitara',
  'Last Word Constantia',
  'Last Word Franschhoek',
  'Last Word Long Beach',
  'Last Word Kalahari',
];

const statuses: GuestStatus[] = ['Checked-in', 'Arriving Soon', 'Checked-out', 'Prospect'];
const loyaltyTiers: LoyaltyTier[] = ['Member', 'Gold', 'Platinum'];
const sources: GuestSource[] = ['PANstrat', 'Booking.com', 'Manual Entry', 'Purple WiFi', 'Tourism Expo'];

export default function Home() {
  const { allGuests, loading, addGuests, updateGuest } = useGuestContext();
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated');
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [router]);

  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    search: '',
    status: [],
    hotel: [],
    loyaltyTier: [],
    source: [],
  });
  const [isClient, setIsClient] = useState(false);
  const [isTourOpen, setIsTourOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [guestToEdit, setGuestToEdit] = useState<Guest | null>(null);

  useEffect(() => {
    setIsClient(true);
    if (!loading && allGuests.length > 0 && window.innerWidth >= 768) {
        setSelectedGuestId(allGuests[0].id);
    }
  }, [loading, allGuests]);

  const handleFilterChange = <K extends keyof Filters>(
    filterName: K,
    value: Filters[K]
  ) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
  };
  
  const clearAllFilters = () => {
    setFilters({
      search: filters.search, // Keep search term
      status: [],
      hotel: [],
      loyaltyTier: [],
      source: [],
    });
  };

  const filteredGuests = useMemo(() => {
    if (loading) return [];
    return allGuests.filter((guest) => {
      const searchMatch = guest.name.toLowerCase().includes(filters.search.toLowerCase());
      const statusMatch = filters.status.length === 0 || filters.status.includes(guest.status);
      const hotelMatch = filters.hotel.length === 0 || guest.stayHistory.some(stay => filters.hotel.includes(stay.hotelName));
      const loyaltyMatch = filters.loyaltyTier.length === 0 || filters.loyaltyTier.includes(guest.loyaltyTier);
      const sourceMatch = filters.source.length === 0 || filters.source.includes(guest.source);
      
      return searchMatch && statusMatch && hotelMatch && loyaltyMatch && sourceMatch;
    });
  }, [allGuests, filters, loading]);

  const selectedGuest = useMemo(() => {
    if (loading) return undefined;
    return allGuests.find((guest) => guest.id === selectedGuestId);
  }, [allGuests, selectedGuestId, loading]);


  const handleSelectGuest = (guestId: string) => {
    setSelectedGuestId(guestId);
  };
  
  const handleImportGuests = (newGuests: Guest[]) => {
    addGuests(newGuests);
    setIsImportOpen(false);
  };

  const handleEditGuest = (guest: Guest) => {
    setGuestToEdit(guest);
    setIsEditOpen(true);
  };

  const handleUpdateGuest = (updatedGuest: Guest) => {
    updateGuest(updatedGuest);
    setIsEditOpen(false);
    setGuestToEdit(null);
  };


  if (!isClient || loading) {
    return (
        <main className="h-screen w-screen bg-secondary/30 flex flex-col font-body">
            <div className="flex-1 grid md:grid-cols-[350px_1fr] overflow-hidden">
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
                <div className="hidden md:block p-4 space-y-4">
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
        <div className="flex flex-1 overflow-hidden h-full">
          <div
            className={cn(
              'h-full w-full md:w-[350px] md:flex-shrink-0',
              'transition-transform duration-300 ease-in-out md:transform-none',
              {
                '-translate-x-full': selectedGuestId && isClient && window.innerWidth < 768,
                'translate-x-0': !selectedGuestId || !isClient || window.innerWidth >= 768,
              }
            )}
          >
            <GuestList
              guests={filteredGuests}
              selectedGuestId={selectedGuestId}
              onSelectGuest={handleSelectGuest}
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={clearAllFilters}
              filterOptions={{ hotels, statuses, loyaltyTiers, sources }}
              onStartTour={() => setIsTourOpen(true)}
              onImportClick={() => setIsImportOpen(true)}
            />
          </div>
          <div
            className={cn(
              'bg-background flex-1 flex flex-col',
              'absolute inset-0 md:relative h-full',
              'transition-transform duration-300 ease-in-out md:transform-none',
              {
                'translate-x-full': !selectedGuestId && isClient && window.innerWidth < 768,
                'translate-x-0': selectedGuestId || !isClient || window.innerWidth >= 768,
              }
            )}
            id="guest-details-panel"
          >
            {selectedGuest ? (
              <GuestDetails 
                guest={selectedGuest} 
                onBack={() => setSelectedGuestId(null)}
                onEdit={handleEditGuest} 
              />
            ) : (
              <div className="hidden md:flex items-center justify-center h-full">
                <Card className="w-full max-w-md shadow-soft">
                  <CardContent className="p-8 text-center">
                    <h3 className="text-lg font-semibold">No Guest Selected</h3>
                    <p className="text-muted-foreground mt-2">
                      {filteredGuests.length > 0
                        ? "Please select a guest from the list to view their details."
                        : "No guests match the current filters."
                      }
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
      {guestToEdit && (
        <EditGuestDialog
            isOpen={isEditOpen}
            onOpenChange={setIsEditOpen}
            guest={guestToEdit}
            onSave={handleUpdateGuest}
        />
      )}
    </>
  );
}
