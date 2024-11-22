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
      status: 'pending'
    }));

    const savedBookings = await Booking.insertMany(bookings);
    res.status(201).json(savedBookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
