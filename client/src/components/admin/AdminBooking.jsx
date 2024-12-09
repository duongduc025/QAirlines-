import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, CalendarDays, Users, Plane, CreditCard } from 'lucide-react';
import AdminSideBar from './AdminSideBar';

const AdminBooking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  
  const allTickets = [
    { 
      id: "T001",
      userId: "U123",
      flightId: "QA101",
      passengers: 2,
      bookingDate: new Date("2024-11-25"),
      totalAmount: "4,500,000",
      status: "Đã đặt" 
    },
    { 
      id: "T002",
      userId: "U124",
      flightId: "QA102",
      passengers: 1,
      bookingDate: new Date("2024-11-25"),
      totalAmount: "2,200,000",
      status: "Đã sử dụng"
    },
    { 
      id: "T003",
      userId: "U125",
      flightId: "QA103",
      passengers: 3,
      bookingDate: new Date("2024-11-26"),
      totalAmount: "6,800,000",
      status: "Đã hủy"
    },
  ];

  // Hàm để kiểm tra xem hai ngày có cùng ngày/tháng/năm không
  const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  // Lọc vé dựa trên ngày được chọn, search query và status filter
  const filteredTickets = allTickets.filter(ticket => {
    const matchesDate = isSameDay(ticket.bookingDate, selectedDate);
    const matchesSearch = searchQuery === '' || 
                         ticket.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         ticket.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    
    return matchesDate && matchesSearch && matchesStatus;
  });

  // Tính tổng số vé và hành khách cho ngày được chọn
  const ticketsToday = filteredTickets.length;
  const passengersToday = filteredTickets.reduce((sum, ticket) => sum + ticket.passengers, 0);

  // Format date để hiển thị
  const formatDate = (date) => {
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SideBar */}
      
        <AdminSideBar />
 

      {/* Main Content */}
      <div className="flex-1 p-4 md:p-8 w-full space-y-4">
        <div className="flex justify-between items-center mb-6 pt-10">
          <h1 className="text-2xl font-bold text-gray-800 ">Quản lý vé máy bay</h1>
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-gray-500" />
            <span className="text-gray-600">{formatDate(new Date())}</span>
          </div>
        </div>

        {/* Stats Cards */}
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
                  <p className="text-2xl font-bold ">{""}</p>
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
      onSelect={(date) => setSelectedDate(date || new Date())}
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
                    <SelectItem value="Đã sử dụng">Đã sử dụng</SelectItem>
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
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTickets.map((ticket) => (
                      <TableRow key={ticket.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">{ticket.id}</TableCell>
                        <TableCell>{ticket.userId}</TableCell>
                        <TableCell>{ticket.flightId}</TableCell>
                        <TableCell>{ticket.passengers}</TableCell>
                        <TableCell>{formatDate(ticket.bookingDate)}</TableCell>
                        <TableCell>{ticket.totalAmount} VND</TableCell>
                        <TableCell>  {ticket.status}  </TableCell>
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
      </div>
    </div>
  );
};

export default AdminBooking;