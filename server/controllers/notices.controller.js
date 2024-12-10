import Notice from '../models/notices.js';
import Promotion from '../models/promotions.js';

export const createNotice = async (req, res) => {
    const { title, category, code } = req.body;

    try {
        let content, condition, label;

        if (category === 'promotion') {
            const promotion = await Promotion.findOne({ promotion_code: code });
            if (!promotion) {
                return res.status(404).json({ message: 'Promotion code not found' });
            }
            content = `${promotion.expiration_date} ${promotion.promotion_code}`;
            condition = promotion.condition;
            label = promotion.discount;
            posted_at = Date.now();
        } else if (category === 'introduction') {
            const introduction = await Introduction.findOne({ promotion_code: code });
            if (!introduction) {
                return res.status(404).json({ message: 'Introduction code not found' });
            }
            content = introduction.content;
            condition = introduction.condition;
            label = introduction.label;
            posted_at = Date.now();
        } else if (category === 'news') {
            const news = await News.findOne({ promotion_code: code });
            if (!news) {
                return res.status(404).json({ message: 'News code not found' });
            }
            content = news.content;
            condition = news.condition;
            label = news.label;
            posted_at = Date.now();
        } else {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const newNotice = new Notice({
            title,
            category,
            content,
            condition,
            label,
            posted_at: new Date()
        });

        await newNotice.save();

        res.status(201).json(newNotice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};