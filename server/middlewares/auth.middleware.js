// Hàm kiểm tra quyền admin
export const isAdmin = (req, res, next) => {
    const user = req.user; 
    if (user && user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Truy cập bị từ chối. Chỉ dành cho admin.' });
    }
};

// Hàm kiểm tra quyền khách hàng
export const isCustomer = (req, res, next) => {
    const user = req.user; 
    if (user && user.role === 'user') {
        next();
    } else {
        res.status(403).json({ message: 'Truy cập bị từ chối. Chỉ dành cho khách hàng.' });
    }
};