import mongoose from 'mongoose';

const airplaneSchema = new mongoose.Schema({
  airplane_id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // Ensure this is ObjectId
  airplane_code: { type: String, required: true },
  model: { type: String, required: true },
  capacity: { type: Number, required: true },
  airline: { type: String, required: true },
  manufacture_date: { type: Date, required: true },
  last_maintenance_date: { type: Date, required: true }
});

export default mongoose.model('Airplane', airplaneSchema);
