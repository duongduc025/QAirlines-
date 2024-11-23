import React, { useState } from "react";
import Profile from "./Profile";
import ChangePassword from "./ChangePassword";

const MyAccount = () => {
    const [tab, setTab] = useState("");

    return (
        <section className =" bg-gray-50">
            <div className="max-w-[1170px]  px-5 mx-auto py-12 min-h-screen ">
                <div className="grid md:grid-cols-3 gap-10">
                    <div className="pb-[50px] px-[30px] rounded-md border-r pl-3">
                        <div className="flex items-center justify-center">
                            <figure className="w-[100px] h-[100px] rounded-full border-2 border-solid border-primaryColor">
                                <img 
                                    src="https://github.com/shadcn.png" 
                                    alt="" 
                                    className="w-full h-full rounded-full" 
                                />
                            </figure>
                        </div>
                        <div className="text-center mt-4">
                            <h3 className="text-headingColor text-[18px] leading-[30px] font-bold">
                                User Name
                            </h3>
                            <p className="text-textColor text-[15px] leading-6 font-medium">
                                user@example.com
                            </p>
                            <p className="text-textColor text-[15px] leading-6 font-medium">
                                User Phone
                            </p>
                        </div>

                        <div className="mt-[50px] md:mt-[20px]">
                            <button 
                                className="w-full bg-[#008080] hover:bg-[#006666] p-3 text-[16px] font-bold leading-7 rounded-md text-white">
                                Logout
                            </button>
                        </div>
                    </div>

                    <div className="md:col-span-2 md:px-[30px]">
                        <div>
                            <button 
                                onClick={() => setTab("profile")} 
                                className={`${
                                    tab === "profile" && "bg-[#008080] text-white font-semibold"
                                } p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`} 
                            >
                                Profile    
                            </button>
                            <button 
                                onClick={() => setTab("changepassword")} 
                                className={`${
                                    tab === "changepassword" && "bg-[#008080] text-white font-semibold"
                                } p-2 mr-5 px-5 rounded-md text-headingColor font-semibold text-[16px] leading-7 border border-solid border-primaryColor`} 
                            > 
                                Change Password   
                            </button>
                        </div>

                        {
                            tab === "profile" && <Profile />
                        }
                        {
                            tab === "changepassword" && <ChangePassword />  
                        }
                    </div>
                </div>
            </div>
        </section>
    );
};

export default MyAccount;