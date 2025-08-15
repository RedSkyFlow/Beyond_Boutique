import type { Guest, GuestStatus } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, CalendarDays } from 'lucide-react';
import { PreferencesEditor } from './preferences-editor';
import { PreferenceSuggestor } from './preference-suggestor';

interface GuestDetailsProps {
  guest: Guest;
  onPreferencesChange: (guestId: string, newPreferences: string) => void;
}

const statusConfig: Record<GuestStatus, { label: string; color: string; }> = {
  'checked-in': { label: 'Checked In', color: 'bg-green-500 text-white' },
  'checked-out': { label: 'Checked Out', color: 'bg-gray-500 text-white' },
  'due-today': { label: 'Due Today', color: 'bg-blue-500 text-white' },
  'upcoming': { label: 'Upcoming', color: 'bg-yellow-500 text-black' },
};


export function GuestDetails({ guest, onPreferencesChange }: GuestDetailsProps) {
  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return names[0][0];
  };

  const currentStatus = statusConfig[guest.status];

  return (
    <Card className="h-full overflow-y-auto">
      <CardHeader>
        <div className="flex items-start gap-4">
          <Avatar className="w-16 h-16 border">
            <AvatarImage src={guest.avatarUrl} alt={guest.name} data-ai-hint="person portrait" />
            <AvatarFallback>{getInitials(guest.name)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-4">
              <CardTitle className="font-headline text-3xl">{guest.name}</CardTitle>
              <Badge className={currentStatus.color}>
                {currentStatus.label}
              </Badge>
            </div>
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
            <p className="text-sm mt-1 text-muted-foreground">Total Stays: {guest.totalStays}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        
        <div className="space-y-4">
          <h3 className="text-xl font-headline">Preferences</h3>
          <PreferencesEditor guest={guest} onPreferencesChange={onPreferencesChange} />
        </div>

        <Separator />
        
        <div className="space-y-4">
          <PreferenceSuggestor guest={guest} />
        </div>
        
        <Separator />

        <div>
          <h3 className="text-xl font-headline mb-4">Stay History</h3>
          <div className="space-y-4">
            {guest.stayHistory.map((stay) => (
              <Card key={stay.id} className="bg-secondary/50">
                <CardHeader>
                  <CardTitle className="font-headline text-lg flex justify-between items-center">
                    <span>{stay.roomType}</span>
                    <span className="text-sm font-normal text-muted-foreground flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {stay.checkInDate} - {stay.checkOutDate}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{stay.notes}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
