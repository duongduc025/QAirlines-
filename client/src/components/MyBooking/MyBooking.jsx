import React, { useState } from 'react';
import { Search, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

const MyBooking = () => {
  const [searchId, setSearchId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const bookingsPerPage = 4;

  const mockBookings = [
    {
      id: "QB001",
      from: "Hà Nội",
      to: "TP.HCM",
      date: "2024-11-20",
      time: "10:30",
      status: "Confirmed",
      price: "2,500,000"
    },
    {
      id: "QB002",
      from: "TP.HCM",
      to: "Đà Nẵng",
      date: "2024-11-22",
      time: "14:15",
      status: "Pending",
      price: "1,800,000"
    },
    {
      id: "QB003",
      from: "Đà Nẵng",
      to: "Phú Quốc",
      date: "2024-11-25",
      time: "08:45",
      status: "Confirmed",
      price: "2,100,000"
    },
    {
      id: "QB004",
      from: "Hà Nội",
      to: "Nha Trang",
      date: "2024-11-28",
      time: "16:20",
      status: "Confirmed",
      price: "2,300,000"
    },
    {
      id: "QB005",
      from: "TP.HCM",
      to: "Hà Nội",
      date: "2024-12-01",
      time: "07:30",
      status: "Pending",
      price: "2,600,000"
    }
  ];

  const handleCancelBooking = () => {
    // Xử lý logic hủy vé tại đây
    console.log('Canceling booking:', selectedBooking);
    setSelectedBooking(null);
  };

  const filteredBookings = searchId
    ? mockBookings.filter(booking => booking.id.toLowerCase().includes(searchId.toLowerCase()))
    : mockBookings;

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking);
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <Card className="w-full max-w-4xl mx-auto flex-1 mb-10">
    <CardHeader className="bg-gradient-to-r from-[#008080]/90 to-transparent text-white">
    <CardTitle className="text-2xl font-bold">Vé đã đặt</CardTitle>
    </CardHeader>
</Card>        
        {/* Search Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by Booking ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            className="flex-1"
          />
          <Button 
            className="bg-[#DAA520] hover:bg-[#B8860B] w-full sm:w-auto"
          >
            <Search className="w-4 h-4 mr-2" />
            Search
          </Button>
        </div>

        {/* Bookings Grid */}
        <div className="grid gap-6">
          {currentBookings.map((booking) => (
            <Card key={booking.id} className="border-[#008080] border-2">
              <CardHeader className="bg-[#008080]/10">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-[#008080]">
                    Booking #{booking.id}
                  </CardTitle>
                  <Badge 
                    variant={booking.status === 'Confirmed' ? 'default' : 'secondary'}
                    className={booking.status === 'Confirmed' ? 'bg-[#008080]' : 'bg-yellow-500'}
                  >
                    {booking.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="mt-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">From</p>
                    <p className="font-medium">{booking.from}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">To</p>
                    <p className="font-medium">{booking.to}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="font-medium text-[#DAA520]">₫{booking.price}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{booking.date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{booking.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Số hành khách</p>
                    <p className="font-medium">1</p>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-3">
                  <Button variant="outline" className="border-[#008080] text-[#008080] hover:bg-[#008080] hover:text-white">
                    View Details
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => setSelectedBooking(booking)}
                    className="bg-[#008080] hover:bg-red-600"
                  >
                    Cancel Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pagination */}
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
                    Previous
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
                      onClick={() => setCurrentPage(page)}
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
                    Next
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        <AlertDialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Confirm Cancellation
              </AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel booking #{selectedBooking?.id}? 
                This action cannot be undone and cancellation fees may apply.
                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-gray-500">From</p>
                      <p className="font-medium">{selectedBooking?.from}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">To</p>
                      <p className="font-medium">{selectedBooking?.to}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium">{selectedBooking?.date}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium">{selectedBooking?.time}</p>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Booking</AlertDialogCancel>
              <AlertDialogAction
                className="bg-red-500 hover:bg-red-600"
                onClick={handleCancelBooking}
              >
                Yes, Cancel Booking
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default MyBooking;