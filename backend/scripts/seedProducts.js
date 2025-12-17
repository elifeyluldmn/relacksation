const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const Product = require('../models/Product');

// Product data
const products = [
  {
    slug: 'sauna',
    name: 'Sauna',
    capacity: 1,
    isActive: true
  },
  {
    slug: 'cold-plunge',
    name: 'Cold Plunge',
    capacity: 2,
    isActive: true
  },
  {
    slug: 'fire-pit',
    name: 'Fire Pit',
    capacity: 1,
    isActive: true
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/relacksation');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert products
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);

    // Display created data
    console.log('\n=== Created Products ===');
    createdProducts.forEach(product => {
      console.log(`- ${product.name}: ${product.slug} (capacity: ${product.capacity})`);
    });

    console.log('\n✅ Products seeded successfully!');

  } catch (error) {
    console.error('Error seeding products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

// Run seeder if called directly
if (require.main === module) {
  seedProducts();
}

module.exports = seedProducts;
