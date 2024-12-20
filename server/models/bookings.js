import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  user_email: { type: String, required: true },
  flight_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Flight' }, 
  ticket_quantity: { type: Number, required: true },
  ticket_price: { type: Number, required: true },
  total_price: { type: Number, required: true },
  booking_date: { type: Date, required: true },
  booking_status: { type: String, enum: ['Đã đặt', 'Đã hủy'], required: true },
  passenger_ids: { type: [mongoose.Schema.Types.ObjectId], required: true, ref: 'Passenger' },
  updated_at: { type: Date, default: Date.now }
});

export default mongoose.model('Booking', bookingSchema);
