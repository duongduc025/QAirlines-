import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    promotion_code: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    posted_at: {
        type: Date,
        default: Date.now
    }
});

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion;
