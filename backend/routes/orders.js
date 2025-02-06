const express = require('express');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');
const XLSX = require('xlsx');
const Restaurant = require('../models/Restaurant');
const mongoose = require('mongoose');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { items, tableNumber, totalPrice, restaurantId } = req.body;
    
    // Validate input
    if (!items || !Array.isArray(items) || items.length === 0 || !tableNumber || !totalPrice || !restaurantId) {
      return res.status(400).json({ message: 'Invalid order data' });
    }

    // Ensure each item has the required fields
    const validatedItems = items.map(item => ({
      menuItem: item.menuItem,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image
    }));

    const order = new Order({ 
      items: validatedItems, 
      tableNumber, 
      totalPrice,
      restaurantId 
    });
    
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Error creating order', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find().populate('items.menuItem');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

router.patch('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error updating order' });
  }
});

router.get('/active', authMiddleware, async (req, res) => {
  try {
    const activeOrders = await Order.find({ 
      status: 'pending',
      restaurantId: req.userId 
    })
      .sort({ timestamp: -1 })
      .lean();
    res.json(activeOrders);
  } catch (error) {
    console.error('Error fetching active orders:', error);
    res.status(500).json({ message: 'Error fetching active orders' });
  }
});

// Separate route for monthly orders
router.get('/monthly', authMiddleware, async (req, res) => {
  try {
    const { month, year } = req.query;
    const startDate = new Date(parseInt(year), parseInt(month), 1);
    const endDate = new Date(parseInt(year), parseInt(month) + 1, 0);
    
    const orders = await Order.find({
      timestamp: { 
        $gte: startDate,
        $lte: endDate
      },
      restaurantId: req.userId
    }).lean();

    // Format orders for Excel with specific fields and order
    const formattedOrders = orders.map(order => ({
      'Date': new Date(order.timestamp).toLocaleDateString(),
      'Time': new Date(order.timestamp).toLocaleTimeString(),
      'Table Number': order.tableNumber,
      'Total Amount': `$${order.totalPrice.toFixed(2)}`,
      'Items': order.items.map(item => 
        `${item.name} (x${item.quantity})`
      ).join(', '),
      'Status': order.status.charAt(0).toUpperCase() + order.status.slice(1)
    }));

    // Set column widths for better readability
    const wscols = [
      { wch: 12 }, // Date
      { wch: 10 }, // Time
      { wch: 8 },  // Table
      { wch: 12 }, // Total Amount
      { wch: 50 }, // Items
      { wch: 10 }  // Status
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedOrders);
    ws['!cols'] = wscols;

    XLSX.utils.book_append_sheet(wb, ws, 'Orders');

    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=orders-${month}-${year}.xlsx`);
    
    res.send(buffer);
  } catch (error) {
    console.error('Error generating monthly report:', error);
    res.status(500).json({ message: 'Error generating monthly report' });
  }
});

// Regular order by ID route
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Error fetching order', error: error.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

router.get('/completed', authMiddleware, async (req, res) => {
  try {
    const currentDate = new Date();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    
    const completedOrders = await Order.find({ 
      status: 'completed',
      restaurantId: req.userId,
      timestamp: { $gte: firstDayOfMonth }
    }).lean();
    
    res.json(completedOrders);
  } catch (error) {
    console.error('Error fetching completed orders:', error);
    res.status(500).json({ message: 'Error fetching completed orders' });
  }
});

router.patch('/:id/mark-paid', authMiddleware, async (req, res) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const order = await Order.findById(req.params.id).session(session);
      if (!order) {
        throw new Error('Order not found');
      }

      // Update order status
      order.status = 'paid';
      await order.save({ session });

      // Update restaurant revenue atomically
      const restaurant = await Restaurant.findOneAndUpdate(
        { owner: req.userId },
        { 
          $inc: { revenue: order.totalPrice },
          $push: { orders: order._id }
        },
        { 
          new: true,
          session,
          upsert: true,
          setDefaultsOnInsert: true
        }
      );

      await session.commitTransaction();
      res.json({ 
        message: 'Order marked as paid', 
        order,
        revenue: restaurant.revenue 
      });
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Error updating order: ' + error.message });
  }
});

// Update order status endpoint
router.patch('/:orderId/status', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update order status and save
    order.status = status;
    if (status === 'completed') {
      // Update restaurant revenue when order is completed
      const restaurant = await Restaurant.findOne({ owner: req.userId });
      if (restaurant) {
        restaurant.revenue += order.totalPrice;
        await restaurant.save();
      }
    }
    await order.save();

    res.json({ message: 'Order status updated', order });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ message: 'Error updating order status' });
  }
});

module.exports = router;
