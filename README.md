# RelACKs - Premium Sauna & Cold Plunge Rentals

A complete booking system for portable sauna and cold plunge rentals in Nantucket, built with Next.js, Express.js, MongoDB, and Stripe.

## 🚀 Features

- **Complete Booking Flow**: Date selection, product choice, contact info, and Stripe payment
- **Smart Availability Management**: Real-time calendar with blocked dates and double-booking prevention
- **Dynamic Pricing**: Nightly rates + setup fees with 25% off for 3+ nights
- **Stripe Integration**: Secure payment processing with webhook handling
- **Email Notifications**: Customer confirmations and owner alerts via Resend/SendGrid
- **Responsive Design**: Modern UI built with React and Tailwind CSS
- **MongoDB Database**: Robust data models with proper indexing
- **Admin Dashboard**: Owner tools for managing bookings and blocking dates

## 💰 Pricing Model

### Product Pricing
- **RelACKs Cold Plunge**: $125/night + $125 setup fee (one-time per product)
- **RelACKs Steam Wagon (Sauna)**: $600/night + $150 setup fee (one-time per product)
- **RelACKs Fire Pit + Wood**: $100/night + $50 setup fee (one-time per product)

### Discount Policy
- **25% off** when booking **≥ 3 nights** (applies to nightly portion only, not setup fees)
- **Long-term rentals (≥7 nights)**: Automatically switch to `MANUAL_QUOTE` mode
- **Quote calculation**: `(nightly price × nights × discount) + setup fee` for each product

### Pricing Modes
- `PRICING_MODE=TEST`: $1 totals for end-to-end testing
- `PRICING_MODE=FIXED`: Use configured nightly rates + setup fees
- `PRICING_MODE=MANUAL_QUOTE`: For long-term rentals requiring custom quotes

## 🏗️ Architecture

```
relacks/
├── frontend/          # Next.js React application
├── backend/           # Express.js API server
├── public/            # Static assets
└── README.md
```

### Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS, React Big Calendar
- **Backend**: Express.js, MongoDB, Mongoose
- **Payment**: Stripe Checkout
- **Email**: Resend/SendGrid (configurable)
- **SMS**: Twilio (optional)
- **Database**: MongoDB with proper indexing

## 📋 Prerequisites

- Node.js 18+ and npm
- MongoDB (local or cloud)
- Stripe account
- Email provider (Resend/SendGrid)

## 🛠️ Installation

### 1. Clone and Setup

```bash
git clone <your-repo-url>
cd relacks
```

### 2. Backend Setup

```bash
cd backend
npm install
cp env.example .env
# Edit .env with your configuration
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

### 4. Database Setup

```bash
cd ../backend
node seedDatabase.js
```

## ⚙️ Environment Configuration

Create `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/relacks

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Email Configuration
EMAIL_PROVIDER=resend
EMAIL_PROVIDER_API_KEY=re_...
EMAIL_FROM=noreply@relacks.com

# Owner Notifications
OWNER_NOTIFY_EMAIL=owner@relacks.com
OWNER_NOTIFY_PHONE=+1...

