import React, { useState } from 'react';
import { Minus, Plus, MapPin, Calendar, Search } from 'lucide-react';

import airportCodes from '@/utils/airport_code';
import axios from 'axios';
import { FLIGHT_API_END_POINT, LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint';
import { toast } from 'sonner';


const FlightSearchPage = ({ onSubmit }) => {
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [formData, setFormData] = useState({
    departure_location: '',
    destination: '',
    departure_date: '',
    return_date: '',
    ticket_quantity: ''
  });

  const [passengers, setPassengers] = useState(1);
  const [returnFlights, setReturnFlights] = useState([]);

  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  // Hàm xử lý tìm kiếm sân bay
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

  // Hàm xử lý khi thay đổi thông tin input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Hàm cập nhật số lượng hành khách
  const updatePassengers = (action) => {
    setPassengers(prev => action === 'add' ? prev + 1 : Math.max(1, prev - 1));
  };

  // Hàm lấy ngày hiện tại
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Hàm xử lý khi submit form tìm kiếm chuyến bay
  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValidDeparture = airportCodes.some(airport => airport.code === formData.departure_location);
    const isValidDestination = airportCodes.some(airport => airport.code === formData.destination);
  
    if (!isValidDeparture || !isValidDestination) {
      toast.error('Vui lòng chọn điểm khởi hành và điểm đến hợp lệ');
      return;
    }

    if (formData.departure_location === formData.destination) {
      toast.error('Điểm khởi hành phải khác điểm đến');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const departureDate = new Date(formData.departure_date);
    
    if (!formData.departure_date) {
      toast.error('Vui lòng chọn ngày khởi hành');
      return;
    }

    if (departureDate < today) {
      toast.error('Ngày khởi hành không được trong quá khứ');
      return;
    }

    if (isRoundTrip) {
      if (!formData.return_date) {
        toast.error('Vui lòng chọn ngày về');
        return;
      }

      const returnDate = new Date(formData.return_date);
      if (returnDate < today) {
        toast.error('Ngày về không được trong quá khứ');
        return;
      }
      if (returnDate < departureDate) {
        toast.error('Ngày về phải sau ngày khởi hành');
        return;
      }
    }
  
    try {
      const token = localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME);
      const config = {
        headers: { 
          "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
          "Content-Type": "application/json",
        }
      };
  
      const endpoint = isRoundTrip ? '/searchRound' : '/search';
      const response = await axios.get(`${FLIGHT_API_END_POINT}${endpoint}`, {
        params: {
          ...formData,
          ticket_quantity: passengers
        },
        ...config
      });
  
      if (response.data) {
        console.log(response.data);
        const departureFlights = isRoundTrip ? response.data.departureFlights : response.data;
        const returnFlights = isRoundTrip ? response.data.returnFlights : null;
        onSubmit(passengers, isRoundTrip, departureFlights, returnFlights);
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tìm kiếm chuyến bay');
    }
  };

  return (
    <>
    <div className="min-h-screen bg-gray-50 flex justify-center p-12">
    <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#008080] mb-4">
            Trải nghiệm dịch vụ 5 sao cùng <span className = 'text-[#DAA520]'>Q</span><span className='text-[#008080]'>Airline</span>
          </h1>
          <p className="text-gray-600 max-w-3xl mx-auto text-xl">
          Cất cánh niềm tin, mang về những trải nghiệm diệu kỳ
          </p>
        </div>
      <div className="w-full max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#008080]/90 to-transparent p-8">
            <h2 className="text-3xl font-bold text-white">Tìm Chuyến Bay</h2>
          </div>
          <div className="p-6 flex justify-center">
            <div className="bg-white rounded-full p-2 flex space-x-4 shadow-md">
              {['Khứ hồi', 'Một chiều'].map((type, index) => (
                <button
                  key={type}
                  onClick={() => setIsRoundTrip(index === 0)}
                  className={`px-8 py-3 rounded-full transition-colors duration-300 ${
                    (index === 0 ? isRoundTrip : !isRoundTrip)
                      ? 'bg-[#008080] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Search Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Location Inputs */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Departure Location */}
              <div>
                <label className="block text-[#008080] font-semibold mb-3">
                  Điểm khởi hành
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="text"
                    placeholder="Chọn điểm đi"
                    value={formData.departure_location}
                    onChange={(e) => {
                      handleSearch(e.target.value, 'origin');
                      setFormData(prev => ({ 
                        ...prev, 
                        departure_location: e.target.value 
                      }));
                    }}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] transition"
                  />
                  {originSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg">
                      {originSuggestions.map(airport => (
                        <div 
                          key={airport.code}
                          onClick={() => {
                            setFormData(prev => ({ 
                              ...prev, 
                              departure_location: airport.code 
                            }));
                            setOriginSuggestions([]);
                          }}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          {airport.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Destination Location */}
              <div>
                <label className="block text-[#008080] font-semibold mb-3">
                  Điểm đến
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 rotate-45" />
                  <input
                    type="text"
                    placeholder="Chọn điểm đến"
                    value={formData.destination}
                    onChange={(e) => {
                      handleSearch(e.target.value, 'destination');
                      setFormData(prev => ({ 
                        ...prev, 
                        destination: e.target.value 
                      }));
                    }}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] transition"
                  />
                  {destSuggestions.length > 0 && (
                    <div className="absolute z-20 w-full mt-1 bg-white border rounded-lg shadow-lg">
                      {destSuggestions.map(airport => (
                        <div 
                          key={airport.code}
                          onClick={() => {
                            setFormData(prev => ({ 
                              ...prev, 
                              destination: airport.code 
                            }));
                            setDestSuggestions([]);
                          }}
                          className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          {airport.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Date Inputs */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Departure Date */}
              <div>
                <label className="block text-[#008080] font-semibold mb-3">
                  Ngày khởi hành
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                  <input
                    type="date"
                    name="departure_date"
                    min={getTodayDate()}
                    value={formData.departure_date}
                    onChange={handleInputChange}
                    className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] transition"
                  />
                </div>
              </div>

              {/* Return Date (Conditional) */}
              {isRoundTrip && (
                <div>
                  <label className="block text-[#008080] font-semibold mb-3">
                    Ngày về
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500" />
                    <input
                      type="date"
                      name="return_date"
                      min={formData.departure_date || getTodayDate()}
                      value={formData.return_date}
                      onChange={handleInputChange}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] transition"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Passenger Selection */}
            <div className="bg-gray-50 rounded-lg p-6 flex justify-between items-center max-w-md mx-auto">
              <span className="text-[#008080] font-semibold">
                Số hành khách
              </span>
              <div className="flex items-center space-x-4 ml-4">
                <button
                  type="button"
                  onClick={() => updatePassengers('remove')}
                  disabled={passengers <= 1}
                  className="bg-[#008080] text-white p-3 rounded-full disabled:opacity-50"
                >
                  <Minus size={20} />
                </button>
                <span className="font-bold text-lg">{passengers}</span>
                <button
                  type="button"
                  onClick={() => updatePassengers('add')}
                  className="bg-[#008080] text-white p-3 rounded-full"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>

            {/* Search Button */}
            <div className="text-center mt-8">
              <button
                type="submit"
                className="flex items-center justify-center mx-auto space-x-2 px-12 py-5 bg-[#008080] text-white rounded-lg hover:bg-[#006666] transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#008080]"
              >
                <Search className="mr-2" />
                Tìm Chuyến Bay
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default FlightSearchPage;