import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import FlightSearchPage from './FlightSearch';
import FlightListPage from './FlightListPage';
import PassengerInfo from './PassengerInfo';
import { Select } from 'antd';

const FlightPage = () => {
  const [currentStep, setCurrentStep] = useState('search');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [numberOfPassenger, setNumberOfPassenger] = useState(1);
  const [isRoundTrip, setIsRoundTrip] = useState(true);

  const [sampleDepartureFlights, setSampleDepartureFlights] = useState(null);
  const [sampleReturnFlights, setSampleReturnFlights] = useState(null);

  const handleSearchSubmit = (passengers, roundTrip, sampleDepartureFlights, sampleReturnFlights) => {
    setNumberOfPassenger(passengers);
    setIsRoundTrip(roundTrip);
    setSampleDepartureFlights(sampleDepartureFlights);
    setSampleReturnFlights(sampleReturnFlights);
    setCurrentStep('list');
  };

  const handleSelectFlight = (flight) => {
   
    if (isRoundTrip && !selectedFlight) {
      setSelectedFlight(flight);
      setCurrentStep('return');
    } else {
      setReturnFlight(flight);
      setCurrentStep('passenger');
    }
    console.log('selected flight', selectedFlight);
    console.log('return flight', returnFlight);
  };

  const handlePassengerSubmit = (passengers) => {
    alert('Booking successful');
  };

  const handleBack = () => {
    console.log('selected flight', selectedFlight);
    console.log('return flight', returnFlight);
    if (currentStep === 'list') {
      setCurrentStep('search');
    } else if (currentStep === 'return') {
      setSelectedFlight(null);
      setCurrentStep('list');
    } else if (currentStep === 'passenger') {
      if (isRoundTrip) {
        setReturnFlight(null);
        setCurrentStep('return');
      } else {
        setSelectedFlight(null);
        setCurrentStep('list');
      }
    }
  };

  return (
    <>
      <Navbar />
      {currentStep === 'search' && (
        <FlightSearchPage onSubmit={handleSearchSubmit} />
      )}
      {currentStep === 'list' && (
        <FlightListPage 
          onSelectFlight={handleSelectFlight} 
          onBack={handleBack} 
          numberOfPassenger={numberOfPassenger} 
          flights={sampleDepartureFlights} 
        />
      )}
      {currentStep === 'return' && (
        <FlightListPage 
          onSelectFlight={handleSelectFlight} 
          onBack={handleBack} 
          isReturn 
          numberOfPassenger={numberOfPassenger} 
          flights={sampleReturnFlights} 
        />
      )}
      {currentStep === 'passenger' && (
        <PassengerInfo
          onSubmit={handlePassengerSubmit}
          selectedFlight={selectedFlight}
          returnFlight={returnFlight}
          numberOfPassenger={numberOfPassenger}
          onBack={handleBack}
        />
      )}
      <Footer />
    </>
  );
};

export default FlightPage;