import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Booking from '../models/bookings.js';
import Flight from '../models/flights.js';

const register = async (req, res) => {
    const { email, fullname, phoneNumber, password } = req.body; 
    if (!email || !fullname || !phoneNumber || !password) {
        console.log("Missing required fields");
        return res.status(400).json("All fields are required");
    }
    console.log("Registering email:", email); 
    console.log("Request body:", req.body); 
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already registered");
            return res.status(400).json("Email already in use");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("Hashed password:", hashedPassword);
            const newUser = new User({ 
                email, 
                fullname, 
                phoneNumber, 
                password: hashedPassword 
            });
            await newUser.save();
            console.log("User registered successfully");
            res.status(201).json("Success");
        }
    } catch (err) {
        console.error("Error occurred during registration:", err); 
        res.status(500).json("Error occurred during registration");
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;   
    console.log("Login attempt for email:", email);
    // if(!email || !password) {
    //     return res.status (401).json({message: "All fields are required"});
    // };
    try {
        const user = await User.findOne({ email });
        console.log("User found:", user);
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match:", isMatch); // Log the result of password comparison
            if (isMatch) {
                const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log("Generated token:", token);
                console.log("JWT Secret for signing:", process.env.JWT_SECRET);
                console.log("Login successful");
                res.json({ token, success: true, user });
            } else {
                console.log("Incorrect password");
                res.status(400).json("The pass is incorrect");
            }
        } else {
            console.log("No record existed");
            res.status(404).json("No record existed");
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json("Error during login");
    }
};

const loginWithToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        console.log("Token is required");
        return res.status(400).json("Token is required");
    }

    try {
        console.log("Received token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);
        const user = await User.findOne({ email: decoded.email });
        if (user) {
            console.log("User found:", user);
            res.json({ success: true, user });
        } else {
            console.log("No user found with that email");
            res.status(404).json("No user found with that email");
        }
    } catch (err) {
        console.error("Error during token login:", err);
        res.status(500).json("Error during token login");
    }
};

const updateUser = async (req, res) => {
    const { _id } = req.params;
    const { newEmail, fullname, phoneNumber } = req.body;
    console.log("Updating user with _id:", _id);

    try {
        const user = await User.findByIdAndUpdate(
            _id,  // Find the user by _id
            { email: newEmail, fullname, phoneNumber },  // Update the information
            { new: true }  // Return the updated document
        );

        if (user) {
            console.log("User updated successfully:", user);
            res.json(user);
        } else {
            console.log("No user found with that _id");
            res.status(404).json("No user found with that _id");
        }
    } catch (err) {
        console.error("Error occurred during update:", err);
        res.status(500).json("Error occurred during update");
    }
};

const changePassword = async (req, res) => {
    const { email } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        return res.status(400).json("New password and confirm password do not match.");
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json("No user found with that email.");
        }

        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json("Current password is incorrect.");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        console.log("Password updated successfully for user:", user);
        res.json("Password updated successfully.");
    } catch (err) {
        console.error("Error occurred during password change:", err);
        res.status(500).json("Error occurred during password change.");
    }
};

//Test vui, sẽ xóa
const addUser = async (req, res) => {
    const { email, fullname, phoneNumber, password, role } = req.body;
    if (!email || !fullname || !phoneNumber || !password || !role) {
        console.log("Missing required fields");
        return res.status(400).json("All fields are required");
    }
    console.log("Adding user with email:", email);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists");
            return res.status(400).json("Email already in use");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ 
                email, 
                fullname, 
                phoneNumber, 
                password: hashedPassword, 
                role });
            await newUser.save();
            console.log("User added successfully");
            res.status(201).json("Success");
        }
    } catch (err) {
        console.error("Error occurred during user addition:", err);
        res.status(500).json("Error occurred during user addition");
    }
};

const logout = (req, res) => {
    // Invalidate the token or clear the session
    res.status(200).json("Logout successful");
};

//SẮP XẾP THÌ ĐỂ FRONTEND

// listAllUserBookingInPeriod
// Đầu vào mặc định period = "month"
// aggregate booking, flight, user 
// => Lấy ra hết theo user_id
// 1 user_id sẽ đi kèm theo 
// + tổng số lượng booking
// + tổng số lượng vé
// + tổng số lượng tiền
// if(period === "day"){
//     Lấy ra ngày hôm qua
// }
// else if(period === "week"){
//     Lấy ra tuần trước
// }
// else if(period === "month"){
//     Lấy ra tháng trước
// }
// else if(period === "quarter"){
//     Lấy ra của 3 tháng trước
// }
// else{
//     console.log("Invalid period");
//     return res.status(400).json("Invalid period");
// }

const listAllUserBookingInPeriod = async (req, res) => {
    const { period = "month" } = req.query;
    let startDate;

    switch (period) {
        case "day":
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 1);
            break;
        case "week":
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            break;
        case "month":
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case "quarter":
            startDate = new Date();
            startDate.setMonth(startDate.getMonth() - 3);
            break;
        default:
            console.log("Invalid period");
            return res.status(400).json("Invalid period");
    }

    try {
        const bookings = await Booking.aggregate([
            { $match: { booking_date: { $gte: startDate } } },
            {
                $group: {
                    _id: "$user_id",
                    totalBookings: { $sum: 1 },
                    totalTickets: { $sum: "$ticket_quantity" },
                    totalPrice: { $sum: "$total_price" }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $unwind: "$user" },
            {
                $project: {
                    _id: 0,
                    user_id: "$_id",
                    email: "$user.email",
                    fullname: "$user.fullname",
                    totalBookings: 1,
                    totalTickets: 1,
                    totalPrice: 1
                }
            }
        ]);

        res.json(bookings);
    } catch (err) {
        console.error("Error occurred during aggregation:", err);
        res.status(500).json("Error occurred during aggregation");
    }
};

//Tạo chart từ những thông số đã có về booking của các user_id

export { register, login, updateUser, changePassword, addUser, logout, loginWithToken, listAllUserBookingInPeriod };

