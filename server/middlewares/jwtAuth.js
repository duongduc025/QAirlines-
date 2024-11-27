import jwt from 'jsonwebtoken';

const authenticateJWT = (req, res, next) => {
    const authHeader = req.header('Authorization');
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("Access token is missing or invalid");
        return res.status(401).json({ message: 'Access token is missing or invalid' });
    }

    console.log("Token received:", token);
    console.log("JWT Secret for verification:", process.env.JWT_SECRET);

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
