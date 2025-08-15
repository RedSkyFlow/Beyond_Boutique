import type { Guest } from '@/types';
import { add, format, sub } from 'date-fns';

export const guests = (): Guest[] => {
  const today = new Date();

  return [
    {
      id: 'guest-1',
      name: 'Eleanor Vance',
      email: 'eleanor.v@example.com',
      phone: '555-0101',
      status: 'Checked-in',
      totalStays: 3,
      loyaltyTier: 'Gold',
      stayHistory: [
        {
          hotelName: 'Last Word Franschhoek',
          checkInDate: '2023-08-15',
          checkOutDate: '2023-08-20',
          roomNumber: '12',
        },
        {
          hotelName: 'Last Word Kitara',
          checkInDate: '2023-12-22',
          checkOutDate: '2023-12-26',
          roomNumber: '05',
        },
        {
          hotelName: 'Last Word Madikwe',
          checkInDate: format(sub(today, { days: 2 }), 'yyyy-MM-dd'),
          checkOutDate: format(add(today, { days: 3 }), 'yyyy-MM-dd'),
          roomNumber: '15',
        },
      ],
      preferences: `Prefers sparkling water in the room.
Celebrated their anniversary with us last year.
Likes a dinner reservation made for 8 PM on the first night.`,
      onSiteActivity: {
        firstSeen: format(sub(today, { days: 2, hours: 3 }), 'yyyy-MM-dd, HH:mm'),
        lastSeen: format(sub(today, { hours: 1 }), 'yyyy-MM-dd, HH:mm'),
        connectedDevices: ['iPhone 15 Pro', 'MacBook Air'],
      },
      communicationHistory: [
          { date: '2023-12-27', log: 'Post-stay "Thank You" email sent.'},
          { date: '2023-08-21', log: 'Post-stay "Thank You" email sent.'}
      ]
    },
    {
      id: 'guest-2',
      name: 'Marcus Thorne',
      email: 'm.thorne@example.com',
      phone: '555-0102',
      status: 'Arriving Soon',
      totalStays: 1,
      loyaltyTier: 'Member',
      stayHistory: [
        {
          hotelName: 'Last Word Long Beach',
          checkInDate: format(add(today, { days: 1 }), 'yyyy-MM-dd'),
          checkOutDate: format(add(today, { days: 5 }), 'yyyy-MM-dd'),
          roomNumber: '201',
        },
      ],
      preferences: 'First time guest. Interested in local wine tours.',
      onSiteActivity: {
        firstSeen: 'N/A',
        lastSeen: 'N/A',
        connectedDevices: [],
      },
      communicationHistory: [
          { date: format(sub(today, {days: 7}), 'yyyy-MM-dd'), log: 'Pre-stay "Looking forward to your visit" email sent.'}
      ]
    },
    {
      id: 'guest-3',
      name: 'Seraphina Dubois',
      email: 'seraphina.d@example.com',
      phone: '555-0103',
      status: 'Checked-out',
      totalStays: 2,
      loyaltyTier: 'Platinum',
      stayHistory: [
          {
              hotelName: 'Last Word Kalahari',
              checkInDate: '2024-01-10',
              checkOutDate: '2024-01-18',
              roomNumber: 'Suite 01',
          },
          {
              hotelName: 'Last Word Constantia',
              checkInDate: format(sub(today, { days: 10 }), 'yyyy-MM-dd'),
              checkOutDate: format(sub(today, { days: 5 }), 'yyyy-MM-dd'),
              roomNumber: 'Suite 02',
          },
      ],
      preferences: `Always requests a room with a garden view.
Prefers champagne on arrival.`,
      onSiteActivity: {
        firstSeen: format(sub(today, { days: 10, hours: 2 }), 'yyyy-MM-dd, HH:mm'),
        lastSeen: format(sub(today, { days: 5, hours: 1 }), 'yyyy-MM-dd, HH:mm'),
        connectedDevices: ['iPhone 14', 'iPad Pro'],
      },
      communicationHistory: [
        { date: format(sub(today, { days: 4 }), 'yyyy-MM-dd'), log: "Post-stay 'Thank You' email sent." },
        { date: '2024-01-19', log: "Post-stay 'Thank You' email sent." },
      ],
    },
  ];
}
