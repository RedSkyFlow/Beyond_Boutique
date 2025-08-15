export interface Stay {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  roomType: string;
  notes: string;
}

export type GuestStatus = 'checked-in' | 'checked-out' | 'due-today' | 'upcoming';

export interface Guest {
  id: string;
  name: string;
  email: string;
  phone: string;
  hotelId: string;
  status: GuestStatus;
  totalStays: number;
  stayHistory: Stay[];
  preferences: string;
  avatarUrl: string;
}

export interface Hotel {
  id: string;
  name: string;
}
