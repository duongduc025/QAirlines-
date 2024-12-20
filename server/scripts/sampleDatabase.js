import mongoose from 'mongoose';
import Flight from '../models/flights.js';
import Airplane from '../models/airplanes.js';
import { randomInt } from 'crypto';

const locations = [
  'HAN', 'SGN', 'DAD', 'PQC', 'CXR', 'HUI', 'BKK', 'HKG', 'ICN', 'NRT', 'KIX', 'SIN', 'TLH', 'DEL', 'BOM', 'DXB', 'DOH', 'MNL', 'KUL', 'REP', 'PNH', 'BWN', 'KHH', 'TPE', 'HKT', 'CJU', 'KTM', 'DAC', 'MAA', 'DMK', 'NAG', 'SYD', 'MEL', 'AKL', 'LAX', 'JFK', 'SFO', 'ORD', 'SEA', 'YVR', 'YYZ', 'LHR', 'CDG', 'FRA', 'AMS', 'MAD', 'BCN', 'FCO', 'MXP', 'GRU', 'GIG', 'LIM', 'BOG', 'EZE', 'SCL', 'MEX', 'CUN', 'PTY', 'GUA', 'SAL', 'SAP', 'SJO', 'HAV', 'MBJ', 'KIN', 'POS', 'GEO', 'PBM', 'UIO', 'GYE', 'LPB', 'VVI', 'ASU', 'MVD', 'SJU', 'STT', 'STX', 'ANU', 'BGI', 'AUA', 'CUR', 'BON', 'SXM', 'PTP', 'FDF', 'GND', 'TAB', 'EIS', 'SKB', 'SLU', 'UVF', 'GCM', 'PLS', 'BDA', 'FPO', 'GGT', 'ELH'
];

const airplaneModels = [
  'Boeing 737', 'Airbus A320', 'Boeing 777', 'Airbus A380', 'Boeing 787', 'Airbus A350'
];

const generateRandomDate = (start, end) => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

const generateRandomFloat = (min, max) => {
  return (Math.random() * (max - min) + min).toFixed(2);
};

const generateAirplanes = async () => {
  const airplanes = [];
  for (let i = 0; i < 100; i++) {
    airplanes.push({
      airplane_code: `AP${i + 1}`,
      model: airplaneModels[randomInt(0, airplaneModels.length)],
      capacity: randomInt(100, 300),
      manufacture_date: generateRandomDate(new Date('2000-01-01'), new Date('2020-12-31'))
    });
  }
  await Airplane.insertMany(airplanes);
  console.log('Sample airplanes data inserted');
};

const popularLocations = ['HAN', 'SGN', 'DAD', 'PQC', 'CXR', 'HUI'];
const flightTimes = [0, 30, 60]; // 12h00, 12h30, 13h00 in minutes

const generateFlights = async () => {
  const flights = [];
  const startDate = new Date('2024-12-21');
  const endDate = new Date('2024-12-28');

  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    for (let i = 0; i < 40; i++) {
      const departureLocation = popularLocations[randomInt(0, popularLocations.length)];
      let destination;
      do {
        destination = popularLocations[randomInt(0, popularLocations.length)];
      } while (destination === departureLocation);

      const departureTime = new Date(date);
      departureTime.setHours(12, 0, 0, 0);
      departureTime.setMinutes(flightTimes[i % flightTimes.length]);

      const returnDate = new Date(departureTime);
      returnDate.setDate(returnDate.getDate() + randomInt(1, 15));

      const price = generateRandomFloat(1000000, 5000000);
      const airplaneCode = `AP${randomInt(1, 100)}`;
      const economySeats = randomInt(100, 300);
      const travelTime = randomInt(1, 10); // in hours

      flights.push({
        flight_code: `FL${date.getTime()}${i + 1}`,
        airplane_code: airplaneCode,
        departure_location: departureLocation,
        destination,
        departure_time: departureTime,
        travel_time: travelTime,
        economy_seats: economySeats,
        economy_price: price
      });

      const returnFlightDepartureTime = new Date(returnDate);
      returnFlightDepartureTime.setHours(12, 0, 0, 0);
      returnFlightDepartureTime.setMinutes(flightTimes[randomInt(0, flightTimes.length)]);

      flights.push({
        flight_code: `FL${date.getTime()}${i + 101}`,
        airplane_code: airplaneCode,
        departure_location: destination,
        destination: departureLocation,
        departure_time: returnFlightDepartureTime,
        travel_time: travelTime,
        economy_seats: economySeats,
        economy_price: price
      });
    }
  }

  await Flight.insertMany(flights);
  console.log('Sample flights data inserted');
};

mongoose.connect('mongodb+srv://tnemo65ldt:mongo%40123@flight.upyhm.mongodb.net/FlightTicketSelling', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB');
    await generateAirplanes();
    await generateFlights();
    mongoose.disconnect();
  })
  .catch(err => console.error('Could not connect to MongoDB', err));
