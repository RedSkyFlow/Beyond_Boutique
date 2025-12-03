import { Timestamp } from 'firebase/firestore';

export type GuestStatus = 'Checked-in' | 'Arriving Soon' | 'Checked-out' | 'Prospect';
export type GuestSource = 'PANstrat' | 'Booking.com' | 'Manual Entry' | 'Purple WiFi' | 'Tourism Expo';
export type LoyaltyTier = 'Member' | 'Gold' | 'Platinum';

export interface StayHistory {
    hotelName: string;
    checkInDate: string;
    checkOutDate: string;
    roomNumber: string;
    rating?: number;
    notes?: string;
}

export interface CommunicationLog {
    id: string;
    date: string;
    type: 'Email' | 'SMS' | 'WhatsApp';
    direction: 'Inbound' | 'Outbound';
    summary: string;
    log: string;
}

export interface Guest {
    id: string; // Firestore Document ID
    hotelId: string; // For multi-tenancy

    // Personal Info
    name: string;
    email: string;
    phone: string;
    dateOfBirth?: string;
    gender?: string;
    homeTown?: string;
    age?: number;

    // Status & Metrics
    status: GuestStatus;
    totalStays: number;
    totalSpend: number;
    loyaltyTier: LoyaltyTier;
    source: GuestSource;

    // Context & Preferences
    preferences: string;
    tags: string[];

    // History
    stayHistory: StayHistory[];
    communicationHistory: CommunicationLog[];
    onSiteActivity?: string[];

    // Intelligent WiFi / Venue OS Fields
    wifiDeviceId?: string; // MAC Address or unique ID
    lastSeenLocation?: string; // e.g., "Pool Bar", "Lobby"
    lastSeenAt?: Timestamp;

    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface Hotel {
    id: string;
    name: string;
    location: string;
    branding: {
        primaryColor: string;
        logoUrl: string;
    };
}
