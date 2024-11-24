import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Search } from "lucide-react";
import AdminSideBar from './AdminSideBar';

const initialAircrafts = [
  {
    id: 1,
    aircraftId: "VN-A321",
    manufacturer: "Airbus",
    model: "A321",
    seats: 180
  },
  {
    id: 2,
    aircraftId: "VN-B787",
    manufacturer: "Boeing",
    model: "787-9",
    seats: 300
  }
];

const AdminAircraft = () => {
  const [aircrafts, setAircrafts] = useState(initialAircrafts);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAircrafts = aircrafts.filter(aircraft => 
    aircraft.aircraftId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemoveAircraft = (id) => {
    setAircrafts(aircrafts.filter(aircraft => aircraft.id !== id));
  };

  const handleAddAircraft = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newAircraft = {
      id: aircrafts.length + 1,
      aircraftId: formData.get('aircraftId'),
      manufacturer: formData.get('manufacturer'),
      model: formData.get('model'),
      seats: Number(formData.get('seats'))
    };
    setAircrafts([...aircrafts, newAircraft]);
    setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30">
        <AdminSideBar />
      </div>
      
      <div className="ml-64 flex-1 p-8">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Quản lý tàu bay</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Thêm tàu bay
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Thêm tàu bay mới</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleAddAircraft} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Mã tàu bay</Label>
                      <Input 
                        name="aircraftId"
                        placeholder="VN-A321"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hãng sản xuất</Label>
                      <Input 
                        name="manufacturer"
                        placeholder="Airbus"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Model</Label>
                      <Input 
                        name="model"
                        placeholder="A321"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Số ghế</Label>
                      <Input 
                        name="seats"
                        type="number"
                        placeholder="180"
                        required
                        min="1"
                      />
                    </div>

                    <Button type="submit" className="w-full">
                      Thêm tàu bay
                    </Button>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mt-4 relative grid grid-cols-1 md:grid-cols-3 gap-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã tàu bay..."
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
                  <TableHead>Mã tàu bay</TableHead>
                  <TableHead>Hãng sản xuất</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Số ghế</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAircrafts.map((aircraft) => (
                  <TableRow key={aircraft.id}>
                    <TableCell className="font-medium">{aircraft.aircraftId}</TableCell>
                    <TableCell>{aircraft.manufacturer}</TableCell>
                    <TableCell>{aircraft.model}</TableCell>
                    <TableCell>{aircraft.seats}</TableCell>
                    <TableCell>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        onClick={() => handleRemoveAircraft(aircraft.id)}
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

export default AdminAircraft;