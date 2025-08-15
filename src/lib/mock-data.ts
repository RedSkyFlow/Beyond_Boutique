import type { Guest, Hotel } from '@/types';
import { add, format } from 'date-fns';

const today = new Date();

export const hotels: Hotel[] = [
  { id: 'hotel-1', name: 'The Lavender Bloom' },
  { id: 'hotel-2', name: 'Rose Petal Inn' },
  { id: 'hotel-3', name: 'The Gilded Lily' },
];

export const guests: Guest[] = [
  {
    id: 'guest-1',
    name: 'Eleanor Vance',
    email: 'eleanor.v@example.com',
    phone: '555-0101',
    hotelId: 'hotel-1',
    status: 'checked-in',
    totalStays: 3,
    avatarUrl: 'https://placehold.co/100x100.png',
    stayHistory: [
      { id: 'stay-1-1', checkInDate: '2023-08-15', checkOutDate: '2023-08-20', roomType: 'Deluxe Suite', notes: 'Celebrated anniversary. Requested late checkout.', roomNumber: '301', partySize: 2 },
      { id: 'stay-1-2', checkInDate: '2023-12-22', checkOutDate: '2023-12-26', roomType: 'Standard King', notes: 'Holiday visit.', roomNumber: '212', partySize: 2 },
      { id: 'stay-1-3', checkInDate: '2024-03-10', checkOutDate: '2024-03-12', roomType: 'Deluxe Suite', notes: 'Business trip. Used the conference room facilities.', roomNumber: '305', partySize: 1 },
    ],
    preferences: 'Prefers a quiet room away from the elevator. Enjoys red wine; a bottle of Merlot was appreciated. Allergic to down feathers.',
  },
  {
    id: 'guest-2',
    name: 'Marcus Thorne',
    email: 'm.thorne@example.com',
    phone: '555-0102',
    hotelId: 'hotel-1',
    status: 'checked-out',
    totalStays: 1,
    avatarUrl: 'https://placehold.co/100x100.png',
    stayHistory: [
      { id: 'stay-2-1', checkInDate: '2024-05-01', checkOutDate: '2024-05-05', roomType: 'Ocean View Balcony', notes: 'First time stay. Enjoyed the spa services.', roomNumber: '415', partySize: 2 },
    ],
    preferences: 'Interested in local tour packages. High floor with a view is a must.',
  },
  {
    id: 'guest-3',
    name: 'Seraphina Dubois',
    email: 'seraphina.d@example.com',
    phone: '555-0103',
    hotelId: 'hotel-2',
    status: 'due-today',
    totalStays: 5,
    avatarUrl: 'https://placehold.co/100x100.png',
    stayHistory: [
      { id: 'stay-3-1', checkInDate: '2022-06-20', checkOutDate: '2022-06-25', roomType: 'Penthouse', notes: 'Annual summer vacation.', roomNumber: 'PH-1', partySize: 4 },
      { id: 'stay-3-2', checkInDate: '2023-01-10', checkOutDate: '2023-01-15', roomType: 'Junior Suite', notes: 'Winter getaway.', roomNumber: '802', partySize: 4 },
      { id: 'stay-3-3', checkInDate: '2023-06-19', checkOutDate: '2023-06-26', roomType: 'Penthouse', notes: 'Booked the usual room.', roomNumber: 'PH-1', partySize: 4 },
      { id: 'stay-3-4', checkInDate: '2023-11-05', checkOutDate: '2023-11-10', roomType: 'Junior Suite', notes: 'Attended a local festival.', roomNumber: '805', partySize: 3 },
      { id: 'stay-3-5', checkInDate: format(today, 'yyyy-MM-dd'), checkOutDate: format(add(today, {days: 7}), 'yyyy-MM-dd'), roomType: 'Penthouse', notes: 'Regular summer stay. Inquired about private dining.', roomNumber: 'PH-1', partySize: 4 },
    ],
    preferences: 'Always requests the Penthouse suite for summer stays. Prefers champagne on arrival. Requires daily newspaper delivery (The Times).',
  },
  {
    id: 'guest-4',
    name: 'Julian Croft',
    email: 'j.croft@example.com',
    phone: '555-0104',
    hotelId: 'hotel-2',
    status: 'checked-out',
    totalStays: 2,
    avatarUrl: 'https://placehold.co/100x100.png',
    stayHistory: [
        { id: 'stay-4-1', checkInDate: '2023-09-01', checkOutDate: '2023-09-04', roomType: 'Standard Queen', notes: 'Attended a wedding nearby.', roomNumber: '101', partySize: 1 },
        { id: 'stay-4-2', checkInDate: '2024-04-15', checkOutDate: '2024-04-18', roomType: 'Standard Queen', notes: 'Complained about noise from the street. Was moved to a quieter room.', roomNumber: '114', partySize: 1 },
    ],
    preferences: 'Needs a very quiet room. Sensitive to noise.',
  },
  {
    id: 'guest-5',
    name: 'Isabella Rossi',
    email: 'isabella.r@example.com',
    phone: '555-0105',
    hotelId: 'hotel-3',
    status: 'upcoming',
    totalStays: 1,
    avatarUrl: 'https://placehold.co/100x100.png',
    stayHistory: [
        { id: 'stay-5-1', checkInDate: format(add(today, {days: 3}), 'yyyy-MM-dd'), checkOutDate: format(add(today, {days: 8}), 'yyyy-MM-dd'), roomType: 'Luxury Villa', notes: 'Honeymoon trip. Booked several couples activities.', roomNumber: 'V-03', partySize: 2 },
    ],
    preferences: 'Vegan diet. Enjoys yoga and wellness activities.',
  },
];
