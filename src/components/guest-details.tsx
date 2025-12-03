
'use client';

import type { Guest, GuestSource, Feedback } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, Calendar, User, Award, Wifi, Smartphone, History, Database, FileText, UserPlus, Package, Briefcase, Languages, Home, MessageSquare, Star, MessageCircle, Frown, Building, PawPrint, Baby, Users, ArrowLeft, Pencil, VenetianMask } from 'lucide-react';
import { AIPredictions } from './ai-predictions';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCard } from './sortable-card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from './ui/button';


interface GuestDetailsProps {
  guest: Guest;
  onBack: () => void;
  onEdit: (guest: Guest) => void;
}

const sourceConfig: Record<GuestSource, { label: string; icon: LucideIcon }> = {
  'PANstrat': { label: 'PANstrat PMS', icon: Database },
  'Booking.com': { label: 'Booking.com CSV', icon: FileText },
  'Manual Entry': { label: 'Manual Entry', icon: UserPlus },
  'Purple WiFi': { label: 'Purple WiFi', icon: Wifi },
  'Tourism Expo': { label: 'Tourism Expo', icon: Briefcase },
};

const feedbackConfig: Record<Feedback['type'], { icon: LucideIcon, color: string }> = {
  'Review': { icon: Star, color: 'text-yellow-500' },
  'Complaint': { icon: Frown, color: 'text-red-500' },
  'Suggestion': { icon: MessageCircle, color: 'text-blue-500' },
  'Comment': { icon: MessageSquare, color: 'text-gray-500' },
}

