import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Dữ liệu mẫu về thông báo
const sampleNotification = {
  id: 1,
  title: "Thông Báo Quan Trọng Về Kỳ Thi Cuối Năm",
  imageUrl: "/api/placeholder/800/400", 
  author: "Ban Giám Hiệu",
  date: "05/12/2024",
  content: `Kính gửi quý phụ huynh và học sinh,

Căn cứ vào kế hoạch đào tạo năm học 2024-2025, Nhà trường xin thông báo một số nội dung quan trọng về kỳ thi cuối năm:

1. Thời Gian Thi
- Ngày bắt đầu: 15/01/2025
- Ngày kết thúc: 20/01/2025

2. Hình Thức Thi
- Thi trực tiếp tại trường
- Áp dụng hình thức thi trắc nghiệm và tự luận

3. Điều Kiện Dự Thi
- Học sinh phải có điểm trung bình từng môn đạt trên 5.0
- Không có nợ học phí
- Tham dự đầy đủ các buổi học trước kỳ thi

Đề nghị học sinh và phụ huynh lưu ý và chuẩn bị chu đáo để kỳ thi diễn ra thành công.

Trân trọng thông báo!`,
};

const PostDetail = () => {
  const [notification] = useState(sampleNotification);

  return (
    <div className="min-h-screen bg-[#008080] py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-4xl mx-auto bg-white shadow-2xl border-4 border-[#DAA520]">
        <CardHeader className="bg-[#DAA520] text-white">
          <CardTitle className="text-3xl font-bold text-center">
            {notification.title}
          </CardTitle>
          <div className="flex justify-between text-sm text-white/80 mt-2">
            <span>Tác giả: {notification.author}</span>
            <span>Ngày: {notification.date}</span>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="w-full h-[400px] overflow-hidden rounded-lg">
            <img 
              src={notification.imageUrl} 
              alt={notification.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose max-w-none whitespace-pre-line text-gray-800">
            {notification.content}
          </div>
          
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              className="border-[#DAA520] text-[#DAA520] hover:bg-[#DAA520] hover:text-white"
            >
              Quay Lại Danh Sách
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;