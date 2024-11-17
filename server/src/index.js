import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import UserModel from '../models/users.js'; // Sửa lỗi nhập khẩu module

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://tnemo65ldt:mongo%40123@flight.upyhm.mongodb.net/");

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    console.log(email);
    console.log(password);

    // Example of req.body
    // {
    //     "email": "example@example.com",
    //     "password": "password123"
    // }

    UserModel.findOne({ email: email })
    .then(user => {
        console.log(user);
        if (user) {
            if (user.password === password) {
                res.json("Success");
            } else {
                res.json("The pass is incorrect");
            }
        } else {
            res.json("No record existed");
        }
    })
    .catch(err => {
        console.error("Error during login:", err);
        res.status(500).json("Error during login");
    });
});

app.post('/register', (req, res) => {
    const { email, fullname, phoneNumber, password, role, user_type } = req.body; 
    console.log("Registering email:", email); // Kiểm tra email được truyền vào
    console.log("Request body:", req.body); // Log the entire request body
    
    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    UserModel.findOne({ email })
    .then(existingUser => {
        if (existingUser) {
            // Nếu email đã tồn tại, trả về lỗi
            return res.status(400).json("Email already in use");
        } else {
            // Nếu email chưa tồn tại, tạo tài khoản mới
            UserModel.create({ email, fullname, phoneNumber, password, role, user_type }) // Khớp với các trường trong schema
            .then(user => res.json("Success"))
            .catch(err => {
                console.error("Error occurred during registration:", err); // Log lỗi
                res.status(500).json("Error occurred during registration");
            });
        }
    })
    .catch(err => {
        console.error("Error checking email uniqueness:", err); // Log lỗi
        res.status(500).json("Error checking email uniqueness");
    });
});

app.put('/updateUserInfo', (req, res) => {
    const { email, fullname, phoneNumber, password } = req.body;
    console.log("Updating user info for email:", email);

    // Example of req.body
    // {
    //     "email": "example@example.com",
    //     "fullname": "John Doe",
    //     "phoneNumber": "1234567890",
    //     "password": "newpassword123"
    // }

    UserModel.findOneAndUpdate(
        { email: email },
        { fullname, phoneNumber, password },
        { new: true }
    )
    .then(updatedUser => {
        if (updatedUser) {
            res.json("User info updated successfully");
        } else {
            res.status(404).json("User not found");
        }
    })
    .catch(err => {
        console.error("Error updating user info:", err);
        res.status(500).json("Error updating user info");
    });
});

app.put('/changeUserInfo', (req, res) => {
    const { email, fullname, phoneNumber, password } = req.body;
    console.log("Changing user info for email:", email);
    // Simulate changing user information without updating the database
    const updatedUser = {
        email,
        fullname,
        phoneNumber,
        password
    };

    res.json({
        message: "User info changed successfully",
        user: updatedUser
    });
});

app.put('/updateUser', (req, res) => {
    const { email, fullname, phoneNumber, password, role, user_type } = req.body;
    console.log("Updating user info for email:", email);
    UserModel.findOneAndUpdate(
        { email: email },
        { fullname, phoneNumber, password, role, user_type },
        { new: true }
    )
    .then(updatedUser => {
        if (updatedUser) {
            res.json("User info updated successfully");
        } else {
            res.status(404).json("User not found");
        }
    })
    .catch(err => {
        console.error("Error updating user info:", err);
        res.status(500).json("Error updating user info");
    });
});

app.get('/testUpdateUser', (req, res) => {
    console.log("chạy được test update");
    const testEmail = "example@example.com";
    const testUpdate = {
        email: testEmail,
        fullname: "Thinh Ne",
        phoneNumber: "0987654321",
        password: "updatedpassword123",
        user_type: "student",
        role: "user"
    };

    UserModel.findOneAndUpdate(
        { email: testEmail },
        testUpdate,
        { new: true }
    )
    .then(updatedUser => {
        if (updatedUser) {
            res.json({
                message: "Test update successful",
                user: updatedUser
            });
        } else {
            res.status(404).json("User not found");
        }
    })
    .catch(err => {
        console.error("Error during test update:", err);
        res.status(500).json("Error during test update");
    });
});

app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
