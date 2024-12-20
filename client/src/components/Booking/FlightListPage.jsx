import React, { useState } from 'react';
import { 
  ArrowRight, 
  Clock, 
  Plane, 
  User, 
  Briefcase, 
  CreditCard, 
  Check, 
  X, 
  ArrowLeft,
  Timer 
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Confirmation Component
const FlightConfirmation = ({ selectedFlight, onConfirm, numberOfPassenger }) => {
  if (!selectedFlight) return null;

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl p-4 lg:p-6 space-y-4 lg:space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-[#008080]">Chi Tiết Đặt Chỗ</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Plane className="text-[#008080]" />
          <div>
            <p className="font-semibold ">{selectedFlight.flight_code}</p>
            <p className="text-sm text-gray-500">{selectedFlight.id}</p>
           </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Clock className="text-amber-500" />
            <p className = "text-gray-500 font-semibold">{formatTime(selectedFlight.departure_time)}</p>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2">
            <User className="text-[#008080]" />
            <span>Số hành khách</span>
          </div>
          <span className="font-bold">{numberOfPassenger}</span>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <CreditCard className="text-[#008080]" />
            <span>Tổng giá</span>
          </div>
          <span className="text-2xl font-bold text-[#DAA520]">
            {(selectedFlight.economy_price * numberOfPassenger).toLocaleString()} VND
          </span>
        </div>

        <button 
          onClick={onConfirm}
          className="w-full bg-[#008080] text-white py-4 rounded-lg 
          hover:bg-[#006666] transition flex items-center justify-center space-x-2"
        >
          <Check />
          <span>Xác Nhận Đặt Vé</span>
        </button>
      </div>
    </div>
  );
};

const FlightListPage = ({ onSelectFlight, onBack, isReturn, numberOfPassenger, flights }) => {
  const [selectedFlight, setSelectedFlight] = useState(null);

  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
  };

  const handleConfirm = () => {
    onSelectFlight(selectedFlight);
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-6 lg:py-12">
        <div className="container mx-auto px-3 lg:px-4">
          <div className="text-center mb-6 lg:mb-8 relative">
            <button 
              onClick={onBack}
              className="absolute left-0 top-0 mt-2 ml-2 lg:mt-4 lg:ml-4 text-[#008080] hover:text-[#006666] transition"
            >
              <ArrowLeft size={20} className="lg:w-6 lg:h-6" />
            </button>
            <h1 className="text-2xl lg:text-4xl font-bold text-[#008080] mb-2 lg:mb-4">
              {isReturn ? 'Chọn chuyến bay về' : 'Danh sách chuyến đi'}
            </h1>
            <p className="text-sm lg:text-base text-gray-600 max-w-xl mx-auto">
              {isReturn ? 'Chọn chuyến bay về phù hợp với lịch trình của bạn' : 'Khám phá các chuyến bay phù hợp với lịch trình của bạn'}
            </p>
          </div>

          <div className="flex flex-col lg:flex-row lg:space-x-8 space-y-4 lg:space-y-0">
            {/* Flight List Section */}
            <div className="w-full lg:w-2/3 space-y-3 lg:space-y-4">
              {flights.map((flight) => (
                <Card 
                  key={flight._id}
                  className="group hover:shadow-xl transition-all duration-300 border-l-4 border-l-[#008080] hover:border-l-[#DAA520]"
                >
                  <CardContent className="p-3 lg:p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-3 lg:space-y-0">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 lg:space-x-3 mb-3 lg:mb-4">
                          <Plane className="text-[#008080] transform -rotate-45 w-4 h-4 lg:w-5 lg:h-5" />
                          <h3 className="text-lg lg:text-xl font-bold text-[#008080]">
                            <span className="text-[#DAA520]">Q</span>Airline
                          </h3>
                          <Badge variant="secondary" className="bg-gray-100 text-xs lg:text-sm">
                            {flight.flight_code}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 lg:space-x-8">
                            <div className="text-center">
                              <p className="text-base lg:text-lg font-semibold">{formatTime(flight.departure_time).split(' ')[1]}</p>
                              <p className="text-xs lg:text-sm text-gray-600">{formatTime(flight.departure_time).split(' ')[0]}</p>
                              <p className="text-xs lg:text-sm font-medium text-[#008080]">{flight.departure_location}</p>
                            </div>

                            <div className="flex flex-col items-center flex-shrink-0">
                              <div className="h-[2px] w-16 lg:w-24 bg-gradient-to-r from-[#008080] to-[#DAA520]" />
                              <div className="flex items-center space-x-1 my-1">
                                <Timer size={12} className="text-gray-400" />
                                <span className="text-xs text-gray-500">{flight.travel_time}h</span>
                              </div>
                              <ArrowRight className="text-[#008080] w-4 h-4" />
                            </div>

                            <div className="text-center">
                              <p className="text-base lg:text-lg font-semibold text-gray-900">
                                {formatTime(new Date(new Date(flight.departure_time).getTime() + flight.travel_time * 3600000)).split(' ')[1]}
                              </p>
                              <p className="text-xs lg:text-sm font-medium text-gray-600">
                                {formatTime(new Date(new Date(flight.departure_time).getTime() + flight.travel_time * 3600000)).split(' ')[0]}
                              </p>
                              <p className="text-xs lg:text-sm font-medium text-[#008080]">{flight.destination}</p>
                            </div>
                          </div>

                          {/* Price and Seats Section - Mobile view */}
                          <div className="flex flex-col items-end space-y-1 lg:hidden">
                            <p className="text-lg font-bold text-[#DAA520]">
                              {flight.economy_price.toLocaleString()} VND
                            </p>
                            <Badge variant="outline" className="border-[#008080] text-[#008080] text-xs">
                              Còn {flight.economy_seats} chỗ
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Desktop price and button section remains unchanged */}
                      <div className="hidden lg:flex lg:flex-col items-end justify-start space-y-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-bold text-[#DAA520]">
                            {flight.economy_price.toLocaleString()} VND
                          </p>
                          <Badge variant="outline" className="border-[#008080] text-[#008080] text-xs">
                            Còn {flight.economy_seats} chỗ
                          </Badge>
                        </div>
                        <button 
                          onClick={() => handleSelectFlight(flight)}
                          className="w-full bg-[#008080] text-white px-6 py-2.5 rounded-lg 
                          hover:bg-[#006666] transition-colors duration-200 flex items-center justify-center space-x-2
                          group-hover:bg-[#DAA520] text-base"
                        >
                          <span>Chọn</span>
                          <ArrowRight size={16} className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Mobile Select Button */}
                      <div className="lg:hidden w-full">
                        <button 
                          onClick={() => handleSelectFlight(flight)}
                          className="w-full bg-[#008080] text-white px-4 py-2 rounded-lg 
                          hover:bg-[#006666] transition-colors duration-200 flex items-center justify-center space-x-2
                          group-hover:bg-[#DAA520] text-sm"
                        >
                          <span>Chọn</span>
                          <ArrowRight size={16} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Confirmation Section */}
            <div className="w-full lg:w-1/3 flex justify-center">
              {selectedFlight ? (
                <FlightConfirmation 
                  selectedFlight={selectedFlight} 
                  onConfirm={handleConfirm}
                  numberOfPassenger={numberOfPassenger}
                />
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full mx-auto">
                  <Plane className="mx-auto text-gray-300 mb-4" size={64} />
                  <p className="text-gray-500">
                    Chọn một chuyến bay để xem chi tiết đặt chỗ
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FlightListPage;