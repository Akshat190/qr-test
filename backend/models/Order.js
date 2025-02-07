const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [{
    menuItem: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String, required: true }
  }],
  tableNumber: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'paid'], default: 'pending' },
  timestamp: { type: Date, default: Date.now },
  restaurantId: { type: String, required: true }
});

// Add a pre-save middleware to ensure image URLs are properly formatted
OrderSchema.pre('save', function(next) {
  this.items = this.items.map(item => ({
    ...item,
    image: item.image || '/placeholder-food.png' // Provide default image if none exists
  }));
  next();
});

module.exports = mongoose.model('Order', OrderSchema);
