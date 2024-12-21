import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plane } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setSingleBooking } from '@/redux/bookingSlice';
import { BOOKING_API_END_POINT } from '@/utils/constraint';
import { format } from 'date-fns';
import airportCodes from '@/utils/airport_code';

const BookingDetail = () => {

  const dispatch = useDispatch();
  const params = useParams();
  const bookingID = params.id;
  const navigate = useNavigate();
  useEffect(() => {
      // Hàm lấy thông tin chi tiết của một vé đặt
      const fetchSingleBooking = async () => {
        try {
          const response = await axios.get(`${BOOKING_API_END_POINT}/${bookingID}`, {
            headers: {
              "Content-Type": "application/json",
            }
          });
          if (response.data.success) {
            dispatch(setSingleBooking(response.data.booking));
          }
        } catch (error) {
          console.error(error);
          toast.error("Đã có lỗi xảy ra, vui lòng thử lại sau");
        }
      };
      fetchSingleBooking();
  }, [bookingID]);

  const { singleBooking } = useSelector((store) => store.booking);
  const bookingDetail = singleBooking;

  // Hàm định dạng ngày tháng
  const formatDate = (dateString, formatString) => {
    const date = new Date(dateString);
    if (isNaN(date)) {
      return 'Invalid date';
    }
    if (formatString === 'dd/MM/yyyy') {
      return date.toLocaleDateString('en-GB', { timeZone: 'UTC' });
    }
    return date.toLocaleDateString('en-GB', { timeZone: 'UTC' }) + ' ' + date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' });
  };

  // Hàm lấy tên sân bay từ mã sân bay
  const getAirportName = (code) => {
    const airport = airportCodes.find(airport => airport.code === code);
    return airport ? airport.name : code;
  };

  return (
    <div className="max-w-4xl mx-auto p-4 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#008080] to-[#006666] p-6 text-white">
          <div className="flex items-center gap-4">
            <ArrowLeft 
              className="cursor-pointer" 
              onClick={() => navigate('/mybookings')}
            />
            <h2 className="text-2xl font-bold">Chi tiết vé đặt</h2>
          </div>
        </div>

        {/* Flight Info Card */}
        <Card className="mx-6 mt-6 border-[#008080]/20">
          <CardContent className="p-0">
            {/* Card Header */}
            <div className="p-4 border-b border-[#008080]/20 bg-[#008080]/5">
              <div className="flex items-center gap-3">
                <Plane className="w-5 h-5 text-[#008080]" />
                <h3 className="text-lg font-semibold text-[#008080]">Thông tin chuyến bay</h3>
              </div>
            </div>

            {/* Flight Details */}
            <div className="p-6 grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Mã chuyến bay</label>
                  <p className="mt-1 font-medium text-[#008080] break-words">
                    {bookingDetail?.flight_details?.flight_code}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Điểm khởi hành</label>
                  <p className="mt-1 font-medium">
                    {getAirportName(bookingDetail?.flight_details?.departure_location)}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Điểm đến</label>
                  <p className="mt-1 font-medium">
                    {getAirportName(bookingDetail?.flight_details?.destination)}
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Thời gian khởi hành</label>
                  <p className="mt-1 font-medium">
                    {formatDate(bookingDetail?.flight_details?.departure_time, 'HH:mm dd/MM/yyyy')}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Thời gian bay</label>
                  <p className="mt-1 font-medium">
                    {bookingDetail?.flight_details?.travel_time}
                  </p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Tổng giá vé</label>
                  <p className="mt-1 font-medium text-[#DAA520]">
                    {bookingDetail?.total_price.toLocaleString()}đ
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Divider */}
        <div className="h-4"></div>

        {/* Passenger Details */}
        <div className="px-6 pb-6 space-y-4">
          <div className="flex items-center gap-3 my-4">
            <h3 className="text-lg font-semibold text-[#008080]">Thông tin hành khách</h3>
          </div>
          {bookingDetail?.passenger_details?.map((passenger, index) => (
            <Card 
              key={index} 
              className="border-[#008080]/20 hover:border-[#DAA520] transition-colors duration-300"
            >
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-[#008080]">
                    Hành khách {index + 1}
                  </h3>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-[#008080] font-medium">Họ và tên</p>
                      <p className="mt-1">{passenger.fullname}</p>
                    </div>
                    <div>
                      <p className="text-[#008080] font-medium">Giới tính</p>
                      <p className="mt-1">
                        {passenger.gender === 'male' ? 'Nam' : 
                         passenger.gender === 'female' ? 'Nữ' : 'Khác'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-[#008080] font-medium">Ngày sinh</p>
                      <p className="mt-1">{formatDate(passenger.date_of_birth, 'dd/MM/yyyy')}</p>
                    </div>
                    <div>
                      <p className="text-[#008080] font-medium">Số CMND/Hộ chiếu</p>
                      <p className="mt-1">{passenger.id_number}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Summary */}
          <Card className="border-[#008080]/20 hover:border-[#DAA520] transition-colors duration-300">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#008080] mb-4">Tổng kết đặt vé</h3>
              <div className="space-y-2">
                <p className="flex justify-between text-sm">
                  <span className="text-gray-600">Số lượng hành khách:</span>
                  <span className="font-medium">{bookingDetail?.ticket_quantity}</span>
                </p>
                <p className="flex justify-between text-sm">
                  <span className="text-gray-600">Giá vé mỗi người:</span>
                  <span className="font-medium">{(bookingDetail?.total_price / bookingDetail?.ticket_quantity).toLocaleString()}đ</span>
                </p>
                <div className="border-t border-[#008080]/20 my-2"></div>
                <p className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-800">Tổng tiền:</span>
                  <span className="text-[#DAA520]">{bookingDetail?.total_price.toLocaleString()}đ</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BookingDetail;