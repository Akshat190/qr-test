const express = require('express');
const MenuItem = require('../models/MenuItem');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.userId });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const newMenuItem = new MenuItem({
      ...req.body,
      restaurantId: req.userId
    });
    const savedMenuItem = await newMenuItem.save();
    res.status(201).json(savedMenuItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const result = await MenuItem.findOneAndDelete({ id });
    if (!result) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting menu item:', error);
    res.status(500).json({ message: 'Error deleting menu item' });
  }
});

// Public route for customers viewing a specific restaurant's menu
router.get('/:restaurantId', async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const menuItems = await MenuItem.find({ restaurantId });
    const menuItemsWithId = menuItems.map(item => ({
      ...item.toObject(),
      restaurantId
    }));
    
    res.json({
      menuItems: menuItemsWithId,
      restaurantName: 'Restaurant Name'
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

module.exports = router;
