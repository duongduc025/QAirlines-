import Notice from '../models/notices.js';
import Promotion from '../models/promotions.js';
import News from '../models/news.js';
import Introduction from '../models/introductions.js';

export const createNotice = async (req, res) => {
    const { title, category, code } = req.body;
    const userId = req.user._id;

    try {
        let content = '';
        let condition = '';
        let label = '';

        if (category === 'promotion') {
            const promotion = await Promotion.findOne({ code });
            if (!promotion) {
                return res.status(404).json({ message: 'Promotion code not found' });
            }
            content = `${promotion.expiration_date} ${promotion.code}`;
            condition = promotion.condition;
            label = promotion.discount;
        } else if (category === 'news') {
            const news = await News.findOne({ code });
            if (!news) {
                return res.status(404).json({ message: 'News code not found' });
            }
            content = news.content;
        } else if (category === 'introduction') {
            const introduction = await Introduction.findOne({ code });
            if (!introduction) {
                return res.status(404).json({ message: 'Introduction code not found' });
            }
            content = introduction.content;
        } else {
            return res.status(400).json({ message: 'Invalid category' });
        }

        const newNotice = new Notice({
            title,
            category,
            content,
            condition,
            label,
            posted_at: new Date(),
            user: userId
        });

        await newNotice.save();

        res.status(201).json(newNotice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};
