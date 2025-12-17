const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// POST /api/quote - Calculate rental quote with discounts
router.post('/quote', async (req, res) => {
  try {
    const { startDate, endDate, products, rentalType } = req.body;
    
    if (!startDate || !endDate || !products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ 
        error: 'Start date, end date, and products array are required' 
      });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({ 
        error: 'Bookings must be at least 1 night. End date must be after start date.' 
      });
    }

    // Calculate duration in nights (endDate is exclusive - checkout day)
    const msPerDay = 1000 * 60 * 60 * 24;
    const duration = Math.round((end - start) / msPerDay);
    
    if (duration < 1) {
      return res.status(400).json({ 
        error: 'Bookings must be at least 1 night' 
      });
    }
    
    // Get product details
    const productIds = products.map(p => p.productId || p.id);
    const productDetails = await Product.find({ 
      _id: { $in: productIds },
      isActive: true 
    });

    if (productDetails.length !== products.length) {
      return res.status(400).json({ 
        error: 'One or more products not found or inactive' 
      });
    }

    // Check for long-term rentals (≥8 nights) - switch to MANUAL_QUOTE
    if (duration >= 8) {
      return res.json({
        startDate: startDate,
        endDate: endDate,
        duration: duration, // duration is in nights
        rentalType: rentalType || 'custom',
        pricingMode: 'MANUAL_QUOTE',
        message: 'For long-term rentals (8+ nights), please contact RelAcksation for a custom quote.',
        products: [],
        pricing: {
          subtotal: 0,
          discount: 0,
          total: 0,
          currency: 'usd'
        },
        validUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
        quoteId: `Q${Date.now()}${Math.random().toString(36).substr(2, 9)}`
      });
    }

    // Calculate pricing with new structure (nightly + setup fee)
    let subtotal = 0;
    let discount = 0;
    const productBreakdown = [];

    products.forEach(requestedProduct => {
      const product = productDetails.find(p => p._id.toString() === (requestedProduct.productId || requestedProduct.id));
      if (product) {
        const quantity = requestedProduct.quantity || 1;
        const nightlyPrice = product.nightlyPrice;
        const setupFee = product.setupFee;
        
        // Calculate nightly portion
        let nightlyTotal = nightlyPrice * quantity * duration;
        
        // Apply 25% discount if duration >= 3 nights (nightly portion only)
        let nightlyDiscount = 0;
        if (duration >= 3) {
          nightlyDiscount = nightlyTotal * 0.25;
          nightlyTotal -= nightlyDiscount;
        }
        
        // Setup fee (no discount)
        const setupTotal = setupFee * quantity;
        
        // Line total
        const lineTotal = nightlyTotal + setupTotal;
        
        subtotal += lineTotal;
        discount += nightlyDiscount;
        
        productBreakdown.push({
          productId: product._id,
          name: product.displayName || product.name,
          category: product.category,
          nightlyPrice: nightlyPrice,
          setupFee: setupFee,
          quantity: quantity,
          duration: duration,
          nightlyTotal: nightlyTotal + nightlyDiscount, // Original nightly total
          nightlyDiscount: nightlyDiscount,
          setupTotal: setupTotal,
          lineTotal: lineTotal
        });
      }
    });

    const total = subtotal;

    const quote = {
      startDate: startDate,
      endDate: endDate,
      duration: duration,
      rentalType: rentalType || 'custom',
      pricingMode: 'FIXED',
      products: productBreakdown,
      pricing: {
        subtotal: Math.round((subtotal + discount) * 100) / 100, // Original total before discount
        discount: Math.round(discount * 100) / 100,
        total: Math.round(total * 100) / 100,
        currency: 'usd'
      },
      discountInfo: {
        applied: discount > 0,
        percentage: duration >= 3 ? 25 : 0,
        savings: Math.round(discount * 100) / 100,
        message: discount > 0 
          ? `Save 25% on nightly rates for ${duration}+ night rentals!`
          : null
      },
      validUntil: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
      quoteId: `Q${Date.now()}${Math.random().toString(36).substr(2, 9)}`
    };

    res.json(quote);

  } catch (error) {
    console.error('Error calculating quote:', error);
    res.status(500).json({ 
      error: 'Failed to calculate quote',
      details: error.message 
    });
  }
});

// GET /api/quote/products - Get available products for quoting
router.get('/quote/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('_id name displayName description nightlyPrice setupFee category maxQuantity capacityPerDay images')
      .sort({ category: 1, name: 1 });

    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ 
      error: 'Failed to get products',
      details: error.message 
    });
  }
});

module.exports = router;
