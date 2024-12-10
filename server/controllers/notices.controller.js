import Notice from '../models/notices.js';
import Promotion from '../models/promotions.js';

export const createNotice = async (req, res) => {
    const { title, category, code } = req.body;

    // if (category === 'promotion') {
    //     const promotion = await Promotion.findOne({ promotion_code: code})
    // else if (category === 'combo') {
    // const combo = await Combo.findOne({ combo_code: code})
    
    try {
        const promotion = await Promotion.findOne({ promotion_code: code });

        if (!promotion) {
            return res.status(404).json({ message: 'Promotion code not found' });
        }

        const newNotice = new Notice({
            title,
            category,
            content: `${promotion.expiration_date} ${promotion.promotion_code}`,
            condition: promotion.condition,
            label: promotion.discount,
            posted_at: new Date()
        });

        await newNotice.save();

        res.status(201).json(newNotice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
//if category === promotion => const promotion = await Promotion.findOne({ promotion_code });
//if category === combo => const combo = await Combo.findOne({ combo_code });
//if category === news
// 3 cái if else rồi xử lý từng cái riêng