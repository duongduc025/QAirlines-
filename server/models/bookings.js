const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user_id: mongoose.Schema.Types.ObjectId,
  flight_id: mongoose.Schema.Types.ObjectId,
  seat_class: String,
  ticket_price: Number,
  booking_date: Date,
  status: String,
});

module.exports = mongoose.model('Booking', bookingSchema);
