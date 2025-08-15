'use client';

import type { Guest, Hotel, GuestStatus } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { Search, SlidersHorizontal, Hotel as HotelIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface GuestListProps {
  guests: Guest[];
  hotels: Hotel[];
  selectedGuestId: string | null;
  onSelectGuest: (guestId: string) => void;
  filters: { search: string; hotelId: string; status: string };
  onFilterChange: (filterName: string, value: string) => void;
}

const statusConfig: Record<GuestStatus, { label: string; color: string; }> = {
  'checked-in': { label: 'Checked In', color: 'bg-green-500' },
  'checked-out': { label: 'Checked Out', color: 'bg-gray-400' },
  'due-today': { label: 'Due Today', color: 'bg-blue-500' },
  'upcoming': { label: 'Upcoming', color: 'bg-yellow-500' },
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
          <TooltipProvider>
            {guests.map((guest) => (
              <button
                key={guest.id}
                onClick={() => onSelectGuest(guest.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg flex items-center gap-4 transition-colors',
                  selectedGuestId === guest.id
                    ? 'bg-secondary'
                    : 'hover:bg-secondary/50'
                )}
              >
                <Avatar className="w-10 h-10 border">
                  <AvatarImage src={guest.avatarUrl} alt={guest.name} data-ai-hint="person" />
                  <AvatarFallback>{getInitials(guest.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{guest.name}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{guest.email}</p>
                </div>
                 <Tooltip>
                    <TooltipTrigger asChild>
                      <div className={cn(
                          'w-2.5 h-2.5 rounded-full',
                          statusConfig[guest.status].color
                        )}
                       />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{statusConfig[guest.status].label}</p>
                    </TooltipContent>
                  </Tooltip>
              </button>
            ))}
          </TooltipProvider>
        </div>
      </ScrollArea>
    </div>
  );
}
