import React from 'react'
import { useState } from 'react'
import Navbar from '../shared/Navbar'
import FlightBooking from './FlightBooking'
import Footer from '../shared/Footer'

import PassengerInfo from './PassengerInfo'
import FlightConfirmation from './FlightConfirmation'


const Flightpage = () => {

  const [currentStep, setCurrentStep] = useState('select');

  const handleConfirm = () => {
    setCurrentStep('passenger');
  };
  const handlePassengerSubmit = () => {
  
    alert('Booking successful');
  }

  const [selectedFlight, setSelectedFlight] = useState({
    type: 'oneway',
    departure: null,
    return: null
  });

  const [numberOfPassenger, setNumberOfPassenger] = useState(1);

  
  const handleSelectFlight = (flight) => {
    setSelectedFlight((prev) => ({
      ...prev,
      departure: flight, 
    }));
  };

  const handleSetNumberOfPassenger = (number) => {
    setNumberOfPassenger(number);
  }

  const sampleFlights = [
    {
      id: 1,
      airline: "Vietnam Airlines",
      departure: "HAN",
      arrival: "SGN", 
      departureDate: "20/11/2024",
      departureTime: "07:00",
      arrivalTime: "09:10",
      price: 1590000,
    },
    {
      id: 2,
      airline: "Bamboo Airways",
      departure: "HAN",
      arrival: "SGN",
      date: "20/11/2024", 
      departureTime: "08:30",
      arrivalTime: "10:40",
      price: 1490000,
    },
    {
      id: 3,
      airline: "VietJet Air",
      departure: "HAN", 
      arrival: "SGN",
      date: "20/11/2024",
      departureTime: "10:15",
      arrivalTime: "12:25",
      price: 1290000,
    },
  ];

  return (
    <>
        <Navbar/>      
      {currentStep === 'select' && (
       <div>
       <FlightBooking
         flights={sampleFlights}
         onSelectFlight={handleSelectFlight} 
         onSetNumberOfPassenger={handleSetNumberOfPassenger}
      />      
        <FlightConfirmation 
         selectedFlight={selectedFlight.departure}
         flightType={selectedFlight.type}
        numberOfPassenger = {numberOfPassenger}
        onConfirm={handleConfirm}
        />
    </div>
      )}
      {currentStep === 'passenger' && (
         <PassengerInfo
         selectedFlight={selectedFlight.departure}
         numberOfPassenger = {numberOfPassenger}
         onSubmit={handlePassengerSubmit}
         onBack={() => setCurrentStep('select')}
       />
      )}
        <Footer/>
    </>
  )
}

export default Flightpage