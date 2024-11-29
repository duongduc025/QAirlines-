import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from './models/users.js';
import Passenger from './models/passenger.js';
import Flight from './models/flights.js';
import Booking from './models/bookings.js';
import Airplane from './models/airplanes.js';

const clearAllData = async () => {
  try {
    // Xóa tất cả các tài liệu trong các collection
    await User.deleteMany({});
    await Passenger.deleteMany({});
    await Flight.deleteMany({});
    await Booking.deleteMany({});
    await Airplane.deleteMany({});
    console.log('All data has been cleared.');
  } catch (err) {
    console.error('Error clearing data:', err);
  }
};

const createSampleUsers = async () => {
  const users = [
    {
      email: 'user1@example.com',
      fullname: 'User One',
      phoneNumber: '1234567890',
      password: await bcrypt.hash('password1', 10),
      role: 'user',
      booking_id: [new mongoose.Types.ObjectId('000000000000000000000001')]
    },
    {
      email: 'user2@example.com',
      fullname: 'User Two',
      phoneNumber: '0987654321',
      password: await bcrypt.hash('password2', 10),
      role: 'user',
      booking_id: [new mongoose.Types.ObjectId('000000000000000000000002'), new mongoose.Types.ObjectId('000000000000000000000003')]
    }
  ];
  await User.insertMany(users);
};

const createSamplePassengers = async () => {
  const passengers = [
    {
      passenger_id: '000000000001',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      gender: 'Male',
      date_of_birth: new Date('1990-01-01'),
      nationality: 'American',
      id_number: 'ID123456',
      flight_id: new mongoose.Types.ObjectId('000000000000000000000001')
    },
    {
      passenger_id: '000000000002',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      phone: '0987654321',
      gender: 'Female',
      date_of_birth: new Date('1992-02-02'),
      nationality: 'American',
      id_number: 'ID654321',
      flight_id: new mongoose.Types.ObjectId('000000000000000000000002')
    }
  ];
  await Passenger.insertMany(passengers);
};

const createSampleFlights = async () => {
  const flights = [
    {
      flight_id: new mongoose.Types.ObjectId('000000000000000000000001'),
      flight_code: 'NY-LA',
      airplane_code: 'BOE737',
      airplane_id: new mongoose.Types.ObjectId('000000000000000000000001'),
      ticket_price: 100,
      departure_location: 'New York',
      destination: 'Los Angeles',
      travel_time: 300,
      arrival_time: new Date('2023-12-01T10:00:00Z'),
      departure_time: new Date('2023-12-01T07:00:00Z'),
      estimated_arrival: new Date('2023-12-01T10:00:00Z'),
      economy_seats: 150,
      business_seats: 200,
      economy_price: 100,
      business_price: 200
    },
    {
      flight_id: new mongoose.Types.ObjectId('000000000000000000000002'),
      flight_code: 'SF-CHI',
      airplane_code: 'AIRA320',
      airplane_id: new mongoose.Types.ObjectId('000000000000000000000002'),
      ticket_price: 150,
      departure_location: 'San Francisco',
      destination: 'Chicago',
      travel_time: 240,
      arrival_time: new Date('2023-12-02T14:00:00Z'),
      departure_time: new Date('2023-12-02T10:00:00Z'),
      estimated_arrival: new Date('2023-12-02T14:00:00Z'),
      economy_seats: 200,
      business_seats: 70,
      economy_price: 150,
      business_price: 250
    }
  ];
  await Flight.insertMany(flights);
};

const createSampleBookings = async () => {
  const bookings = [
    {
      booking_id: new mongoose.Types.ObjectId('000000000000000000000001'),
      user_email: 'user1@example.com',
      flight_id: [new mongoose.Types.ObjectId('000000000000000000000001')],
      ticket_class: 'economy',
      ticket_quantity: 1,
      ticket_price: 100,
      total_price: 100,
      booking_date: new Date(),
      booking_status: 'Đã đặt',
      passenger_ids: ['000000000001'],
      status: 'confirmed'
    },
    {
      booking_id: new mongoose.Types.ObjectId('000000000000000000000002'),
      user_email: 'user2@example.com',
      flight_id: [new mongoose.Types.ObjectId('000000000000000000000002')],
      ticket_class: 'business',
      ticket_quantity: 2,
      ticket_price: 200,
      total_price: 400,
      booking_date: new Date(),
      booking_status: 'Đã đặt',
      passenger_ids: ['000000000001', '000000000002'],
      status: 'confirmed'
    },
    {
      booking_id: new mongoose.Types.ObjectId('000000000000000000000003'),
      user_email: 'user2@example.com',
      flight_id: [new mongoose.Types.ObjectId('000000000000000000000001')],
      ticket_class: 'business',
      ticket_quantity: 2,
      ticket_price: 100,
      total_price: 100,
      booking_date: new Date(),
      booking_status: 'Đã đặt',
      passenger_ids: ['000000000001', '000000000002'],
      status: 'confirmed'
    }
  ];
  await Booking.insertMany(bookings);
};

const createSampleAirplanes = async () => {
  const airplanes = [
    {
      airplane_id: new mongoose.Types.ObjectId('000000000000000000000001'),
      airplane_code: 'BOE737',
      model: 'Boeing 737',
      capacity: 200,
      airline: 'Airline A',
      manufacture_date: new Date('2010-01-01'),
      last_maintenance_date: new Date('2023-01-01')
    },
    {
      airplane_id: new mongoose.Types.ObjectId('000000000000000000000002'),
      airplane_code: 'AIRA320',
      model: 'Airbus A320',
      capacity: 180,
      airline: 'Airline B',
      manufacture_date: new Date('2012-02-02'),
      last_maintenance_date: new Date('2023-02-02')
    }
  ];
  await Airplane.insertMany(airplanes);
};

const createSampleData = async () => {
  await mongoose.connect('mongodb+srv://tnemo65ldt:mongo%40123@flight.upyhm.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });
  await clearAllData();
  await createSampleUsers();
  await createSamplePassengers();
  await createSampleFlights();
  await createSampleBookings();
  await createSampleAirplanes();
  console.log('Create Done');
  mongoose.disconnect();
};

createSampleData().catch(err => console.error(err));
