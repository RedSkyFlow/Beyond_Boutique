
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
      source: 'PANstrat',
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
      source: 'Booking.com',
      totalStays: 1,
      loyaltyTier: 'Member',
      stayHistory: [
        {
          hotelName: 'Last Word Franschhoek',
          checkInDate: format(add(today, { days: 1 }), 'yyyy-MM-dd'),
          checkOutDate: format(add(today, { days: 5 }), 'yyyy-MM-dd'),
          roomNumber: '07',
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
      source: 'PANstrat',
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
    {
      id: 'guest-4',
      name: 'Liam O\'Connell',
      email: 'liam.oc@example.com',
      phone: '555-0104',
      status: 'Checked-in',
      source: 'Booking.com',
      totalStays: 5,
      loyaltyTier: 'Platinum',
      stayHistory: [
        {
          hotelName: 'Last Word Kitara',
          checkInDate: format(sub(today, { days: 1 }), 'yyyy-MM-dd'),
          checkOutDate: format(add(today, { days: 6 }), 'yyyy-MM-dd'),
          roomNumber: '08',
        },
      ],
      preferences: 'Avid bird watcher. Requests binoculars and a local guide book.',
      onSiteActivity: {
        firstSeen: format(sub(today, { days: 1, hours: 5 }), 'yyyy-MM-dd, HH:mm'),
        lastSeen: format(sub(today, { minutes: 30 }), 'yyyy-MM-dd, HH:mm'),
        connectedDevices: ['Pixel 8 Pro'],
      },
      communicationHistory: [
        { date: format(sub(today, { days: 10 }), 'yyyy-MM-dd'), log: 'Booking confirmation for safari tour.' },
      ],
    },
    {
      id: 'guest-5',
      name: 'Sofia Rossi',
      email: 'sofia.r@example.com',
      phone: '555-0105',
      status: 'Arriving Soon',
      source: 'Manual Entry',
      totalStays: 2,
      loyaltyTier: 'Gold',
      stayHistory: [
        {
          hotelName: 'Last Word Long Beach',
          checkInDate: '2023-07-20',
          checkOutDate: '2023-07-25',
          roomNumber: '301',
        },
        {
          hotelName: 'Last Word Constantia',
          checkInDate: format(add(today, { days: 3 }), 'yyyy-MM-dd'),
          checkOutDate: format(add(today, { days: 8 }), 'yyyy-MM-dd'),
          roomNumber: '11',
        },
      ],
      preferences: 'Requires hypoallergenic bedding. Enjoys white wine, preferably Sauvignon Blanc.',
      onSiteActivity: {
        firstSeen: 'N/A',
        lastSeen: 'N/A',
        connectedDevices: [],
      },
      communicationHistory: [
        { date: format(sub(today, { days: 4 }), 'yyyy-MM-dd'), log: 'Confirmed dinner reservations via email.' },
      ],
    },
    {
      id: 'guest-6',
      name: 'Kenji Tanaka',
      email: 'kenji.t@example.com',
      phone: '555-0106',
      status: 'Checked-out',
      source: 'Booking.com',
      totalStays: 1,
      loyaltyTier: 'Member',
      stayHistory: [
        {
          hotelName: 'Last Word Long Beach',
          checkInDate: format(sub(today, { days: 8 }), 'yyyy-MM-dd'),
          checkOutDate: format(sub(today, { days: 3 }), 'yyyy-MM-dd'),
          roomNumber: '105',
        },
      ],
      preferences: 'Interested in surfing lessons. Requested a late check-out.',
      onSiteActivity: {
        firstSeen: format(sub(today, { days: 8 }), 'yyyy-MM-dd, HH:mm'),
        lastSeen: format(sub(today, { days: 3 }), 'yyyy-MM-dd, HH:mm'),
        connectedDevices: ['Samsung Galaxy S23'],
      },
      communicationHistory: [
        { date: format(sub(today, { days: 2 }), 'yyyy-MM-dd'), log: 'Post-stay survey sent.' },
      ],
    },
    {
      id: 'guest-7',
      name: 'Ava Chen',
      email: 'ava.c@example.com',
      phone: '555-0107',
      status: 'Checked-in',
      source: 'PANstrat',
      totalStays: 4,
      loyaltyTier: 'Gold',
      stayHistory: [
        {
          hotelName: 'Last Word Kalahari',
          checkInDate: format(sub(today, { days: 4 }), 'yyyy-MM-dd'),
          checkOutDate: format(add(today, { days: 1 }), 'yyyy-MM-dd'),
          roomNumber: 'Dune Villa',
        },
      ],
      preferences: 'Enjoys star-gazing. Allergic to nuts.',
      onSiteActivity: {
        firstSeen: format(sub(today, { days: 4 }), 'yyyy-MM-dd, HH:mm'),
        lastSeen: format(sub(today, { hours: 2 }), 'yyyy-MM-dd, HH:mm'),
        connectedDevices: ['iPhone 15', 'Apple Watch Ultra'],
      },
      communicationHistory: [
        { date: format(sub(today, { days: 5 }), 'yyyy-MM-dd'), log: 'Dietary restrictions confirmed.' },
      ],
    },
    {
      id: 'guest-8',
      name: 'Javier Morales',
      email: 'javier.m@example.com',
      phone: '555-0108',
      status: 'Arriving Soon',
      source: 'Manual Entry',
      totalStays: 1,
      loyaltyTier: 'Member',
      stayHistory: [
        {
          hotelName: 'Last Word Kitara',
          checkInDate: format(add(today, { days: 2 }), 'yyyy-MM-dd'),
          checkOutDate: format(add(today, { days: 7 }), 'yyyy-MM-dd'),
          roomNumber: '02',
        },
      ],
      preferences: 'Honeymoon couple. Requested a private dinner setup for their arrival night.',
      onSiteActivity: {
        firstSeen: 'N/A',
        lastSeen: 'N/A',
        connectedDevices: [],
      },
      communicationHistory: [
        { date: format(sub(today, { days: 3 }), 'yyyy-MM-dd'), log: 'Confirmed honeymoon package details.' },
      ],
    },
     {
      id: 'guest-9',
      name: 'Chloe Williams',
      email: 'chloe.w@example.com',
      phone: '555-0109',
      status: 'Checked-out',
      source: 'PANstrat',
      totalStays: 2,
      loyaltyTier: 'Gold',
      stayHistory: [
        {
          hotelName: 'Last Word Madikwe',
          checkInDate: format(sub(today, { days: 15 }), 'yyyy-MM-dd'),
          checkOutDate: format(sub(today, { days: 10 }), 'yyyy-MM-dd'),
          roomNumber: '10',
        },
      ],
      preferences: 'Family with two young children. Prefers ground-floor rooms.',
      onSiteActivity: {
        firstSeen: format(sub(today, { days: 15 }), 'yyyy-MM-dd, HH:mm'),
        lastSeen: format(sub(today, { days: 10 }), 'yyyy-MM-dd, HH:mm'),
        connectedDevices: ['iPad Mini', 'iPhone 13', 'iPhone 13'],
      },
      communicationHistory: [
        { date: format(sub(today, { days: 9 }), 'yyyy-MM-dd'), log: 'Post-stay "Thank You" email sent.' },
      ],
    },
     {
      id: 'guest-10',
      name: 'Ben Carter',
      email: 'ben.c@example.com',
      phone: '555-0110',
      status: 'Checked-in',
      source: 'Purple WiFi',
      totalStays: 1,
      loyaltyTier: 'Member',
      stayHistory: [
        {
          hotelName: 'Last Word Long Beach',
          checkInDate: format(sub(today, { days: 1 }), 'yyyy-MM-dd'),
          checkOutDate: format(add(today, { days: 4 }), 'yyyy-MM-dd'),
          roomNumber: '202',
        },
      ],
      preferences: 'No preferences listed.',
      onSiteActivity: {
        firstSeen: format(sub(today, { days: 1 }), 'yyyy-MM-dd, HH:mm'),
        lastSeen: format(sub(today, { minutes: 15 }), 'yyyy-MM-dd, HH:mm'),
        connectedDevices: ['Android Phone'],
      },
      communicationHistory: [],
    },
    {
      id: 'guest-11',
      name: 'Olivia Garcia',
      email: 'olivia.g@example.com',
      phone: '555-0111',
      status: 'Arriving Soon',
      source: 'PANstrat',
      totalStays: 3,
      loyaltyTier: 'Gold',
      stayHistory: [
        {
          hotelName: 'Last Word Madikwe',
          checkInDate: format(add(today, { days: 1 }), 'yyyy-MM-dd'),
          checkOutDate: format(add(today, { days: 5 }), 'yyyy-MM-dd'),
          roomNumber: '03',
        },
      ],
      preferences: 'Prefers extra pillows and a quiet room.',
      onSiteActivity: {
        firstSeen: 'N/A',
        lastSeen: 'N/A',
        connectedDevices: [],
      },
      communicationHistory: [
        { date: format(sub(today, { days: 2 }), 'yyyy-MM-dd'), log: 'Room request acknowledged.' },
      ],
    },
    {
      id: 'guest-12',
      name: 'Lucas Nguyen',
      email: 'lucas.n@example.com',
      phone: '555-0112',
      status: 'Checked-out',
      source: 'Booking.com',
      totalStays: 1,
      loyaltyTier: 'Member',
      stayHistory: [
        {
          hotelName: 'Last Word Franschhoek',
          checkInDate: format(sub(today, { days: 7 }), 'yyyy-MM-dd'),
          checkOutDate: format(sub(today, { days: 4 }), 'yyyy-MM-dd'),
          roomNumber: '09',
        },
      ],
      preferences: 'Requested information on hiking trails.',
      onSiteActivity: {
        firstSeen: format(sub(today, { days: 7 }), 'yyyy-MM-dd, HH:mm'),
        lastSeen: format(sub(today, { days: 4 }), 'yyyy-MM-dd, HH:mm'),
        connectedDevices: ['Garmin Watch', 'iPhone 12'],
      },
      communicationHistory: [
        { date: format(sub(today, { days: 3 }), 'yyyy-MM-dd'), log: 'Post-stay "Thank You" email sent.' },
      ],
    },
  ];
}
