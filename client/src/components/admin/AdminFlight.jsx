import AdminSideBar from './AdminSideBar';
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Clock, Search } from "lucide-react";
import { useSelector, useDispatch } from 'react-redux';
import store from '@/redux/store';
import { setAllFlight } from '@/redux/flightSlice';

const airports = {
  HAN: "Hà nội - Nội bài airport",
  BKK: "Bangkok - Suvarnabhumi airport",
  SGN: "Hồ chí minh - Tân sơn nhất airport",
  DAD: "Đà nẵng international airport",
};

const aircrafts = {
  A321: "Airbus A321 - 180 seats",
  A330: "Airbus A330 - 240 seats",
  B787: "Boeing 787 - 300 seats",
  B777: "Boeing 777 - 350 seats",
};


const initialFlights = [
  {
    _id: 1,
    flight_code: "VN123",
    aircraft: "A321",
    economy_seats: 180,
    economy_price: 2000000,
    departure_location: "HAN",
    destination: "BKK",
    departure_time: "2024-11-23T10:00",
    travel_time: "2024-11-23T12:00",
    status: "On Time"
  },
  {
    _id: 2,
    flight_code: "VN456",
    aircraft: "B787",
    economy_seats: 300,
    economy_price: 3500000,
    departure_location: "SGN",
    destination: "DAD",
    departure_time: "2024-11-23T14:00",
    travel_time: "2024-11-23T15:30",
    status: "Delayed"
  }
];

const AdminFlight = () => {
  const dispatch = useDispatch();
  const { allFlight } = useSelector((store) => store.flight);
  console.log('allFlightRedux', allFlight);
  const [flights, setFlights] = useState(allFlight);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDelayDialogOpen, setIsDelayDialogOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFlights = flights.filter(flight => 
    flight.flight_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFlight = (_id) => {
    setFlights(flights.filter(flight => flight._id !== _id));
  };

  const handleAddFlight = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newFlight = {
      _id: flights.length + 1,
      flight_code: formData.get('flight_code'),
      aircraft: formData.get('aircraft'),
      economy_seats: 180,
      economy_price: Number(formData.get('economy_price')),
      departure_location: formData.get('departure_location'),
      destination: formData.get('destination'),
      departure_time: formData.get('departure_time'),
      travel_time: formData.get('travel_time'),
      status: "On Time"
    };
    setFlights([...flights, newFlight]);
    setIsDialogOpen(false);
  };

  const handleDelayFlight = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const delayMinutes = parseInt(formData.get('delayMinutes'));
    
    setFlights(flights.map(flight => {
      if (flight._id === selectedFlight._id) {
        const newDepartureTime = new Date(flight.departure_time);
        const newTravelTime = new Date(flight.travel_time);
        
        newDepartureTime.setMinutes(newDepartureTime.getMinutes() + delayMinutes);
        newTravelTime.setMinutes(newTravelTime.getMinutes() + delayMinutes);

        return {
          ...flight,
          departure_time: newDepartureTime.toISOString().slice(0, 16),
          travel_time: newTravelTime.toISOString().slice(0, 16),
          status: "Delayed"
        };
      }
      return flight;
    }));
    
    setIsDelayDialogOpen(false);
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
                      <Select name="aircraft" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại máy bay" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(aircrafts).map(([code, name]) => (
                            <SelectItem key={code} value={code}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                      <Select name="departure_location" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn sân bay khởi hành" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(airports).map(([code, name]) => (
                            <SelectItem key={code} value={code}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Điểm đến</Label>
                      <Select name="destination" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn sân bay đến" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(airports).map(([code, name]) => (
                            <SelectItem key={code} value={code}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Thời gian khởi hành</Label>
                      <Input
                        name="departure_time"
                        type="datetime-local"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Thời gian đến dự kiến</Label>
                      <Input
                        name="travel_time"
                        type="datetime-local"
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
            <div className="mt-4 relative grid grid-cols-1 md:grid-cols-3 gap-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground " />
              <Input
                placeholder="Tìm kiếm theo mã chuyến bay..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
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
                  <TableHead className="text-center">Thời gian khởi hành</TableHead>
                  <TableHead className="text-center">Thời gian bay</TableHead>
                  <TableHead className="text-center w-[150px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlights.map((flight) => (
                  <TableRow key={flight._id}>
                    <TableCell className="text-center font-medium">{flight.flight_code}</TableCell>
                    <TableCell className="text-center">{aircrafts[flight.aircraft]}</TableCell>
                    <TableCell className="text-center">{flight.economy_seats}</TableCell>
                    <TableCell className="text-center">{flight.economy_price.toLocaleString()}</TableCell>
                    <TableCell className="text-center">{airports[flight.departure_location]}</TableCell>
                    <TableCell className="text-center">{airports[flight.destination]}</TableCell>
                    <TableCell className="text-center">
                      {new Date(flight.departure_time).toLocaleString()}
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
                      
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleRemoveFlight(flight._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminFlight;