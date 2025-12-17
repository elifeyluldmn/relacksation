# RelAcksation - Simple Mode

Premium Sauna & Cold Plunge Rentals in Nantucket - Simple booking system with offline payment via Venmo.

## Features

- **Simple Booking Flow**: Date selection → Product selection → Contact info → Submit request
- **Per-Product Capacity**: Sauna (1/day), Cold Plunge (2/day), Fire Pit (1/day)
- **Offline Payment**: Contact owner via phone/email to arrange Venmo payment
- **Owner Panel**: Mobile-friendly admin interface to manage bookings
- **No Stripe**: Removed all online payment complexity

## Quick Start

### Backend
```bash
cd backend
npm install
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Seed Products
```bash
cd backend
node scripts/seedProducts.js
```

## Environment Setup

Create `backend/.env.local`:
```
MONGODB_URI=mongodb+srv://acksteam:Nantucket0@acksteam.9yx0fam.mongodb.net/relacksation?retryWrites=true&w=majority&appName=acksteam
PORT=5000
BUSINESS_NAME=RelAcksation
COMPANY_NAME=RelAcks Wellness Inc.
PAYMENT_MODE=OFFLINE_CONTACT
OWNER_CONTACT_PHONE=+1XXXYYYZZZZ
OWNER_CONTACT_EMAIL=info@relacksation.com
ADMIN_PASSWORD=change-me
```

Create `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_OWNER_PHONE=+1XXXYYYZZZZ
NEXT_PUBLIC_OWNER_EMAIL=info@relacksation.com
NEXT_PUBLIC_ADMIN_PASSWORD=change-me
```

## API Endpoints

- `GET /api/products` - List available products with capacities
- `GET /api/availability?start=YYYY-MM-DD&end=YYYY-MM-DD` - Check availability
- `POST /api/bookings` - Create booking request
- `PATCH /api/bookings/:id` - Update booking status (admin)
- `GET /api/bookings` - List all bookings (admin)

## Pages

- `/` - Home page with product showcase
- `/booking` - 5-step booking flow
- `/success` - Confirmation page with contact info
- `/owner` - Admin panel (password protected)

## Data Models

### Product
```javascript
{
  slug: "sauna" | "cold-plunge" | "fire-pit",
  name: "Sauna",
  capacity: 1,
  isActive: true
}
```

### Booking
```javascript
{
  customer: { name, email, phone },
  address: { line1, city, state, zip },
  products: ["sauna", "cold-plunge"],
  startDate: "YYYY-MM-DD",
  endDate: "YYYY-MM-DD",
  status: "pending" | "confirmed" | "canceled"
}
```

## Testing

1. **Basic booking**: Select dates, choose Sauna, fill contact info, submit
2. **Capacity test**: Book 2 Cold Plunge for same day (both succeed), try 3rd (fails)
3. **Admin test**: Cancel one Cold Plunge booking, then 3rd booking succeeds

## What Was Removed

- Stripe integration and webhooks
- Complex ReservationSlot/hold system
- BlockedDate management
- Email service complexity
- Multi-step checkout flow

## What Was Simplified

- Single booking model (no separate payment/booking)
- Direct capacity checking (no holds/reservations)
- Simple date-based availability
- Contact-based payment flow
- Mobile-first admin interface

## Next Steps

1. Update MongoDB Atlas network access if connection fails
2. Set real phone number and email in environment variables
3. Test complete booking flow end-to-end
4. Add basic email notifications if needed
5. Deploy to production when ready
