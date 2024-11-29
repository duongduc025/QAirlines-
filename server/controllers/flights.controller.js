import Flight from '../models/flights.js';
import Airplane from '../models/airplanes.js';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
// ...existing code...

export const showAllFlights = async (req, res) => {
    try {
        const flights = await Flight.aggregate([
            {
                $lookup: {
                    from: 'airplanes',
                    localField: 'airplane_id',
                    foreignField: 'airplane_id',
                    as: 'airplane_details'
                }
            },
            {
                $unwind: '$airplane_details'
            },
            {
                $project: {
                    flight_id: 1,
                    departure_location: 1,
                    destination: 1,
                    departure_time: 1,
                    arrival_time: 1,
                    economy_seats: 1,
                    business_seats: 1,
                    economy_price: 1,
                    business_price: 1,
                    'airplane_details.model': 1,
                    'airplane_details.airline': 1
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
        console.log("Authenticated user:", req.user);
        const { flight_id, airplane_id, ticket_price, departure_location, destination, travel_time, arrival_time, departure_time, estimated_arrival, economy_seats, business_seats, economy_price, business_price } = req.body;

        if (!flight_id || !airplane_id || !ticket_price || !departure_location || !destination || !travel_time || !arrival_time || !departure_time || !estimated_arrival || !economy_seats || !business_seats || !economy_price || !business_price) {
            return res.status(400).json({ message: "All fields are required" });
        }

        try {
            const existingFlight = await Flight.findOne({ flight_id });
            if (existingFlight) {
                return res.status(400).json({ message: "Flight ID already exists" });
            }

            const newFlight = new Flight({
                flight_id,
                airplane_id,
                ticket_price,
                departure_location,
                destination,
                travel_time,
                arrival_time,
                departure_time,
                estimated_arrival,
                economy_seats,
                business_seats,
                economy_price,
                business_price
            });

            await newFlight.save();
            res.status(201).json(newFlight);
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
        // Log all flights in the database
        const allFlights = await Flight.find({});
        console.log('All Flights in Database:', allFlights);

        const flights = await Flight.aggregate([
            {
                $match: {
                    departure_location,
                    destination,
                    departure_time: { $lt: new Date(departure_date) } //lớn hơn
                }
            },
            {
                $lookup: {
                    from: 'airplanes',
                    localField: 'airplane_id',
                    foreignField: 'airplane_id',
                    as: 'airplane_details'
                }
            },
            {
                $unwind: '$airplane_details'
            },
            {
                $project: {
                    flight_id: 1,
                    departure_location: 1,
                    destination: 1,
                    departure_time: 1,
                    arrival_time: 1,
                    travel_time: { $abs: { $subtract: ['$arrival_time', '$departure_time'] } },
                    economy_seats: 1,
                    business_seats: 1,
                    economy_price: 1,
                    business_price: 1,
                    'airplane_details.model': 1,
                    'airplane_details.airline': 1
                }
            }
        ]);

        console.log('Flights Found:', flights);

        const availableFlights = flights.filter(flight => {
            if (flight.economy_seats >= ticket_quantity) {
                flight.available_seats = flight.economy_seats;
                flight.price = flight.economy_price;
                flight.class = 'Economy';
                return true;
            } else if (flight.business_seats >= ticket_quantity) {
                flight.available_seats = flight.business_seats;
                flight.price = flight.business_price;
                flight.class = 'Business';
                return true;
            }
            return false;
        });

        console.log('Available Flights:', availableFlights);

        res.json(availableFlights);
    } catch (error) {
        console.error('Error during flight search:', error);
        res.status(500).json({ message: error.message });
    }
};

// ...existing code...
