import Flight from '../models/flights.js';
import Airplane from '../models/airplanes.js';
import mongoose from 'mongoose';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import DelayNotice from '../models/delayNotices.js';
import User from '../models/users.js';
import Booking from '../models/bookings.js';

// ...existing code...

// Hàm hiển thị tất cả các chuyến bay
export const showAllFlights = async (req, res) => {
    try {
        const flights = await Flight.aggregate([
            {
                $lookup: {
                    from: 'airplanes',
                    localField: 'airplane_code',
                    foreignField: 'airplane_code',
                    as: 'airplane_details'
                }
            },
            {
                $unwind: {
                    path: '$airplane_details',
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    flight_code: 1,
                    departure_location: 1,
                    destination: 1,
                    departure_time: 1,
                    travel_time: 1, 
                    economy_seats: 1,
                    economy_price: 1,
                    airplane_code: 1,
                    airplane_details: 1
                }
            }
        ]);
        res.json(flights);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Hàm thêm chuyến bay mới
export const addNewFlight = [
    authenticateJWT,
    isAdmin,        
    async (req, res) => {
        console.log("Authenticated user ID:", req.user._id);
        const {flight_code, airplane_code, departure_location, destination, travel_time, departure_time, economy_seats, economy_price } = req.body;

        if (!flight_code || !airplane_code || !departure_location || !destination || !travel_time || !departure_time || !economy_seats || !economy_price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const existingFlight = await Flight.findOne({ flight_code });
            if (existingFlight) {
                return res.status(400).json({ message: "Flight with this code already exists" });
            }

            const newFlight = new Flight({
                flight_code,
                airplane_code,
                departure_location,
                destination,
                travel_time,
                departure_time,
                economy_seats,
                economy_price
            });

            await newFlight.save();
            res.status(201).json(newFlight);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];

// Hàm cập nhật thời gian khởi hành
export const updateDepartureTime = async (req, res) => {
    const { flightId } = req.params;
        const { newDepartureTime } = req.body;

    if (!newDepartureTime) {
        return res.status(400).json({ message: "New departure time is required" });
    }

    try {
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({ message: "Flight not found" });
        }

        const previousDepartureTime = flight.departure_time;
        const newDepartureDate = new Date(newDepartureTime);

        flight.departure_time = newDepartureDate;

        await flight.save();

        // Lưu thông tin vào delayNotices
        const delayNotice = new DelayNotice({
            flightId: flight._id,
            previousDepartureTime,
            newDepartureTime: newDepartureDate
        });

        await delayNotice.save();

        // Tìm tất cả các booking có flight_id đầu vào
        const bookings = await Booking.find({ flight_id: flightId });

        // Cập nhật delayNotices cho tất cả các user có booking_id tương ứng
        for (const booking of bookings) {
            await User.updateMany(
                { booking_id: booking._id },
                { $push: { delayNotices: delayNotice._id } }
            );
        }

        res.json(flight);
    } catch (error) {
        console.error('Error during flight update:', error);
        res.status(500).json({ message: error.message });
    }
};

// Hàm xóa chuyến bay theo ID
export const deleteFlightById = [
    authenticateJWT,
    isAdmin,
    async (req, res) => {
        const { flightId } = req.params;

        try {
            const flight = await Flight.findByIdAndDelete(flightId);
            if (!flight) {
                return res.status(404).json({ message: "Flight not found" });
            }
            res.json({ message: "Flight deleted successfully" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
];

// Hàm tìm kiếm chuyến bay
export const searchFlights = async (req, res) => {
    const { departure_location, destination, departure_date, ticket_quantity } = req.query;

    if (!departure_location || !destination || !departure_date || !ticket_quantity) {
        return res.status(400).json({ message: "All fields are required" });
    }

    console.log('Search Parameters:', { departure_location, destination, departure_date, ticket_quantity });

    try {
        const startOfDay = new Date(departure_date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const endOfDay = new Date(departure_date);
        endOfDay.setUTCHours(23, 59, 59, 999);

        const ticketQuantity = parseInt(ticket_quantity, 10);
        if (isNaN(ticketQuantity)) {
            return res.status(400).json({ message: "Invalid ticket quantity" });
        }

        console.log('Start of Day:', startOfDay);
        console.log('End of Day:', endOfDay);

        const flights = await Flight.find({
            departure_location,
            destination,
            departure_time: { $gte: startOfDay, $lte: endOfDay }
        });

        console.log('Flights Found:', flights);

        const availableFlights = flights.filter(flight => flight.economy_seats >= ticketQuantity);

        console.log('Available Flights:', availableFlights);

        res.json(availableFlights);
    } catch (error) {
        console.error('Error during flight search:', error);
        res.status(500).json({ message: error.message });
    }
};

// Hàm tìm kiếm chuyến bay khứ hồi
export const searchRoundFlights = async (req, res) => {
    const { departure_location, destination, departure_date, return_date, ticket_quantity } = req.query;

    if (!departure_location || !destination || !departure_date || !return_date || !ticket_quantity) {
        return res.status(400).json({ message: "All fields are required" });
    }

    console.log('Search Parameters:', { departure_location, destination, departure_date, return_date, ticket_quantity });

    try {
        const startOfDepartureDay = new Date(departure_date);
        startOfDepartureDay.setUTCHours(0, 0, 0, 0);

        const endOfDepartureDay = new Date(departure_date);
        endOfDepartureDay.setUTCHours(23, 59, 59, 999);

        const startOfReturnDay = new Date(return_date);
        startOfReturnDay.setUTCHours(0, 0, 0, 0);

        const endOfReturnDay = new Date(return_date);
        endOfReturnDay.setUTCHours(23, 59, 59, 999);

        const ticketQuantity = parseInt(ticket_quantity, 10);
        if (isNaN(ticketQuantity)) {
            return res.status(400).json({ message: "Invalid ticket quantity" });
        }

        console.log('Start of Departure Day:', startOfDepartureDay);
        console.log('End of Departure Day:', endOfDepartureDay);
        console.log('Start of Return Day:', startOfReturnDay);
        console.log('End of Return Day:', endOfReturnDay);

        const departureFlights = await Flight.find({
            departure_location,
            destination,
            departure_time: { $gte: startOfDepartureDay, $lte: endOfDepartureDay }
        });

        const returnFlights = await Flight.find({
            departure_location: destination,
            destination: departure_location,
            departure_time: { $gte: startOfReturnDay, $lte: endOfReturnDay }
        });

        console.log('Departure Flights Found:', departureFlights);
        console.log('Return Flights Found:', returnFlights);

        const availableDepartureFlights = departureFlights.filter(flight => flight.economy_seats >= ticketQuantity);
        const availableReturnFlights = returnFlights.filter(flight => flight.economy_seats >= ticketQuantity);

        console.log('Available Departure Flights:', availableDepartureFlights);
        console.log('Available Return Flights:', availableReturnFlights);

        res.json({ departureFlights: availableDepartureFlights, returnFlights: availableReturnFlights });
    } catch (error) {
        console.error('Error during round flight search:', error);
        res.status(500).json({ message: error.message });
    }
};