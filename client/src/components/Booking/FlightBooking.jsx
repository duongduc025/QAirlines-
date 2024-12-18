  import React, { useState } from 'react';
  import { Calendar, Plane, ArrowRight, Filter, SortDesc, UserPlus, UserMinus } from 'lucide-react';



  const FlightBooking = ({ flights, onSelectFlight, onSetNumberOfPassenger }) => {
    
    const airports = [
      { code: 'HAN', name: 'Nội Bài International Airport, Hà Nội' },
      { code: 'SGN', name: 'Tân Sơn Nhất International Airport, Hồ Chí Minh' },
      { code: 'DAD', name: 'Đà Nẵng International Airport, Đà Nẵng' },
      { code: 'PQC', name: 'Phú Quốc International Airport, Phú Quốc' },
      { code: 'CXR', name: 'Cam Ranh International Airport, Nha Trang' },
      { code: 'HUI', name: 'Phú Bài International Airport, Huế' },
      { code: 'BKK', name: 'Suvarnabhumi Airport, Bangkok, Thái Lan' },
      { code: 'HKG', name: 'Hong Kong International Airport, Hồng Kông' },
      { code: 'ICN', name: 'Incheon International Airport, Seoul, Hàn Quốc' },
      { code: 'NRT', name: 'Narita International Airport, Tokyo, Nhật Bản' },
      { code: 'KIX', name: 'Kansai International Airport, Osaka, Nhật Bản' },
      { code: 'SIN', name: 'Changi Airport, Singapore' },
      { code: 'TLH', name: 'Taiwan Taoyuan International Airport, Đài Loan' },
      { code: 'DEL', name: 'Indira Gandhi International Airport, New Delhi, Ấn Độ' },
      { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport, Mumbai, Ấn Độ' },
      { code: 'DXB', name: 'Dubai International Airport, Dubai, UAE' },
      { code: 'DOH', name: 'Hamad International Airport, Doha, Qatar' },
      { code: 'MNL', name: 'Ninoy Aquino International Airport, Manila, Philippines' },
      { code: 'KUL', name: 'Kuala Lumpur International Airport, Malaysia' },
      { code: 'REP', name: 'Siem Reap International Airport, Campuchia' },
      { code: 'PNH', name: 'Phnom Penh International Airport, Campuchia' },
      { code: 'BWN', name: 'Brunei International Airport, Brunei' },
      { code: 'KHH', name: 'Kaohsiung International Airport, Đài Loan' },
      { code: 'TPE', name: 'Taipei Taoyuan International Airport, Đài Loan' },
      { code: 'HKT', name: 'Phuket International Airport, Thái Lan' },
      { code: 'CJU', name: 'Jeju International Airport, Hàn Quốc' },
      { code: 'KTM', name: 'Tribhuvan International Airport, Kathmandu, Nepal' },
      { code: 'DAC', name: 'Hazrat Shahjalal International Airport, Dhaka, Bangladesh' },
      { code: 'MAA', name: 'Chennai International Airport, Chennai, Ấn Độ' },
      { code: 'BKK', name: 'Don Mueang International Airport, Bangkok, Thái Lan' },
      { code: 'NAG', name: 'Dr. Babasaheb Ambedkar International Airport, Nagpur, Ấn Độ' }
    ];

    const [originSuggestions, setOriginSuggestions] = useState([]);
    const [destSuggestions, setDestSuggestions] = useState([]);
    
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [passengers, setPassengers] = useState({
      adults: 1,
    });
    
    const [formData, setFormData] = useState({
      from: '',
      to: '',
      departureDate: '',
      returnDate: ''
    });
    
    const [searchResults, setSearchResults] = useState({
      outboundFlights: [],
      returnFlights: []
    });
    
    const [selectedFlights, setSelectedFlights] = useState({
      outboundFlight: null,
      returnFlight: null
    });
    
    const [sortBy, setSortBy] = useState('price');
    const [searchStage, setSearchStage] = useState('outbound'); 
  
    const handleInputChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const updatePassengers = (type, operation) => {
      setPassengers(prev => ({
        ...prev,
        [type]: Math.max(0, operation === 'add' 
          ? prev[type] + 1 
          : prev[type] - 1)
      }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
        const outboundFlights = flights.filter(flight => 
        flight.from === formData.from && 
        flight.to === formData.to &&
        flight.date === formData.departureDate
      );
      
      setSearchResults(prev => ({
        ...prev,
        outboundFlights: outboundFlights
      }));
      
      setSearchStage('outbound');
    };
  
    const handleReturnSearch = () => {
      const returnFlights = flights.filter(flight => 
        flight.from === formData.to && 
        flight.to === formData.from &&
        flight.date === formData.returnDate
      );
      
      setSearchResults(prev => ({
        ...prev,
        returnFlights: returnFlights
      }));
      
      setSearchStage('return');
    };
  
    const handleSearch = (input, type) => {
      if (!input) return type === 'origin' ? setOriginSuggestions([]) : setDestSuggestions([]);
      
      const filtered = airports.filter(airport => 
        airport.name.toLowerCase().includes(input.toLowerCase()) ||
        airport.code.toLowerCase().includes(input.toLowerCase())
      );
      
      if (type === 'origin') {
        setOriginSuggestions(filtered);
      } else {
        setDestSuggestions(filtered);
      }
    };
  
    const sortFlights = (flights) => {
      return [...flights].sort((a, b) => {
        switch(sortBy) {
          case 'price': return a.price - b.price;
          case 'duration': 
            const [aHours, aMins] = a.duration.split('h').map(Number);
            const [bHours, bMins] = b.duration.split('h').map(Number);
            return (aHours * 60 + aMins) - (bHours * 60 + bMins);
          default: return 0;
        }
      });
    };
  
    const handleFlightSelection = (flight, type) => {
      if (type === 'outbound') {
        setSelectedFlights(prev => ({
          ...prev,
          outboundFlight: flight
        }));
        
        if (!isRoundTrip) {
          onSelectFlight(flight);
          onSetNumberOfPassenger(passengers.adults);
        } else {
          handleReturnSearch();
        }
      } else if (type === 'return') {
        setSelectedFlights(prev => ({
          ...prev,
          returnFlight: flight
        }));
        
        onSelectFlight({
          outbound: selectedFlights.outboundFlight,
          return: flight
        });
        onSetNumberOfPassenger(passengers.adults);
      }
    };

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
                      name="from"
                      value={formData.from}
        
                      className="w-full p-3 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                      placeholder="Chọn điểm đi"
                      onChange={(e) => {
                      setFormData({ ...formData, from: e.target.value });
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
                          setFormData({ ...formData, from: airport.code });
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
                      name="to"
                      value={formData.to}
                      onChange={(e) => {
                        setFormData({ ...formData, to: e.target.value });
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
                          setFormData({ ...formData, to: airport.code });
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
                      name="departureDate"
                      value={formData.departureDate}
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
                          onClick={() => 
                            {
                              updatePassengers('adults', 'remove')
                              
                            }}
                          className="bg-[#008080] text-white rounded-full p-1 disabled:opacity-50"
                          disabled={passengers.adults <= 1}
                        >
                          <UserMinus className="h-4 w-4" />
                        </button>
                        <span>{passengers.adults}</span>
                        <button 
                          type="button"
                          onClick={() =>{
                      
                          updatePassengers('adults', 'add')
                          }
                          }
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

        {(searchResults.outboundFlights.length > 0 || searchResults.returnFlights.length > 0) && (
        <div className="container mx-auto px-6 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-[#008080]">
              {searchStage === 'outbound' 
                ? 'Chọn Chuyến Bay Đi' 
                : 'Chọn Chuyến Bay Về'}
            </h2>
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
            {searchStage === 'outbound' 
              ? sortFlights(searchResults.outboundFlights).map(flight => (
                  <div 
                    key={flight.id} 
                    className="bg-white border border-[#008080]/20 rounded-lg shadow-md p-6 hover:shadow-xl transition-all"
                  >
                    {/* [Flight display details remain the same] */}
                    <div className="flex justify-between items-center">
                      {/* [Previous flight details rendering] */}
                      <div>
                        <p className="text-xl font-bold text-[#008080]">{flight.price.toLocaleString()} VND</p>
                        <button 
                          className="mt-2 px-4 py-2 bg-[#DAA520] text-white rounded-lg hover:bg-[#008080] transition"
                          onClick={() => handleFlightSelection(flight, 'outbound')}
                        >
                          Chọn chuyến bay
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              : sortFlights(searchResults.returnFlights).map(flight => (
                  <div 
                    key={flight.id} 
                    className="bg-white border border-[#008080]/20 rounded-lg shadow-md p-6 hover:shadow-xl transition-all"
                  >
                    {/* [Same rendering as outbound flights] */}
                    <div className="flex justify-between items-center">
                      {/* [Previous flight details rendering] */}
                      <div>
                        <p className="text-xl font-bold text-[#008080]">{flight.price.toLocaleString()} VND</p>
                        <button 
                          className="mt-2 px-4 py-2 bg-[#DAA520] text-white rounded-lg hover:bg-[#008080] transition"
                          onClick={() => handleFlightSelection(flight, 'return')}
                        >
                          Chọn chuyến bay về
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