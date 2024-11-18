const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const UserModel = require('../models/User');
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://127.0.0.1:27017/user");
app.post("/login", (req, res) => {
    const {email, password} = req.body;
    console.log(email);
    console.log(password);

    UserModel.findOne({email: email})
    .then(user =>{
        console.log(user);
        if(user){
            
            if(user.password === password){
                res.json("Success")
            }
            else{
                res.json("The pass is incorrect")
            }
        }
        else{
            res.json("No record existed")
        }
    }) 
})

app.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    console.log("Registering email:", email); // Kiểm tra email được truyền vào

    // Kiểm tra xem email đã tồn tại trong cơ sở dữ liệu chưa
    UserModel.findOne({ email: email })
    .then(existingUser => {
        if (existingUser) {
            // Nếu email đã tồn tại, trả về lỗi
            return res.status(400).json("Email already in use");
        } else {
            // Nếu email chưa tồn tại, tạo tài khoản mới
            UserModel.create({ email, name, password })
            .then(user => res.json("Success"))
            .catch(err => res.status(500).json("Error occurred during registration"));
        }
    })
    .catch(err => res.status(500).json("Error checking email uniqueness"));
});

app.listen(3001, ()=>{
    console.log("Server is running on port 3001");
})
