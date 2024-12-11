import Promotion from '../models/promotions.js';

export const createPromotion = async (req, res) => {
    const { promotion_code, discount, expiration_date, condition } = req.body;
    const newPromotion = new Promotion({ promotion_code, discount, expiration_date, condition });

    try {
        await newPromotion.save();
        res.status(201).json(newPromotion);
    } catch (error) {
        if (error.code === 11000) { // Mã lỗi khóa trùng
            res.status(400).json({ message: 'Mã khuyến mãi phải là duy nhất' });
        } else {
            res.status(400).json({ message: error.message });
        }
    }
};