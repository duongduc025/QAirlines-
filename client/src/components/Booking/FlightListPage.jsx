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
  ArrowLeft 
} from 'lucide-react';



// Confirmation Component
const FlightConfirmation = ({ selectedFlight, onConfirm, numberOfPassenger }) => {
  if (!selectedFlight) return null;

  return (
    <div className="w-full max-w-md bg-white shadow-2xl rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-[#008080]">Chi Tiết Đặt Chỗ</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <Plane className="text-[#008080]" />
          <div>
            <p className="font-semibold">{selectedFlight.airline}</p>
            <p className="text-sm text-gray-500">{selectedFlight.id}</p>
          </div>
        </div>

        <div className="flex justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="text-amber-500" />
            <span>{selectedFlight.departureTime} - {selectedFlight.arrivalTime}</span>
          </div>
          <span className="text-[#DAA520] font-bold">
            {selectedFlight.duration}
          </span>
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
            {(selectedFlight.price * numberOfPassenger).toLocaleString()} VND
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

  return (
    <>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 relative">
            <button 
              onClick={onBack}
              className="absolute left-0 top-0 mt-4 ml-4 text-[#008080] hover:text-[#006666] transition"
            >
              <ArrowLeft size={24} />
            </button>
            <h1 className="text-4xl font-bold text-[#008080] mb-4">
              {isReturn ? 'Chọn Chuyến Bay Về' : 'Danh Sách Chuyến Bay'}
            </h1>
            <p className="text-gray-600 max-w-xl mx-auto">
              {isReturn ? 'Chọn chuyến bay về phù hợp với lịch trình của bạn' : 'Khám phá các chuyến bay phù hợp với lịch trình của bạn'}
            </p>
          </div>

          <div className="flex space-x-8">
            {/* Flight List Section */}
            <div className="w-2/3 space-y-6">
              {flights.map((flight) => (
                <div 
                  key={flight.id} 
                  className="bg-white rounded-2xl shadow-lg p-6 flex justify-between items-center hover:shadow-xl transition"
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-bold text-[#008080]">
                        {flight.airline}
                      </h3>
                      <span className="text-[#DAA520] font-semibold">
                        {flight.type}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <p className="font-bold">{flight.departureTime}</p>
                          <p className="text-sm text-gray-500">{flight.departureAirport}</p>
                        </div>
                        <ArrowRight className="text-[#008080]" />
                        <div className="text-center">
                          <p className="font-bold">{flight.arrivalTime}</p>
                          <p className="text-sm text-gray-500">{flight.destinationAirport}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-[#DAA520]">
                          {flight.price.toLocaleString()} VND
                        </p>
                        <p className="text-sm text-gray-500">
                          Còn {flight.availableSeats} chỗ
                        </p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSelectFlight(flight)}
                    className="ml-6 bg-[#008080] text-white px-6 py-3 rounded-lg 
                    hover:bg-[#006666] transition flex items-center space-x-2"
                  >
                    <span>Chọn</span>
                    <ArrowRight size={20} />
                  </button>
                </div>
              ))}
            </div>

            {/* Confirmation Section */}
            <div className="w-1/3">
              {selectedFlight ? (
                <FlightConfirmation 
                  selectedFlight={selectedFlight} 
                  onConfirm={handleConfirm}
                  numberOfPassenger={numberOfPassenger}
                />
              ) : (
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center">
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