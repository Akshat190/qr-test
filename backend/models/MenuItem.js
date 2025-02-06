const mongoose = require('mongoose');

const MenuItemSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  estimatedTime: { type: Number, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  restaurantId: { type: String, required: true }
});

module.exports = mongoose.model('MenuItem', MenuItemSchema);
