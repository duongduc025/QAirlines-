import User from '../models/users.js';
import Booking from '../models/bookings.js';
import Flight from '../models/flights.js';
import Passenger from '../models/passenger.js';
import mongoose from 'mongoose';

export const getBookingByUserId = async (req, res) => {
    const { _id } = req.params;
    console.log(`Fetching bookings for user ID: ${_id}`);
   
    try {
        const user = await User.findById(_id);
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }
      
        const bookings = await Booking.aggregate([
            { $match: { user_id: new mongoose.Types.ObjectId(_id) } },
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
                    user_id: 1,
                    flight_id: 1,
                    ticket_quantity: 1,
                    total_price: 1,
                    booking_date: 1,
                    booking_status: 1,
                    passenger_ids: 1,
                    updated_at: 1,
                    'flight_details.departure_location': 1,
                    'flight_details.destination': 1,
                    'flight_details.travel_time': 1,
                    'flight_details.departure_time': 1
                }
            }
        ]);

        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

export const getSpecificBookingById = async (req, res) => {
    const { booking_id } = req.params;
    console.log(`Fetching specific booking for booking ID: ${booking_id}`);

    try {
        const booking = await Booking.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(booking_id) } },
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
                $lookup: {
                    from: 'airplanes',
                    localField: 'flight_details.airplane_code',
                    foreignField: 'airplane_code',
                    as: 'airplane_details'
                }
            },
            { $unwind: '$airplane_details' }
        ]);

        if (!booking.length) {
            console.log('Booking not found');
            return res.status(404).json({ message: 'Booking not found' });
        }

        const passengerDetails = [];
        for (const passengerId of booking[0].passenger_ids) {
            const passenger = await Passenger.findById(passengerId);
            if (passenger) {
                passengerDetails.push(passenger);
            }
        }

        booking[0].passenger_details = passengerDetails;

        res.json({ success: true, booking: booking[0] });
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
            const { fullname, gender, dob, identity_number } = passenger;
            const newPassenger = new Passenger({
                fullname,
                gender,
                date_of_birth: new Date(dob),
                id_number: identity_number,
                flight_id: new mongoose.Types.ObjectId(flight_id)
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
            flight_id: new mongoose.Types.ObjectId(flight_id),
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
            { $unwind: '$flight_details' },
            {
                $lookup: {
                    from: 'users',
                    localField: 'user_id',
                    foreignField: '_id',
                    as: 'user_details'
                }
            },
            { $unwind: '$user_details' },
            {
                $project: {
                    _id: 1,
                    user_id: 1,
                    user_email: '$user_details.email',
                    user_fullname: '$user_details.fullname',
                    flight_id: 1,
                    ticket_quantity: 1,
                    total_price: 1,
                    booking_date: 1,
                    booking_status: 1,
                    passenger_ids: 1,
                    updated_at: 1,
                    'flight_details.departure_location': 1,
                    'flight_details.destination': 1,
                    'flight_details.travel_time': 1,
                    'flight_details.departure_time': 1
                }
            }
        ]);

        for (const booking of bookings) {
            const passengerDetails = [];
            for (const passengerId of booking.passenger_ids) {
                const passenger = await Passenger.findById(passengerId);
                if (passenger) {
                    passengerDetails.push(passenger);
                }
            }
            booking.passenger_details = passengerDetails;
        }

        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ success: false, message: 'Server error', error });
    }
};

//Bỏ authenJWT thì làm được
export const cancelBooking = async (req, res) => {
    const { booking_id } = req.params;
    const user_id = req.user._id; // Giả sử ID người dùng được lưu trong token

    try {
        const booking = await Booking.findOne({ _id: new mongoose.Types.ObjectId(booking_id), user_id }).populate('flight_id');
        if (!booking) {
            return res.status(404).json({ message: 'Không tìm thấy đặt vé' });
        }

        const currentTime = new Date();
        const departureTime = booking.flight_id.departure_time; 

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

export const createRoundBooking = async (req, res) => {
    const { outbound_flight_id, return_flight_id, ticket_quantity, passengers } = req.body;
    const user_id = req.user._id; // Assuming the user's ID is stored in the token

    try {
        const outboundFlight = await Flight.findById(outbound_flight_id);
        if (!outboundFlight) {
            return res.status(404).json({ message: 'Outbound flight not found' });
        }

        const returnFlight = await Flight.findById(return_flight_id);
        if (!returnFlight) {
            return res.status(404).json({ message: 'Return flight not found' });
        }

        // Check if there are enough economy seats available for both flights
        if (outboundFlight.economy_seats < ticket_quantity || returnFlight.economy_seats < ticket_quantity) {
            return res.status(400).json({ message: 'Not enough economy seats available' });
        }

        // Calculate the total price for both flights
        const outbound_ticket_price = outboundFlight.economy_price;
        const return_ticket_price = returnFlight.economy_price;
        const total_price = ticket_quantity * (outbound_ticket_price + return_ticket_price);

        // Create passengers and collect their IDs
        const passenger_ids = [];
        for (const passenger of passengers) {
            const { fullname, gender, dob, identity_number } = passenger;
            const newPassenger = new Passenger({
                fullname,
                gender,
                date_of_birth: new Date(dob),
                id_number: identity_number,
                flight_id: outbound_flight_id
            });
            await newPassenger.save();
            passenger_ids.push(newPassenger._id);
        }

        // Find the user by ID
        const user = await User.findById(user_id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Create a new booking for the outbound flight
        const newOutboundBooking = new Booking({
            user_id: user._id,
            user_email: user.email,
            flight_id: outbound_flight_id,
            ticket_quantity,
            ticket_price: outbound_ticket_price,
            total_price: ticket_quantity * outbound_ticket_price,
            booking_date: new Date(),
            booking_status: 'Đã đặt',
            passenger_ids,
            updated_at: new Date()
        });

        // Create a new booking for the return flight
        const newReturnBooking = new Booking({
            user_id: user._id,
            user_email: user.email,
            flight_id: return_flight_id,
            ticket_quantity,
            ticket_price: return_ticket_price,
            total_price: ticket_quantity * return_ticket_price,
            booking_date: new Date(),
            booking_status: 'Đã đặt',
            passenger_ids,
            updated_at: new Date()
        });

        // Update the flights' available seats
        outboundFlight.economy_seats -= ticket_quantity;
        returnFlight.economy_seats -= ticket_quantity;
        await outboundFlight.save();
        await returnFlight.save();

        // Save the new bookings
        await newOutboundBooking.save();
        await newReturnBooking.save();

        console.log('Outbound Booking ID:', newOutboundBooking._id);
        console.log('Return Booking ID:', newReturnBooking._id);

        // Update the user's booking list
        user.booking_id.push(newOutboundBooking._id, newReturnBooking._id);
        await user.save();

        res.status(201).json({ message: 'Round-trip booking successful', outbound_booking_id: newOutboundBooking._id, return_booking_id: newReturnBooking._id });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};

export const updateBookingStatus = async (req, res) => {
    const { booking_id } = req.params;

    try {
        const booking = await Booking.findById(booking_id).populate('flight_id');
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const currentTime = new Date();
        const departureTime = booking.flight_id.departure_time;

        if (currentTime > departureTime) {
            booking.booking_status = 'Đã đi';
            booking.updated_at = new Date();
            await booking.save();
        }

        res.status(200).json({ message: 'Booking status updated', booking });
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};