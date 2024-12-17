import mongoose from 'mongoose';

const passengerSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  gender: { type: String, required: true },
  date_of_birth: { type: Date, required: true },
  id_number: { type: String, required: true },
  flight_id: { type: String, required: true }
});

export default mongoose.model('Passenger', passengerSchema);
