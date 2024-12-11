import Notice from '../models/notices.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export const createNotice = async (req, res) => {
    const { title, category, brief, mark, content } = req.body;
    const userId = req.user._id;
    const file = req.file;

    try {
        let imageUrl = '';

        if (file) {
            const result = await cloudinary.v2.uploader.upload(file.path);
            imageUrl = result.secure_url;
        }

        const newNotice = new Notice({
            title,
            category,
            brief,
            mark,
            content,
            image: imageUrl,
            posted_at: new Date(),
            user: userId
        });

        await newNotice.save();

        res.status(201).json(newNotice);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getImageByNoticeId = async (req, res) => {
    const { id } = req.params;

    try {
        const notice = await Notice.findById(id);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found' });
        }

        res.status(200).json({ image: notice.image });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};