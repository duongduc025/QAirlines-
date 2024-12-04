import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flight_id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  flight_code: { type: String, required: true },
  airplane_code: { type: String, required: true},
  ticket_price: { type: Number, required: true },
  departure_location: { type: String, required: true },
  destination: { type: String, required: true },
  travel_time: { type: Number, required: true },
  arrival_time: { type: Date, required: true },
  departure_time: { type: Date, required: true },
  estimated_arrival: { type: Date, required: true },
  economy_seats: { type: Number, required: true },
  economy_price: { type: Number, required: true },
});

export default mongoose.model('Flight', flightSchema);
