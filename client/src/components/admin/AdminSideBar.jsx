import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Home,
  Ticket,
  Plane,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Menu,
  LogOut
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { LOCAL_STORAGE_TOKEN_NAME } from "../../utils/constraint";
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner'

// Trạng thái mở rộng của sidebar
const AdminSideBar = () => {
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Hàm xử lý đăng xuất
  const handleLogout = async () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch(setUser(null));
    toast.success('Đăng xuất thành công');
    navigate('/login');
  }

  // Danh sách các mục menu
  const menuItems = [
    { icon: Home, label: 'Trang chủ', to: '/' },
    { icon: Ticket, label: 'Ưu đãi', to: '/promotions' },
    { icon: Plane, label: 'Tàu bay', to: '/aircrafts' },
    { icon: Calendar, label: 'Chuyến bay', to: '/flights' },
    { icon: BookOpen, label: 'Đặt vé', to: '/bookings' },
  ];

  return (
    <TooltipProvider>
      <div 
        className={cn(
          "fixed top-0 left-0 z-50 h-screen bg-white border-r border-gray-200 transition-all duration-300 transform",
          expanded ? "translate-x-0 w-64 shadow-lg" : "-translate-x-full w-64"
        )}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between p-4 border-b">
            {expanded ? (
              <h2 className="font-semibold text-xl text-gray-800">
                Admin Panel
              </h2>
            ) : (
              <div className="w-full flex justify-center">
                <Menu size={20} className="text-gray-600" />
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setExpanded(!expanded)}
              className="hover:bg-gray-100"
            >
              {expanded ? <ChevronLeft size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  {expanded ? (
                    <NavLink
                      to={item.to}
                      className={({ isActive }) => cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                        "hover:bg-gray-100 hover:text-blue-600",
                        "text-gray-700",
                        isActive && "bg-blue-50 text-blue-600"
                      )}
                    >
                      <item.icon size={20} />
                      <span className="transition-opacity duration-300">
                        {item.label}
                      </span>
                    </NavLink>
                  ) : (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) => cn(
                            "flex items-center justify-center px-3 py-2 rounded-lg",
                            "hover:bg-gray-100 hover:text-blue-600",
                            "text-gray-700",
                            isActive && "bg-blue-50 text-blue-600"
                          )}
                        >
                          <item.icon size={20} />
                        </NavLink>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Phần đăng xuất */}
        <div className="border-t border-gray-200 p-4 mt-auto">
          {expanded ? (
            <Button
              variant="ghost"
              className={cn(
                "w-full flex items-center justify-start space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50",
                "transition-all duration-200"
              )}
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span className="transition-opacity duration-300">
                Đăng xuất
              </span>
            </Button>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50",
                    "transition-all duration-200"
                  )}
                  onClick={handleLogout}
                >
                  <LogOut size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>Đăng xuất</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>

        {/* Nút mở sidebar khi đóng */}
        {!expanded && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(true)}
            className="absolute top-4 left-full ml-2 bg-white border rounded-r-lg"
          >
            <Menu size={20} />
          </Button>
        )}
      </div>

      {/* Overlay mờ khi sidebar mở */}
      {expanded && (
        <div 
          className="fixed inset-0 bg-black/20 z-40" 
          onClick={() => setExpanded(false)}
        />
      )}
    </TooltipProvider>
  );
};

export default AdminSideBar;