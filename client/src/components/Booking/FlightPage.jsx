import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import Footer from '../shared/Footer';
import FlightSearchPage from './FlightSearch';
import FlightListPage from './FlightListPage';
import PassengerInfo from './PassengerInfo';
import { Select } from 'antd';
import { toast } from 'sonner'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from '@/redux/authSlice';

import { BOOKING_API_END_POINT, LOCAL_STORAGE_TOKEN_NAME } from '../../utils/constraint';

const FlightPage = () => {
  const [currentStep, setCurrentStep] = useState('search');
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [returnFlight, setReturnFlight] = useState(null);
  const [numberOfPassenger, setNumberOfPassenger] = useState(1);
  const [isRoundTrip, setIsRoundTrip] = useState(true);

  const [departureFlights, setDepartureFlights] = useState(null);
  const [returnFlights, setReturnFlights] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector(store => store.booking);

  const handleSearchSubmit = (passengers, roundTrip, departureFlights, returnFlights) => {
    setNumberOfPassenger(passengers);
    setIsRoundTrip(roundTrip);
    setDepartureFlights(departureFlights);
    setReturnFlights(returnFlights);
    setCurrentStep('list');
  };

  const handleSelectFlight = (flight) => {
   
    if (!isRoundTrip) {
      setSelectedFlight(flight);
      console.log('selected flight', selectedFlight);
      setCurrentStep('passenger');
    }
    else if (isRoundTrip && !selectedFlight) {
      setSelectedFlight(flight);
      setCurrentStep('return');
    } else {
      setReturnFlight(flight);
      setCurrentStep('passenger');
    }
    
  };

  const handlePassengerSubmit = async (formData) => {
    dispatch(setLoading(true));
    console.log('formData', formData);
    try {
      const endpoint = isRoundTrip ? `${BOOKING_API_END_POINT}/round-bookings` : `${BOOKING_API_END_POINT}/bookings`;
      const response = await axios.post(endpoint, formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`
        },
      });
      if (response.status === 201) {
        toast.success("Đặt vé thành công");
        window.scrollTo(0, 0);
        navigate('/');
      } else {
        toast.error("Vui lòng thử lại");
      }
    } catch (error) {
      console.error('Error submitting passenger info:', error);
      toast.error("Vui lòng thử lại");
    } finally {
      dispatch(setLoading(false));
    }
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
          flights={departureFlights} 
        />
      )}
      {currentStep === 'return' && (
        <FlightListPage 
          onSelectFlight={handleSelectFlight} 
          onBack={handleBack} 
          isReturn 
          numberOfPassenger={numberOfPassenger} 
          flights={returnFlights} 
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