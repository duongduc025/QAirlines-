import store from '@/redux/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constraint';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';


const Profile = () => {
  const { user } = useSelector(store => store.auth);
  const [formData, setFormData] = useState({
    fullname: "",
    newEmail: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setFormData({
        fullname: user.fullname,
        newEmail: user.email,
        phoneNumber: user.phoneNumber,
      });
    }
  }, [user]);

  // Update formData when user changes input
  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const submitHandler = async e => {
    e.preventDefault();

    console.log(formData);
    try {
      setLoading(true);
      const res = await axios.put(`${USER_API_END_POINT}/update/${user._id}`, formData, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN_NAME)}`,
          "Content-Type": "application/json",
        },
      });
      if(res.data){
        dispatch(setUser(res.data));
        toast.success("Cập nhật thông tin thành công");
      }
    } catch (error) {
      console.error(error);
      toast.error("Cập nhật thông tin thất bại");
    } finally {
      setLoading(false);
    }
  };

  const { fullname, newEmail, phoneNumber} = formData;

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="mb-5 pt-10">
          <label className='form__label font-semibold '> Họ và tên</label>
          <input 
            type="text"
            placeholder={'Họ và tên'}
            name="fullname"
            value={fullname}
            onChange={handleInputChange} 
            className="p-5 w-full pr-4 py-3 border-b border-solid border-[#008080] focus:outline-none focus:border-b-[#008080]  text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>
        
        <div className="mb-5">
          <label className='form__label font-semibold '> Email</label>
          <input 
            type="email"
            placeholder="Email"
            name="newEmail"
            value={newEmail}
            onChange={handleInputChange}  
            className="p-5 w-full pr-4 py-3 border-b border-solid border-[#008080] focus:outline-none focus:border-b-[#008080] text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>

        <div className="mb-5">
          <label className='form__label font-semibold p '>Số điện thoại</label>
          <input 
            type="text"
            placeholder="Số điện thoại"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handleInputChange}  
            className="p-5 w-full pr-4 py-3 border-b border-solid border-[#008080] focus:outline-none focus:border-b-#008080]text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
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

export default Profile;