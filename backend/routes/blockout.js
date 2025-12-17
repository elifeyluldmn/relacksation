const express = require('express');
const router = express.Router();
const BlockedDate = require('../models/BlockedDate');
const Product = require('../models/Product');

// Middleware to check admin password (simple implementation)
const checkAdmin = (req, res, next) => {
  const adminPassword = req.headers['x-admin-password'];
  
  if (!adminPassword || adminPassword !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ 
      error: 'Unauthorized - Admin access required' 
    });
  }
  
  next();
};

// POST /api/blockout - Create new blocked date (owner only)
router.post('/blockout', checkAdmin, async (req, res) => {
  try {
    const { 
      date, 
      reason, 
      description, 
      isAllProductsBlocked, 
      products,
      blockedBy = 'owner'
    } = req.body;

    // Validate required fields
    if (!date || !reason) {
      return res.status(400).json({ 
        error: 'Date and reason are required' 
      });
    }

    // Validate reason enum
    const validReasons = ['maintenance', 'holiday', 'owner-block', 'weather', 'other'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ 
        error: 'Invalid reason value' 
      });
    }

    // Check if date is already blocked
    const existingBlock = await BlockedDate.findOne({
      date: new Date(date),
      isActive: true
    });

    if (existingBlock) {
      return res.status(409).json({ 
        error: 'Date is already blocked',
        existingBlock
      });
    }

    // Validate products if not blocking all
    let productIds = [];
    if (!isAllProductsBlocked && products && products.length > 0) {
      // Verify products exist
      const validProducts = await Product.find({
        _id: { $in: products },
        isActive: true
      });

      if (validProducts.length !== products.length) {
        return res.status(400).json({ 
          error: 'One or more products not found or inactive' 
        });
      }

      productIds = products;
    }

    // Create blocked date
    const blockedDate = new BlockedDate({
      date: new Date(date),
      reason,
      description: description || '',
      isAllProductsBlocked: isAllProductsBlocked !== false, // Default to true
      products: productIds,
      blockedBy,
      isActive: true
    });

    await blockedDate.save();

    // Populate product details for response
    if (productIds.length > 0) {
      await blockedDate.populate('products', 'name displayName');
    }

    res.status(201).json({
      success: true,
      message: 'Date blocked successfully',
      blockedDate
    });

  } catch (error) {
    console.error('Error creating blocked date:', error);
    res.status(500).json({ 
      error: 'Failed to block date',
      details: error.message 
    });
  }
});

// GET /api/blockout - Get all blocked dates (owner only)
router.get('/blockout', checkAdmin, async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      reason, 
      isActive = true,
      page = 1,
      limit = 50
    } = req.query;

    // Build filter object
    const filter = { isActive: isActive === 'true' };
    
    if (startDate && endDate) {
      filter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    if (reason) {
      filter.reason = reason;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get total count for pagination
    const totalBlockedDates = await BlockedDate.countDocuments(filter);
    
    // Get blocked dates with pagination
    const blockedDates = await BlockedDate.find(filter)
      .populate('products', 'name displayName category')
      .sort({ date: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Calculate pagination info
    const totalPages = Math.ceil(totalBlockedDates / parseInt(limit));
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      blockedDates,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalBlockedDates,
        hasNextPage,
        hasPrevPage,
        limit: parseInt(limit)
      }
    });

  } catch (error) {
    console.error('Error getting blocked dates:', error);
    res.status(500).json({ 
      error: 'Failed to get blocked dates',
      details: error.message 
    });
  }
});

// GET /api/blockout/:id - Get specific blocked date (owner only)
router.get('/blockout/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const blockedDate = await BlockedDate.findById(id)
      .populate('products', 'name displayName category');

    if (!blockedDate) {
      return res.status(404).json({ 
        error: 'Blocked date not found' 
      });
    }

    res.json(blockedDate);

  } catch (error) {
    console.error('Error getting blocked date:', error);
    res.status(500).json({ 
      error: 'Failed to get blocked date',
      details: error.message 
    });
  }
});

// PUT /api/blockout/:id - Update blocked date (owner only)
router.put('/blockout/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      reason, 
      description, 
      isAllProductsBlocked, 
      products,
      isActive 
    } = req.body;

    // Validate reason if provided
    if (reason) {
      const validReasons = ['maintenance', 'holiday', 'owner-block', 'weather', 'other'];
      if (!validReasons.includes(reason)) {
        return res.status(400).json({ 
          error: 'Invalid reason value' 
        });
      }
    }

    // Build update object
    const updateData = {};
    if (reason !== undefined) updateData.reason = reason;
    if (description !== undefined) updateData.description = description;
    if (isAllProductsBlocked !== undefined) updateData.isAllProductsBlocked = isAllProductsBlocked;
    if (isActive !== undefined) updateData.isActive = isActive;

    // Handle products array
    if (products !== undefined) {
      if (isAllProductsBlocked) {
        updateData.products = [];
      } else if (Array.isArray(products)) {
        // Verify products exist
        const validProducts = await Product.find({
          _id: { $in: products },
          isActive: true
        });

        if (validProducts.length !== products.length) {
          return res.status(400).json({ 
            error: 'One or more products not found or inactive' 
          });
        }

        updateData.products = products;
      }
    }

    const blockedDate = await BlockedDate.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).populate('products', 'name displayName category');

    if (!blockedDate) {
      return res.status(404).json({ 
        error: 'Blocked date not found' 
      });
    }

    res.json({
      success: true,
      message: 'Blocked date updated successfully',
      blockedDate
    });

  } catch (error) {
    console.error('Error updating blocked date:', error);
    res.status(500).json({ 
      error: 'Failed to update blocked date',
      details: error.message 
    });
  }
});

