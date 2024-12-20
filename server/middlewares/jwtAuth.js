import jwt from 'jsonwebtoken';

// Hàm xác thực JWT
const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    // Lấy header từ yêu cầu HTTP
    // Tách chuỗi header
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("Access token is missing or invalid");
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    console.log("Token received:", token);
    console.log("JWT Secret for verification:", process.env.JWT_SECRET);
    // Secret key dùng để mã hóa/giải mã token. 
    // Phải khớp với secret đã sử dụng khi tạo token.
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.log("Invalid token:", err.message);
            return res.status(403).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    });
};

export { authenticateJWT };
