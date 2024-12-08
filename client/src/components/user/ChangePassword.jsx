import React, { useState } from 'react';
import { message } from 'antd';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    CurrentPassword: '',
    password: '',
    confirmPassword: ''
  });

  const { CurrentPassword, password, confirmPassword } = formData;

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    // Placeholder for password change logic
    // const res = await changePassword(formData);
    // if (res.success) {
    //   message.success("Password changed successfully");
    // }
  };

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="mb-5 pt-10">
          <input 
            type="password"
            placeholder="Current Password"
            name="CurrentPassword"
            value={CurrentPassword}
            onChange={handleInputChange} 
            className="p-5 w-full pr-4 py-3 border-b border-solid border-[#008080] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>
        
        <div className="mb-5">
          <input 
            type="password"
            placeholder="New Password"
            name="password"
            value={password}
            onChange={handleInputChange}  
            className="p-5 w-full pr-4 py-3 border-b border-solid border-[#008080] focus:outline-none focus:border-b-primaryColor text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>

        <div className="mb-5">
          <input 
            type="password"
            placeholder="Confirm Password"
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
            Update
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangePassword;