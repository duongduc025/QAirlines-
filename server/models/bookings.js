import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  booking_id: { type: String, required: true },
  user_email: { type: String, required: true },
  flight_id: { type: [String], required: true },
  ticket_class: { type: String, required: true },
  ticket_quantity: { type: Number, required: true },
  ticket_price: { type: Number, required: true },
  total_price: { type: Number, required: true },
  booking_date: { type: Date, required: true },
  booking_status: { type: String, enum: ['Đã đặt', 'đã hủy'], required: true },
  passenger_ids: { type: [String], required: true },
  status: { type: String, enum: ['confirmed', 'pending', 'cancelled'], required: true }
});

export default mongoose.model('Booking', bookingSchema);
