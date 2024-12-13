import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { 
        type: String, 
        required: true,
        enum: ['Khuyến mãi', 'Giới thiệu', 'Tin tức', 'Thông báo']
    },
    brief: { type: String, required: true },
    mark: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    posted_at: { type: Date, default: Date.now }
});

export default mongoose.model('Promotion', promotionSchema);