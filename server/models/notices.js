import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
    category: { type: String, required: true },
    content: { type: String, required: true },
    label: { type: String, required: true },
    condition: { type: String, required: false },
    code: { type: String, required: false },
    posted_at: { type: Date, default: Date.now }
});

export default mongoose.model('Notice', noticeSchema);