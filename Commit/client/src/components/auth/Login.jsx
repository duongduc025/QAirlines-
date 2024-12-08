import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../shared/Footer'
import axios from 'axios'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useDispatch } from 'react-redux' 
import { setLoading } from '@/redux/authSlice'
import store from '@/redux/store'
import { useSelector } from 'react-redux'
import { USER_API_END_POINT, LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint'
import { setUser } from '@/redux/authSlice'


const Login = () => {
    
    const [input, setInput] = useState({
        email: "",
        password: "",
    });
    const { loading, user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
                withCredentials: true,
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                localStorage.setItem('user', JSON.stringify(res.data.user));
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, res.data.token);
                navigate("/");
                toast.success("Đăng nhập thành công");
            } else {
                toast.error(res.data);
                console.log("Thất bại");
            }
        } catch (error) {
            console.log("Lỗi")
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }
   

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12">
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-1/2 border border-gray-200 rounded-md p-4 my-10'>
                    <h1 className='font-bold text-xl mb-5'>Login</h1>
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
                        <Label>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="********"
                        />
                    </div>
                    {
                    loading ? <Button className="w-full my-4 bg-[#008080]"> <Loader2 className = "mr2 h-4 w-4 animate-spin" /> Please wait </Button> :
                    <Button type="submit" className="w-full my-4 bg-[#008080]">Đăng nhập</Button>
                    }
                    <span className='text-sm'>Chưa có tài khoản? <Link to="/register" className='text-blue-600'>Đăng kí</Link></span>
                </form>
            </div>
            </div>
        <Footer/>
        </>
    )
}

export default Login