# Server Configuration
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Pricing Configuration
PRICING_MODE=TEST  # TEST, FIXED, or MANUAL_QUOTE
```

## 🚀 Running the Application

### Development Mode

1. **Start Backend**:
   ```bash
   cd backend
   npm run dev
   ```

2. **Start Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

### Production Mode

```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm start
```

## 📊 Database Models

### Product
- Basic info (name, description, price)
- Category (sauna, cold-plunge, fire-pit, accessory)
- Availability and quantity limits
- Metadata for dimensions, features, etc.

### Booking
- Customer information
- Rental dates and duration
- Product selection and pricing
- Payment status and Stripe integration
- Booking status tracking

### BlockedDate
- Date blocking for holidays/maintenance
- Product-specific or global blocking
- Reason and description tracking

### ReservationSlot
- Temporary slot holds during checkout
- Prevents double-booking
- Auto-expiration for abandoned sessions

## 🔌 API Endpoints

### Availability
- `GET /api/availability` - Check date availability
- `GET /api/availability/blocked` - Get blocked dates

### Quotes
- `POST /api/quote` - Calculate rental pricing
- `GET /api/quote/products` - Get available products

### Checkout
- `POST /api/checkout` - Create Stripe checkout session
- `GET /api/checkout/session/:id` - Get session status
- `POST /api/checkout/cancel/:id` - Cancel checkout

### Stripe Webhooks
- `POST /api/stripe/webhook` - Handle payment events

## 💳 Stripe Integration

### Setup
1. Create Stripe account
2. Get API keys from dashboard
3. Configure webhook endpoint
4. Set webhook secret in environment

### Products
The system creates dynamic Stripe products with names like:
- "RelACKs Portable Sauna"
- "RelACKs Cold Plunge Tub"
- "RelACKs Fire Pit"

### Webhooks
Handles these events:
- `checkout.session.completed` - Confirm booking
- `checkout.session.expired` - Release held slots

## 📧 Email Configuration

### Resend (Recommended)
```env
EMAIL_PROVIDER=resend
EMAIL_PROVIDER_API_KEY=re_...
EMAIL_FROM=noreply@relacks.com
```

### SendGrid
```env
EMAIL_PROVIDER=sendgrid
EMAIL_PROVIDER_API_KEY=SG...
EMAIL_FROM=noreply@relacks.com
```

### Email Templates
- **Customer Confirmation**: Booking details, pricing, next steps
- **Owner Notification**: New booking alert with customer info

## 🔒 Security Features

- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- Input validation and sanitization
- MongoDB injection protection

## 📱 Frontend Features

### Booking Flow
1. **Date Selection**: Interactive calendar with availability
2. **Product Selection**: Choose from available products
3. **Quote Generation**: Real-time pricing with discounts
4. **Contact Form**: Customer information collection
5. **Payment**: Secure Stripe checkout
6. **Confirmation**: Success page with next steps

### Responsive Design
- Mobile-first approach
- Touch-friendly calendar
- Optimized forms
- Modern UI components

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📦 Deployment

### Backend Deployment
1. Set production environment variables
2. Use PM2 or similar process manager
3. Configure MongoDB connection
4. Set up SSL certificates

### Frontend Deployment
1. Build production bundle
2. Deploy to Vercel, Netlify, or similar
3. Configure environment variables
4. Set up custom domain

### Database Deployment
1. Use MongoDB Atlas or similar
2. Configure connection strings
3. Set up backup and monitoring
4. Configure network access

## 🔧 Customization

### Adding New Products
1. Update `seedDatabase.js`
2. Add product images to `public/images/`
3. Update frontend product display

### Modifying Pricing
1. Edit discount logic in `quote.js`
2. Update frontend pricing display
3. Test with various date ranges

### Custom Email Templates
1. Modify `emailService.js`
2. Update HTML templates
3. Test email delivery

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Failed**
   - Check connection string
   - Verify MongoDB is running
   - Check network access

2. **Stripe Webhook Errors**
   - Verify webhook secret
   - Check endpoint URL
   - Monitor webhook logs

3. **Email Not Sending**
   - Check API keys
   - Verify email provider settings
   - Check SMTP configuration

4. **Frontend API Errors**
   - Verify backend URL
   - Check CORS configuration
   - Monitor network requests

### Debug Mode
```env
NODE_ENV=development
DEBUG=relacks:*
```

## 📈 Performance Optimization

- Database indexing on frequently queried fields
- API response caching
- Image optimization
- Code splitting and lazy loading
- CDN for static assets

## 🔄 Updates and Maintenance

### Regular Tasks
- Monitor Stripe webhook delivery
- Check email delivery rates
- Review database performance
- Update dependencies
- Backup database

### Monitoring
- Application logs
- Error tracking
- Performance metrics
- User analytics

## 📄 License

MIT License - see LICENSE file for details

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## 📞 Support

- **Email**: support@relacks.com
- **Documentation**: [Project Wiki]
- **Issues**: [GitHub Issues]

## 🎯 Roadmap

- [ ] Owner dashboard with analytics
- [ ] Mobile app development
- [ ] Advanced reporting
- [ ] Integration with property management systems
- [ ] Multi-location support
- [ ] Customer loyalty program

---

**Built with ❤️ for RelACKs**

*Last updated: December 2024*
