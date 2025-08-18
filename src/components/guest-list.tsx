
'use client';

import type { Guest, GuestStatus, GuestSource, LoyaltyTier, Filters } from '@/types';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Search, SlidersHorizontal, BedDouble, User, Building, HelpCircle, Upload, Database, FileText, UserPlus, Wifi, Briefcase, Award, Package, Hotel } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import type { LucideIcon } from 'lucide-react';
import { MultiSelectFilter } from './multi-select-filter';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
import { Separator } from './ui/separator';

interface GuestListProps {
  guests: Guest[];
  selectedGuestId: string | null;
  onSelectGuest: (guestId: string) => void;
  filters: Filters;
  onFilterChange: <K extends keyof Filters>(filterName: K, value: Filters[K]) => void;
  onClearFilters: () => void;
  filterOptions: {
    hotels: string[];
    statuses: GuestStatus[];
    loyaltyTiers: LoyaltyTier[];
    sources: GuestSource[];
  };
  onStartTour: () => void;
  onImportClick: () => void;
}

const statusConfig: Record<GuestStatus, { label: string; className: string; }> = {
  'Checked-in': { label: 'Checked-in', className: 'bg-green-100 text-green-800 border-green-200' },
  'Arriving Soon': { label: 'Arriving Soon', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  'Checked-out': { label: 'Checked-out', className: 'bg-gray-100 text-gray-800 border-gray-200' },
  'Prospect': { label: 'Prospect', className: 'bg-blue-100 text-blue-800 border-blue-200' },
};

const sourceConfig: Record<GuestSource, { label: string; icon: LucideIcon }> = {
  'PANstrat': { label: 'PANstrat PMS', icon: Database },
  'Booking.com': { label: 'Booking.com CSV', icon: FileText },
  'Manual Entry': { label: 'Manual Entry', icon: UserPlus },
  'Purple WiFi': { label: 'Purple WiFi', icon: Wifi },
  'Tourism Expo': { label: 'Tourism Expo', icon: Briefcase },
};


export function GuestList({
  guests,
  selectedGuestId,
  onSelectGuest,
  filters,
  onFilterChange,
  onClearFilters,
  filterOptions,
  onStartTour,
  onImportClick,
}: GuestListProps) {
  const activeFilterCount = Object.values(filters).reduce((count, value) => {
    if (Array.isArray(value) && value.length > 0) {
      return count + value.length;
    }
    return count;
  }, 0);


  return (
    <div className="flex flex-col h-full bg-card border-r w-full md:w-[350px]">
      <div className="p-4 space-y-4 border-b">
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Hotel className="h-8 w-8 text-primary-foreground bg-primary p-1.5 rounded-lg" />
              <h1 className="text-2xl font-bold tracking-tight font-headline">Beyond Boutique</h1>
            </div>
           <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" className="h-8" onClick={onImportClick}>
              <Upload className="h-4 w-4 mr-2"/>
              Import
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
        <div className="flex items-center gap-2">
            <div className="relative flex-1" id="search-bar">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search guests..."
                className="pl-9 h-10"
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
              />
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" className="h-10 relative" id="filter-popover-trigger">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filter
                        {activeFilterCount > 0 && (
                            <Badge variant="secondary" className="absolute -top-2 -right-2 h-5 w-5 justify-center p-0 rounded-full bg-accent text-accent-foreground">
                                {activeFilterCount}
                            </Badge>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-4 space-y-4" align="end">
                    <div className="flex items-center justify-between">
                        <h4 className="font-medium">Filter Guests</h4>
                        <Button variant="link" size="sm" className="p-0 h-auto" onClick={onClearFilters}>Clear all</Button>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <Label>Hotel</Label>
                             <MultiSelectFilter
                              id="hotel-filter"
                              placeholder="Select hotels..."
                              options={filterOptions.hotels.map(h => ({ value: h, label: h.replace('Last Word ', '') }))}
                              selectedValues={filters.hotel}
                              onChange={(values) => onFilterChange('hotel', values)}
                            />
                        </div>
                         <div>
                            <Label>Status</Label>
                            <MultiSelectFilter
                              id="status-filter"
                              placeholder="Select statuses..."
                              options={filterOptions.statuses.map(s => ({ value: s, label: s }))}
                              selectedValues={filters.status}
                              onChange={(values) => onFilterChange('status', values)}
                            />
                        </div>
                         <Separator />
                         <div>
                            <Label>Loyalty Tier</Label>
                             <MultiSelectFilter
                              id="loyalty-filter"
                              placeholder="Select tiers..."
                              options={filterOptions.loyaltyTiers.map(t => ({ value: t, label: t }))}
                              selectedValues={filters.loyaltyTier}
                              onChange={(values) => onFilterChange('loyaltyTier', values)}
                            />
                        </div>
                         <div>
                            <Label>Source</Label>
                            <MultiSelectFilter
                              id="source-filter"
                              placeholder="Select sources..."
                              options={filterOptions.sources.map(s => ({ value: s, label: s }))}
                              selectedValues={filters.source}
                              onChange={(values) => onFilterChange('source', values)}
                            />
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1" id="guest-list">
            {guests.map((guest) => {
              const latestStay = guest.stayHistory.length > 0 ? guest.stayHistory[guest.stayHistory.length - 1] : null;
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
                    ? 'bg-primary/50'
                    : 'hover:bg-primary/20'
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{guest.name}</p>
                     <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="flex items-center" onClick={(e) => e.stopPropagation()}>
                            <SourceIcon className="h-3.5 w-3.5 text-muted-foreground" />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Origin: {guestSource.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className={cn('px-2 py-0.5 text-xs font-medium rounded-full border', guestStatus.className)}>
                    {guestStatus.label}
                  </div>
                </div>
                {guest.status !== 'Prospect' && latestStay && (
                  <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                    <div className='flex items-center gap-1.5'>
                      <BedDouble className="h-3.5 w-3.5" />
                      <span>Room {latestStay.roomNumber}</span>
                    </div>
                     <div className='flex items-center gap-1.5'>
                      <User className="h-3.5 w-3.5" />
                      <span>{guest.totalStays} {guest.totalStays === 1 ? 'Stay' : 'Stays'}</span>
                    </div>
                  </div>
                )}
                 {guest.status === 'Prospect' && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    <p>No stay history.</p>
                  </div>
                )}
              </button>
            )})}
        </div>
      </ScrollArea>
    </div>
  );
}
