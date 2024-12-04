import User from '../models/users.js';
import Booking from '../models/bookings.js';
import Flight from '../models/flights.js';
import { v4 as uuidv4 } from 'uuid';
import Passenger from '../models/passenger.js';

export const getBookingsByUserEmail = async (req, res) => {
    const { email } = req.params;
    console.log(`Fetching bookings for user email: ${email}`);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const bookings = await Booking.aggregate([
            { $match: { user_email: user.email } },
            {
                $lookup: {
                    from: 'flights',
                    localField: 'flight_id',
                    foreignField: '_id',
                    as: 'flight_details'
                }
            },
            { $unwind: '$flight_details' },
            {
                $project: {
                    booking_id: 1,
                    departure_location: '$flight_details.departure_location',
                    destination: '$flight_details.destination',
                    ticket_price: '$flight_details.ticket_price',
                    departure_time: '$flight_details.departure_time',
                    travel_time: '$flight_details.travel_time',
                    ticket_quantity: 1
                }
            }
        ]);

        res.json(bookings);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const getSpecificBookingByUserEmail = async (req, res) => {
    const { email, booking_id } = req.params;
    console.log(`Fetching specific booking for user email: ${email}, booking ID: ${booking_id}`);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const bookings = await Booking.aggregate([
            { $match: { booking_id: booking_id, user_email: email } },
            {
                $lookup: {
                    from: 'flights',
                    localField: 'flight_id',
                    foreignField: '_id',
                    as: 'flight_details'
                }
            },
            { $unwind: '$flight_details' },
            {
                $project: {
                    booking_id: 1,
                    departure_location: '$flight_details.departure_location',
                    destination: '$flight_details.destination',
                    ticket_price: '$flight_details.ticket_price',
                    departure_time: '$flight_details.departure_time',
                    travel_time: '$flight_details.travel_time',
                    ticket_quantity: 1
                }
            }
        ]);

        if (bookings.length === 0) {
            console.log('Booking not found for this user');
            return res.status(404).json({ message: 'Booking not found for this user' });
        }

        res.json(bookings[0]);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

// Thêm chú thích bằng tiếng Việt cho hàm createBooking
export const createBooking = async (req, res) => {
    const { flight_id, ticket_quantity, passengers } = req.body;
    const user_email = req.user.email; // Assuming the user's email is stored in the token

    try {
        // Find the flight by ID
        const flight = await Flight.findById(flight_id);
        if (!flight) {
            return res.status(404).json({ message: 'Flight not found' });
        }

        // Check if there are enough economy seats available
        if (flight.economy_seats < ticket_quantity) {
            return res.status(400).json({ message: 'Not enough economy seats available' });
        }

        // Calculate the total price
        const ticket_price = flight.economy_price;
        const total_price = ticket_quantity * ticket_price;

        // Create passengers and collect their IDs
        const passenger_ids = [];
        for (const passenger of passengers) {
            const { first_name, last_name, email, phone, gender, dob, nationality, identity_number } = passenger;
            const newPassenger = new Passenger({
                passenger_id: uuidv4(),
                first_name,
                last_name,
                email,
                phone,
                gender,
                date_of_birth: new Date(dob),
                nationality,
                id_number: identity_number,
                flight_id
            });
            await newPassenger.save();
            passenger_ids.push(newPassenger.passenger_id);
        }

        // Create a new booking
        const booking_id = uuidv4();
        const newBooking = new Booking({
            booking_id,
            user_email,
            flight_id,
            ticket_quantity,
            ticket_price,
            total_price,
            booking_date: new Date(),
            booking_status: 'Booked',
            passenger_ids,
            updated_at: new Date()
        });

        // Update the flight's available seats
        flight.economy_seats -= ticket_quantity;
        await flight.save();

        // Save the new booking
        await newBooking.save();

        // Update the user's booking list
        const user = await User.findOne({ email: user_email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.booking_id.push(booking_id);
        await user.save();

        res.status(201).json({ message: 'Booking successful', booking_id });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const listAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.aggregate([
            {
                $lookup: {
                    from: 'flights',
                    localField: 'flight_id',
                    foreignField: '_id',
                    as: 'flight_details'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_email',
                    foreignField: 'email',
                    as: 'user_details'
                }
            },
            {
                $unwind: '$flight_details'
            },
            {
                $unwind: '$user_details'
            },
            {
                $project: {
                    booking_id: 1,
                    user_email: '$user_details.email',
                    flight_code: '$flight_details.flight_code',
                    departure_location: '$flight_details.departure_location',
                    destination: '$flight_details.destination',
                    departure_time: '$flight_details.departure_time',
                    arrival_time: '$flight_details.arrival_time',
                    ticket_quantity: 1,
                    total_price: 1,
                    booking_status: 1
                }
            }
        ]);

        res.json(bookings);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

//Bỏ authenJWT thì làm được
export const cancelBooking = async (req, res) => {
    const { booking_id } = req.params;
    const user_email = req.user.email; // Giả sử email người dùng được lưu trong token

    try {
        const booking = await Booking.findOne({ booking_id, user_email });
        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đặt vé' });
        }

        const currentTime = new Date();
        const departureTime = booking.flight_id[0].departure_time; 

        if (departureTime - currentTime < 24 * 60 * 60 * 1000) { 
            return res.status(400).json({ message: 'Không thể hủy đặt vé trong vòng 24 giờ trước khi khởi hành' });
        }

        booking.booking_status = 'Đã hủy';
        booking.updated_at = new Date();
        await booking.save();

        res.status(200).json({ message: 'Hủy đặt vé thành công' });
    } catch (error) {
        console.error('Lỗi máy chủ:', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
};
