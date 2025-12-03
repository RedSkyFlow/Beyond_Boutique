
export interface Stay {
  hotelName: string;
  checkInDate: string;
  checkOutDate: string;
  roomNumber: string;
  partySize?: number;
  children?: number;
  pets?: boolean;
  rating?: number;
  notes?: string;
}

export type GuestStatus = 'Checked-in' | 'Arriving Soon' | 'Checked-out' | 'Prospect';

export type GuestSource = 'PANstrat' | 'Booking.com' | 'Manual Entry' | 'Purple WiFi' | 'Tourism Expo';

export type LoyaltyTier = 'Member' | 'Gold' | 'Platinum';

export interface OnSiteActivity {
  firstSeen: string;
  lastSeen: string;
  connectedDevices: string[];
  venuesVisited?: string[];
}

export interface Communication {
  date: string;
  log: string;
  type?: 'Email' | 'SMS' | 'WhatsApp';
  direction?: 'Inbound' | 'Outbound';
  summary?: string;
}

export interface Feedback {
  date: string;
  type: 'Review' | 'Complaint' | 'Suggestion' | 'Comment';
  content: string;
  source: string;
}

export interface Guest {
  id: string;
  hotelId: string; // Added for multi-tenancy
  name: string;
  email: string;
  phone: string;
  status: GuestStatus;
  source: GuestSource;
  totalStays: number;
  totalSpend?: number; // Added
  loyaltyTier: LoyaltyTier;
  stayHistory: Stay[];
  preferences: string;
  onSiteActivity?: OnSiteActivity; // Kept as object for now, but optional
  communicationHistory: Communication[];
  feedback?: Feedback[];
  age?: number;
  occupation?: string;
  homeTown?: string;
  language?: string;
  gender?: string;
  dateOfBirth?: string;
  tags?: string[]; // Added

  // Intelligent WiFi fields
  wifiDeviceId?: string;
  lastSeenLocation?: string;

  createdAt?: any; // Timestamp
  updatedAt?: any; // Timestamp
}

export interface Filters {
  search: string;
  status: GuestStatus[];
  hotel: string[];
  loyaltyTier: LoyaltyTier[];
  source: GuestSource[];
}
