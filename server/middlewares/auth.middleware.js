export const isAdmin = (req, res, next) => {
    const user = req.user; // Giả sử thông tin người dùng được lưu trong req.user
    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Truy cập bị từ chối. Chỉ dành cho admin.' });
    }
};

export const isCustomer = (req, res, next) => {
    const user = req.user; // Giả sử thông tin người dùng được lưu trong req.user
    if (user && user.role === 'customer') {
        next();
    } else {
        res.status(403).json({ message: 'Truy cập bị từ chối. Chỉ dành cho khách hàng.' });
    }
};