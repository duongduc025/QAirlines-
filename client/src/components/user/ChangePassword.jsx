import React, { useState } from 'react';
import { message } from 'antd';
import axios from 'axios';
import { LOCAL_STORAGE_TOKEN_NAME, USER_API_END_POINT } from '@/utils/constraint';
import { useSelector } from 'react-redux';
import { set } from 'date-fns';
import { toast } from 'sonner';


const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const { user } = useSelector(store => store.auth);

  const { currentPassword, newPassword, confirmPassword } = formData;

  // Update formData when user changes input
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const submitHandler = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp");
      return;
    }
    if(newPassword.length < 6){
      toast.error("Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }
    try {
      const res = await axios.put(`${USER_API_END_POINT}/change-password/${user._id}`, formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
          "Content-Type": "application/json",
        },
      });
      console.log(res.data);
      if (res.data) {
        toast.success("Cập nhật mật khẩu thành công");
      setFormData({ 
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      }
    }
    catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="mb-5 pt-10">
          <input 
            type="password"
            placeholder="Mật khẩu hiện tại"
            name="currentPassword"
            value={currentPassword}
            onChange={handleInputChange} 
            className="p-5 w-full pr-4 py-3 border-b border-solid border-[#008080] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>
        
        <div className="mb-5">
          <input 
            type="password"
            placeholder="Mật khẩu mới"
            name="newPassword"
            value={newPassword}
            onChange={handleInputChange}  
            className="p-5 w-full pr-4 py-3 border-b border-solid border-[#008080] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>

        <div className="mb-5">
          <input 
            type="password"
            placeholder="Xác nhận mật khẩu"
            name="confirmPassword"
            value={confirmPassword}
            onChange={handleInputChange}  
            className="p-5 w-full pr-4 py-3 border-b border-solid border-[#008080] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>
        
        <div className="mt-7">
          <button
            type="submit"
            className="w-full bg-[#DAA520] text-white text-[18px] leading-[30px] rounded-lg px-4 py-3">
            Cập nhật
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;