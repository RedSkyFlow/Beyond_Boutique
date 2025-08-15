export interface Stay {
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
}

export type GuestStatus = 'Checked-in' | 'Arriving Soon' | 'Checked-out';

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
  totalStays: number;
  loyaltyTier: 'Member' | 'Gold' | 'Platinum';
  stayHistory: Stay[];
  preferences: string;
  onSiteActivity: OnSiteActivity;
  communicationHistory: Communication[];
}
