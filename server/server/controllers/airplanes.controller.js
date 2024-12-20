import Airplane from '../models/airplanes.js';

// Hàm thêm máy bay mới
export const addPlane = async (req, res) => {
    try {
        const { airplane_code, model, capacity, manufacture_date} = req.body;
        const existingPlane = await Airplane.findOne({ airplane_code });
        if (existingPlane) {
            return res.status(400).json({ message: 'Airplane already exists' });
        }
        const newPlane = new Airplane({
            airplane_code,
            model,
            capacity,
            manufacture_date
        });
        await newPlane.save();
        res.status(201).json(newPlane);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Hàm xóa máy bay theo ID
export const deletePlane = async (req, res) => {
    try {
        const { id } = req.params;
        await Airplane.findByIdAndDelete(id);
        res.status(200).json({ message: 'Airplane deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Hàm hiển thị tất cả các máy bay
export const showAllAirplanes = async (req, res) => {
    try {
        const airplanes = await Airplane.find();
        res.status(200).json(airplanes);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
