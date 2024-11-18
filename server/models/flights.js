const mongoose = require('mongoose');

const flightSchema = new mongoose.Schema({
  airplane_id: mongoose.Schema.Types.ObjectId,
  available_seats: Number,
  departure_location: String,
  destination_location: String,
  travel_time: Date,
  arrival_time: Date,
  flight_type: String,
});

module.exports = mongoose.model('Flight', flightSchema);
