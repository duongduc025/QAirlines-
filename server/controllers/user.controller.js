import User from '../models/users.js';

// ...existing code...
const register = async (req, res) => {
    const { email, fullname, phoneNumber, password, role } = req.body; 
    if (!email || !fullname || !phoneNumber || !password || !role) {
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
            const newUser = new User({ email, fullname, phoneNumber, password, role });
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
            if (user.password === password) {
                console.log("Login successful");
                res.json("Success");
            } else {
                console.log("Incorrect password");
                res.json("The pass is incorrect");
            }
        } else {
            console.log("No record existed");
            res.json("No record existed");
        }
    } catch (err) {
        console.error("Error during login:", err);
        res.status(500).json("Error during login");
    }
};

const findUserByEmail = async (req, res) => {
    const { email } = req.params;
    console.log("Searching for user with email:", email);
    try {
        const user = await User.findOne({ email });
        if (user) {
            console.log("User found:", user);
            res.json(user);
        } else {
            console.log("No user found with that email");
            res.status(404).json("No user found with that email");
        }
    } catch (err) {
        console.error("Error occurred during search:", err);
        res.status(500).json("Error occurred during search");
    }
};

const updateUser = async (req, res) => {
    const { email } = req.params;
    const { fullname, phoneNumber, password, role } = req.body;
    console.log("Updating user with email:", email);
    try {
        const user = await User.findOneAndUpdate(
            { email },
            { fullname, phoneNumber, password, role },
            { new: true }
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

export { register, login, findUserByEmail, updateUser };
