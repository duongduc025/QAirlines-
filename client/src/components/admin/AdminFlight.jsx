import AdminSideBar from './AdminSideBar';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import store from '@/redux/store';
import { setAllFlight } from '@/redux/flightSlice';
import { FLIGHT_API_END_POINT } from '@/utils/constraint';
import { LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint';
import { toast } from 'sonner';
import airportCodes from '@/utils/airport_code';
import axios from 'axios';
import useGetAllFlight from '@/hook/useGetAllFlight';

const AdminFlight = () => {
  const dispatch = useDispatch();
  const { allAirCraft } = useSelector((store) => store.aircraft);
  const { allFlight } = useSelector((store) => store.flight);
  const [flights, setFlights] = useState(allFlight);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDelayDialogOpen, setIsDelayDialogOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [flightToDelete, setFlightToDelete] = useState(null);

  const [departureSearch, setDepartureSearch] = useState("");
  const [destinationSearch, setDestinationSearch] = useState("");
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const [departureFilter, setDepartureFilter] = useState("");
  const [destinationFilter, setDestinationFilter] = useState("");
  const [departureDateFilter, setDepartureDateFilter] = useState("");
  const [returnDateFilter, setReturnDateFilter] = useState("");

  const filteredFlights = flights.filter(flight => {
    const matchesCode = flight.flight_code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDeparture = departureFilter === "" || 
      (airportCodes.find(airport => airport.code === flight.departure_location)?.name
        .toLowerCase()
        .includes(departureFilter.toLowerCase()) ||
      flight.departure_location.toLowerCase().includes(departureFilter.toLowerCase()));
    const matchesDestination = destinationFilter === "" || 
      (airportCodes.find(airport => airport.code === flight.destination)?.name
        .toLowerCase()
        .includes(destinationFilter.toLowerCase()) ||
      flight.destination.toLowerCase().includes(destinationFilter.toLowerCase()));
    const matchesDepartureDate = departureDateFilter === "" || 
      new Date(flight.departure_time).toISOString().split('T')[0] === departureDateFilter;
    const matchesReturnDate = returnDateFilter === "" || 
      new Date(flight.return_time).toISOString().split('T')[0] === returnDateFilter;
    
    return matchesCode && matchesDeparture && matchesDestination && matchesDepartureDate && matchesReturnDate;
  });

  const totalPages = Math.ceil(filteredFlights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFlights = filteredFlights.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Hàm xử lý xóa chuyến bay
  const handleRemoveFlight = async (_id) => {
    try {
      const response = await fetch(`${FLIGHT_API_END_POINT}/deleteFlight/${_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`
        }
      });

      if (response.ok) {
        toast.success('Xóa chuyến bay thành công');
        setFlights(flights.filter(flight => flight._id !== _id));
        dispatch(setAllFlight(flights.filter(flight => flight._id !== _id)));
      } else {
        console.error('Failed to delete flight');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Hàm xử lý thêm chuyến bay
  const handleAddFlight = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    // Tạo đối tượng Date và điều chỉnh múi giờ
    const localDate = new Date(formData.get('departure_time'));
    const utcDate = new Date(localDate.getTime() - localDate.getTimezoneOffset() * 60000);
    const selectedAirplane = allAirCraft.find(aircraft => aircraft.airplane_code === formData.get('airplane_code'));

    const newFlight = {
      flight_code: formData.get('flight_code'),
      airplane_code: formData.get('airplane_code'),
      economy_seats: selectedAirplane.capacity,
      economy_price: Number(formData.get('economy_price')),
      departure_location: formData.get('departure_location'),
      destination: formData.get('destination'),
      departure_time: utcDate.toISOString(),
      travel_time: parseFloat(formData.get('travel_time')), 
    };

    try {
      const response = await fetch(`${FLIGHT_API_END_POINT}/addFlight`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`
        },
        body: JSON.stringify(newFlight)
      });

      if (response.status === 201) {
        const addedFlight = await response.json();
        setFlights([...flights, addedFlight]);
        dispatch(setAllFlight([...flights, addedFlight]));
        toast.success('Thêm chuyến bay thành công');
        
        // Reset form values
        setDepartureSearch("");
        setDestinationSearch("");
      } else {
        console.error('Failed to add flight');
      }
    } catch (error) {
      console.error('Error:', error);
    }

    setIsDialogOpen(false);
  };

  // Hàm xử lý delay chuyến bay
  const handleDelayFlight = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const delayMinutes = parseInt(formData.get('delayMinutes'));

    const originalDepartureTime = new Date(selectedFlight.departure_time);
    const newDepartureTime = new Date(originalDepartureTime.getTime() + delayMinutes * 60000);

    try {
      const response = await axios.put(
        `${FLIGHT_API_END_POINT}/updateDepartureTime/${selectedFlight._id}`,
        { newDepartureTime: newDepartureTime.toISOString() },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`
          }
        }
      );

      if (response.status === 200) {
        const updatedFlight = response.data;
        setFlights(flights.map(flight => flight._id === selectedFlight._id ? updatedFlight : flight));
        dispatch(setAllFlight(flights.map(flight => flight._id === selectedFlight._id ? updatedFlight : flight)));
        toast.success('Cập nhật thời gian bay thành công');
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật thời gian bay');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Có lỗi xảy ra khi cập nhật thời gian bay');
    }

    setIsDelayDialogOpen(false);
  };

  // Hàm xử lý tìm kiếm sân bay
  const handleSearch = (input, type) => {
    if (!input) return type === 'origin' ? setOriginSuggestions([]) : setDestSuggestions([]);
    
    const filtered = airportCodes.filter(airport => 
      airport.name.toLowerCase().includes(input.toLowerCase()) ||
      airport.code.toLowerCase().includes(input.toLowerCase())
    );
    
    if (type === 'origin') {
      setOriginSuggestions(filtered);
    } else {
      setDestSuggestions(filtered);
    }
  };
  

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* AdminSidebar placeholder */}
        <AdminSideBar />
        
      {/* Main content */}
      <div className="pt-20 flex-1 p-4 md:p-8 mx-auto max-w-[100rem] w-full">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Quản lý chuyến bay</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Thêm chuyến bay
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Thêm chuyến bay mới</DialogTitle>
                    <DialogDescription>Điền thông tin chi tiết để thêm chuyến bay mới.</DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddFlight} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Mã chuyến bay</Label>
                      <Input 
                        name="flight_code"
                        placeholder="VN123"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Máy bay</Label>
                      <select 
                        name="airplane_code"
                        required
                        className="w-full p-2 border rounded-md"
                      >
                        {allAirCraft.map((aircraft) => (
                          <option key={aircraft.airplane_code} value={aircraft.airplane_code}>
                            {aircraft.airplane_code}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label>Giá vé (VND)</Label>
                      <Input 
                        name="economy_price"
                        type="number"
                        placeholder="2000000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Điểm khởi hành</Label>
                      <Input
                        name="departure_location"
                        value={departureSearch}
                        onChange={(e) => {
                          setDepartureSearch(e.target.value);
                          handleSearch(e.target.value, 'origin');
                        }}
                        placeholder="Nhập tên hoặc mã sân bay khởi hành"
                        required
                      />
                      {originSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                          {originSuggestions.map((airport) => (
                            <div
                              key={airport.code}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setDepartureSearch(airport.code);
                                setOriginSuggestions([]);
                              }}
                            >
                              {airport.name} ({airport.code})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Điểm đến</Label>
                      <Input
                        name="destination"
                        value={destinationSearch}
                        onChange={(e) => {
                          setDestinationSearch(e.target.value);
                          handleSearch(e.target.value, 'destination');
                        }}
                        placeholder="Nhập tên hoặc mã sân bay đến"
                        required
                      />
                      {destSuggestions.length > 0 && (
                        <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1">
                          {destSuggestions.map((airport) => (
                            <div
                              key={airport.code}
                              className="p-2 hover:bg-gray-100 cursor-pointer"
                              onClick={() => {
                                setDestinationSearch(airport.code);
                                setDestSuggestions([]);
                              }}
                            >
                              {airport.name} ({airport.code})
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label>Thời gian khởi hành</Label>
                      <Input
                        name="departure_time"
                        type="datetime-local"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <Label>Thời gian bay (giờ)</Label>
                      <Input
                        name="travel_time"
                        type="number"
                        step="0.1"
                        placeholder="1.5"
                        required
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Thêm chuyến bay
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            {/* Search Bar */}
            <div className="mt-4 relative grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm theo mã chuyến bay..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
              <Input
                placeholder="Tìm kiếm điểm khởi hành (tên/mã)..."
                value={departureFilter}
                onChange={(e) => setDepartureFilter(e.target.value)}
              />
              <Input
                placeholder="Tìm kiếm điểm đến (tên/mã)..."
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
              />
              <Input
                type="date"
                placeholder="Ngày đi"
                value={departureDateFilter}
                onChange={(e) => setDepartureDateFilter(e.target.value)}
              />
              <Input
                type="date"
                placeholder="Ngày về"
                value={returnDateFilter}
                onChange={(e) => setReturnDateFilter(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Mã chuyến bay</TableHead>
                  <TableHead className="text-center">Máy bay</TableHead>
                  <TableHead className="text-center">Số ghế</TableHead>
                  <TableHead className="text-center">Giá vé (VND)</TableHead>
                  <TableHead className="text-center">Điểm khởi hành</TableHead>
                  <TableHead className="text-center">Điểm đến</TableHead>
                  <TableHead className="text-center w-[150px]">Thời gian khởi hành</TableHead>
                  <TableHead className="text-center">Thời gian bay</TableHead>
                  <TableHead className="text-center w-[150px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
                <TableBody>
                {currentFlights.map((flight) => (
                  <TableRow key={flight._id}>
                    <TableCell className="text-center font-medium">{flight.flight_code}</TableCell>
                    <TableCell className="text-center">{flight.airplane_code}</TableCell>
                    <TableCell className="text-center">{flight.economy_seats}</TableCell>
                    <TableCell className="text-center">{flight.economy_price.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{airportCodes.find(airport => airport.code === flight.departure_location)?.name}</TableCell>
                    <TableCell className="text-center">{airportCodes.find(airport => airport.code === flight.destination)?.name}</TableCell>
                    <TableCell className="text-center">
                      {new Date(flight.departure_time).toLocaleString('en-US', { timeZone: 'UTC' })}
                    </TableCell>
                    <TableCell className="text-center">{flight.travel_time}</TableCell>
                    <TableCell className="text-center flex gap-2 justify-center">
                      <Dialog open={isDelayDialogOpen && selectedFlight?._id === flight._id} 
                              onOpenChange={(open) => {
                                setIsDelayDialogOpen(open);
                                if (!open) setSelectedFlight(null);
                              }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => setSelectedFlight(flight)}
                          >
                            <Clock className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Cập nhật thời gian bay</DialogTitle>
                            <DialogDescription>Điền số phút delay để cập nhật thời gian bay.</DialogDescription>
                          </DialogHeader>
                          <form onSubmit={handleDelayFlight} className="space-y-6">
                            <div className="space-y-2">
                              <Label>Số phút delay</Label>
                              <Input
                                name="delayMinutes"
                                type="number"
                                placeholder="30"
                                min="1"
                                required
                              />
                            </div>
                            <Button type="submit" className="w-full">
                              Cập nhật
                            </Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      
                      <Dialog open={isConfirmDialogOpen && flightToDelete?._id === flight._id} 
                              onOpenChange={(open) => {
                                setIsConfirmDialogOpen(open);
                                if (!open) setFlightToDelete(null);
                              }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => setFlightToDelete(flight)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Xác nhận xóa chuyến bay</DialogTitle>
                            <DialogDescription></DialogDescription>
                          </DialogHeader>
                          <p>Bạn có chắc chắn muốn xóa chuyến bay {flight.flight_code} không?</p>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Hủy</Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => {
                                handleRemoveFlight(flight._id);
                                setIsConfirmDialogOpen(false);
                              }}
                            >
                              Xóa
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-gray-500">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredFlights.length)} trong số {filteredFlights.length} chuyến bay
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="text-sm">
                  Trang {currentPage} / {totalPages}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFlight;