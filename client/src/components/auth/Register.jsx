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
import { useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { useDispatch } from 'react-redux'
import { USER_API_END_POINT, LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint'
import { setUser } from '@/redux/authSlice'



const Signup = () => {

    const navigate = useNavigate(); 
    const { loading, user } = useSelector(store => store.auth);
    const [input, setInput] = useState({
        email: "",
        fullname: "",
        phoneNumber: "",
        password: "",
    });
 
    const dispatch = useDispatch();


    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
    const changeFileHandler = (e) => {
        setInput({ ...input, file: e.target.files?.[0] });
    }
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.fullname || !input.email || !input.phoneNumber || !input.password) {
            toast.error("Vui lòng điền đầy đủ các thông tin");
            return;
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
                withCredentials: true,
            });
            if (res.data) {
                navigate("/login");
                toast.success("Đăng ký thành công");
            } else {
                toast.error(res.data);
                console.log("Thất bại");
            }
        }
        catch (error) {
            console.log("Lỗi")
            toast.error(error.response.data.message);
        }
        finally {
            dispatch(setLoading(false));
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
                    {
                    loading ? <Button className="w-full my-4 bg-[#008080]"> <Loader2 className = "mr2 h-4 w-4 animate-spin" /> Please wait </Button> :
                    <Button type="submit" className="w-full my-4 bg-[#008080]">Register</Button>
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
