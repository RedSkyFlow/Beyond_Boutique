
export interface Stay {
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
  partySize?: number;
  children?: number;
  pets?: boolean;
}

export type GuestStatus = 'Checked-in' | 'Arriving Soon' | 'Checked-out' | 'Prospect';

export type GuestSource = 'PANstrat' | 'Booking.com' | 'Manual Entry' | 'Purple WiFi' | 'Tourism Expo';

export type LoyaltyTier = 'Member' | 'Gold' | 'Platinum';

export interface OnSiteActivity {
  firstSeen: string;
  lastSeen: string;
  connectedDevices: string[];
}

export interface Communication {
    date: string;
    log: string;
}

export interface Feedback {
  date: string;
  type: 'Review' | 'Complaint' | 'Suggestion' | 'Comment';
  content: string;
  source: string;
}

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: GuestStatus;
  source: GuestSource;
  totalStays: number;
  loyaltyTier: LoyaltyTier;
  stayHistory: Stay[];
  preferences: string;
  onSiteActivity: OnSiteActivity;
  communicationHistory: Communication[];
  feedback: Feedback[];
  age?: number;
  occupation?: string;
  homeTown?: string;
  language?: string;
}

export interface Filters {
  search: string;
  status: GuestStatus[];
  hotel: string[];
  loyaltyTier: LoyaltyTier[];
  source: GuestSource[];
}
