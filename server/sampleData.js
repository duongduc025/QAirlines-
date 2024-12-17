
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
      booking_id: ['booking1']
    },
    {
      email: 'user2@example.com',
      fullname: 'User Two',
      phoneNumber: '0987654321',
      password: await bcrypt.hash('password2', 10),
      role: 'user',
      booking_id: ['booking2', 'booking3']
    }
  ];
  await User.insertMany(users);
};

const createSamplePassengers = async () => {
  const passengers = [
    {
      passenger_id: 'passenger1',
      first_name: 'John',
      last_name: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      gender: 'Male',
      date_of_birth: new Date('1990-01-01'),
      nationality: 'American',
      id_number: 'ID123456',
      flight_id: 'flight1'
    },
    {
      passenger_id: 'passenger2',
      first_name: 'Jane',
      last_name: 'Doe',
      email: 'jane.doe@example.com',
      phone: '0987654321',
      gender: 'Female',
      date_of_birth: new Date('1992-02-02'),
      nationality: 'American',
      id_number: 'ID654321',
      flight_id: 'flight2'
    }
  ];
  await Passenger.insertMany(passengers);
};

const createSampleFlights = async () => {
  const flights = [
    {
      flight_id: 'flight1',
      airplane_id: 'airplane1',
      ticket_price: 100,
      departure_location: 'New York',
      destination: 'Los Angeles',
      travel_time: 300,
      arrival_time: new Date('2023-12-01T10:00:00Z'),
      departure_time: new Date('2023-12-01T07:00:00Z'),
      estimated_arrival: new Date('2023-12-01T10:00:00Z'),
      economy_seats: 150,
      business_seats: 50,
      economy_price: 100,
      business_price: 200
    },
    {
      flight_id: 'flight2',
      airplane_id: 'airplane2',
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
      booking_id: 'booking1',
      user_email: 'user1@example.com',
      flight_id: ['flight1'],
      ticket_class: 'economy',
      ticket_quantity: 1,
      ticket_price: 100,
      total_price: 100,
      booking_date: new Date(),
      booking_status: '��ã đặt',
      passenger_ids: ['passenger1'],
      status: 'confirmed'
    },
    {
      booking_id: 'booking2',
      user_email: 'user2@example.com',
      flight_id: ['flight2'],
      ticket_class: 'business',
      ticket_quantity: 2,
      ticket_price: 200,
      total_price: 400,
      booking_date: new Date(),
      booking_status: 'Đã đặt',
      passenger_ids: ['passenger2', 'passenger1'],
      status: 'confirmed'
    },
    {
      booking_id: 'booking3',
      user_email: 'user2@example.com',
      flight_id: ['flight1'],
      ticket_class: 'business',
      ticket_quantity: 2,
      ticket_price: 100,
      total_price: 100,
      booking_date: new Date(),
      booking_status: 'Đã đặt',
      passenger_ids: ['passenger2', 'passenger1'],
      status: 'confirmed'
    }
  ];
  await Booking.insertMany(bookings);
};

const createSampleAirplanes = async () => {
  const airplanes = [
    {
      airplane_id: 'airplane1',
      model: 'Boeing 737',
      capacity: 200,
      airline: 'Airline A',
      manufacture_date: new Date('2010-01-01'),
      last_maintenance_date: new Date('2023-01-01')
    },
    {
      airplane_id: 'airplane2',
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