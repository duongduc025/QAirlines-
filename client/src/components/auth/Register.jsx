import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import Footer from '../shared/Footer'

const Signup = () => {

    const navigate = useNavigate(); // Add useNavigate hook

    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        user_type: "", // Add user_type to the state
        file: ""
    });
 

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.fullname || !input.email || !input.phoneNumber || !input.password || !input.user_type) {
            toast.error("Please fill in all fields.");
            return;
        }
        try {
            const response = await axios.post('http://localhost:3001/register', input);
            console.log("Response:", response.data); // Log the response
            if (response.data === "Success") {
                toast.success("Registration successful!");
                navigate('/login'); // Navigate to login page
            } else {
                toast.error(response.data);
            }
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error("An error occurred during registration.");
        }
    }
    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12">
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Sign Up</h1>
                    <div className='my-2'>
                        <Label>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="patel"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="patel@gmail.com"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="8080808080"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="************"
                        />
                    </div>
                    <div className='my-2'>
                        <Label>User Type</Label>
                        <Input
                            type="text"
                            value={input.user_type}
                            name="user_type"
                            onChange={changeEventHandler}
                            placeholder="student"
                        />
                    </div>
                    {
                     <Button type="submit" className="w-full my-4 bg-[#008080]">Signup</Button>
                    }
                    <span className='text-sm'>Already have an account? <Link to="/login" className='text-blue-600'>Login</Link></span>
                </form>
            </div>
        </div>
        <Footer/>
        </div>
    )
}

export default Signup
