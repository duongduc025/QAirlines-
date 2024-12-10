import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    promotion_code: {
        type: String,
        required: true,
        unique: true
    },
    discount: {
        type: Number,
        required: true
    },
    expiration_date: {
        type: Date,
        required: true
    },
    condition: {
        type: String,
        required: true
    }
});

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion;
