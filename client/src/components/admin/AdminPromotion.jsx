import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Search, ImagePlus, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import AdminSideBar from './AdminSideBar';
import { useDispatch, useSelector } from 'react-redux';
import { setAllPromotions } from '@/redux/promotionSlice';
import { PROMOTION_API_END_POINT, LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { setLoading } from '@/redux/authSlice'


const categories = [
  { id: "Thông báo", name: "Thông báo" },
  { id: "Tin tức", name: "Tin tức" },
  { id: "Khuyến mãi", name: "Khuyến mãi" },
  { id: "Giới thiệu", name: "Giới thiệu" }
];

const marks = [
  { id: "10%", name: "10%" },
  { id: "20%", name: "20%" },
  { id: "30%", name: "30%" },
  { id: "40%", name: "40%" },
  { id: "50%", name: "50%" },
  { id: "Giới hạn", name: "Giới hạn" },
  { id: "Mới", name: "Mới" },
  { id: "Hot", name: "Hot" },
  { id: "Khác", name: "Khác" }
];

const AdminPromotion = () => {
  const dispatch = useDispatch();
  const { loading, user } = useSelector(store => store.auth);
  const { allPromotions } = useSelector((store) => store.promotion);
  const [promotions, setPromotions] = useState(allPromotions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [promotionToDelete, setPromotionToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredPromotions = promotions.filter(promotion => 
    promotion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPromotions = filteredPromotions.slice(startIndex, endIndex);

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

  // Hàm xử lý xóa ưu đãi
  const handleRemovePromotion = async (_id) => {
    try {
      const response = await fetch(`${PROMOTION_API_END_POINT}/deletePromotion/${_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`
        }
      });

      if (response.ok) {
        toast.success('Xóa ưu đãi thành công');
        setPromotions(promotions.filter(promotion => promotion._id !== _id));
        dispatch(setAllPromotions(promotions.filter(promotion => promotion._id !== _id)));
      } else {
        console.error('Xóa ưu đãi thất bại');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  // Hàm xử lý thay đổi hình ảnh
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    console.log(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setImgFile(file);
    }

  };

  // Hàm xử lý thêm ưu đãi
  const handleAddPromotion = async (event) => {
    event.preventDefault();
    dispatch(setLoading(true));
    const formData = new FormData(event.target);

    if (imgFile) {
        formData.append('image', imgFile);
    }

    try {
        const response = await fetch(`${PROMOTION_API_END_POINT}/createPromotion`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`
            },
            body: formData
        });

        if (response.status === 201) {
            const addedPromotion = await response.json();
            setPromotions([...promotions, addedPromotion]);
            dispatch(setAllPromotions([...promotions, addedPromotion]));
            toast.success('Thêm ưu đãi thành công');
        } else {
            console.error('Failed to add promotion');
        }
    } catch (error) {
        console.error('Error:', error);
    } finally {
        dispatch(setLoading(false));
    }

    setIsDialogOpen(false);
    setImagePreview(null);
};

  // Hàm xử lý xem nội dung ưu đãi
  const handleViewContent = (promotion) => {
    setSelectedPromotion(promotion);
    setIsViewDialogOpen(true);
  };
  

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
        <AdminSideBar />
      
      <div className="pt-20 flex-1 p-4 md:p-8 mx-auto max-w-7xl w-full">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-2xl font-bold">Quản lý ưu đãi</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Thêm ưu đãi
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Thêm ưu đãi mới</DialogTitle>
                    <DialogDescription></DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddPromotion} className="space-y-6">
                    <div className="space-y-2">
                      <Label>Tiêu đề</Label>
                      <Input 
                        name="title"
                        placeholder="Nhập tiêu đề ưu đãi"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hạng mục</Label>
                      <Select name="category" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn hạng mục" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Mô tả ngắn</Label>
                      <Textarea 
                        name="brief"
                        placeholder="Nhập mô tả ngắn"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Nhãn</Label>
                      <Select name="mark" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn nhãn" />
                        </SelectTrigger>
                        <SelectContent>
                          {marks.map((mark) => (
                            <SelectItem key={mark.id} value={mark.id}>
                              {mark.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Nội dung chi tiết</Label>
                      <Textarea 
                        name="content"
                        placeholder="Nhập nội dung chi tiết của ưu đãi"
                        className="min-h-[200px]"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Hình ảnh</Label>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-4">
                          <Input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="flex-1"
                          />
                          <Button type="button" variant="outline" size="icon">
                            <ImagePlus className="h-4 w-4" />
                          </Button>
                        </div>
                        {imagePreview && (
                          <div className="relative w-full h-48 max-w-10 max-h-10">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {loading ? (
                      <Button className="w-full my-4 ">
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                      </Button>
                    ) : (
                      <Button type="submit" className="w-full my-4">
                        Thêm ưu đãi
                      </Button>
                    )}
                  </form>
                </DialogContent>
              </Dialog>
            </div>
            
            <div className="mt-4 relative grid grid-cols-1 md:grid-cols-3 gap-4">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo tiêu đề..."
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
                  <TableHead>Tiêu đề</TableHead>
                  <TableHead>Hạng mục</TableHead>
                  <TableHead>Mô tả ngắn</TableHead>
                  <TableHead>Mark</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Hình ảnh</TableHead>
                  <TableHead className="w-[120px]">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentPromotions.map((promotion) => (
                  <TableRow key={promotion._id}>
                    <TableCell className="font-medium">{promotion.title}</TableCell>
                    <TableCell>{categories.find(c => c.id === promotion.category)?.name}</TableCell>
                    <TableCell className="whitespace-pre-wrap">{promotion.brief}</TableCell>
                    <TableCell>{marks.find(c => c.id === promotion.mark)?.name}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleViewContent(promotion)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                    <TableCell>
                      <img
                        src={promotion.image}
                        alt={promotion.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Dialog open={isConfirmDialogOpen && promotionToDelete?._id === promotion._id} 
                                onOpenChange={(open) => {
                                  setIsConfirmDialogOpen(open);
                                  if (!open) setPromotionToDelete(null);
                                }}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="destructive" 
                              size="icon"
                              onClick={() => setPromotionToDelete(promotion)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Xác nhận xóa ưu đãi</DialogTitle>
                              <DialogDescription></DialogDescription>
                            </DialogHeader>
                            <p>Bạn có chắc chắn muốn xóa ưu đãi {promotion.title} không?</p>
                            <div className="flex justify-end gap-2 mt-4">
                              <Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>Hủy</Button>
                              <Button 
                                variant="destructive" 
                                onClick={() => {
                                  handleRemovePromotion(promotion._id);
                                  setIsConfirmDialogOpen(false);
                                }}
                              >
                                Xóa
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination Controls */}
            <div className="flex items-center justify-between py-4">
              <div className="text-sm text-gray-500">
                Hiển thị {startIndex + 1}-{Math.min(endIndex, filteredPromotions.length)} trong số {filteredPromotions.length} ưu đãi
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

      {/* Dialog for viewing content */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPromotion?.title}</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-4">
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap font-sans">
                {selectedPromotion?.content}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminPromotion;