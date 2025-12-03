**\#\# 1.0 Strategic Objective & Core Mandate \#\#**

**Project Name:** "Beyond Boutique" CRM (Production MVP v1.0)

**Core Mission:** Build a secure, scalable, and production-ready CRM application designed for the luxury boutique hotel market, with "The Last Word" hotels as our foundational design partner.

**Core Mandate:** The application must be elegant, intuitive, and focused on enhancing personalized guest service. The backend must be robust, and the data architecture must be clean and efficient.

**\#\# 2.0 Tech Stack & Architecture \#\#**

* **Frontend:** React with Tailwind CSS for styling.  
* **Backend & Database:** Google Firebase, utilizing Firestore for the primary database, Firebase Authentication for user management, and Firebase Cloud Functions for all server-side logic.  
* **Deployment:** Google Cloud.

**\#\# 3.0 Data Models (Firestore Collections) \#\#**

Define the following collections and schemas in Firestore:

* **`guests` Collection:**  
  * `guestId` (string, unique)  
  * `firstName` (string)  
  * `lastName` (string)  
  * `email` (string, primary identifier)  
  * `phone` (string)  
  * `totalStays` (number)  
  * `preferences` (string, for free-text notes)  
  * `createdAt` (timestamp)  
* **`reservations` Collection:**  
  * `reservationId` (string, unique)  
  * `guestId` (reference to `guests` collection)  
  * `hotelId` (reference to `hotels` collection)  
  * `checkInDate` (timestamp)  
  * `checkOutDate` (timestamp)  
  * `roomNumber` (string)  
  * `status` (string: "Confirmed", "Checked-in", "Checked-out")  
* **`hotels` Collection:**  
  * `hotelId` (string, unique)  
  * `name` (string, e.g., "The Last Word Franschhoek")  
* **`communications` Collection:**  
  * `commId` (string, unique)  
  * `guestId` (reference to `guests` collection)  
  * `type` (string: "Post-Stay Email")  
  * `sentAt` (timestamp)

**\#\# 4.0 User Roles & Authentication \#\#**

Implement Firebase Authentication with email/password logins. Define two user roles:

1. **`manager`:** Full read/write access across the application.  
2. **`staff`:** Read-only access to most guest data, but with write permissions to add/edit the `preferences` field in the `guests` collection.

**\#\# 5.0 Core Features & UI/UX \#\#**

Build the "Single View of the Guest" dashboard as the main interface.

* The UI should be identical to the prototype prompt: a two-column layout with a searchable guest list on the left and a detailed guest profile on the right.  
* **Functionality:**  
  * The dashboard must pull live data from the Firestore collections.  
  * Implement edit functionality for the `preferences` notes field for both `staff` and `manager` roles.  
  * The guest list must be filterable by `status` ("Checked-in", "Checked-out") and by `hotelId`.

**\#\# 6.0 Backend Logic & Automation (Firebase Cloud Functions) \#\#**

Write and deploy the following server-side logic:

1. **`onNewReservation` Function:**  
   * **Trigger:** A new document is created in the `reservations` collection.  
   * **Action:** The function must check if a guest with the corresponding email already exists in the `guests` collection.  
     * If **YES**, it increments the `totalStays` count for that guest.  
     * If **NO**, it creates a new document in the `guests` collection with the basic information and sets `totalStays` to 1\.  
2. **`dailyCheckOutTrigger` Function:**  
   * **Trigger:** A scheduled function to run once every 24 hours.  
   * **Action:** It queries the `reservations` collection to find all guests whose `checkOutDate` was exactly three days ago. For each result, it calls the `sendPostStayEmail` function and passes the guest's data.  
3. **`sendPostStayEmail` Function:**  
   * **Trigger:** Called by the function above.  
   * **Action:** Sends a pre-defined, elegant "thank you" email template to the guest. Upon successful sending, it creates a new document in the `communications` collection to log the interaction.

**\#\# 7.0 Call to Action \#\#**

Generate a complete, production-ready MVP of the "Beyond Boutique" CRM based on these specifications. This includes setting up the Firestore data models with appropriate security rules, writing and deploying the Firebase Cloud Functions for all backend logic, and building the fully interactive React frontend. Prioritize a secure, scalable, and functional build.  
