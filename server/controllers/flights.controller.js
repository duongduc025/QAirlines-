import Flight from '../models/flights.js';
import Airplane from '../models/airplanes.js';
import mongoose from 'mongoose';
import { authenticateJWT } from '../middlewares/jwtAuth.js';
import { isAdmin } from '../middlewares/auth.middleware.js';
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
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'flight_id',
                    as: 'booking_details'
                }
            },
            {
                $unwind: {
                    path: '$booking_details',
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
                    economy_seats: 1,
                    economy_price: 1,
                    'airplane_details.model': 1,
                    'airplane_details.airplane_code': 1,
                    'booking_details._id': 1,
                    travel_time: { $divide: [{ $abs: { $subtract: ['$arrival_time', '$departure_time'] } }, 3600000] } // convert milliseconds to hours
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
        console.log("Người dùng đã xác thực:", req.user);
        const {flight_code, airplane_code, ticket_price, departure_location, destination, travel_time, arrival_time, departure_time, estimated_arrival, economy_seats, economy_price } = req.body;

        if (!flight_code || !airplane_code || !ticket_price || !departure_location || !destination || !travel_time || !arrival_time || !departure_time || !estimated_arrival || !economy_seats || !economy_price) {
            return res.status(400).json({ message: "Tất cả các trường là bắt buộc" });
        }

        try {
            const existingFlight = await Flight.findOne({ flight_code });
            if (existingFlight) {
                return res.status(400).json({ message: "Chuyến bay với mã này đã tồn tại" });
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

export const searchFlights = async (req, res) => {
    const { departure_location, destination, departure_date, ticket_quantity } = req.query;

    if (!departure_location || !destination || !departure_date || !ticket_quantity) {
        return res.status(400).json({ message: "Tất cả các trường là bắt buộc" });
    }

    console.log('Tham số tìm kiếm:', { departure_location, destination, departure_date, ticket_quantity });

    try {
        const departureDate = new Date(departure_date);
        if (isNaN(departureDate)) {
            return res.status(400).json({ message: "Ngày khởi hành không hợp lệ" });
        }

        const ticketQuantity = parseInt(ticket_quantity, 10);
        if (isNaN(ticketQuantity)) {
            return res.status(400).json({ message: "Số lượng vé không hợp lệ" });
        }

        const flights = await Flight.aggregate([
            {
                $match: {
                    departure_location,
                    destination,
                    departure_time: { $lt: departureDate }
                }
            },
            {
                $lookup: {
                    from: 'airplanes',
                    localField: 'airplane_code',
                    foreignField: 'airplane_code',
                    as: 'airplane_details'
                }
            },
            {
                $unwind: '$airplane_details',
                
            },
            {
                $lookup: {
                    from: 'bookings',
                    localField: '_id',
                    foreignField: 'flight_id',
                    as: 'booking_details'
                }
            },
            {
                $unwind: {
                    path: '$booking_details',
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
                    travel_time: { $abs: { $subtract: ['$arrival_time', '$departure_time'] } },
                    economy_seats: 1,
                    economy_price: 1,
                    'airplane_details.model': 1,
                    'airplane_details.airplane_code': 1,
                    'booking_details._id': 1
                }
            }
        ]);

        console.log('Các chuyến bay tìm thấy:', flights);
        if(flights){
            console.log('kết nối rỗng');
        }
        flights.forEach(flight => {
            console.log('Chuyến bay:', flight.flight_code);
            console.log('Chi tiết máy bay:', flight.airplane_details);
            console.log('Chi tiết đặt vé:', flight.booking_details);
        });

        const availableFlights = flights.filter(flight => {
            console.log('Kiểm tra chuyến bay:', flight);
            if (flight.economy_seats >= ticketQuantity) {
                console.log(`Chuyến bay ${flight.flight_code} có đủ ghế hạng phổ thông: ${flight.economy_seats}`);
                flight.available_seats = flight.economy_seats;
                flight.price = flight.economy_price;
                return true;
            }
            console.log(`Chuyến bay ${flight.flight_code} không có đủ ghế`);
            return false;
        });

        console.log('Các chuyến bay có sẵn:', availableFlights);

        res.json(availableFlights);
    } catch (error) {
        console.error('Lỗi trong quá trình tìm kiếm chuyến bay:', error);
        res.status(500).json({ message: error.message });
    }
};

export const updateDepartureTime = async (req, res) => {
    const { flightId } = req.params;
    const { newDepartureTime } = req.body;

    if (!newDepartureTime) {
        return res.status(400).json({ message: "Thời gian khởi hành mới là bắt buộc" });
    }

    try {
        const flight = await Flight.findById(flightId);
        if (!flight) {
            return res.status(404).json({ message: "Không tìm thấy chuyến bay" });
        }

        const newDepartureDate = new Date(newDepartureTime);
        const newArrivalTime = new Date(newDepartureDate.getTime() + flight.travel_time * 3600000); // travel_time is in minutes

        flight.departure_time = newDepartureDate;
        flight.arrival_time = newArrivalTime;

        await flight.save();

        res.json(flight);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ...existing code...
