const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  items: [{
    menuItem: { type: String, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String }
  }],
  tableNumber: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'completed', 'paid'], default: 'pending' },
  timestamp: { type: Date, default: Date.now },
  restaurantId: { type: String, required: true }
});

module.exports = mongoose.model('Order', OrderSchema);
