import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import flightRoutes from './routes/flights.route.js';
import bookingRoutes from './routes/booking.route.js';
import promotionRoutes from './routes/promotions.route.js';
import airplaneRoutes from './routes/airplanes.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());
console.log('MONGO_URI:', process.env.MONGO_URI);

// Kết nối đến MongoDB
mongoose.connect(process.env.MONGO_URI, {
    ssl: true
})
.then(() => {
    console.log("Connected to MongoDB");
    console.log('Connected to database:', mongoose.connection.db.databaseName); 
})
.catch(err => {
    console.error("Failed to connect to MongoDB", err);
});

// Định nghĩa các route
app.use('/api/users', userRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/airplanes', airplaneRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

