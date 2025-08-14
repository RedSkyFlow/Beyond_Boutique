# **App Name**: Boutique CRM

## Core Features:

- Guest Dashboard: Single View of the Guest: A dashboard providing a 360-degree view of each guest, including personal details, stay history, and preferences. Filterable by hotelId and check-in status.
- Real-time Data: Real-time Data Sync: The dashboard must pull live data from the Firestore collections.
- Preferences Editor: Preferences Editor: Allow staff and managers to edit guest preferences to reflect requests and improve service. The updates will automatically save to the guest document in Firestore.
- onNewReservation: New Reservation Handler: Upon new reservation, check guest existence. If the guest already exists, increment `totalStays`; otherwise, create a new guest profile.
- dailyCheckOutTrigger: Daily Check-Out Automation: Run a function to find guests who checked out three days ago, triggering the `sendPostStayEmail` function.
- sendPostStayEmail: Post-Stay Email Service: Trigger sending of a 'thank you' email to the guest. Log successful interactions.
- Preference Suggestor: AI Preference Suggestor: Analyze guest history and provide staff with suggestions about the kinds of perks or offers each guest might like. This tool will offer a tailored recommendation for improving each guest's stay. It will use reasoning to decide whether to suggest anything or not. It can include services, room type, etc.

## Style Guidelines:

- Primary color: Soft lavender (#E6E6FA) to evoke feelings of luxury and tranquility.
- Background color: Pale off-white (#F8F8FF) for a clean and unobtrusive backdrop.
- Accent color: Dusty rose (#D8BFD8) to highlight key interactive elements.
- Body and headline font: 'Alegreya', a humanist serif for an elegant and readable aesthetic.
- Code font: 'Source Code Pro' for displaying code snippets.
- Minimalist icons for primary actions and navigation, ensuring clarity and ease of use.
- Two-column layout, as described, with searchable guest list on the left and detailed guest profile on the right. A clean, intuitive and efficient information layout.