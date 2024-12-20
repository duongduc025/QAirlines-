import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Booking from '../models/bookings.js';
import Flight from '../models/flights.js';
import mongoose from 'mongoose';
import DelayNotice from '../models/delayNotices.js';

// Hàm đăng ký người dùng mới
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

// Hàm đăng nhập người dùng
const login = async (req, res) => {
    const { email, password } = req.body;   
    console.log("Login attempt for email:", email);

    try {
        const user = await User.findOne({ email });
        console.log("User found:", user);
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Password match:", isMatch); // Log the result of password comparison
            if (isMatch) {
                const token = jwt.sign({ _id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
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

// Hàm đăng nhập bằng token
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
        const user = await User.findOne({ _id: decoded._id });
        if (user) {
            console.log("User found:", user);
            res.json({ success: true, user });
        } else {
            console.log("No user found with that id");
            res.status(404).json("No user found with that id");
        }
    } catch (err) {
        console.error("Error during token login:", err);
        res.status(500).json("Error during token login");
    }
};

// Hàm cập nhật thông tin người dùng
const updateUser = async (req, res) => {
    const { _id } = req.params;
    const { newEmail, fullname, phoneNumber } = req.body;
    console.log("Updating user with _id:", _id);

    try {
        const user = await User.findByIdAndUpdate(
            _id,  
            { email: newEmail, fullname, phoneNumber },  
            { new: true } 
        );

        if (user) {
            console.log("User updated successfully:", user);

            // Update email in related bookings
            await Booking.updateMany(
                { user_id: _id },
                { user_email: newEmail }
            );

            console.log("User email updated in related bookings");

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

// Hàm thay đổi mật khẩu người dùng
const changePassword = async (req, res) => {
    const { _id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    console.log("Changing password for user with _id:", _id);
    if (newPassword !== confirmPassword) {
        return res.status(400).json("New password and confirm password do not match.");
    }

    try {
        const user = await User.findOne({ _id });
        if (!user) {
            return res.status(404).json("No user found with that id.");
        }
        console.log("Changing password for user:", user);
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

// Hàm thêm người dùng mới (test)
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

// Hàm đăng xuất người dùng
const logout = (req, res) => {
    // Invalidate the token or clear the session
    res.status(200).json("Logout successful");
};

// Hàm liệt kê tất cả các booking của người dùng trong một khoảng thời gian
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

// Hàm lấy thông báo trễ chuyến của người dùng
const getDelayNotices = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('delayNotices');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const delayNotices = [];
        for (const noticeId of user.delayNotices) {
            const notice = await DelayNotice.findById(noticeId).populate('flightId');
            if (notice) {
                const booking = await Booking.findOne({ flight_id: notice.flightId._id, user_id: userId });

                delayNotices.push({
                    ...notice.toObject(),
                    flightDetails: notice.flightId,
                    bookingDetails: booking
                });
            }
        }

        res.json(delayNotices);
    } catch (error) {
        console.error('Error fetching delay notices:', error);
        res.status(500).json({ message: error.message });
    }
};

// Hàm cập nhật thông báo trễ chuyến của người dùng
const updateDelayNotices = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId).populate('delayNotices');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        for (const noticeId of user.delayNotices) {
            const notice = await DelayNotice.findById(noticeId);
            if (notice) {
                notice.status = 'Đã xem';
                await notice.save();
            }
        }

        res.json({ message: "All delay notices updated to 'Đã xem'" });
    } catch (error) {
        console.error('Error updating delay notices:', error);
        res.status(500).json({ message: error.message });
    }
};


export { register, login, updateUser, changePassword, addUser, logout, loginWithToken, listAllUserBookingInPeriod, getDelayNotices, updateDelayNotices };

