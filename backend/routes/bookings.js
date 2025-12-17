const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Product = require('../models/Product');

// GET /api/bookings - Get all bookings (admin only)
router.get('/bookings', async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(100);

    res.json(bookings);
  } catch (error) {
    console.error('Error getting bookings:', error);
    res.status(500).json({ 
      error: 'Failed to get bookings',
      details: error.message 
    });
  }
});

// POST /api/bookings - Create new booking
router.post('/bookings', async (req, res) => {
  try {
    const { startDate, endDate, products, customer, address } = req.body;

    // Validate required fields
    if (!startDate || !endDate || !products || !customer || !address) {
      return res.status(400).json({ 
        error: 'All fields are required: startDate, endDate, products, customer, address' 
      });
    }

    if (!Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        error: 'At least one product must be selected' 
      });
    }

    // Validate date format
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
      return res.status(400).json({ 
        error: 'Dates must be in YYYY-MM-DD format' 
      });
    }

    // Calculate nights (endDate is exclusive - checkout day)
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const msPerDay = 1000 * 60 * 60 * 24;
    const nights = Math.round((endDateObj - startDateObj) / msPerDay);
    
    // Validate minimum 1 night booking
    if (startDate >= endDate) {
      return res.status(400).json({ 
        error: 'Bookings must be at least 1 night. End date must be after start date.' 
      });
    }
    
    if (nights < 1) {
      return res.status(400).json({ 
        error: 'Bookings must be at least 1 night' 
      });
    }

    // Validate products exist and are active
    const validProducts = ['sauna', 'cold-plunge', 'fire-pit'];
    const invalidProducts = products.filter(p => !validProducts.includes(p));
    if (invalidProducts.length > 0) {
      return res.status(400).json({ 
        error: `Invalid products: ${invalidProducts.join(', ')}` 
      });
    }

    // Check availability for each product on each date in the range
    // Note: endDate is exclusive (checkout day), so we only check dates [startDate, endDate)
    const productCapacities = {};
    const activeProducts = await Product.find({ isActive: true });
    activeProducts.forEach(product => {
      productCapacities[product.slug] = product.capacity;
    });
    
    // Loop through dates from startDate to endDate (exclusive)
    for (let d = new Date(startDateObj); d < endDateObj; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      
      for (const productSlug of products) {
        const capacity = productCapacities[productSlug];
        if (!capacity) {
          return res.status(400).json({ 
            error: `Product ${productSlug} not found or inactive` 
          });
        }

        // Count existing bookings for this product on this date
        // A booking [existingStart, existingEnd) overlaps with dateStr if:
        // existingStart <= dateStr < existingEnd
        const existingBookings = await Booking.countDocuments({
          status: { $ne: 'canceled' },
          products: productSlug,
          startDate: { $lte: dateStr },
          endDate: { $gt: dateStr }  // Changed from $gte to $gt to make endDate exclusive
        });

        if (existingBookings >= capacity) {
          return res.status(409).json({ 
            error: `${productSlug} is fully booked for ${dateStr}`,
            details: `Only ${capacity} ${productSlug} available per day`
          });
        }
      }
    }

    // Create booking
    const booking = new Booking({
      startDate,
      endDate,
      products,
      customer,
      address,
      status: 'pending'
    });

    await booking.save();

    res.status(201).json({
      bookingId: booking._id,
      status: 'pending',
      message: 'Booking request created successfully'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ 
      error: 'Failed to create booking',
      details: error.message 
    });
  }
});

// PATCH /api/bookings/:id - Update booking status (admin only)
router.patch('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['pending', 'confirmed', 'canceled'].includes(status)) {
      return res.status(400).json({ 
        error: 'Valid status required: pending, confirmed, or canceled' 
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found' 
      });
    }

    res.json({
      bookingId: booking._id,
      status: booking.status,
      message: 'Booking status updated successfully'
    });

  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ 
      error: 'Failed to update booking',
      details: error.message 
    });
  }
});

// DELETE /api/bookings/:id - Cancel booking (admin only)
router.delete('/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status: 'canceled' },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ 
        error: 'Booking not found' 
      });
    }

    res.json({
      bookingId: booking._id,
      status: booking.status,
      message: 'Booking canceled successfully'
    });

  } catch (error) {
    console.error('Error canceling booking:', error);
    res.status(500).json({ 
      error: 'Failed to cancel booking',
      details: error.message 
    });
  }
});

module.exports = router;