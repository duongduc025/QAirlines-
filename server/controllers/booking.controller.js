import User from '../models/users.js';
import Booking from '../models/bookings.js';
import Flight from '../models/flights.js';
import Passenger from '../models/passenger.js';
import mongoose from 'mongoose';

export const getBookingByUserId = async (req, res) => {
    const { id } = req.params;
    console.log(`Lấy thông tin đặt vé cho ID người dùng: ${id}`);
   
    try {
        const user = await User.findById(id);
        if (!user) {
            console.log('Không tìm thấy người dùng');
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
      
        const bookings = await Booking.aggregate([
            { $match: { user_id: user._id } },
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
                    ticket_quantity: 1
                }
            }
        ]);

        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Lỗi máy chủ:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ', error });
    }
};

export const getSpecificBookingByUserId = async (req, res) => {
    const { id, booking_id } = req.params;
    console.log(`Lấy thông tin đặt vé cụ thể cho ID người dùng: ${id}, ID đặt vé: ${booking_id}`);

    try {
        const user = await User.findById(id);
        if (!user) {
            console.log('Không tìm thấy người dùng');
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        const bookings = await Booking.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(booking_id), user_id: user._id } },
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
            console.log('Không tìm thấy đặt vé cho người dùng này');
            return res.status(404).json({ message: 'Không tìm thấy đặt vé cho người dùng này' });
        }

        res.json({ success: true, bookings: bookings[0] });
    } catch (error) {
        console.error('Lỗi máy chủ:', error);
        res.status(500).json({ success: false, message: 'Lỗi máy chủ', error });
    }
};

// Thêm chú thích bằng tiếng Việt cho hàm createBooking
export const createBooking = async (req, res) => {
    const { flight_id, ticket_quantity, passengers } = req.body;
    const user_email = req.user.email; // Giả sử email người dùng được lưu trong token

    try {
        // Tìm chuyến bay theo ID
        const flight = await Flight.findById(flight_id);
        if (!flight) {
            return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });
        }

        // Kiểm tra xem có đủ ghế hạng phổ thông không
        if (flight.economy_seats < ticket_quantity) {
            return res.status(400).json({ message: 'Không đủ ghế hạng phổ thông' });
        }

        // Tính tổng giá vé
        const ticket_price = flight.economy_price;
        const total_price = ticket_quantity * ticket_price;

        // Tạo hành khách và thu thập ID của họ
        const passenger_ids = [];
        for (const passenger of passengers) {
            const { first_name, last_name, email, gender, dob, identity_number } = passenger;
            const newPassenger = new Passenger({
                first_name,
                last_name,
                email,
                gender,
                date_of_birth: new Date(dob),
                id_number: identity_number,
                flight_id
            });
            await newPassenger.save();
            passenger_ids.push(newPassenger._id);
        }

        // Tìm người dùng theo email
        const user = await User.findOne({ email: user_email });
        if (!user) {
            return res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }

        // Tạo đặt vé mới
        const newBooking = new Booking({
            user_id: user._id,
            user_email,
            flight_id,
            ticket_quantity,
            ticket_price,
            total_price,
            booking_date: new Date(),
            booking_status: 'Đã đặt',
            passenger_ids,
            updated_at: new Date()
        });

        // Cập nhật số ghế còn lại của chuyến bay
        flight.economy_seats -= ticket_quantity;
        await flight.save();

        // Lưu đặt vé mới
        await newBooking.save();

        // Cập nhật danh sách đặt vé của người dùng
        user.booking_id.push(newBooking._id);
        await user.save();

        res.status(201).json({ message: 'Đặt vé thành công', booking_id: newBooking._id });
    } catch (error) {
        console.error('Lỗi máy chủ:', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error });
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
        console.log('Danh sách đặt vé:', bookings); // Debug log to check the bookings data
        res.json({ success:true, bookings});
    } catch (error) {
        console.error('Lỗi máy chủ:', error);
        res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
};

//Bỏ authenJWT thì làm được
export const cancelBooking = async (req, res) => {
    const { booking_id } = req.params;
    const user_email = req.user.email; // Giả sử email người dùng được lưu trong token

    try {
        const booking = await Booking.findOne({ _id: mongoose.Types.ObjectId(booking_id), user_email });
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
