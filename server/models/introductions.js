import mongoose from 'mongoose';

const introductionSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    posted_at: { type: Date, default: Date.now }
});

export default mongoose.model('Introduction', introductionSchema);