const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('./models/Product');
const BlockedDate = require('./models/BlockedDate');

// Sample products data
const sampleProducts = [
  {
    name: 'relacksation-sauna',
    displayName: 'RelAcksation Sauna',
    description: 'Professional-grade portable infrared sauna for deep relaxation and detoxification. Features include adjustable temperature control, timer, and easy setup.',
    nightlyPrice: 600,
    setupFee: 150,
    category: 'sauna',
    capacityPerDay: 1,
    maxQuantity: 1,
    isActive: true,
    images: [
      {
        url: '/images/portable-sauna.jpg',
        alt: 'Portable Infrared Sauna'
      }
    ],
    metadata: {
      dimensions: '72" x 72" x 72"',
      weight: '45 lbs',
      power: '120V, 1500W',
      features: 'Infrared heating, timer, temperature control'
    }
  },
  {
    name: 'relacksation-cold-plunge',
    displayName: 'RelAcksation Cold Plunge',
    description: 'Invigorating cold therapy tub for muscle recovery and improved circulation. Includes temperature monitoring and circulation system.',
    nightlyPrice: 125,
    setupFee: 125,
    category: 'cold-plunge',
    capacityPerDay: 2,
    maxQuantity: 2,
    isActive: true,
    images: [
      {
        url: '/images/cold-plunge.jpg',
        alt: 'Cold Plunge Tub'
      }
    ],
    metadata: {
      dimensions: '60" x 30" x 30"',
      weight: '35 lbs',
      capacity: '100 gallons',
      features: 'Temperature monitoring, circulation system, easy drain'
    }
  },
  {
    name: 'relacksation-fire-pit-wood',
    displayName: 'RelAcksation Fire Pit + Wood',
    description: 'Cozy outdoor fire pit for evening gatherings and relaxation. Portable design with safety features and easy fuel access.',
    nightlyPrice: 100,
    setupFee: 50,
    category: 'fire-pit',
    capacityPerDay: 1,
    maxQuantity: 1,
    isActive: true,
    images: [
      {
        url: '/images/fire-pit.jpg',
        alt: 'Portable Fire Pit'
      }
    ],
    metadata: {
      dimensions: '36" x 36" x 18"',
      weight: '25 lbs',
      fuel: 'Propane or wood',
      features: 'Safety screen, adjustable flame, portable design'
    }
  }
];

// Sample blocked dates (holidays, maintenance, etc.)
const sampleBlockedDates = [
  {
    date: new Date('2024-12-25'),
    reason: 'holiday',
    description: 'Christmas Day - All services closed',
    isAllProductsBlocked: true,
    blockedBy: 'system'
  },
  {
    date: new Date('2024-12-31'),
    reason: 'holiday',
    description: 'New Year\'s Eve - Limited availability',
    isAllProductsBlocked: false,
    products: [], // Will be populated with product IDs
    blockedBy: 'system'
  },
  {
    date: new Date('2025-01-01'),
    reason: 'holiday',
    description: 'New Year\'s Day - All services closed',
    isAllProductsBlocked: true,
    blockedBy: 'system'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/relacksation');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await BlockedDate.deleteMany({});
    console.log('Cleared existing data');

    // Insert products
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`Created ${createdProducts.length} products`);

    // Update blocked dates with product references
    const productIds = createdProducts.map(p => p._id);
    const updatedBlockedDates = sampleBlockedDates.map(blocked => ({
      ...blocked,
      products: blocked.isAllProductsBlocked ? [] : productIds.slice(0, 2) // Block first 2 products for limited availability
    }));

    // Insert blocked dates
    const createdBlockedDates = await BlockedDate.insertMany(updatedBlockedDates);
    console.log(`Created ${createdBlockedDates.length} blocked dates`);

    // Display created data
    console.log('\n=== Created Products ===');
    createdProducts.forEach(product => {
      console.log(`- ${product.displayName}: $${product.nightlyPrice}/night + $${product.setupFee} setup (${product.category})`);
    });

    console.log('\n=== Created Blocked Dates ===');
    createdBlockedDates.forEach(blocked => {
      console.log(`- ${blocked.date.toDateString()}: ${blocked.reason} - ${blocked.description}`);
    });

    console.log('\n✅ Database seeded successfully!');
    console.log('\nNext steps:');
    console.log('1. Configure email provider (Resend/SendGrid)');
    console.log('2. Set owner contact information in .env');
    console.log('3. Start the backend server: npm run dev');
    console.log('4. Start the frontend: cd ../frontend && npm run dev');

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
