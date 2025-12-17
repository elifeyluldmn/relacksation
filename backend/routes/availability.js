const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Product = require('../models/Product');

// GET /api/availability - Get availability for date range
router.get('/availability', async (req, res) => {
  try {
    const { start, end } = req.query;
    
    if (!start || !end) {
      return res.status(400).json({ 
        error: 'Start and end dates are required (YYYY-MM-DD format)' 
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(start) || !dateRegex.test(end)) {
      return res.status(400).json({ 
        error: 'Dates must be in YYYY-MM-DD format' 
      });
    }

    if (start > end) {
      return res.status(400).json({ 
        error: 'Start date must be before end date' 
      });
    }

    // Get all products
    const products = await Product.find({ isActive: true });
    const productCapacities = {};
    products.forEach(product => {
      productCapacities[product.slug] = product.capacity;
    });

    // Generate date range for display (inclusive of end date)
    // Note: When checking conflicts, we use half-open intervals [startDate, endDate)
    const dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    
    // Loop through dates from start to end (inclusive) for display purposes
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(d.toISOString().split('T')[0]);
    }

    // Get bookings that overlap with the date range
    // A booking [bookingStart, bookingEnd) overlaps with [start, end) if:
    // bookingStart < end AND bookingEnd > start
    const bookings = await Booking.find({
      status: { $ne: 'canceled' },
      startDate: { $lt: end },  // bookingStart < end
      endDate: { $gt: start }   // bookingEnd > start (endDate is exclusive)
    });

    // Calculate availability for each date and product
    const availability = {};
    
    dates.forEach(date => {
      availability[date] = {};
      
      products.forEach(product => {
        const capacity = product.capacity;
        // A booking [bookingStart, bookingEnd) overlaps with date if:
        // bookingStart <= date < bookingEnd
        const used = bookings.filter(booking => {
          return booking.products.includes(product.slug) &&
                 booking.startDate <= date &&
                 booking.endDate > date;  // Changed from >= to > to make endDate exclusive
        }).length;
        
        availability[date][product.slug] = {
          used,
          capacity,
          available: capacity - used
        };
      });
    });

    res.json({
      startDate: start,
      endDate: end,
      availability
    });

  } catch (error) {
    console.error('Error getting availability:', error);
    res.status(500).json({ 
      error: 'Failed to get availability',
      details: error.message 
    });
  }
});

module.exports = router;