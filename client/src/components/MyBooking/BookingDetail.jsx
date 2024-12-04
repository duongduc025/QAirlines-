import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { setSingleBooking } from '@/redux/bookingSlice';


const BookingDetail = () => {
  const {singleBooking} = useSelector((state) => state.booking);
  const {user} = useSelector((state) => state.auth);

  param = useParams();
  const bookingID = params.id;

  useEffect(() => {
    const fetchSingleBooking = async () => {
      try {
        const response = await axios.get(`${BOOKING_API_ENDPOINT}/get/${bookingID}`, {withCredentials: true});
         if(response.data === "Success") {
            dispatch(setSingleBooking(response.data));
         }
      } catch (error) {
        console.error("Error during booking:", error);
        toast.error("An error occurred during booking.");
      }
      fetchSingleBooking();
    }
  }, [bookingID, dispatch, user?._id]);
  const exampleTicket = {
    flight: {
      airline: 'Vietnam Airlines',
      departure: 'Hà Nội',
      arrival: 'Hồ Chí Minh',
      departureDate: '15/12/2024',
      departureTime: '14:30',
      arrivalTime: '16:00',
      price: 2500000
    },
    passengers: [
      {
        lastName: 'Nguyễn Văn A',
        gender: 'male',
        dateOfBirth: '15/05/1990',
        idNumber: '123456789'
      },
      {
        lastName: 'Trần Thị B',
        gender: 'female',
        dateOfBirth: '20/10/1995',
        idNumber: '987654321'
      }
    ]
  };
  const selectedFlight = exampleTicket.flight;
  const passengers = exampleTicket.passengers;
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-[#008080] p-6 text-white">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Chi Tiết Vé Đặt</h2>
          </div>
        </div>

        {/* Flight Info */}
        <div className="bg-[#008080]/10 p-6 border-b border-[#008080]/20">
          <h3 className="text-[#008080] font-semibold mb-4">Thông tin chuyến bay:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="flex justify-between py-2">
                <span className="text-gray-600">Hãng bay:</span>
                <span className="font-medium">{selectedFlight.airline}</span>
              </p>
              <p className="flex justify-between py-2">
                <span className="text-gray-600">Chuyến bay:</span>
                <span className="font-medium">{selectedFlight.departure} - {selectedFlight.arrival}</span>
              </p>
              <p className="flex justify-between py-2">
                <span className="text-gray-600">Ngày bay:</span>
                <span className="font-medium">{selectedFlight.departureDate}</span>
              </p>
            </div>
            <div>
              <p className="flex justify-between py-2">
                <span className="text-gray-600">Giờ bay:</span>
                <span className="font-medium">{selectedFlight.departureTime} - {selectedFlight.arrivalTime}</span>
              </p>
              <p className="flex justify-between py-2">
                <span className="text-gray-600">Số hành khách:</span>
                <span className="font-medium">{passengers.length}</span>
              </p>
              <p className="flex justify-between py-2">
                <span className="text-gray-600">Tổng giá vé:</span>
                <span className="font-medium text-[#DAA520]">{(selectedFlight.price * passengers.length).toLocaleString()}đ</span>
              </p>
            </div>
          </div>
        </div>

        {/* Passenger Details */}
        <div className="p-6 space-y-8">
          {passengers.map((passenger, index) => (
            <Card key={index} className="border-[#008080]/20">
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
                      <p className="mt-1">{passenger.lastName}</p>
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
                      <p className="mt-1">{passenger.dateOfBirth}</p>
                    </div>
                    <div>
                      <p className="text-[#008080] font-medium">Số CMND/Hộ chiếu</p>
                      <p className="mt-1">{passenger.idNumber}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Summary */}
          <Card className="border-[#008080]/20">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-[#008080] mb-4">Tổng kết đặt vé</h3>
              <div className="space-y-2">
                <p className="flex justify-between text-sm">
                  <span className="text-gray-600">Số lượng hành khách:</span>
                  <span className="font-medium">{passengers.length}</span>
                </p>
                <p className="flex justify-between text-sm">
                  <span className="text-gray-600">Giá vé mỗi người:</span>
                  <span className="font-medium">{selectedFlight.price.toLocaleString()}đ</span>
                </p>
                <div className="border-t border-[#008080]/20 my-2"></div>
                <p className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-800">Tổng tiền:</span>
                  <span className="text-[#DAA520]">{(selectedFlight.price * passengers.length).toLocaleString()}đ</span>
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