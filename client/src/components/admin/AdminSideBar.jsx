import React, { useState } from 'react';
import {
  Home,
  Ticket,
  Plane,
  Calendar,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  LogOut
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const AdminSideBar = () => {
  const [expanded, setExpanded] = useState(true);

  const menuItems = [
    { icon: Home, label: 'Trang chủ', href: '/admin' },
    { icon: Ticket, label: 'Ưu đãi', href: '/admin/promotions' },
    { icon: Plane, label: 'Tàu bay', href: '/admin/aircrafts' },
    { icon: Calendar, label: 'Chuyến bay', href: '/admin/flights' },
    { icon: BookOpen, label: 'Đặt vé', href: '/admin/bookings' },
  ];

  const handleLogout = () => {
    // Xử lý logic đăng xuất ở đây
    console.log('Logging out...');
  };

  return (
    <div className={cn(
      "h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
      expanded ? "w-64" : "w-16"
    )}>
      <div className="flex-1">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className={cn(
            "font-semibold transition-all duration-300",
            expanded ? "opacity-100" : "opacity-0 hidden"
          )}>
            Admin Panel
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpanded(!expanded)}
            className="hover:bg-gray-100"
          >
            {expanded ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
          </Button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200",
                    "hover:bg-gray-100 hover:text-blue-600",
                    "text-gray-700"
                  )}
                >
                  <item.icon size={20} />
                  <span className={cn(
                    "transition-all duration-300",
                    expanded ? "opacity-100" : "opacity-0 hidden"
                  )}>
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Phần đăng xuất */}
      <div className="border-t border-gray-200 p-4 mt-auto">
        <Button
          variant="ghost"
          className={cn(
            "w-full flex items-center justify-start space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50",
            "transition-all duration-200"
          )}
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className={cn(
            "transition-all duration-300",
            expanded ? "opacity-100" : "opacity-0 hidden"
          )}>
            Đăng xuất
          </span>
        </Button>
      </div>
    </div>
  );
};
export default AdminSideBar;