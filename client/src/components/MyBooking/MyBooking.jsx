import React, { useState } from 'react';
import { Search, AlertTriangle, Trash2, Plane, Calendar, Users, Clock, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { setAllBooking } from '@/redux/bookingSlice';
import { Pagination } from '@/components/ui/pagination';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSelector, useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { toast } from 'sonner'; 
import { LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint';
import { BOOKING_API_END_POINT } from '@/utils/constraint';
import { useNavigate } from 'react-router-dom';
import qairlineLogo from '@/assets/image/qairline_logo.png';
import Airplane from '../../assets/image/airplane.png';

const MyBooking = () => {
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const bookingsPerPage = 4;

  const { allBooking } = useSelector((store) => store.booking);
  const [ userBooking, setUserbooking ] = useState(allBooking);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleCancelBooking = async () => {
    if (selectedBooking) {
      console.log(selectedBooking);
      try {
        const response = await fetch(`${BOOKING_API_END_POINT}/bookings/${selectedBooking._id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`
          }
        });

        if (response.ok) {
          toast.success('Hủy vé thành công');
          const updatedBookings = userBooking.map(booking => 
            booking._id === selectedBooking._id ? { ...booking, booking_status: 'Đã hủy' } : booking
          );
          dispatch(setAllBooking(updatedBookings));
          setUserbooking([...updatedBookings]); 
          setSelectedBooking(null);
        } else {
          toast.error('Hủy vé thất bại');
        }
      } catch (error) {
        toast.error('Hủy vé thất bại');
      }
    }
  };

  const filteredBookings = searchId
    ? userBooking.filter(booking => booking._id.toLowerCase().includes(searchId.toLowerCase()))
    : selectedDate
    ? userBooking.filter(booking => format(new Date(booking.flight_details.departure_time), 'yyyy-MM-dd') === selectedDate)
    : userBooking;

  const sortedBookings = [...filteredBookings].sort((a, b) => new Date(b.booking_date) - new Date(a.booking_date));

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = sortedBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); 
  };

  const formatDateTime = (dateTimeStr) => {
    const date = new Date(dateTimeStr);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: 'UTC' }) + ' ' + date.toLocaleDateString('en-GB', { timeZone: 'UTC' });
  };

  const handleViewDetails = (bookingId) => {
    window.scrollTo(0, 0);
    navigate(`/bookingdetail/${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
        <Card className="w-full max-w-6xl mx-auto flex-1 mb-4 overflow-hidden">
          <CardHeader className="relative p-4 sm:p-8 md:p-16"> 
            <div className="absolute inset-0">
              <img 
                src={Airplane}
                alt="Airplane background" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
            </div>
            <div className="relative flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <div className="flex items-center justify-center p-2 bg-white/90 rounded-lg shadow-sm transform hover:scale-105 transition-transform backdrop-blur-sm border border-white/20">
                <img src={qairlineLogo} alt="QAirline Logo" className="h-8 sm:h-10 w-auto rounded" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 flex items-baseline">
                  <span className="text-[#DAA520]">Q</span>
                  <span className="text-[#008080]">Airline </span> 
                  <span className="text-white/90"> : Vé đã đặt</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <p className="text-white/80 text-base sm:text-lg">
                    Quản lý và theo dõi các chuyến bay 
                    <span className="text-[#DAA520] drop-shadow-[0_0_2px_rgba(218,165,32,0.3)]"> Q</span>
                    <span className="text-[#008080] drop-shadow-[0_0_2px_rgba(0,128,128,0.3)]">Airline</span> 
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>        

        <div className="mb-6 relative">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 px-4 sm:px-8 bg-gradient-to-r from-[#008080]/5 to-[#DAA520]/5 rounded-lg border border-[#008080]/10">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#008080] to-[#DAA520]"></div>
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-b from-[#DAA520] to-[#008080]"></div>
            
            <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-[#DAA520] to-[#DAA520] bg-clip-text text-transparent mb-4 sm:mb-0">
              Danh sách vé
            </h2>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <label className="text-[#008080] font-medium">Tìm theo ngày khởi hành:</label>
              <div className="relative w-full sm:w-48">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 w-4 h-4" />
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#008080] transition text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {currentBookings.map((booking, index) => (
            <Card key={booking._id} className="overflow-hidden border border-gray-100 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="bg-gradient-to-r from-[#008080] to-[#008080]/90 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-white/10 p-2 rounded-full">
                      <Plane className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-white text-lg">
                      Vé số #{booking._id.slice(-4)}
                    </CardTitle>
                  </div>
                  <Badge 
                    variant={
                      booking.booking_status === 'Đã đặt' ? 'success' : 
                      booking.booking_status === 'Đã hủy' ? 'warning' : 
                      'default'
                    }
                    className={`
                      px-4 py-1.5 rounded-full text-sm font-medium
                      ${booking.booking_status === 'Đã đặt' 
                        ? 'bg-emerald-100 text-emerald-700 border-emerald-200' 
                        : booking.booking_status === 'Đã hủy'
                        ? 'bg-orange-100 text-orange-700 border-orange-200'
                        : 'bg-blue-100 text-blue-700 border-blue-200'}
                    `}
                  >
                    {booking.booking_status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 bg-gray-50 rounded-xl p-4 pt-7">
                    <div className="flex items-center justify-center m-auto">
                      <div className="text-center flex-1">
                        <p className="text-base lg:text-lg font-semibold">
                          {formatDateTime(booking.flight_details.departure_time).split(' ')[0]}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-600">
                          {formatDateTime(booking.flight_details.departure_time).split(' ')[1]}
                        </p>
                        <p className="text-xs lg:text-sm font-bold text-[#008080]">
                          {booking.flight_details.departure_location}
                        </p>
                      </div>

                      <div className="flex flex-col items-center px-4">
                        <div className="h-[2px] w-24 bg-gradient-to-r from-[#008080] to-[#DAA520]" />
                        <div className="flex items-center gap-2 my-2">
                          <Clock size={14} className="text-gray-500" />
                          <span className="text-sm text-gray-600">{booking.flight_details.travel_time}h</span>
                        </div>
                        <ArrowRight className="text-[#008080] w-5 h-5" />
                      </div>

                      <div className="text-center flex-1">
                        <p className="text-base lg:text-lg font-semibold">
                          {formatDateTime(new Date(new Date(booking.flight_details.departure_time).getTime() + booking.flight_details.travel_time * 3600000)).split(' ')[0]}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-600">
                          {formatDateTime(new Date(new Date(booking.flight_details.departure_time).getTime() + booking.flight_details.travel_time * 3600000)).split(' ')[1]}
                        </p>
                        <p className="text-xs lg:text-sm font-bold text-[#008080]">
                          {booking.flight_details.destination}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 lg:border-l lg:pl-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users className="h-4 w-4" />
                          <p className="text-sm">Số hành khách</p>
                        </div>
                        <p className="font-semibold text-lg">{booking.ticket_quantity}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600">Tổng tiền</p>
                        <p className="font-bold text-lg text-[#DAA520]">
                          {formatPrice(booking.total_price)}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                      <Button 
                        variant="outline" 
                        className="w-full border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white transition-colors"
                        onClick={() => handleViewDetails(booking._id)}
                      >
                        Xem chi tiết
                      </Button>
                      <Button 
                        variant="destructive" 
                        className="w-full bg-[#008080] hover:bg-red-600 transition-colors"
                        onClick={() => setSelectedBooking(booking)}
                      >
                        Hủy vé
                      </Button>
                    </div>
                  </div>
                </div>
                
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex justify-center">
            <nav>
              <ul className="flex flex-wrap gap-2">
                <li>
                  <Button
                    variant="outline"
                    className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                  >
                    Trước
                  </Button>
                </li>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <li key={page}>
                    <Button
                      variant={currentPage === page ? "default" : "outline"}
                      className={currentPage === page 
                        ? "bg-[#008080] text-white"
                        : "border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white"
                      }
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  </li>
                ))}
                <li>
                  <Button
                    variant="outline"
                    className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                  >
                    Sau
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        <Dialog open={!!selectedBooking} onOpenChange={(open) => {
          if (!open) setSelectedBooking(null);
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Xác nhận hủy vé</DialogTitle>
              <DialogDescription>Chỉ được hủy vé trong khoảng thời gian trước 24 tiếng so với giờ khởi hành</DialogDescription>
            </DialogHeader>
            <p>Bạn có chắc chắn muốn hủy vé #{selectedBooking?._id.slice(-4)}?</p>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setSelectedBooking(null)}>Giữ vé</Button>
              <Button 
                variant="destructive" 
                onClick={() => {
                  handleCancelBooking();
                  setSelectedBooking(null);
                }}
              >
                Xác nhận hủy
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default MyBooking;