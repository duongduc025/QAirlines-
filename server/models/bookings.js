import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  flight_id: { type: mongoose.Schema.Types.ObjectId, required: true },
  seat_class: { type: String, required: true },
  ticket_price: { type: Number, required: true, min: 0 },
  booking_date: { type: Date, default: Date.now },
  status: { type: String, required: true, enum: ['confirmed', 'pending', 'cancelled'], default: 'pending' },
  ticket_quantity: { type: Number, required: true, min: 1 },
});

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
