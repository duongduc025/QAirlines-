import Flight from '../models/flights.js';
import Airplane from '../models/airplanes.js';
import mongoose from 'mongoose';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
import DelayNotice from '../models/delayNotices.js';

// ...existing code...

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
                    arrival_time: 1,
                    travel_time: { $divide: [{ $abs: { $subtract: ['$arrival_time', '$departure_time'] } }, 3600000] }, 
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

export const addNewFlight = [
    authenticateJWT,
    isAdmin,        
    async (req, res) => {
        console.log("Authenticated user ID:", req.user._id);
        const {flight_code, airplane_code, ticket_price, departure_location, destination, travel_time, arrival_time, departure_time, estimated_arrival, economy_seats, economy_price } = req.body;

        if (!flight_code || !airplane_code || !ticket_price || !departure_location || !destination || !travel_time || !arrival_time || !departure_time || !estimated_arrival || !economy_seats || !economy_price) {
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
                ticket_price,
                departure_location,
                destination,
                travel_time,
                arrival_time,
                departure_time,
                estimated_arrival,
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
        const newArrivalTime = new Date(newDepartureDate.getTime() + flight.travel_time * 3600000); // travel_time is in minutes

        flight.departure_time = newDepartureDate;
        flight.arrival_time = newArrivalTime;

        await flight.save();

        // Lưu thông tin vào delayNotices
        const delayNotice = new DelayNotice({
            flightId: flight._id,
            previousDepartureTime,
            newDepartureTime: newDepartureDate
        });

        await delayNotice.save();

        res.json(flight);
    } catch (error) {
        console.error('Error during flight update:', error);
        res.status(500).json({ message: error.message });
    }
};

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



export const searchFlights = async (req, res) => {
    const { departure_location, destination, departure_date, ticket_quantity } = req.query;

    if (!departure_location || !destination || !departure_date || !ticket_quantity) {
        return res.status(400).json({ message: "All fields are required" });
    }

    console.log('Search Parameters:', { departure_location, destination, departure_date, ticket_quantity });

    try {
        const startOfDay = new Date(departure_date);
        startOfDay.setUTCHours(0, 0, 0, 0);

        const ticketQuantity = parseInt(ticket_quantity, 10);
        if (isNaN(ticketQuantity)) {
            return res.status(400).json({ message: "Invalid ticket quantity" });
        }

        console.log('Start of Day:', startOfDay);

        const flights = await Flight.find({
            departure_location,
            destination,
            departure_time: { $gte: startOfDay }
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