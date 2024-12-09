import AdminSideBar from './AdminSideBar';
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Clock, Search } from "lucide-react";

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
    id: 1,
    flightId: "VN123",
    aircraft: "A321",
    seats: 180,
    price: 2000000,
    departure: "HAN",
    destination: "BKK",
    departureTime: "2024-11-23T10:00",
    arrivalTime: "2024-11-23T12:00",
    status: "On Time"
  },
  {
    id: 2,
    flightId: "VN456",
    aircraft: "B787",
    seats: 300,
    price: 3500000,
    departure: "SGN",
    destination: "DAD",
    departureTime: "2024-11-23T14:00",
    arrivalTime: "2024-11-23T15:30",
    status: "Delayed"
  }
];

const AdminFlight = () => {
  const [flights, setFlights] = useState(initialFlights);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDelayDialogOpen, setIsDelayDialogOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFlights = flights.filter(flight => 
    flight.flightId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveFlight = (id) => {
    setFlights(flights.filter(flight => flight.id !== id));
  };

  const handleAddFlight = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newFlight = {
      id: flights.length + 1,
      flightId: formData.get('flightId'),
      aircraft: formData.get('aircraft'),
      seats: 180,
      price: Number(formData.get('price')),
      departure: formData.get('departure'),
      destination: formData.get('destination'),
      departureTime: formData.get('departureTime'),
      arrivalTime: formData.get('arrivalTime'),
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
      if (flight.id === selectedFlight.id) {
        const newDepartureTime = new Date(flight.departureTime);
        const newArrivalTime = new Date(flight.arrivalTime);
        
        newDepartureTime.setMinutes(newDepartureTime.getMinutes() + delayMinutes);
        newArrivalTime.setMinutes(newArrivalTime.getMinutes() + delayMinutes);

        return {
          ...flight,
          departureTime: newDepartureTime.toISOString().slice(0, 16),
          arrivalTime: newArrivalTime.toISOString().slice(0, 16),
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
      <div className="ml-4 mr-4 flex-1 p-4 md:p-8 w-full space-y-4">
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
                        name="flightId"
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
                        name="price"
                        type="number"
                        placeholder="2000000"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Điểm khởi hành</Label>
                      <Select name="departure" required>
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
                        name="departureTime"
                        type="datetime-local"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Thời gian đến dự kiến</Label>
                      <Input
                        name="arrivalTime"
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
                  <TableHead>Mã chuyến bay</TableHead>
                  <TableHead>Máy bay</TableHead>
                  <TableHead>Số ghế</TableHead>
                  <TableHead>Giá vé (VND)</TableHead>
                  <TableHead>Điểm khởi hành</TableHead>
                  <TableHead>Điểm đến</TableHead>
                  <TableHead>Thời gian khởi hành</TableHead>
                  <TableHead>Thời gian đến</TableHead>
                  <TableHead className="w-[150px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFlights.map((flight) => (
                  <TableRow key={flight.id}>
                    <TableCell className="font-medium">{flight.flightId}</TableCell>
                    <TableCell>{aircrafts[flight.aircraft]}</TableCell>
                    <TableCell>{flight.seats}</TableCell>
                    <TableCell>{flight.price.toLocaleString()}</TableCell>
                    <TableCell>{airports[flight.departure]}</TableCell>
                    <TableCell>{airports[flight.destination]}</TableCell>
                    <TableCell>
                      {new Date(flight.departureTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(flight.arrivalTime).toLocaleString()}
                    </TableCell>
                  
                    <TableCell className="flex gap-2">
                      <Dialog open={isDelayDialogOpen && selectedFlight?.id === flight.id} 
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
                        onClick={() => handleRemoveFlight(flight.id)}
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