// DELETE /api/blockout/:id - Delete blocked date (owner only)
router.delete('/blockout/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const blockedDate = await BlockedDate.findByIdAndUpdate(
      id,
      { 
        isActive: false,
        deletedAt: new Date()
      },
      { new: true }
    );

    if (!blockedDate) {
      return res.status(404).json({ 
        error: 'Blocked date not found' 
      });
    }

    res.json({
      success: true,
      message: 'Blocked date removed successfully',
      blockedDate
    });

  } catch (error) {
    console.error('Error removing blocked date:', error);
    res.status(500).json({ 
      error: 'Failed to remove blocked date',
      details: error.message 
    });
  }
});

// POST /api/blockout/bulk - Bulk create blocked dates (owner only)
router.post('/blockout/bulk', checkAdmin, async (req, res) => {
  try {
    const { dates, reason, description, isAllProductsBlocked, products } = req.body;

    if (!dates || !Array.isArray(dates) || dates.length === 0) {
      return res.status(400).json({ 
        error: 'Dates array is required and must not be empty' 
      });
    }

    if (!reason) {
      return res.status(400).json({ 
        error: 'Reason is required' 
      });
    }

    // Validate reason
    const validReasons = ['maintenance', 'holiday', 'owner-block', 'weather', 'other'];
    if (!validReasons.includes(reason)) {
      return res.status(400).json({ 
        error: 'Invalid reason value' 
      });
    }

    // Check for existing blocks
    const existingBlocks = await BlockedDate.find({
      date: { $in: dates.map(d => new Date(d)) },
      isActive: true
    });

    if (existingBlocks.length > 0) {
      return res.status(409).json({ 
        error: 'Some dates are already blocked',
        existingBlocks: existingBlocks.map(b => b.date)
      });
    }

    // Create blocked dates
    const blockedDates = dates.map(date => ({
      date: new Date(date),
      reason,
      description: description || '',
      isAllProductsBlocked: isAllProductsBlocked !== false,
      products: isAllProductsBlocked ? [] : (products || []),
      blockedBy: 'owner',
      isActive: true
    }));

    const createdBlockedDates = await BlockedDate.insertMany(blockedDates);

    res.status(201).json({
      success: true,
      message: `${createdBlockedDates.length} dates blocked successfully`,
      blockedDates: createdBlockedDates
    });

  } catch (error) {
    console.error('Error creating bulk blocked dates:', error);
    res.status(500).json({ 
      error: 'Failed to create bulk blocked dates',
      details: error.message 
    });
  }
});

// GET /api/blockout/stats/summary - Get blocked date statistics (owner only)
router.get('/blockout/stats/summary', checkAdmin, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate && endDate) {
      dateFilter.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    // Get total blocked dates
    const totalBlockedDates = await BlockedDate.countDocuments({
      ...dateFilter,
      isActive: true
    });

    // Get blocked dates by reason
    const blockedByReason = await BlockedDate.aggregate([
      { $match: { ...dateFilter, isActive: true } },
      {
        $group: {
          _id: '$reason',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Get blocked dates by month
    const blockedByMonth = await BlockedDate.aggregate([
      { $match: { ...dateFilter, isActive: true } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Get product-specific blocks
    const productSpecificBlocks = await BlockedDate.aggregate([
      { 
        $match: { 
          ...dateFilter, 
          isActive: true, 
          isAllProductsBlocked: false 
        } 
      },
      { $unwind: '$products' },
      {
        $group: {
          _id: '$products',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'productInfo'
        }
      },
      {
        $project: {
          productName: { $arrayElemAt: ['$productInfo.displayName', 0] },
          count: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    const stats = {
      overview: {
        totalBlockedDates,
        totalBlockedDates: totalBlockedDates
      },
      blockedByReason,
      blockedByMonth,
      productSpecificBlocks
    };

    res.json(stats);

  } catch (error) {
    console.error('Error getting blocked date stats:', error);
    res.status(500).json({ 
      error: 'Failed to get blocked date statistics',
      details: error.message 
    });
  }
});

module.exports = router;
