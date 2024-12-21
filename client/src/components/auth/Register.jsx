import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Loader2, UserPlus } from 'lucide-react'
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

    // Hàm xử lý khi thay đổi thông tin input
    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }
  
    // Hàm xử lý khi submit form đăng ký
    const submitHandler = async (e) => {
        e.preventDefault();
        if (!input.email || !input.fullname || !input.phoneNumber || !input.password) {
            toast.error("Vui lòng điền đầy đủ các thông tin");
            return;
        }
        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, input, {
                
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
            toast.error(error.response.data);
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    return (
        <div>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12 bg-[url('/airplane-bg.jpg')] bg-cover bg-center">
                <div className='flex items-center justify-center max-w-7xl mx-auto'>
                    <form onSubmit={submitHandler} className='w-full max-w-md bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-8 my-10 shadow-lg'>
                        <div className="flex flex-col items-center mb-6">
                            <UserPlus className="w-16 h-16 text-[#008080] mb-2" />
                            <h1 className='font-bold text-2xl text-gray-800'>Đăng ký tài khoản</h1>
                        </div>

                        <div className='space-y-4'>
                            <div>
                                <Label className="text-gray-700">Họ và tên</Label>
                                <Input
                                    type="text"
                                    value={input.fullname}
                                    name="fullname"
                                    onChange={changeEventHandler}
                                    placeholder="Nhập họ và tên"
                                    className="mt-1 focus:ring-2 focus:ring-[#008080]"
                                />
                            </div>

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
                                <Label className="text-gray-700">Số điện thoại</Label>
                                <Input
                                    type="text"
                                    value={input.phoneNumber}
                                    name="phoneNumber"
                                    onChange={changeEventHandler}
                                    placeholder="Nhập số điện thoại"
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
                                Đăng ký
                            </Button>
                        )}

                        <p className='text-sm text-center text-gray-600'>
                            Đã có tài khoản? {' '}
                            <Link to="/login" className='text-[#DAA520] hover:underline font-medium'>
                                Đăng nhập
                            </Link>
                        </p>
                    </form>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Signup
