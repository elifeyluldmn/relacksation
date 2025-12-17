const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/relacks';
    console.log('[RelACKs] Connecting to MongoDB...');
    console.log(`[RelACKs] URI: ${mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}`); // Hide credentials
    
    // Create a promise that rejects after 5 seconds
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('MongoDB connection timeout after 5 seconds')), 5000);
    });
    
    // Race between connection and timeout
    const conn = await Promise.race([
      mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }),
      timeoutPromise
    ]);

    console.log(`[RelACKs] MongoDB Connected: ${conn.connection.host}`);
    
    // Create indexes for better performance
    await mongoose.connection.db.collection('products').createIndex({ category: 1, isActive: 1 });
    await mongoose.connection.db.collection('bookings').createIndex({ 'rental.startDate': 1, 'rental.endDate': 1 });
    await mongoose.connection.db.collection('blockeddates').createIndex({ date: 1, isActive: 1 });
    await mongoose.connection.db.collection('reservationslots').createIndex({ date: 1, productId: 1 }, { unique: true });
    
    console.log('[RelACKs] Database indexes created successfully');
    
  } catch (error) {
    console.error('[RelACKs] Error connecting to MongoDB:', error.message);
    console.error('[RelACKs] Please check your MONGODB_URI environment variable');
    process.exit(1);
  }
};

module.exports = connectDB;
