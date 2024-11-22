import mongoose from 'mongoose'; 

const flightSchema = new mongoose.Schema({
  airplane_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  departure_location: {
    type: String,
    required: true
  },
  destination_location: {
    type: String,
    required: true
  },
  travel_time: {
    type: Date,
    required: true
  },
  arrival_time: {
    type: Date,
    required: true
  },
  normal_seats: {
    type: Number,
    required: true,
    min: 0
  },
  economy_seats: {
    type: Number,
    required: true,
    min: 0
  },
  normal_ticket_price: {
    type: Number,
    required: true,
    min: 0
  },
  economy_ticket_price: {
    type: Number,
    required: true,
    min: 0
  }
});

const FlightModel = mongoose.model('Flight', flightSchema);

export default FlightModel;
