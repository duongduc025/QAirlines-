import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import flightRoutes from './routes/flights.route.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
// const MONGO_URI = "mongodb+srv://tnemo65ldt:mongo%40123@flight.upyhm.mongodb.net/";
mongoose.connect(process.env.MONGO_URI, {
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
