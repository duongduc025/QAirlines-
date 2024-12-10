import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    discount: { type: Number, required: true },
    expiration_date: { type: Date, required: true },
    condition: { type: String, required: true }
});

export default mongoose.model('Promotion', promotionSchema);