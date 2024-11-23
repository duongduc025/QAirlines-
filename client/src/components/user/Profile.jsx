import React, { useState } from 'react';


const Profile = () => {
  const [formData, setFormData] = useState({
    fullname: "Hoang Duc Duong",
    email: "hoangducduong025@gmail.com",
    phone: "0889222717",
  });

  const handleInputChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = e => {
    e.preventDefault();
  };

  const { fullname, email, birthday, phone, gender } = formData;

  return (
    <div>
      <form onSubmit={submitHandler}>
        <div className="mb-5 pt-10">
          <label className='form__label font-semibold '> Full Name</label>
          <input 
            type="text"
            placeholder={'Full name'}
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
            name="email"
            value={email}
            onChange={handleInputChange}  
            className="p-5 w-full pr-4 py-3 border-b border-solid border-[#008080] focus:outline-none focus:border-b-[#008080] text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
            required
          />
        </div>

  

        <div className="mb-5">
          <label className='form__label font-semibold p '>Phone</label>
          <input 
            type="text"
            placeholder="Phone"
            name="phone"
            value={phone}
            onChange={handleInputChange}  
            className="p-5 w-full pr-4 py-3 border-b border-solid border-[#008080] focus:outline-none focus:border-b-#008080]text-[16px] leading-7 text-headingColor placeholder:text-textColor cursor-pointer"
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

export default Profile;