import Promotion from '../models/promotions.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createPromotion = async (req, res) => {
    const { title, category, brief, mark, content } = req.body;
    const userId = req.user._id;
    const file = req.file;

    try {
        let imageUrl = '';

        if (file) {
            const result = await cloudinary.v2.uploader.upload(file.path);
            imageUrl = result.secure_url;
        }

        const newPromotion = new Promotion({
            title,
            category,
            brief,
            mark,
            content,
            image: imageUrl,
            posted_at: new Date(),
            user: userId
        });

        await newPromotion.save();

        res.status(201).json(newPromotion);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getImageByPromotionId = async (req, res) => {
    const { id } = req.params;

    try {
        const promotion = await Promotion.findById(id);
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        res.status(200).json({ image: promotion.image });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const deletePromotionById = async (req, res) => {
    const { id } = req.params;

    try {
        const promotion = await Promotion.findByIdAndDelete(id);
        if (!promotion) {
            return res.status(404).json({ message: 'Promotion not found' });
        }

        res.status(200).json({ message: 'Promotion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};