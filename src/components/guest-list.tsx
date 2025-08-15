
'use client';

import type { Guest, GuestStatus, GuestSource } from '@/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Search, SlidersHorizontal, BedDouble, User, Building, HelpCircle, Upload, Database, FileText, UserPlus, Wifi } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';

interface GuestListProps {
  guests: Guest[];
  selectedGuestId: string | null;
  onSelectGuest: (guestId: string) => void;
  filters: { search: string; status: string; hotel: string };
  onFilterChange: (filterName: string, value: string) => void;
  hotels: string[];
  onStartTour: () => void;
}

const statusConfig: Record<GuestStatus, { label: string; className: string; }> = {
  'Checked-in': { label: 'Checked-in', className: 'bg-green-100 text-green-800' },
  'Arriving Soon': { label: 'Arriving Soon', className: 'bg-yellow-100 text-yellow-800' },
  'Checked-out': { label: 'Checked-out', className: 'bg-gray-100 text-gray-800' },
};

const sourceConfig: Record<GuestSource, { label: string; icon: LucideIcon }> = {
  'PANstrat': { label: 'PANstrat PMS', icon: Database },
  'Booking.com': { label: 'Booking.com CSV', icon: FileText },
  'Manual Entry': { label: 'Manual Entry', icon: UserPlus },
  'Purple WiFi': { label: 'Purple WiFi', icon: Wifi },
};


export function GuestList({
  guests,
  selectedGuestId,
  onSelectGuest,
  filters,
  onFilterChange,
  hotels,
  onStartTour,
}: GuestListProps) {

  return (
    <div className="flex flex-col h-full bg-card border-r">
      <div className="p-4 space-y-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">The Last Word</h1>
           <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8">
              <Upload className="h-4 w-4 mr-2"/>
              Import Guests
            </Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" onClick={onStartTour} className="h-8 w-8">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Take a tour of the app</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
           </div>
        </div>
        <div className="relative" id="search-bar">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                  <Input
                    placeholder="Search guests..."
                    className="pl-9"
                    value={filters.search}
                    onChange={(e) => onFilterChange('search', e.target.value)}
                  />
              </TooltipTrigger>
              <TooltipContent>
                <p>Search for guests by name</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div id="hotel-filter">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Select value={filters.hotel} onValueChange={(value) => onFilterChange('hotel', value)}>
                    <SelectTrigger>
                      <div className='flex items-center gap-2'>
                        <Building className="h-4 w-4 text-muted-foreground" />
                        <SelectValue placeholder="All Hotels" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Hotels</SelectItem>
                      {hotels.map((hotel) => (
                        <SelectItem key={hotel} value={hotel}>{hotel.replace('Last Word ', '')}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter guests by hotel</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div id="status-filter">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent>
                  <p>Filter guests by status</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1" id="guest-list">
            {guests.map((guest) => {
              const latestStay = guest.stayHistory[guest.stayHistory.length - 1];
              const guestStatus = statusConfig[guest.status];
              const guestSource = sourceConfig[guest.source];
              const SourceIcon = guestSource.icon;
              return (
              <button
                key={guest.id}
                onClick={() => onSelectGuest(guest.id)}
                className={cn(
                  'w-full text-left p-3 rounded-lg flex flex-col gap-1 transition-colors',
                  selectedGuestId === guest.id
                    ? 'bg-secondary'
                    : 'hover:bg-secondary/50'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{guest.name}</p>
                     <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <SourceIcon className="h-3.5 w-3.5 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Origin: {guestSource.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className={cn('px-2 py-0.5 text-xs font-medium rounded-full', guestStatus.className)}>
                    {guestStatus.label}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <div className='flex items-center gap-1.5'>
                    <BedDouble className="h-3.5 w-3.5" />
                    <span>Room {latestStay.roomNumber}</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <User className="h-3.5 w-3.5" />
                    <span>{guest.totalStays}{guest.totalStays === 1 ? 'st' : guest.totalStays === 2 ? 'nd' : 'rd'} Stay</span>
                  </div>
                </div>
              </button>
            )})}
        </div>
      </ScrollArea>
    </div>
  );
}
