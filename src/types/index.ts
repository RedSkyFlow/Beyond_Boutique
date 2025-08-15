export interface Stay {
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
}

export type GuestStatus = 'Checked-in' | 'Arriving Soon' | 'Checked-out';

export type GuestSource = 'PANstrat' | 'Booking.com' | 'Manual Entry' | 'Purple WiFi';

export interface OnSiteActivity {
  firstSeen: string;
  lastSeen: string;
  connectedDevices: string[];
}

export interface Communication {
    date: string;
    log: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: GuestStatus;
  source: GuestSource;
  totalStays: number;
  loyaltyTier: 'Member' | 'Gold' | 'Platinum';
  stayHistory: Stay[];
  preferences: string;
  onSiteActivity: OnSiteActivity;
  communicationHistory: Communication[];
}
