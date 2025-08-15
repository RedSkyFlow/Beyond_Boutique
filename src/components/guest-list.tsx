'use client';

import type { Guest, Hotel, GuestStatus } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Search, SlidersHorizontal, Hotel as HotelIcon, BedDouble, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface GuestListProps {
  guests: Guest[];
  hotels: Hotel[];
  selectedGuestId: string | null;
  onSelectGuest: (guestId: string) => void;
  filters: { search: string; hotelId: string; status: string };
  onFilterChange: (filterName: string, value: string) => void;
}

const statusConfig: Record<GuestStatus, { label: string; className: string; }> = {
  'checked-in': { label: 'Checked In', className: 'bg-green-100 text-green-800' },
  'checked-out': { label: 'Checked Out', className: 'bg-gray-100 text-gray-800' },
  'due-today': { label: 'Due Today', className: 'bg-blue-100 text-blue-800' },
  'upcoming': { label: 'Upcoming', className: 'bg-yellow-100 text-yellow-800' },
};


export function GuestList({
  guests,
  hotels,
  selectedGuestId,
  onSelectGuest,
  filters,
  onFilterChange,
}: GuestListProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0][0] || '';
  };

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 space-y-4 border-b">
        <h2 className="text-2xl font-headline">Guests</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search guests..."
            className="pl-9"
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Select value={filters.hotelId} onValueChange={(value) => onFilterChange('hotelId', value)}>
            <SelectTrigger>
              <div className='flex items-center gap-2'>
                <HotelIcon className="h-4 w-4 text-muted-foreground"/>
                <SelectValue placeholder="All Hotels" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hotels</SelectItem>
              {hotels.map((hotel) => (
                <SelectItem key={hotel.id} value={hotel.id}>{hotel.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
            <SelectTrigger>
              <div className='flex items-center gap-2'>
                <SlidersHorizontal className="h-4 w-4 text-muted-foreground" />
                <SelectValue placeholder="All Statuses" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(statusConfig).map(([status, config]) => (
                <SelectItem key={status} value={status}>{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
            {guests.map((guest) => {
              const latestStay = guest.stayHistory[guest.stayHistory.length - 1];
              const guestStatus = statusConfig[guest.status];
              return (
              <button
                key={guest.id}
                onClick={() => onSelectGuest(guest.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg flex items-start gap-4 transition-colors',
                  selectedGuestId === guest.id
                    ? 'bg-secondary'
                    : 'hover:bg-secondary/50'
                )}
              >
                <Avatar className="w-10 h-10 border mt-1">
                  <AvatarImage src={guest.avatarUrl} alt={guest.name} data-ai-hint="person" />
                  <AvatarFallback>{getInitials(guest.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{guest.name}</p>
                    <Badge className={cn('px-2 py-0.5 text-xs font-medium', guestStatus.className)}>
                      {guestStatus.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{guest.email}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    {latestStay?.roomNumber && (
                      <div className='flex items-center gap-1.5'>
                        <BedDouble className="h-3.5 w-3.5" />
                        <span>Room {latestStay.roomNumber}</span>
                      </div>
                    )}
                    {latestStay?.partySize && (
                      <div className='flex items-center gap-1.5'>
                        <Users className="h-3.5 w-3.5" />
                        <span>{latestStay.partySize} Guest{latestStay.partySize > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            )})}
        </div>
      </ScrollArea>
    </div>
  );
}
