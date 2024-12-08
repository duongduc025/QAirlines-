import React, { useState } from 'react';
import { Calendar, Plane } from 'lucide-react';

const FlightSearchForm = () => {
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departureDate: '',
    returnDate: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  return (
    <div className="container mx-auto px-6 -mt-24 relative z-10 pt-20">
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
              <label className="block text-[#008080] font-medium mb-2">Điểm khởi hàng</label>
              <div className="relative">
                <Plane className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#DAA520]" />
                <input
                  type="text"
                  name="from"
                  value={formData.from}
                  onChange={handleInputChange}
                  className="w-full p-3 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  placeholder="Chọn điểm đi"
                />
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
                  onChange={handleInputChange}
                  className="w-full p-3 pl-12 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] focus:border-transparent"
                  placeholder="Chọn điểm đến"
                />
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
  );
};

export default FlightSearchForm;