export function GuestDetails({ guest, onBack, onEdit }: GuestDetailsProps) {
  const [cardOrder, setCardOrder] = useState<string[]>([
    'currentStay', 'onSiteActivity', 'preferences', 'aiPredictions', 'stayHistory', 'feedback', 'communication'
  ]);

  const guestSource = sourceConfig[guest.source];

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCardOrder((items) => {
        const oldIndex = items.indexOf(active.id as string);
        const newIndex = items.indexOf(over.id as string);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const currentStay = guest.status === 'Checked-in' || guest.status === 'Arriving Soon'
    ? guest.stayHistory[guest.stayHistory.length - 1]
    : null;


  const cards: Record<string, { component: React.ReactNode }> = {
    currentStay: {
      component: (
        <Card className="shadow-soft w-full h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5 text-accent-foreground" />
              {guest.status === 'Arriving Soon' ? 'Upcoming Stay' : 'Current Stay'}
            </CardTitle>
            {currentStay && <CardDescription>{currentStay.hotelName}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {currentStay ? (
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                <p className="flex items-center gap-2 col-span-2"><span className="font-semibold w-24">Check-in:</span> {currentStay.checkInDate}</p>
                <p className="flex items-center gap-2 col-span-2"><span className="font-semibold w-24">Check-out:</span> {currentStay.checkOutDate}</p>
                <p className="flex items-center gap-2 col-span-2"><span className="font-semibold w-24">Room:</span> {currentStay.roomNumber}</p>

                {currentStay.partySize !== undefined && (
                  <p className="flex items-center gap-2 text-muted-foreground"><Users className="h-4 w-4" /> Party of {currentStay.partySize}</p>
                )}
                {currentStay.children !== undefined && currentStay.children > 0 && (
                  <p className="flex items-center gap-2 text-muted-foreground"><Baby className="h-4 w-4" /> {currentStay.children} {currentStay.children === 1 ? 'Child' : 'Children'}</p>
                )}
                {currentStay.pets && (
                  <p className="flex items-center gap-2 text-muted-foreground"><PawPrint className="h-4 w-4" /> Pet-friendly</p>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {guest.status === 'Prospect'
                  ? 'This prospect has not stayed with us yet.'
                  : 'No current or upcoming stay information.'}
              </p>
            )}
          </CardContent>
        </Card>
      ),
    },
    onSiteActivity: {
      component: (
        <Card className="shadow-soft w-full h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Wifi className="h-5 w-5 text-accent-foreground" />
              On-Site Activity
            </CardTitle>
            <CardDescription>Purple WiFi Analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            {guest.onSiteActivity ? (
              <>
                <p><span className="font-semibold">First Seen:</span> {guest.onSiteActivity.firstSeen}</p>
                <p><span className="font-semibold">Last Seen:</span> {guest.onSiteActivity.lastSeen}</p>
                <div className="flex items-start gap-2 pt-1">
                  <Smartphone className="h-4 w-4 mt-0.5 text-accent-foreground" />
                  <div>
                    <p className="font-semibold">Connected Devices:</p>
                    <ul className="list-disc pl-5 text-muted-foreground">
                      {guest.onSiteActivity.connectedDevices.length > 0 ?
                        guest.onSiteActivity.connectedDevices.map((device, index) => <li key={`${device}-${index}`}>{device}</li>)
                        : <li>None</li>
                      }
                    </ul>
                  </div>
                </div>
                {guest.onSiteActivity.venuesVisited && guest.onSiteActivity.venuesVisited.length > 0 && (
                  <div className="flex items-start gap-2 pt-1">
                    <Building className="h-4 w-4 mt-0.5 text-accent-foreground" />
                    <div>
                      <p className="font-semibold">Venues Visited:</p>
                      <ul className="list-disc pl-5 text-muted-foreground">
                        {guest.onSiteActivity.venuesVisited.map((venue, index) => <li key={`${venue}-${index}`}>{venue}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <p className="text-muted-foreground">No on-site activity recorded.</p>
            )}
          </CardContent>
        </Card>
      ),
    },
    preferences: {
      component: (
        <Card className="shadow-soft w-full h-full">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-accent-foreground" />
              Guest Preferences
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{guest.preferences}</p>
          </CardContent>
        </Card>
      ),
    },
    aiPredictions: {
      component: <AIPredictions guest={guest} />,
    },
    stayHistory: {
      component: (
        <Card className="shadow-soft w-full h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <History className="h-5 w-5 text-accent-foreground" />
              Stay History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {guest.stayHistory.length > 0 ? (
              <div className="space-y-4">
                {guest.stayHistory.slice().reverse().map((stay, index) => (
                  <div key={index} className="flex items-start gap-4 text-sm">
                    <Building className="h-5 w-5 mt-0.5 shrink-0 text-accent-foreground" />
                    <div className="flex-1">
                      <p className="font-semibold">{stay.hotelName}</p>
                      <p className="text-muted-foreground">
                        {stay.checkInDate} to {stay.checkOutDate} &middot; Room {stay.roomNumber}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No stay history recorded.</p>
            )}
          </CardContent>
        </Card>
      ),
    },
    feedback: {
      component: (
        <Card className="shadow-soft w-full h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="h-5 w-5 text-accent-foreground" />
              Guest Feedback
            </CardTitle>
          </CardHeader>
          <CardContent>
            {guest.feedback.length > 0 ? (
              <div className="space-y-4">
                {guest.feedback.map((item, index) => {
                  const Icon = feedbackConfig[item.type].icon;
                  const color = feedbackConfig[item.type].color;
                  return (
                    <div key={index} className="flex items-start gap-4 text-sm">
                      <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", color)} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-semibold">
                            {item.type} from {item.source}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.date}</p>
                        </div>
                        <p className="text-muted-foreground italic mt-1">"{item.content}"</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No feedback history recorded.</p>
            )}
          </CardContent>
        </Card>
      ),
    },
    communication: {
      component: (
        <Card className="shadow-soft w-full h-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <History className="h-5 w-5 text-accent-foreground" />
              Communication History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {guest.communicationHistory.length > 0 ? (
              <ul className="space-y-2 text-sm">
                {guest.communicationHistory.map(item => (
                  <li key={item.date} className="flex items-center gap-2">
                    <span className="font-semibold">{item.date}:</span>
                    <span className="text-muted-foreground">{item.log}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No communication history recorded.</p>
            )}
          </CardContent>
        </Card>
      ),
    }
  };


  return (
    <div className="flex flex-col h-full bg-secondary/30">
      {/* Guest Header Card */}
      <div className="p-4 border-b bg-background">
        <Card className="shadow-soft">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="md:hidden h-8 w-8" onClick={onBack}>
                  <ArrowLeft className="h-5 w-5" />
                  <span className="sr-only">Back</span>
                </Button>
                <CardTitle className="text-3xl font-bold">{guest.name}</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => onEdit(guest)}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit Guest
              </Button>
            </div>
            <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-2 gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-accent-foreground" />
                <span>{guest.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-accent-foreground" />
                <span>{guest.phone}</span>
              </div>
              {guest.homeTown && (
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4 text-accent-foreground" />
                  <span>{guest.homeTown}</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm">
              {guest.totalStays > 0 && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-accent-foreground" />
                  <span>{guest.totalStays} {guest.totalStays === 1 ? 'Stay' : 'Stays'}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-accent-foreground" />
                <span>Loyalty Tier: {guest.loyaltyTier}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-accent-foreground" />
                <span>Origin: {guestSource.label}</span>
              </div>
              {guest.language && (
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4 text-accent-foreground" />
                  <span>{guest.language}</span>
                </div>
              )}
              {guest.occupation && (
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-accent-foreground" />
                  <span>{guest.occupation}</span>
                </div>
              )}
              {guest.age && (
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-accent-foreground" />
                  <span>{guest.age} years old</span>
                </div>
              )}
              {guest.gender && (
                <div className="flex items-center gap-2">
                  <VenetianMask className="h-4 w-4 text-accent-foreground" />
                  <span>{guest.gender}</span>
                </div>
              )}
            </div>
          </CardHeader>
        </Card>
      </div>

      <ScrollArea className="flex-1 h-full">
        <div className="p-4">
          <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={cardOrder} strategy={verticalListSortingStrategy}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
                {cardOrder.map((id) => (
                  <SortableCard key={id} id={id}>
                    {cards[id].component}
                  </SortableCard>
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </ScrollArea>
    </div>
  );
}
