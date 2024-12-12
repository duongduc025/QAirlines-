import mongoose from 'mongoose';

const airplaneSchema = new mongoose.Schema({
  airplane_code: { type: String, required: true },
  model: { type: String, required: true },
  capacity: { type: Number, required: true },
  manufacture_date: { type: Date, required: true }
});

export default mongoose.model('Airplane', airplaneSchema);
