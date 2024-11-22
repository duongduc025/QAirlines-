import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import UserModel from './models/users.js';
import userRoutes from './routes/user.route.js';
import flightRoutes from './routes/flights.route.js';
import bookingRoutes from './routes/booking.route.js'; // Import booking routes

const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://tnemo65ldt:mongo%40123@flight.upyhm.mongodb.net/", {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    ssl: true
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch(err => {
    console.error("Failed to connect to MongoDB", err);
});

app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes); // Use booking routes

// Đóng kết nối khi server dừng
process.on('SIGINT', () => {
    mongoose.disconnect()
        .then(() => {
            console.log("MongoDB connection closed");
            process.exit(0);
        })
        .catch(err => {
            console.error("Error closing MongoDB connection", err);
            process.exit(1);
        });
});

const PORT = process.env.PORT || 3001; // Change port to 3001
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
