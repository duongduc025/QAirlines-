import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Plane, 
  Clock, 
  Users, 
  Bell,
  Settings
} from "lucide-react";
import AdminSideBar from './AdminSideBar';
import useGetAllFlight from '@/hook/useGetAllFlight';
import useGetAllAirCraft from '@/hook/useGetAllAirCraft';
import useGetAllPromotion from '@/hook/useGetAllPromotion';
import useGetAllBookingsAdmin from '@/hook/useGetAllBookingsAdmin';

const AdminIntro = () => {
  // Gọi các hook để lấy dữ liệu
  useGetAllFlight();
  useGetAllAirCraft();
  useGetAllPromotion();
  useGetAllBookingsAdmin();

  return (
    <div className="min-h-screen bg-gray-100 flex">
        <AdminSideBar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900">QAirline Admin</h1>
          <p className="text-gray-600 mt-4 text-lg">Hệ thống quản trị chuyến bay chuyên nghiệp</p>
        </div>

        {/* Features */}
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Chức Năng Quản Trị</CardTitle>
              <CardDescription>
                Tổng hợp các công cụ quản lý dành cho quản trị viên
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start space-x-4">
                <Bell className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Quản Lý Thông Tin</h3>
                  <p className="text-gray-600">Đăng tải và quản lý các thông tin về giới thiệu, khuyến mãi, thông báo và tin tức của hãng</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Plane className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Quản Lý Tàu Bay</h3>
                  <p className="text-gray-600">Nhập và cập nhật thông tin về các tàu bay bao gồm mã, hãng sản xuất và các thông tin kỹ thuật</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Settings className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Quản Lý Chuyến Bay</h3>
                  <p className="text-gray-600">Nhập và quản lý thông tin chuyến bay như số hiệu, tàu bay, điểm đi, điểm đến, giờ khởi hành</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Users className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Theo Dõi Đặt Vé</h3>
                  <p className="text-gray-600">Xem và thống kê chi tiết về tình trạng đặt vé của khách hàng</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-blue-500 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">Quản Lý Delay</h3>
                  <p className="text-gray-600">Cập nhật và điều chỉnh giờ khởi hành cho các chuyến bay khi cần thiết</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminIntro;