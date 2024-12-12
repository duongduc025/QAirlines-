import User from '../models/users.js';
import Booking from '../models/bookings.js';
import Flight from '../models/flights.js';
import Passenger from '../models/passenger.js';
import mongoose from 'mongoose';

export const getBookingByUserId = async (req, res) => {
    const { id } = req.params;
    console.log(`Fetching bookings for user ID: ${id}`);
   
    try {
        const user = await User.findById(id);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
      
        const bookings = await Booking.aggregate([
            { $match: { user_id: id } },
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
                    _id: 1,
                    departure_location: '$flight_details.departure_location',
                    destination: '$flight_details.destination',
                    ticket_price: '$flight_details.ticket_price',
                    departure_time: '$flight_details.departure_time',
                    travel_time: '$flight_details.travel_time',
                    booking_status: '$flight_details.booking_status',
                    ticket_quantity: 1,
                    arrival_time: '$flight_details.arrival_time', 
                    flight_code: '$flight_details.flight_code' 
                }
            }
        ]);

        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};


export const getSpecificBookingByUserId = async (req, res) => {
    const { id, booking_id } = req.params;
    console.log(`Fetching specific booking for user ID: ${id}, booking ID: ${booking_id}`);

    try {
        const user = await User.findById(id);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const bookings = await Booking.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(booking_id), user_id: id } },
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
                    _id: 1,
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

        res.json({ success: true, bookings: bookings[0] });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

// Thêm chú thích bằng tiếng Việt cho hàm createBooking
export const createBooking = async (req, res) => {
    const { flight_id, ticket_quantity, passengers } = req.body;
    const user_id = req.user._id; // Assuming the user's ID is stored in the token

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
            const { fullname, email, gender, dob, identity_number } = passenger;
            const newPassenger = new Passenger({
                fullname,
                email,
                gender,
                date_of_birth: new Date(dob),
                id_number: identity_number,
                flight_id
            });
            await newPassenger.save();
            passenger_ids.push(newPassenger._id);
        }

        // Find the user by ID
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new booking
        const newBooking = new Booking({
            user_id: user._id,
            user_email: user.email,
            flight_id,
            ticket_quantity,
            ticket_price,
            total_price,
            booking_date: new Date(),
            booking_status: 'Đã đặt',
            passenger_ids,
            updated_at: new Date()
        });

        // Update the flight's available seats
        flight.economy_seats -= ticket_quantity;
        await flight.save();

        // Save the new booking
        await newBooking.save();

        // Update the user's booking list
        user.booking_id.push(newBooking._id);
        await user.save();

        res.status(201).json({ message: 'Booking successful', booking_id: newBooking._id });
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
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_details'
                }
            },
            { $unwind: '$flight_details' },
            { $unwind: '$user_details' },
            {
                $project: {
                    _id: 1,
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
        console.log('Bookings:', bookings); // Debug log to check the bookings data
        res.json({ success:true, bookings});
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

//Bỏ authenJWT thì làm được
export const cancelBooking = async (req, res) => {
    const { booking_id } = req.params;
    const user_id = req.user._id; // Giả sử ID người dùng được lưu trong token

    try {
        const booking = await Booking.findOne({ _id: mongoose.Types.ObjectId(booking_id), user_id });
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
