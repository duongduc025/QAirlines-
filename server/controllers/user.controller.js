import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Booking from '../models/bookings.js';
import Flight from '../models/flights.js';
import path from 'path';
import fs from 'fs';

const register = async (req, res) => {
    const { email, fullname, phoneNumber, password } = req.body; 
    const avatarPath = req.file ? req.file.path : null; // Get the uploaded file path

    if (!email || !fullname || !phoneNumber || !password) {
        console.log("Vui lòng nhập đầy đủ thông tin");
        return res.status(400).json("Vui lòng điền đầy đủ các trường");
    }
    console.log("Đang đăng ký email:", email); 
    console.log("Nội dung yêu cầu:", req.body); 
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Người dùng đã được đăng ký");
            return res.status(400).json("Email đã được sử dụng");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            console.log("Mật khẩu đã mã hóa:", hashedPassword);
            const newUser = new User({ 
                email, 
                fullname, 
                phoneNumber, 
                password: hashedPassword,
                avatar: avatarPath // Save the avatar path to the user profile
            });
            await newUser.save();
            console.log("Đăng ký người dùng thành công");
            res.status(201).json("Đăng ký thành công");
        }
    } catch (err) {
        console.error("Đã xảy ra lỗi trong quá trình đăng ký:", err); 
        res.status(500).json("Đã xảy ra lỗi trong quá trình đăng ký");
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;   
    console.log("Đang thử đăng nhập với email:", email);
    try {
        const user = await User.findOne({ email });
        console.log("Người dùng được tìm thấy:", user);
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            console.log("Mật khẩu khớp:", isMatch);
            if (isMatch) {
                const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log("Đã tạo token:", token);
                console.log("Khóa JWT được sử dụng để ký:", process.env.JWT_SECRET);
                console.log("Đăng nhập thành công");
                res.json({ token, success: true, user });
            } else {
                console.log("Mật khẩu không chính xác");
                res.status(400).json("Mật khẩu không chính xác");
            }
        } else {
            console.log("Không tìm thấy bản ghi");
            res.status(404).json("Không tìm thấy tài khoản");
        }
    } catch (err) {
        console.error("Lỗi trong quá trình đăng nhập:", err);
        res.status(500).json("Đã xảy ra lỗi trong quá trình đăng nhập");
    }
};

const loginWithToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        console.log("Yêu cầu token");
        return res.status(400).json("Yêu cầu token");
    }

    try {
        console.log("Đã nhận token:", token);
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Token đã giải mã:", decoded);
        const user = await User.findOne({ email: decoded.email });
        if (user) {
            console.log("Người dùng được tìm thấy:", user);
            res.json({ success: true, user });
        } else {
            console.log("Không tìm thấy người dùng với email đó");
            res.status(404).json("Không tìm thấy người dùng với email này");
        }
    } catch (err) {
        console.error("Lỗi trong quá trình đăng nhập bằng token:", err);
        res.status(500).json("Đã xảy ra lỗi trong quá trình đăng nhập bằng token");
    }
};

const updateUser = async (req, res) => {
    const { _id } = req.params;
    const { newEmail, fullname, phoneNumber } = req.body;
    console.log("Đang cập nhật người dùng với _id:", _id);

    try {
        const user = await User.findByIdAndUpdate(
            _id,
            { email: newEmail, fullname, phoneNumber },
            { new: true }
        );

        if (user) {
            console.log("Cập nhật người dùng thành công:", user);
            res.json(user);
        } else {
            console.log("Không tìm thấy người dùng với _id này");
            res.status(404).json("Không tìm thấy người dùng với _id này");
        }
    } catch (err) {
        console.error("Đã xảy ra lỗi trong quá trình cập nhật:", err);
        res.status(500).json("Đã xảy ra lỗi trong quá trình cập nhật");
    }
};

const changePassword = async (req, res) => {
    const { _id } = req.params;
    const { currentPassword, newPassword, confirmPassword } = req.body;
    console.log("Đang thay đổi mật khẩu cho người dùng với _id:", _id);
    if (newPassword !== confirmPassword) {
        return res.status(400).json("Mật khẩu mới và xác nhận mật khẩu không khớp.");
    }

    try {
        const user = await User.findOne({ _id });
        if (!user) {
            return res.status(404).json("Không tìm thấy người dùng với id này.");
        }
        console.log("Đang thay đổi mật khẩu cho người dùng:", user);
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            return res.status(400).json("Mật khẩu hiện tại không chính xác.");
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();

        console.log("Đã cập nhật mật khẩu thành công cho người dùng:", user);
        res.json("Đã cập nhật mật khẩu thành công.");
    } catch (err) {
        console.error("Đã xảy ra lỗi trong quá trình thay đổi mật khẩu:", err);
        res.status(500).json("Đã xảy ra lỗi trong quá trình thay đổi mật khẩu.");
    }
};

const addUser = async (req, res) => {
    const { email, fullname, phoneNumber, password, role } = req.body;
    if (!email || !fullname || !phoneNumber || !password || !role) {
        console.log("Thiếu các trường bắt buộc");
        return res.status(400).json("Tất cả các trường là bắt buộc");
    }
    console.log("Đang thêm người dùng với email:", email);
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("Người dùng đã tồn tại");
            return res.status(400).json("Email đã được sử dụng");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ 
                email, 
                fullname, 
                phoneNumber, 
                password: hashedPassword, 
                role });
            await newUser.save();
            console.log("Đã thêm người dùng thành công");
            res.status(201).json("Thêm người dùng thành công");
        }
    } catch (err) {
        console.error("Đã xảy ra lỗi trong quá trình thêm người dùng:", err);
        res.status(500).json("Đã xảy ra lỗi trong quá trình thêm người dùng");
    }
};

const logout = (req, res) => {
    res.status(200).json("Đăng xuất thành công");
};

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
            console.log("Khoảng thời gian không hợp lệ");
            return res.status(400).json("Khoảng thời gian không hợp lệ");
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
        console.error("Đã xảy ra lỗi trong quá trình tổng hợp:", err);
        res.status(500).json("Đã xảy ra lỗi trong quá trình tổng hợp");
    }
};

export { register, login, updateUser, changePassword, addUser, logout, loginWithToken, listAllUserBookingInPeriod };