import User from '../models/users.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
            const newUser = new User({ email, fullname, phoneNumber, password: hashedPassword });
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
    try {
        const user = await User.findOne({ email });
        console.log("User found:", user);
        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
                console.log("Generated token:", token);
                console.log("JWT Secret for signing:", process.env.JWT_SECRET);
                console.log("Login successful");
                res.json({ token });
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

const updateUser = async (req, res) => {
    const { email } = req.params;
    const { newEmail, fullname, phoneNumber } = req.body;
    console.log("Updating user with email:", email);

    try {
        const existingUser = await User.findOne({ email: newEmail });
        if (existingUser) {
            return res.status(400).json("New email already exists.");
        }

        const user = await User.findOneAndUpdate(
            { email },  // Tìm người dùng cũ dựa trên email
            { email: newEmail, fullname, phoneNumber },  // Cập nhật thông tin
            { new: true }  // Trả về tài liệu đã cập nhật
        );

        if (user) {
            console.log("User updated successfully:", user);
            res.json(user);
        } else {
            console.log("No user found with that email");
            res.status(404).json("No user found with that email");
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
            const newUser = new User({ email, fullname, phoneNumber, password: hashedPassword, role });
            await newUser.save();
            console.log("User added successfully");
            res.status(201).json("Success");
        }
    } catch (err) {
        console.error("Error occurred during user addition:", err);
        res.status(500).json("Error occurred during user addition");
    }
};

export { register, login, updateUser, changePassword, addUser };
