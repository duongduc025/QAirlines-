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
  Timer,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Confirmation Component
const FlightConfirmation = ({ selectedFlight, onConfirm, numberOfPassenger }) => {
  if (!selectedFlight) return null;

  // Hàm định dạng thời gian
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white shadow-2xl rounded-2xl p-4 lg:p-6 space-y-4 lg:space-y-6 h-96">
      <div className="flex justify-between items-center border-b pb-4">
        <h2 className="text-2xl font-bold text-[#008080]">Chi tiết đặt chỗ</h2>
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
  const [currentPage, setCurrentPage] = useState(1);
  const flightsPerPage = 5;

  // Calculate pagination values
  const indexOfLastFlight = currentPage * flightsPerPage;
  const indexOfFirstFlight = indexOfLastFlight - flightsPerPage;
  const currentFlights = flights.slice(indexOfFirstFlight, indexOfLastFlight);
  const totalPages = Math.ceil(flights.length / flightsPerPage);

  // Pagination handlers
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  // Add new helper function for pagination
  const generatePaginationNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    return pages;
  };

  // Hàm xử lý khi chọn chuyến bay
  const handleSelectFlight = (flight) => {
    setSelectedFlight(flight);
  };

  // Hàm xử lý khi xác nhận chọn chuyến bay
  const handleConfirm = () => {
    onSelectFlight(selectedFlight);
  };

  // Hàm định dạng thời gian
  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
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
              {currentFlights.map((flight) => (
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

                      {/* Desktop price and button section */}
                      <div className="hidden lg:flex lg:flex-col items-end justify-start space-y-2">
                        <div className="flex items-center space-x-2">
                          <p className="text-2xl font-bold text-[#DAA520]">
                            {flight.economy_price.toLocaleString()} VND
                          </p>
                          <Badge variant="outline" className="border-[#008080] text-[#008080] text-xs">
                            Còn {flight.economy_seats} chỗ
                          </Badge>
                        </div>
                        <div className="w-[140px]"> {/* Add fixed-width container */}
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
                      </div>

                      {/* Mobile Select Button */}
                      <div className="lg:hidden w-[140px] mx-auto"> {/* Add fixed-width container and center */}
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

              {/* Pagination Controls */}
              {flights.length > flightsPerPage && (
                <div className="flex justify-center items-center space-x-2 mt-6">
                  <button
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#008080] hover:bg-[#008080] hover:text-white'
                    }`}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <div className="flex items-center space-x-1">
                    {generatePaginationNumbers().map((page, index) => (
                      <button
                        key={index}
                        onClick={() => page !== '...' && setCurrentPage(page)}
                        disabled={page === '...'}
                        className={`
                          min-w-[32px] h-8 flex items-center justify-center rounded-lg
                          transition-all duration-200 text-sm font-medium
                          ${page === '...' 
                            ? 'cursor-default text-gray-400'
                            : page === currentPage
                              ? 'bg-[#008080] text-white'
                              : 'text-gray-600 hover:bg-[#008080]/10'
                          }
                        `}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-[#008080] hover:bg-[#008080] hover:text-white'
                    }`}
                    aria-label="Next page"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
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
                <div className="bg-white rounded-2xl shadow-lg p-6 text-center max-w-md w-full mx-auto h-96 flex items-center justify-center">
                  <div>
                    <Plane className="mx-auto text-gray-300 mb-4" size={64} />
                    <p className="text-gray-500">
                      Chọn một chuyến bay để xem chi tiết đặt chỗ
                    </p>
                  </div>
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