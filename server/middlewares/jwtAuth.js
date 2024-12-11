import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    //Lấy header từ yêu cầu HTTP
    //Tách chuỗi header
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("Thiếu hoặc không hợp lệ mã thông báo truy cập");
        return res.status(401).json({ message: 'Thiếu hoặc không hợp lệ mã thông báo truy cập' });
    }

    console.log("Mã thông báo nhận được:", token);
    console.log("Bí mật JWT để xác minh:", process.env.JWT_SECRET);
    //Secret key dùng để mã hóa/giải mã token. 
    //Phải khớp với secret đã sử dụng khi tạo token.
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Mã thông báo không hợp lệ:", err.message);
            return res.status(403).json({ message: 'Mã thông báo không hợp lệ' });
        }
        req.user = user;
        next();
    });
};

export { authenticateJWT };
