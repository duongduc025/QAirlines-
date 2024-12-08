import React, { useState } from "react";
import MyAccount from "./MyAccount";
import Navbar from "../shared/Navbar";
import Footer from "../shared/Footer";
const UserAccount = () => {

    return (
        <>
        <Navbar />
            <MyAccount />
        <Footer />
       </>
    )
         
}
export default UserAccount;