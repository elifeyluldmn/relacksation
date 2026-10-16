# RelACKsation V2 — development preview
A clean Next.js rental-request website in the `v2/` folder. **Not deployed.** The existing frontend/backend remain untouched.

## Features
- Minimal responsive homepage and multi-step booking flow
- Sauna $500, cold plunge $150, fire pit $100 per 24-hour rental
- Discounts: 3–6 days 10%, 7–29 days 20%, 30+ days 35%
- No payment or time slots; delivery and pickup arranged by phone
- MongoDB booking records and per-product/day inventory locks
- Password-protected owner booking list and status controls
- Optional SMTP booking notifications

## Local setup
```powershell
cd v2
npm install
Copy-Item .env.example .env.local
npm run dev
```
Set the environment values in `.env.local` before testing bookings. Open http://localhost:3000.

## Before production
- Requires MongoDB Atlas replica set / transactions.
- Ensure a **unique index** on `v2_inventory` for `{product:1,date:1}` before taking bookings.
- Set long random ADMIN_PASSWORD (16+ characters) and SESSION_SECRET (32+ characters).
- Configure SMTP and owner phone number.
- Run install, build, security review, test concurrency and cancellation, and end-to-end booking tests.
- Replace decorative placeholder artwork with approved actual business photos.
- Add CSRF protection, login rate limiting, spam prevention, and calendar UI before launch.
- Confirm operational policy for multi-day pricing and availability.
