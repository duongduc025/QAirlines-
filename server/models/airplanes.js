const mongoose = require('mongoose');

const airplaneSchema = new mongoose.Schema({
  model: String,
  capacity: Number,
  airline: String,
  manufacturing_date: Date,
  last_maintenance_date: Date,
});

module.exports = mongoose.model('Airplane', airplaneSchema);
