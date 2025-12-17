const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET /api/products - Get all active products
router.get('/products', async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .select('slug name capacity')
      .sort({ slug: 1 });

    res.json(products);
  } catch (error) {
    console.error('Error getting products:', error);
    res.status(500).json({ 
      error: 'Failed to get products',
      details: error.message 
    });
  }
});

// GET /api/products/all - Get all products (including inactive) for admin
router.get('/products/all', async (req, res) => {
  try {
    const products = await Product.find({})
      .select('slug name capacity isActive')
      .sort({ slug: 1 });

    res.json(products);
  } catch (error) {
    console.error('Error getting all products:', error);
    res.status(500).json({ 
      error: 'Failed to get products',
      details: error.message 
    });
  }
});

// PATCH /api/products/:id - Update product capacity or active status
router.patch('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { capacity, isActive } = req.body;

    // Validation
    const updates = {};
    
    if (capacity !== undefined) {
      if (!Number.isInteger(capacity) || capacity < 0) {
        return res.status(400).json({ 
          error: 'Invalid capacity',
          details: 'Capacity must be a non-negative integer' 
        });
      }
      updates.capacity = capacity;
    }

    if (isActive !== undefined) {
      if (typeof isActive !== 'boolean') {
        return res.status(400).json({ 
          error: 'Invalid isActive value',
          details: 'isActive must be a boolean' 
        });
      }
      updates.isActive = isActive;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ 
        error: 'No valid updates provided',
        details: 'Please provide capacity or isActive' 
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ 
        error: 'Product not found',
        details: `No product found with id: ${id}` 
      });
    }

    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ 
      error: 'Failed to update product',
      details: error.message 
    });
  }
});

module.exports = router;
