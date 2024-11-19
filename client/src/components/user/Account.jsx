import React, { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';

const UserProfileForm = () => {
  const [profile, setProfile] = useState({
    fullName: '',
    birthDate: '',
    gender: '',
    language: '',
    email: '',
    phone: {
      countryCode: '',
      number: ''
    },
    address: {
      country: '',
      city: '',
      street: '',
      postalCode: ''
    },
    nationality: '',
    idType: '',
    idNumber: ''
  });

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center gap-2 text-green-600 mb-6">
        <a href="../home" className="hover:text-green-600">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
        </a>
        <span>&gt;</span>
        <span>Thông Tin Tài Khoản</span>
      </div>
      <div className="flex justify-between mb-8">
                <h2 className="text-2xl font-semibold">THÔNG TIN TÀI KHOẢN</h2>
        </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-medium mb-4">Thông tin người dùng</h1>
        
       
        {/* Thông tin cá nhân */}
        <div className="mb-6">          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Tên</label>
              <input
                type="text"
                value={profile.fullName}
                disabled
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Ngày sinh</label>
                <input
                  type="text"
                  value={profile.birthDate}
                  disabled
                  className="w-full p-2 border rounded bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">Giới tính</label>
                <input
                  type="text"
                  value={profile.gender}
                  disabled
                  className="w-full p-2 border rounded bg-gray-50"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Ngôn ngữ ưu tiên */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Ngôn ngữ ưu tiên</h2>
          <div className="relative">
            <select 
              value={profile.language}
              className="w-full p-2 border rounded appearance-none pr-10"
            >
              <option value="" disabled>Chọn ngôn ngữ</option>
              <option value="Vietnamese">Vietnamese</option>
              <option value="English">English</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
        </div>

        {/* Thông tin liên hệ */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Thông tin liên hệ</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">EMAIL</label>
              <input
                type="email"
                value={profile.email}
                disabled
                className="w-full p-2 border rounded bg-gray-50"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">SỐ ĐIỆN THOẠI</label>
              <div className="flex gap-2">
                <div className="relative w-40">
                  <select 
                    value={profile.phone.countryCode}
                    className="w-full p-2 border rounded appearance-none pr-10"
                    disabled
                  >
                    <option value="" disabled>Chọn vùng</option>
                    <option value="+84">Việt Nam (+84)</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={profile.phone.number}
                  disabled
                  className="flex-1 p-2 border rounded bg-gray-50"
                />
              </div>
            </div>
          </div>
          
          <button className="text-green-600 text-sm mt-2">+ Thêm Số Điện Thoại Khác</button>
        </div>

        {/* Địa chỉ hóm thư */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Địa chỉ hòm thư</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">QUỐC GIA</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Quốc gia của bạn"
                  className="w-full p-2 border rounded pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">THÀNH PHỐ/ BANG/ TỈNH</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Thành phố/ bang/ tỉnh"
                  className="w-full p-2 border rounded pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">ĐỊA CHỈ</label>
              <input
                type="text"
                placeholder="Căn hộ, Số nhà, Tên đường"
                className="w-full p-2 border rounded"
              />
            </div>
            
            <div>
              <label className="block text-sm text-gray-600 mb-1">MÃ BƯU ĐIỆN</label>
              <input
                type="text"
                placeholder="Mã Bưu Điện của bạn"
                className="w-full p-2 border rounded"
              />
              <p className="text-xs text-gray-500 mt-1">Người Việt Nam vui lòng nhập Mã Bưu Điện là 100000</p>
            </div>
          </div>
        </div>

        {/* Khác */}
        <div className="mb-6">
          <h2 className="text-lg font-medium mb-4">Khác</h2>
          
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">QUỐC TỊCH</label>
              <div className="relative">
                <input
                  type="text"
                  value={profile.nationality}
                  className="w-full p-2 border rounded pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-600 mb-1">LOẠI GIẤY TỜ TUỲ THÂN</label>
                <div className="relative">
                  <select 
                    value={profile.idType}
                    className="w-full p-2 border rounded appearance-none pr-10" 
                  >
                    <option value="" disabled>Chọn giấy tờ</option>
                    <option value="cmnd/cccd">CMND/CCCD</option>
                    <option value="sohochieu">Số hộ chiếu</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gray-600 mb-1">CMND/CCCD</label>
                <input
                  type="text"
                  value={profile.idNumber}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>
          
          <button className="text-green-600 text-sm mt-2">+ Add another ID</button>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button className="px-6 py-2 bg-green-600 text-white rounded">Lưu Thay Đổi</button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;