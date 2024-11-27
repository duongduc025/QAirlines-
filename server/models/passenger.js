import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  passenger_id: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  nationality: { type: String, required: true },
  id_number: { type: String, required: true },
  flight_id: { type: String, required: true }
});

export default mongoose.model('Passenger', passengerSchema);
