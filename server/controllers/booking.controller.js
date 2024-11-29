import User from '../models/users.js';
import Booking from '../models/bookings.js';
import Flight from '../models/flights.js';

export const getBookingsByUserEmail = async (req, res) => {
    const { email } = req.params;
    console.log(`Fetching bookings for user email: ${email}`);

    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const bookings = await Booking.find({ user_email: user.email });
        const flightDetails = await Promise.all(bookings.map(async (booking) => {
            const flight = await Flight.findOne({ flight_id: booking.flight_id });
            return {
                booking_id: booking.booking_id,
                departure_location: flight.departure_location,
                destination: flight.destination,
                ticket_price: flight.ticket_price,
                departure_time: flight.departure_time,
                travel_time: flight.travel_time,
                ticket_quantity: booking.ticket_quantity
            };
        }));

        res.json(flightDetails);
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

        const booking = await Booking.findOne({ booking_id: booking_id, user_email: email });
        if (!booking) {
            console.log('Booking not found for this user');
            return res.status(404).json({ message: 'Booking not found for this user' });
        }

        const flight = await Flight.findOne({ flight_id: booking.flight_id });
        if (!flight) {
            console.log('Flight not found');
            return res.status(404).json({ message: 'Flight not found' });
        }

        const flightDetails = {
            booking_id: booking.booking_id,
            departure_location: flight.departure_location,
            destination: flight.destination,
            ticket_price: flight.ticket_price,
            departure_time: flight.departure_time,
            travel_time: flight.travel_time,
            ticket_quantity: booking.ticket_quantity
        };

        res.json(flightDetails);
    } catch (error) {
        console.error('Server error:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
