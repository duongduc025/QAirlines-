import FlightModel from '../models/flights.js';

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
    }, 'airplane_id ticket_price')
    .then(flights => {
        res.json(flights);
    })
    .catch(err => {
        console.error("Error searching flights:", err);
        res.status(500).json("Error searching flights");
    });
};

export const addFlight = (req, res) => {
    const { airplane_id, available_seats, departure_location, destination_location, travel_time, arrival_time, flight_type, ticket_price } = req.body;
    console.log("Adding new flight:", req.body);

    FlightModel.findOne({ airplane_id, departure_location, destination_location })
    .then(existingFlight => {
        if (existingFlight) {
            return res.status(400).json("Flight with the same airplane ID, departure location, and destination location already exists");
        } else {
            FlightModel.create({ airplane_id, available_seats, departure_location, destination_location, travel_time, arrival_time, flight_type, ticket_price })
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

//Để làm khứ hồi thì lấy điểm khởi hành thành điểm đến, đổi điểm đi và điểm dến và thời gian không có yêu cầu gì để trả về khứ hồi
//Booking cần có số người (1 người có thể đặt cho nhiều người đi, passenger là lấy ID và baggage extra = 5kg)