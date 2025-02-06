const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const mongoose = require('mongoose');

// Get menu items for a specific restaurant
router.get('/:restaurantId/menu', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    
    // Find the restaurant first to get the name
    const restaurant = await Restaurant.findOne({ owner: restaurantId });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const menuItems = await MenuItem.find({ restaurantId })
      .select('-__v')
      .lean()
      .then(items => items.map(item => ({
        ...item,
        id: item._id.toString()
      })));

    res.json({
      menuItems,
      restaurantName: restaurant.name
    });
  } catch (error) {
    console.error('Error fetching restaurant menu:', error);
    res.status(500).json({ message: 'Error fetching restaurant menu' });
  }
});

// Validate restaurant access
router.get('/:restaurantId/validate', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const restaurant = await User.findOne({ 
      _id: restaurantId,
      role: 'owner'
    });

    if (!restaurant) {
      return res.status(404).json({ 
        message: 'Restaurant not found',
        isValid: false 
      });
    }

    res.json({
      isValid: true,
      restaurantName: restaurant.restaurantName
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error validating restaurant access',
      isValid: false 
    });
  }
});

// Get restaurant revenue
router.get('/revenue', authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.userId });
    
    if (!restaurant) {
      // If no restaurant found, create one with initial revenue
      const newRestaurant = await Restaurant.create({
        owner: req.userId,
        revenue: 0,
        lastRevenueReset: new Date()
      });
      
      return res.json({
        revenue: newRestaurant.revenue,
        lastReset: newRestaurant.lastRevenueReset
      });
    }
    
    res.json({
      revenue: restaurant.revenue,
      lastReset: restaurant.lastRevenueReset
    });
  } catch (error) {
    console.error('Error fetching revenue:', error);
    res.status(500).json({ message: 'Error fetching revenue' });
  }
});

// Reset restaurant revenue
router.post('/reset-revenue', authMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOneAndUpdate(
      { owner: req.userId },
      { 
        $set: { 
          revenue: 0,
          lastRevenueReset: new Date()
        }
      },
      { new: true, upsert: true }
    );
    
    res.json({ 
      message: 'Revenue reset successfully',
      revenue: 0,
      lastReset: restaurant.lastRevenueReset
    });
  } catch (error) {
    console.error('Error resetting revenue:', error);
    res.status(500).json({ message: 'Error resetting revenue' });
  }
});

module.exports = router; 