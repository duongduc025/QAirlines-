import React, { useState } from 'react';
import { Calendar, Plane, ArrowRight, Filter, SortDesc, UserPlus, UserMinus } from 'lucide-react';
import { FLIGHT_API_END_POINT, LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint';
import airportCodes from '@/utils/airport_code';
import { toast } from 'sonner';
import axios from 'axios';

const FlightBooking = ({ flights, onSelectFlight, onSetNumberOfPassenger }) => {
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengers, setPassengers] = useState({ adults: 1 });
  const [formData, setFormData] = useState({
    departure_location: '',
    destination: '',
    departure_date: '',
    returnDate: '',
    ticket_quantity: '',
  });

  const sampleFlights = [
    {
      id: 4,
      airline: "Pacific Airlines",
      departure: "SGN",
      arrival: "DAD",
      departureDate: "21/11/2024",
      departureTime: "06:00",
      arrivalTime: "07:20",
      price: 990000,
    },
    {
      id: 5,
      airline: "Vietnam Airlines",
      departure: "SGN",
      arrival: "DAD",
      departureDate: "21/11/2024",
      departureTime: "09:00",
      arrivalTime: "10:20",
      price: 1290000,
    },
    {
      id: 6,
      airline: "Bamboo Airways",
      departure: "SGN",
      arrival: "DAD",
      departureDate: "21/11/2024",
      departureTime: "11:30",
      arrivalTime: "12:50",
      price: 1190000,
    },
  ];

  const [flightList, setFlightList] = useState(flights);
  const [flightReturnList, setFlightReturnList] = useState(sampleFlights);
  console.log('Flight Return List:', flightReturnList);
  const [departure_flight, setDepartureFlight] = useState([null]);
  const [return_flight, setReturnFlight] = useState([null]);
  const [isSelectingReturn, setIsSelectingReturn] = useState(false);

  const [searchResults, setSearchResults] = useState([]);
  const [sortBy, setSortBy] = useState('price');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const updatePassengers = (type, operation) => {
    setPassengers(prev => ({
      ...prev,
      [type]: Math.max(0, operation === 'add' ? prev[type] + 1 : prev[type] - 1)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidDeparture = airportCodes.some(airport => airport.code === formData.departure_location);
    const isValidDestination = airportCodes.some(airport => airport.code === formData.destination);
    setSearchResults(flights);
    // if (!isValidDeparture || !isValidDestination) {
    //   toast.error('Vui lòng chọn điểm khởi hành và điểm đến hợp lệ');
    //   return;
    // }

    // setFormData({ ...formData, ticket_quantity: passengers.adults });
    // const searchInput = {
    //   departure_location: formData.departure_location,
    //   destination: formData.destination,
    //   departure_date: formData.departure_date,
    //   ticket_quantity: passengers.adults,
    // };

    // try {
    //   const response = await axios.get(`${FLIGHT_API_END_POINT}/search`, searchInput, {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
    //     },
    //   });

    //   const departureFlights = response.data;
    //   console.log('Departure Flights:', departureFlights);

    //   let returnFlights = [];

    //   if (formData.returnDate) {
    //     const returnSearchInput = {
    //       departure_location: formData.destination,
    //       destination: formData.departure_location,
    //       departure_date: formData.returnDate,
    //       ticket_quantity: passengers.adults,
    //     };

    //     const returnResponse = await axios.get(`${FLIGHT_API_END_POINT}/search`, returnSearchInput, {
    //       headers: {
    //         'Content-Type': 'application/json',
    //         "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
    //       },
    //     });

    //     returnFlights = returnResponse.data;
    //     console.log('Return Flights:', returnFlights);
    //   }

    //   setSearchResults([...departureFlights, ...returnFlights]);
    // } catch (error) {
    //   toast.error('Có lỗi xảy ra khi tìm kiếm chuyến bay');
    //   console.error('Error fetching flights:', error);
    // }
  };

  const handleSelectFlight = (flight) => {
    if (isRoundTrip && !isSelectingReturn) {
      setDepartureFlight(flight);
      setSearchResults(flightReturnList);
      setIsSelectingReturn(true);
      onSelectFlight(flight);
      onSetNumberOfPassenger(passengers.adults);
      console.log('1');
    } else {
      console.log('2');
      setReturnFlight(flight);
      onSelectFlight(flight);
      onSetNumberOfPassenger(passengers.adults);
    }
  };

  const handleSearch = (input, type) => {
    if (!input) return type === 'origin' ? setOriginSuggestions([]) : setDestSuggestions([]);
    
    const filtered = airportCodes.filter(airport => 
      airport.name.toLowerCase().includes(input.toLowerCase()) ||
      airport.code.toLowerCase().includes(input.toLowerCase())
    );
    
    if (type === 'origin') {
      setOriginSuggestions(filtered);
    } else {
      setDestSuggestions(filtered);
    }
  };

  const sortedFlights = [...searchResults].sort((a, b) => {
    switch(sortBy) {
      case 'price': return a.price - b.price;
      case 'duration': 
        const [aHours, aMins] = a.duration.split('h').map(Number);
        const [bHours, bMins] = b.duration.split('h').map(Number);
        return (aHours * 60 + aMins) - (bHours * 60 + bMins);
      default: return 0;
    }
  });

  return (
    <div className="bg-gray-100 min-h-screen w-2/3 ml-20">
      <div className="container mx-auto px-6 relative z-10 pt-10">
        <div className="bg-white rounded-xl shadow-xl p-8 border border-[#008080]/20">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#008080]">Tìm Chuyến Bay</h2>
            <div className="space-x-4">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={isRoundTrip}
                  onChange={() => setIsRoundTrip(true)}
                  className="hidden"
                />
                <span className={`px-4 py-2 rounded-full ${isRoundTrip ? 'bg-[#008080] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  Khứ hồi
                </span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  checked={!isRoundTrip}
                  onChange={() => setIsRoundTrip(false)}
                  className="hidden"
                />
                <span className={`px-4 py-2 rounded-full ${!isRoundTrip ? 'bg-[#008080] text-white' : 'bg-gray-100 text-gray-600'}`}>
                  Một chiều
                </span>
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="relative">
                <label className="block text-[#008080] font-medium mb-2">Điểm khởi hành</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DAA520]" />
                  <input
                    type="text"
                    name="departure_location"
                    value={formData.departure_location}
                    className="w-full p-3 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                    placeholder="Chọn điểm đi"
                    onChange={(e) => {
                      setFormData({ ...formData, departure_location: e.target.value });
                      handleSearch(e.target.value, 'origin');
                    }}
                  />
                  {originSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                      {originSuggestions.map((airport) => (
                        <div
                          key={airport.code}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData({ ...formData, departure_location: airport.code });
                            setOriginSuggestions([]);
                          }}
                        >
                          {airport.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block text-[#008080] font-medium mb-2">Điểm đến</label>
                <div className="relative">
                  <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DAA520] rotate-90" />
                  <input
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={(e) => {
                      setFormData({ ...formData, destination: e.target.value });
                      handleSearch(e.target.value, 'destination');
                    }}
                    className="w-full p-3 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                    placeholder="Chọn điểm đến"
                  />
                  {destSuggestions.length > 0 && (
                    <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                      {destSuggestions.map((airport) => (
                        <div
                          key={airport.code}
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => {
                            setFormData({ ...formData, destination: airport.code });
                            setDestSuggestions([]);
                          }}
                        >
                          {airport.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative">
                <label className="block text-[#008080] font-medium mb-2">Ngày đi</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DAA520]" />
                  <input
                    type="date"
                    name="departure_date"
                    value={formData.departure_date}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  />
                </div>
              </div>

              {isRoundTrip && (
                <div className="relative">
                  <label className="block text-[#008080] font-medium mb-2">Ngày về</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DAA520]" />
                    <input
                      type="date"
                      name="returnDate"
                      value={formData.returnDate}
                      onChange={handleInputChange}
                      className="w-full p-3 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <label className="block text-[#008080] font-medium mb-2">Hành khách</label>
                <div className="bg-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span>Số người</span>
                    <div className="flex items-center space-x-2">
                      <button 
                        type="button"
                        onClick={() => updatePassengers('adults', 'remove')}
                        className="bg-[#008080] text-white rounded-full p-1 disabled:opacity-50"
                        disabled={passengers.adults <= 1}
                      >
                        <UserMinus className="h-4 w-4" />
                      </button>
                      <span>{passengers.adults}</span>
                      <button 
                        type="button"
                        onClick={() => updatePassengers('adults', 'add')}
                        className="bg-[#008080] text-white rounded-full p-1"
                      >
                        <UserPlus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6">
              <button
                type="submit"
                className="px-8 py-3 bg-[#008080] text-white rounded-lg hover:bg-[#006666] transform transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008080]"
              >
                Tìm Chuyến Bay
              </button>
            </div>
          </form>
        </div>
      </div>

      {searchResults.length > 0 && (
        <div className="container mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#008080]">Kết Quả Tìm Kiếm Chuyến Bay</h2>
            <div className="flex space-x-4">
              <div className="relative group">
                <button 
                  className="flex items-center px-4 py-2 bg-gray-100 rounded-lg hover:bg-[#008080] hover:text-white transition"
                  onClick={() => setSortBy(sortBy === 'price' ? 'duration' : 'price')}
                >
                  <SortDesc className="mr-2 h-5 w-5" />
                  Sắp xếp: {sortBy === 'price' ? 'Giá' : 'Thời gian'}
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {sortedFlights.map(flight => (
              <div 
                key={flight.id} 
                className="bg-white border border-[#008080]/20 rounded-lg shadow-md p-6 hover:shadow-xl transition-all"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-4">
                    <Plane className="h-8 w-8 text-[#DAA520]" />
                    <div>
                      <p className="font-bold text-[#008080]">{flight.airline}</p>
                      <p className="text-sm text-gray-500">{flight.from} → {flight.to}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="font-bold">{flight.departureTime}</p>
                      <p className="text-sm text-gray-500">{flight.from}</p>
                    </div>
                    <ArrowRight className="h-5 w-5 text-[#DAA520]" />
                    <div className="text-left">
                      <p className="font-bold">{flight.arrivalTime}</p>
                      <p className="text-sm text-gray-500">{flight.to}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Thời gian bay</p>
                    <p className="font-bold">{flight.duration}</p>
                    <p className="text-sm text-gray-500">{flight.stops === 0 ? 'Bay thẳng' : `${flight.stops} điểm dừng`}</p>
                  </div>
                  <div>
                    <p className="text-xl font-bold text-[#008080]">{flight.price.toLocaleString()} VND</p>
                    <button className="mt-2 px-4 py-2 bg-[#DAA520] text-white rounded-lg hover:bg-[#008080] transition"
                      onClick={() => handleSelectFlight(flight)}>
                      Chọn chuyến bay
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightBooking;