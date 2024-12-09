import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PlusCircle, Trash2, Search, ImagePlus, Eye } from "lucide-react";
import AdminSideBar from './AdminSideBar';

const categories = [
  { id: "flight", name: "Vé máy bay" },
  { id: "hotel", name: "Khách sạn" },
  { id: "package", name: "Combo du lịch" },
  { id: "service", name: "Dịch vụ" }
];

const marks = [
  { id: "discount-30", name: "-30%" },
  { id: "discount-50", name: "-50%" },
  { id: "limited", name: "Giới hạn" },
  { id: "new", name: "Mới" },
  { id: "hot", name: "Hot" }
];

const initialPromotions = [
  {
    id: 1,
    title: "Khuyến mãi mùa hè",
    category: "flight",
    shortDescription: "Giảm giá đặc biệt cho các chuyến bay nội địa",
    mark: "discount-50",
    content: "Ưu đãi giảm 50% cho tất cả các chuyến bay nội địa từ 1/6 - 31/8/2024\n\n- Áp dụng cho mọi hạng vé\n- Không giới hạn số lượng\n- Có thể kết hợp với các ưu đãi khác",
    image: "/promo1.jpg"
  },
  {
    id: 2,
    title: "Combo nghỉ dưỡng",
    category: "package",
    shortDescription: "Combo vé máy bay + khách sạn 5 sao",
    mark: "limited",
    content: "Trọn gói nghỉ dưỡng 3N2Đ tại các resort 5 sao:\n\n- Vé máy bay khứ hồi\n- Phòng Deluxe\n- Ăn sáng buffet\n- Đưa đón sân bay\n- Tour tham quan địa phương",
    image: "/promo2.jpg"
  }
];

const AdminPromotion = () => {
  const [promotions, setPromotions] = useState(initialPromotions);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const filteredPromotions = promotions.filter(promotion => 
    promotion.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRemovePromotion = (id) => {
    setPromotions(promotions.filter(promotion => promotion.id !== id));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPromotion = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newPromotion = {
      id: promotions.length + 1,
      title: formData.get('title'),
      category: formData.get('category'),
      shortDescription: formData.get('shortDescription'),
      mark: formData.get('mark'),
      content: formData.get('content'),
      image: imagePreview || '/placeholder.jpg'
    };
    setPromotions([...promotions, newPromotion]);
    setIsDialogOpen(false);
    setImagePreview(null);
  };

  const handleViewContent = (promotion) => {
    setSelectedPromotion(promotion);
    setIsViewDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
        <AdminSideBar />
      
      <div className="flex-1 p-4 md:p-8 mx-auto max-w-7xl w-full">
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
                        name="shortDescription"
                        placeholder="Nhập mô tả ngắn"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Mark</Label>
                      <Select name="mark" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn mark" />
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
                          <div className="relative w-full h-48">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    <Button type="submit" className="w-full">
                      Thêm ưu đãi
                    </Button>
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
                {filteredPromotions.map((promotion) => (
                  <TableRow key={promotion.id}>
                    <TableCell className="font-medium">{promotion.title}</TableCell>
                    <TableCell>{categories.find(c => c.id === promotion.category)?.name}</TableCell>
                    <TableCell className="max-w-xs truncate">{promotion.shortDescription}</TableCell>
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
                        <Button 
                          variant="destructive" 
                          size="icon"
                          onClick={() => handleRemovePromotion(promotion.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Dialog for viewing content */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedPromotion?.title}</DialogTitle>
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