const mongoose = require('mongoose');

const promotionSchema = new mongoose.Schema({
  promo_code: String,
  discount_rate: Number,
  expiry_date: Date,
});

module.exports = mongoose.model('Promotion', promotionSchema);
