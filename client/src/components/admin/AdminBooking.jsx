import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CalendarDays, Users, Plane, CreditCard } from 'lucide-react';
import AdminSideBar from './AdminSideBar';
import { useSelector } from 'react-redux';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useGetAllBookingsAdmin from '@/hook/useGetAllBookingsAdmin';
// Component quản lý đặt vé
const AdminBooking = () => {
  const { allBooking } = useSelector(store => store.booking);
  const [ allBookings, setAllBookings ] = useState(allBooking);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  const monthlyStats = useMemo(() => {
    const months = Array(12).fill(0).map((_, index) => ({
      name: `Tháng ${index + 1}`,
      bookings: 0,
      amount: 0,
      cancellations: 0
    }));

    allBookings.forEach(booking => {
      const bookingDate = new Date(booking.booking_date);
      if (bookingDate.getUTCFullYear() === selectedYear) {
        const monthIndex = bookingDate.getUTCMonth();
        months[monthIndex].bookings += 1;
        months[monthIndex].amount += booking.total_price;
        if (booking.booking_status === 'Đã hủy') {
          months[monthIndex].cancellations += 1;
        }
      }
    });

    // Calculate cancellation rate for each month
    months.forEach(month => {
      month.cancellationRate = month.bookings ? 
        ((month.cancellations / month.bookings) * 100).toFixed(1) : 0;
    });

    return months;
  }, [allBookings, selectedYear]);

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array(5).fill(0).map((_, index) => currentYear - index);
  }, []);
  
  // Hàm kiểm tra xem hai ngày có cùng ngày/tháng/năm không
  const isSameDay = (date1, date2) => {
    return date1.getUTCDate() === date2.getUTCDate() &&
           date1.getUTCMonth() === date2.getUTCMonth() &&
           date1.getUTCFullYear() === date2.getUTCFullYear();
  };

  // Update filteredTickets to use the new data structure
  const filteredTickets = allBookings.filter(ticket => {
    const bookingDate = new Date(ticket.booking_date);
    const matchesDate = isSameDay(bookingDate, selectedDate);
    const matchesSearch = searchQuery === '' || 
                         ticket._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.user_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.booking_status === statusFilter;
    
    return matchesDate && matchesSearch && matchesStatus;
  });

  // Update calculations for totals
  const ticketsToday = filteredTickets.length;
  const totalAmountToday = filteredTickets.reduce((sum, ticket) => sum + ticket.total_price, 0);
  const passengersToday = filteredTickets.reduce((sum, ticket) => sum + ticket.ticket_quantity, 0);

  // Add these calculations after the existing calculations
  const totalTickets = allBookings.length;
  const totalPassengers = allBookings.reduce((sum, booking) => sum + booking.ticket_quantity, 0);
  const totalRevenue = allBookings.reduce((sum, booking) => sum + booking.total_price, 0);

  // Hàm định dạng ngày
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', { timeZone: 'UTC' });
  };

  // Hàm định dạng ngày giờ
  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-GB', { timeZone: 'UTC' });
  };

  // Component hiển thị chi tiết đặt vé
  const BookingDetailsDialog = ({ booking }) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">Chi tiết</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chi tiết đặt vé #{booking._id}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Thông tin chuyến bay</h3>
              <p>Từ: {booking.flight_details.departure_location}</p>
              <p>Đến: {booking.flight_details.destination}</p>
              <p>Thời gian bay: {booking.flight_details.travel_time} giờ</p>
              <p>Khởi hành: {formatDateTime(booking.flight_details.departure_time)}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Thông tin đặt vé</h3>
              <p>Người đặt: {booking.user_fullname}</p>
              <p>Email: {booking.user_email}</p>
              <p>Số lượng vé: {booking.ticket_quantity}</p>
              <p>Tổng tiền: {booking.total_price.toLocaleString()} VND</p>
              <p>Ngày đặt: {formatDateTime(booking.booking_date)}</p>
              <p>Trạng thái: {booking.booking_status}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Thông tin hành khách</h3>
            <div className="grid gap-4">
              {booking.passenger_details.map((passenger, index) => (
                <div key={passenger._id} className="border p-3 rounded-lg">
                  <h4 className="font-medium">Hành khách {index + 1}</h4>
                  <div className="grid grid-cols-2 gap-2">
                    <p>Họ tên: {passenger.fullname}</p>
                    <p>Giới tính: {passenger.gender}</p>
                    <p>Ngày sinh: {formatDate(new Date(passenger.date_of_birth))}</p>
                    <p>CCCD/CMND: {passenger.id_number}</p>
                    {passenger.email && <p>Email: {passenger.email}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  // Add this new calculation inside the component
  const getMonthlyComparison = (currentMonth) => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentStats = monthlyStats[currentMonth];
    const prevStats = monthlyStats[prevMonth];
    
    const bookingChange = prevStats.bookings ? 
      ((currentStats.bookings - prevStats.bookings) / prevStats.bookings) * 100 : 0;
    const revenueChange = prevStats.amount ? 
      ((currentStats.amount - prevStats.amount) / prevStats.amount) * 100 : 0;
      
    return { bookingChange, revenueChange };
  };
  useGetAllBookingsAdmin();

  return (
    <div className=" flex min-h-screen bg-gray-50">
      {/* SideBar */}
      
        <AdminSideBar />
 

      {/* Main Content */}
      <div className="pt-20 *:flex-1 p-4 md:p-8 w-full space-y-4">
        <div className="flex justify-between items-center mb-6 pt-10">
          <h1 className="text-2xl font-bold text-gray-800 ">Quản lý vé máy bay</h1>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">{formatDate(new Date())}</span>
          </div>
        </div>

        {/* Update Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Tổng vé ngày {formatDate(selectedDate)}</p>
                  <p className="text-2xl font-bold ">{ticketsToday}</p>
                </div>
                <Plane className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Tổng hành khách ngày {formatDate(selectedDate)}</p>
                  <p className="text-2xl font-bold ">{passengersToday}</p>
                </div>
                <Users className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Tổng số tiền ngày {formatDate(selectedDate)}</p>
                  <p className="text-2xl font-bold ">{totalAmountToday.toLocaleString()} VND</p>
                </div>
                <Users className="h-8 w-8" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Calendar */}
          <Card className="lg:col-span-1 min-w-[320px]">
  <CardHeader>
    <CardTitle className="text-gray-700 flex items-center gap-2">
      <CalendarDays className="h-5 w-5" />
      Chọn ngày xem vé
    </CardTitle>
  </CardHeader>
  <CardContent className="flex justify-center items-center px-2 sm:px-4">
    <Calendar
      mode="single"
      selected={selectedDate}
      onSelect={(date) => {
        if (date) {
          const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
          setSelectedDate(adjustedDate);
        } else {
          setSelectedDate(new Date());
        }
      }}
      className="rounded-md border w-full max-w-[300px]"
    />
  </CardContent>
</Card>

          {/* Ticket List */}
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="text-gray-700">Danh sách vé ngày {formatDate(selectedDate)}</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Tìm kiếm theo ID vé hoặc ID người dùng..." 
                      className="pl-10"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="Đã đặt">Đã đặt</SelectItem>
                    <SelectItem value="Đã hủy">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader className="bg-gray-50">
                    <TableRow>
                      <TableHead className="font-semibold">ID Vé</TableHead>
                      <TableHead className="font-semibold">ID Người dùng</TableHead>
                      <TableHead className="font-semibold">ID Chuyến bay</TableHead>
                      <TableHead className="font-semibold">Số người</TableHead>
                      <TableHead className="font-semibold">Ngày đặt</TableHead>
                      <TableHead className="font-semibold">Tổng tiền</TableHead>
                      <TableHead className="font-semibold">Trạng thái</TableHead>
                      <TableHead className="font-semibold">Thao tác</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket._id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{ticket._id}</TableCell>
                        <TableCell>{ticket.user_id}</TableCell>
                        <TableCell>{ticket.flight_id}</TableCell>
                        <TableCell>{ticket.ticket_quantity}</TableCell>
                        <TableCell>{formatDate(new Date(ticket.booking_date))}</TableCell>
                        <TableCell>{ticket.total_price.toLocaleString()} VND</TableCell>
                        <TableCell>{ticket.booking_status}</TableCell>
                        <TableCell>
                          <BookingDetailsDialog booking={ticket} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredTickets.length === 0 && (
                  <div className="py-8 text-center text-gray-500">
                    Không có vé nào trong ngày {formatDate(selectedDate)}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-gray-700">Thống kê vé theo tháng</CardTitle>
              <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Chọn năm" />
                </SelectTrigger>
                <SelectContent>
                  {years.map(year => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px] mb-8">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="bookings" fill="#4f46e5" name="Số vé" />
                  <Bar yAxisId="right" dataKey="amount" fill="#06b6d4" name="Doanh thu (VND)" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Thêm phần thống kê chi tiết */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Chi tiết thống kê theo tháng</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {monthlyStats.map((month) => (
                  <Card key={month.name} className="border shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">{month.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <dl className="space-y-2">
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Số vé:</dt>
                          <dd className="text-sm font-medium">{month.bookings}</dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Doanh thu:</dt>
                          <dd className="text-sm font-medium">
                            {month.amount.toLocaleString()} VND
                          </dd>
                        </div>
                        <div className="flex justify-between">
                          <dt className="text-sm text-gray-500">Tỉ lệ huỷ:</dt>
                          <dd className={`text-sm font-medium ${
                            Number(month.cancellationRate) > 10 ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {month.cancellationRate}%
                          </dd>
                        </div>
                      </dl>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBooking;