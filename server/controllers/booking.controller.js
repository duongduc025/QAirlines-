import mongoose from 'mongoose'; // Import mongoose
import Booking from '../models/bookings.js';

export const createBooking = async (req, res) => {
  try {
    const { user_id, flight_id, tickets } = req.body; 

    const bookings = tickets.map(ticket => ({
      user_id,
      flight_id,
      seat_class: ticket.seat_class,
      ticket_price: ticket.ticket_price,
      ticket_quantity: ticket.ticket_quantity,
      status: 'pending',
      booking_id: new mongoose.Types.ObjectId() 
    }));

    const savedBookings = await Booking.insertMany(bookings);

    res.status(201).json(savedBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingByBookingId = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getBookingsByUserId = async (req, res) => {
  try {
    const bookings = await Booking.find({ user_id: req.params.userId });
    if (!bookings.length) {
      return res.status(404).json({ message: 'No bookings found for this user' });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
