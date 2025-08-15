import type { Guest, GuestSource } from '@/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Mail, Phone, Calendar, User, Award, Wifi, Smartphone, History, Database, FileText, UserPlus, Package } from 'lucide-react';
import { AIPredictions } from './ai-predictions';
import type { LucideIcon } from 'lucide-react';

interface GuestDetailsProps {
  guest: Guest;
}

const sourceConfig: Record<GuestSource, { label: string; icon: LucideIcon }> = {
  'PANstrat': { label: 'PANstrat PMS', icon: Database },
  'Booking.com': { label: 'Booking.com CSV', icon: FileText },
  'Manual Entry': { label: 'Manual Entry', icon: UserPlus },
  'Purple WiFi': { label: 'Purple WiFi', icon: Wifi },
};

export function GuestDetails({ guest }: GuestDetailsProps) {
  const currentStay = guest.stayHistory[guest.stayHistory.length - 1];
  const guestSource = sourceConfig[guest.source];

  return (
    <div className="space-y-4">
      {/* Guest Header Card */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{guest.name}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground mt-2 gap-6">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{guest.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{guest.phone}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-primary" />
              <span>{guest.totalStays}{guest.totalStays === 1 ? 'st' : guest.totalStays === 2 ? 'nd' : guest.totalStays === 3 ? 'rd' : 'th'} Stay</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Award className="h-4 w-4 text-primary" />
              <span>Loyalty Tier: {guest.loyaltyTier}</span>
            </div>
             <div className="flex items-center gap-2 text-sm">
              <Package className="h-4 w-4 text-primary" />
              <span>Origin: {guestSource.label}</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Current Stay Card */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calendar className="h-5 w-5" />
              Current Stay
            </CardTitle>
            <CardDescription>{currentStay.hotelName}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p className="flex items-center gap-2"><span className="font-semibold w-28">Check-in:</span> {currentStay.checkInDate}</p>
            <p className="flex items-center gap-2"><span className="font-semibold w-28">Check-out:</span> {currentStay.checkOutDate}</p>
            <p className="flex items-center gap-2"><span className="font-semibold w-28">Room Number:</span> {currentStay.roomNumber}</p>
          </CardContent>
        </Card>

        {/* On-Site Activity Card */}
        <Card className="shadow-soft">
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
                  {guest.onSiteActivity.connectedDevices.map(device => <li key={device}>{device}</li>)}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Guest Preferences Card */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="text-xl">Guest Preferences</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{guest.preferences}</p>
          </CardContent>
        </Card>

        {/* AI Predictions Card */}
        <AIPredictions guest={guest} />
      </div>
      
      {/* Communication History Card */}
      <Card className="shadow-soft">
        <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <History className="h-5 w-5" />
              Communication History
            </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            {guest.communicationHistory.map(item => (
              <li key={item.date} className="flex items-center gap-2">
                <span className="font-semibold">{item.date}:</span>
                <span className="text-muted-foreground">{item.log}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
