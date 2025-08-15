
'use client';

import type { Guest, GuestSource, Feedback } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, Calendar, User, Award, Wifi, Smartphone, History, Database, FileText, UserPlus, Package, Briefcase, Globe, Languages, Home, MessageSquare, Star, MessageCircle, Frown, Building } from 'lucide-react';
import { AIPredictions } from './ai-predictions';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { DndContext, closestCenter, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { SortableCard } from './sortable-card';


interface GuestDetailsProps {
  guest: Guest;
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

export function GuestDetails({ guest }: GuestDetailsProps) {
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

  const cards: Record<string, { component: React.ReactNode }> = {
    currentStay: {
      component: (
        <Card className="shadow-soft w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5" />
              Current Stay
            </CardTitle>
            {guest.stayHistory.length > 0 && <CardDescription>{guest.stayHistory[guest.stayHistory.length - 1].hotelName}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {guest.stayHistory.length > 0 ? (
                <>
                    <p className="flex items-center gap-2"><span className="font-semibold w-28">Check-in:</span> {guest.stayHistory[guest.stayHistory.length - 1].checkInDate}</p>
                    <p className="flex items-center gap-2"><span className="font-semibold w-28">Check-out:</span> {guest.stayHistory[guest.stayHistory.length - 1].checkOutDate}</p>
                    <p className="flex items-center gap-2"><span className="font-semibold w-28">Room Number:</span> {guest.stayHistory[guest.stayHistory.length - 1].roomNumber}</p>
                </>
            ) : (
                <p className="text-sm text-muted-foreground">This prospect has not stayed with us yet.</p>
            )}
          </CardContent>
        </Card>
      ),
    },
    onSiteActivity: {
      component: (
        <Card className="shadow-soft w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Wifi className="h-5 w-5" />
              On-Site Activity
            </CardTitle>
            <CardDescription>Purple WiFi Analytics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><span className="font-semibold">First Seen:</span> {guest.onSiteActivity.firstSeen}</p>
            <p><span className="font-semibold">Last Seen:</span> {guest.onSiteActivity.lastSeen}</p>
            <div className="flex items-start gap-2 pt-1">
              <Smartphone className="h-4 w-4 mt-0.5"/>
              <div>
                <p className="font-semibold">Connected Devices:</p>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {guest.onSiteActivity.connectedDevices.length > 0 ? 
                    guest.onSiteActivity.connectedDevices.map(device => <li key={device}>{device}</li>)
                    : <li>None</li>
                  }
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      ),
    },
    preferences: {
      component: (
        <Card className="shadow-soft w-full">
          <CardHeader>
            <CardTitle className="text-xl">Guest Preferences</CardTitle>
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
        <Card className="shadow-soft w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <History className="h-5 w-5" />
              Stay History
            </CardTitle>
          </CardHeader>
          <CardContent>
            {guest.stayHistory.length > 0 ? (
              <div className="space-y-4">
                {guest.stayHistory.slice().reverse().map((stay, index) => (
                    <div key={index} className="flex items-start gap-4 text-sm">
                      <Building className="h-5 w-5 mt-0.5 shrink-0 text-primary" />
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
        <Card className="shadow-soft w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <MessageSquare className="h-5 w-5" />
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
        <Card className="shadow-soft w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <History className="h-5 w-5" />
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
    <div className="space-y-4">
      {/* Guest Header Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{guest.name}</CardTitle>
          <div className="flex flex-wrap items-center text-sm text-muted-foreground mt-2 gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{guest.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{guest.phone}</span>
            </div>
            {guest.homeTown && (
                <div className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    <span>{guest.homeTown}</span>
                </div>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 pt-2 text-sm">
            {guest.totalStays > 0 && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                <span>{guest.totalStays} {guest.totalStays === 1 ? 'Stay' : 'Stays'}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <span>Loyalty Tier: {guest.loyaltyTier}</span>
            </div>
             <div className="flex items-center gap-2">
              <Package className="h-4 w-4 text-primary" />
              <span>Origin: {guestSource.label}</span>
            </div>
             {guest.language && (
                <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 text-primary" />
                    <span>{guest.language}</span>
                </div>
            )}
             {guest.occupation && (
                <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-primary" />
                    <span>{guest.occupation}</span>
                </div>
            )}
            {guest.age && (
                <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    <span>{guest.age} years old</span>
                </div>
            )}
          </div>
        </CardHeader>
      </Card>
      
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={cardOrder} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {cardOrder.map((id) => (
              <SortableCard key={id} id={id}>
                {cards[id].component}
              </SortableCard>
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
    </div>
  );
}
