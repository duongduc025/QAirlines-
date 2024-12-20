import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { PlusCircle, Trash2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import AdminSideBar from './AdminSideBar';
import { useDispatch, useSelector } from 'react-redux';
import { setAllAirCraft } from '@/redux/airCraftSlice';
import { AIRCRAFT_API_END_POINT, LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint';
import { toast } from 'sonner';
import useGetAllAirCraft from '@/hook/useGetAllAirCraft';

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const AdminAircraft = () => {
  const dispatch = useDispatch();
  const { allAirCraft } = useSelector((store) => store.aircraft);
  const [aircrafts, setAircrafts] = useState(allAirCraft);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [aircraftToDelete, setAircraftToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 30;

  const filteredAircrafts = aircrafts.filter(aircraft => 
    aircraft.airplane_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredAircrafts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentAircrafts = filteredAircrafts.slice(startIndex, endIndex);

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

  // Hàm xử lý xóa tàu bay
  const handleRemoveAircraft = async (_id) => {
    try {
      const response = await fetch(`${AIRCRAFT_API_END_POINT}/delete/${_id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`
        }
      });
  
      if (response.ok) {
        toast.success('Xóa tàu bay thành công');
        setAircrafts(aircrafts.filter(aircraft => aircraft._id !== _id));
        dispatch(setAllAirCraft(aircrafts.filter(aircraft => aircraft._id !== _id)));
      } else {
        console.error('Failed to delete aircraft');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Hàm xử lý thêm tàu bay
  const handleAddAircraft = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newAircraft = {
      airplane_code: formData.get('airplane_code'),
      manufacture_date: formData.get('manufacture_date'),
      model: formData.get('model'),
      capacity: Number(formData.get('capacity'))
    };
  
    try {
      const response = await fetch(`${AIRCRAFT_API_END_POINT}/addPlane`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`
        },
        body: JSON.stringify(newAircraft)
      });
  
      if (response.status === 201) {
        const addedAircraft = await response.json();
        setAircrafts([...aircrafts, addedAircraft]);
        dispatch(setAllAirCraft([...aircrafts, addedAircraft]));
        toast.success('Thêm tàu bay thành công');
      } else {
        console.error('Failed to add aircraft');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  
    setIsDialogOpen(false);
  };

  

  return (
    <div className="flex min-h-screen bg-gray-100">
     
        <AdminSideBar />
     
      <div className="pt-20 flex-1 p-4 md:p-8 mx-auto max-w-7xl w-full">
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
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddAircraft} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Mã tàu bay</Label>
                      <Input 
                        name="airplane_code"
                        placeholder="VN-A321"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Ngày sản xuất</Label>
                      <Input 
                        name="manufacture_date"
                        type="date"
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
                        name="capacity"
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
                  <TableHead>Ngày sản xuất</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Số ghế</TableHead>
                  <TableHead className="w-[100px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentAircrafts.map((aircraft) => (
                  <TableRow key={aircraft._id}>
                    <TableCell className="font-medium">{aircraft.airplane_code}</TableCell>
                    <TableCell>{formatDate(aircraft.manufacture_date)}</TableCell>
                    <TableCell>{aircraft.model}</TableCell>
                    <TableCell>{aircraft.capacity}</TableCell>
                    <TableCell>
                      <Dialog open={isConfirmDialogOpen && aircraftToDelete?._id === aircraft._id} 
                              onOpenChange={(open) => {
                                setIsConfirmDialogOpen(open);
                                if (!open) setAircraftToDelete(null);
                              }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => setAircraftToDelete(aircraft)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Xác nhận xóa tàu bay</DialogTitle>
                            <DialogDescription></DialogDescription>
                          </DialogHeader>
                          <p>Bạn có chắc chắn muốn xóa tàu bay {aircraft.airplane_code} không?</p>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Hủy</Button>
                            <Button 
                              variant="destructive" 
                              onClick={() => {
                                handleRemoveAircraft(aircraft._id);
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
                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredAircrafts.length)} trong số {filteredAircrafts.length} tàu bay
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

export default AdminAircraft;