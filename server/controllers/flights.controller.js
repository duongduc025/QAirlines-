import FlightModel from '../models/flights.js';
import { validationResult } from 'express-validator';

//
export const searchFlights = (req, res) => {
    console.log("Request received at /searchFlights");
    const { origin, destination, departDate } = req.body;
    console.log("Request body:", req.body);
    console.log("Searching flights from:", origin, "to:", destination, "on:", departDate);

    FlightModel.find({
        departure_location: origin,
        destination_location: destination,
        travel_time: { $gte: new Date(departDate), $lt: new Date(new Date(departDate).setDate(new Date(departDate).getDate() + 1)) }
    }, 'airplane_id normal_ticket_price economy_ticket_price')
    .then(flights => {
        res.json(flights);
    })
    .catch(err => {
        console.error("Error searching flights:", err);
        res.status(500).json("Error searching flights");
    });
};

export const addFlight = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { airplane_id, normal_seats, economy_seats, departure_location, destination_location, travel_time, arrival_time, normal_ticket_price, economy_ticket_price } = req.body;
    console.log("Adding new flight:", req.body);

    FlightModel.findOne({ airplane_id, departure_location, destination_location })
    .then(existingFlight => {
        if (existingFlight) {
            return res.status(400).json("Flight with the same airplane ID, departure location, and destination location already exists");
        } else {
            FlightModel.create({ airplane_id, normal_seats, economy_seats, departure_location, destination_location, travel_time, arrival_time, normal_ticket_price, economy_ticket_price })
            .then(flight => res.json("Flight added successfully"))
            .catch(err => {
                console.error("Error adding flight:", err);
                res.status(500).json("Error adding flight");
            });
        }
    })
    .catch(err => {
        console.error("Error checking existing flight:", err);
        res.status(500).json("Error checking existing flight");
    });
};

export const flightsAll = (req, res) => {
    const {
        departure_location,
        destination_location,
        flight_type,
        ticket_price,
        limit = 10,
        sort = 'ticket_price',
        mode = 'asc'
    } = req.query;

    const filter = {};
    if (departure_location) filter.departure_location = departure_location;
    if (destination_location) filter.destination_location = destination_location;
    if (flight_type) filter.flight_type = flight_type;
    if (ticket_price) filter.ticket_price = { $lte: Number(ticket_price) };

    const sortOrder = mode === 'asc' ? 1 : -1;

    FlightModel.find(filter)
        .sort({ [sort]: sortOrder })
        .limit(Number(limit))
        .then(flights => res.json(flights))
        .catch(err => {
            console.error("Error fetching flights:", err);
            res.status(500).json("Error fetching flights");
        });
};

export const flightsDelete = (req, res) => {
    const { id } = req.params;
    console.log("Deleting flight with ID:", id);

    FlightModel.findByIdAndDelete(id)
        .then(deletedFlight => {
            if (deletedFlight) {
                console.log("Flight deleted successfully");
                res.json("Flight deleted successfully");
            } else {
                console.log("Flight not found");
                res.status(404).json("Flight not found");
            }
        })
        .catch(err => {
            console.error("Error deleting flight:", err);
            res.status(500).json("Error deleting flight");
        });
};

export const flightsDetail = (req, res) => {
    const { id } = req.params;
    console.log("Fetching details for flight with ID:", id);

    FlightModel.findById(id)
        .then(flight => {
            if (flight) {
                console.log("Flight details found:", flight);
                res.json(flight);
            } else {
                console.log("Flight not found");
                res.status(404).json("Flight not found");
            }
        })
        .catch(err => {
            console.error("Error fetching flight details:", err);
            res.status(500).json("Error fetching flight details");
        });
};

//Để làm khứ hồi thì lấy điểm khởi hành thành điểm đến, đổi điểm đi và điểm dến v�� thời gian không có yêu cầu gì để trả về khứ hồi
//Booking cần có số người (1 người có thể đặt cho nhiều người đi, passenger là lấy ID và baggage extra = 5kg)