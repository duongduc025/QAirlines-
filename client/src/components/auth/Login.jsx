import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../shared/Footer'
import axios from 'axios'
import { Loader2, UserCircle } from 'lucide-react'
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

    // Hàm xử lý khi thay đổi thông tin input
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    // Hàm xử lý khi submit form đăng nhập
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                localStorage.setItem(LOCAL_STORAGE_TOKEN_NAME, res.data.token);
                navigate("/");
                toast.success("Đăng nhập thành công");
            } else {
                toast.error("Mật khẩu hoặc email không đúng");
            }
        } catch (error) {
            toast.error("Mật khẩu hoặc email không đúng");
        } finally {
            dispatch(setLoading(false));
        }
    }
   

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12 bg-[url('/airplane-bg.jpg')] bg-cover bg-center">
                <div className='flex items-center justify-center max-w-7xl mx-auto'>
                    <form onSubmit={submitHandler} className='w-full max-w-md bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-8 my-10 shadow-lg'>
                        <div className="flex flex-col items-center mb-6">
                            <UserCircle className="w-16 h-16 text-[#008080] mb-2" />
                            <h1 className='font-bold text-2xl text-gray-800'>Đăng nhập</h1>
                        </div>
                        
                        <div className='space-y-4'>
                            <div>
                                <Label className="text-gray-700">Email</Label>
                                <Input
                                    type="email"
                                    value={input.email}
                                    name="email"
                                    onChange={changeEventHandler}
                                    placeholder="Nhập email của bạn"
                                    className="mt-1 focus:ring-2 focus:ring-[#008080]"
                                />
                            </div>

                            <div>
                                <Label className="text-gray-700">Mật khẩu</Label>
                                <Input
                                    type="password"
                                    value={input.password}
                                    name="password"
                                    onChange={changeEventHandler}
                                    placeholder="Nhập mật khẩu của bạn"
                                    className="mt-1 focus:ring-2 focus:ring-[#008080]"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <Button disabled className="w-full mt-6 mb-4 bg-[#008080] hover:bg-[#DAA520] transition-all duration-300">
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Đang xử lý...
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full mt-6 mb-4 bg-[#008080] hover:bg-[#DAA520] transition-all duration-300">
                                Đăng nhập
                            </Button>
                        )}
                        
                        <p className='text-sm text-center text-gray-600'>
                            Chưa có tài khoản? {' '}
                            <Link to="/register" className='text-[#DAA520] hover:underline font-medium'>
                                Đăng ký
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Login