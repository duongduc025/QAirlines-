import mongoose from 'mongoose'; 

const flightSchema = new mongoose.Schema({
  airplane_id: mongoose.Schema.Types.ObjectId,
  available_seats: Number,
  departure_location: String,
  destination_location: String,
  travel_time: Date,
  arrival_time: Date,
  flight_type: String,
  ticket_price: Number,
});

const FlightModel = mongoose.model('Flight', flightSchema);
//Flight là tên collection

export default FlightModel;
