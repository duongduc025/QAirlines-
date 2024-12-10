import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    posted_at: { type: Date, default: Date.now }
});

export default mongoose.model('News', newsSchema);