// import mongoose from 'mongoose'; // Import mongoose
// import Booking from '../models/bookings.js';
// import FlightModel from '../models/flights.js'; // Import Flight model

// export const createBooking = async (req, res) => {
//   try {
//     const { user_id, flight_id, seat_class, total_price, passenger_id } = req.body; 

//     const session = await mongoose.startSession();
//     session.startTransaction();

//     try {
//       const booking = new Booking({
//         booking_id: new mongoose.Types.ObjectId(),
//         user_id,
//         flight_id,
//         seat_class,
//         total_price,
//         passenger_id,
//         status: 'pending'
//       });

//       const savedBooking = await booking.save({ session });

//       for (const flight of flight_id) {
//         const flightDoc = await FlightModel.findById(flight).session(session);
//         if (!flightDoc) {
//           throw new Error('Flight not found');
//         }

//         for (const seat of seat_class) {
//           if (seat.class === 'economy') {
//             flightDoc.economy_seats -= seat.ticket_quantity;
//           } else if (seat.class === 'business') {
//             flightDoc.business_seats -= seat.ticket_quantity;
//           }
//         }

//         await flightDoc.save({ session });
//       }

//       await session.commitTransaction();
//       session.endSession();

//       res.status(201).json(savedBooking);
//     } catch (error) {
//       await session.abortTransaction();
//       session.endSession();
//       throw error;
//     }
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getBookingByBookingId = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.bookingId);
//     if (!booking) {
//       return res.status(404).json({ message: 'Booking not found' });
//     }
//     res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getBookingsByUserId = async (req, res) => {
//   try {
//     const bookings = await Booking.find({ user_id: req.params.userId });
//     if (!bookings.length) {
//       return res.status(404).json({ message: 'No bookings found for this user' });
//     }
//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
