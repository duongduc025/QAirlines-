import mongoose from 'mongoose';

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    condition: {
        type: String,
        required: true
    },
    promotion_code: {
        type: String,
        required: false
    },
    posted_at: {
        type: Date,
        default: Date.now
    }
});

const Notice = mongoose.model('Notice', noticeSchema);

export default Notice;
