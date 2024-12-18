import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import logo from '../../assets/image/qairline_logo.png'
import { LogOut, User2, Menu, X, Bell, ChevronRight } from 'lucide-react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { LOCAL_STORAGE_TOKEN_NAME } from '@/utils/constraint'
import { useSelector, useDispatch } from 'react-redux'
import { setAllBooking } from '@/redux/bookingSlice'
import { setUser } from '@/redux/authSlice'
import { Badge } from '../ui/badge'

const guessNavLinks = [
    {
        path: '/home',
        display: 'Trang chủ',
    },
    {
        path: '/promotion',
        display: 'Khuyến mãi & Tin tức',
    },
    {
        path: '/flight',
        display: 'Tìm chuyến bay',
    },
    {
        path: '/mybookings',
        display: 'Chuyến bay của tôi',
    },
]

const mobileNavLinks = [
  {
      path: '/home',
      display: 'Trang chủ',
  },
  {
      path: '/promotion',
      display: 'Ưu đãi',
  },
  {
      path: '/flight',
      display: 'Tìm chuyến bay',
  },
  {
      path: '/mybookings',
      display: 'Chuyến bay của tôi',
  },
]

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
    const [navLinks, setNavLinks] = useState(guessNavLinks);

    useEffect(() => {
      setNavLinks(isMobileMenuOpen ? mobileNavLinks : guessNavLinks);
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen)
    }

    const handleLogout = async () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
        dispatch(setUser(null));
        dispatch(setAllBooking([]));
        navigate('/login');
    }

    const handleViewMoreNotifications = () => {
        navigate('/promotion');
    }
    const { allPromotions } = useSelector(store => store.promotion);
    //lấy ra 5 promotions mới nhất
    const latestPromotions = allPromotions.slice(0, 5);

    return (
        <div className='bg-white relative'>
            {/* Desktop and Mobile Header */}
            <div className='flex items-center justify-between mx-auto max-w-[95rem] h-20 px-4'>
                {/* Logo Section */}
                <div className="flex items-center">
                    <img id='userImg' width={40} height={40} src={logo} alt="QAirline Logo" className="rounded-full" />
                    <h1 className='ml-2 text-3xl font-bold text-[#DAA520]'>Q<span className='text-[#008080]'>Airline</span></h1>
                </div>

                {/* Desktop Navigation */}
                <div className='hidden xl:flex items-center gap-12'>
                    <ul className='flex font-medium items-center gap-5'>
                        {navLinks.map((link, index) => (
                            <React.Fragment key={index}>
                                <li>
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'text-[#DAA520] text-[18px] leading-8 font-[600]'
                                                : 'text-textColor text-[18px] leading-8 font-[500] hover:text-primaryColor'
                                        }
                                    >
                                        {link.display}
                                    </NavLink>
                                </li>
                                {index < navLinks.length - 1 && (
                                    <div className="h-6 border-l border-gray-300 mx-2"></div>
                                )}
                            </React.Fragment>
                        ))}
                    </ul>

                    {!user ? (
                        <div className='flex items-center gap-2'> 
                            <Link to='/login'>
                                <Button className="bg-[#DAA520] text-white hover:bg-[#006666] text-base px-5 py-1.5">Đăng nhập</Button>
                            </Link>
                            <Link to='/register'>
                                <Button className='bg-[#008080] text-white hover:bg-[#DAA520] text-base px-5 py-1.5'>Đăng ký</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className='flex items-center gap-4'>
                         <Popover>
    <PopoverTrigger asChild>
        <div className='relative cursor-pointer'>
            <Bell className='text-black hover:text-[#DAA520] w-6 h-6' />
            
        </div>
    </PopoverTrigger>
    <PopoverContent 
        align="start" 
        className="w-[350px] p-0 shadow-xl rounded-xl mt-2"
    >
        <div className='bg-[#DAA520] text-white px-4 py-3 rounded-t-xl flex justify-center'>
            <h2 className='text-lg font-semibold'>Thông Báo</h2>
        </div>
        <div className='max-h-[350px] overflow-y-auto'>
            {latestPromotions.map((promotion) => (
                <div 
                    key={promotion._id} 
                    className='px-4 py-2 border-b last:border-b-0 hover:bg-gray-50 transition-colors duration-200 cursor-pointer group'
                >
                    <div className='flex items-center max-w-full'>
                        <div className='flex-1 min-w-0'
                              onClick={handleViewMoreNotifications}
                        >
                            <h4 className='font-semibold text-sm text-gray-800 group-hover:text-[#DAA520] transition-colors truncate max-w-full'>
                            
                                {promotion.title}
                            </h4>
                            <p className='text-xs text-gray-600 truncate max-w-full'>
                                {promotion.brief}
                            </p>
                            <span className='text-xs text-gray-400 block truncate max-w-full'>
                                {promotion.posted_at}
                            </span>
                        </div>
                        <div className='pl-2 flex-shrink-0'>
                            <ChevronRight className='text-gray-400 w-4 h-4 group-hover:text-[#DAA520] transition-colors' />
                        </div>
                    </div>
                </div>
            ))}
        </div>
        <div 
            className='px-4 py-2 bg-gray-50 rounded-b-xl text-center cursor-pointer hover:bg-gray-100 transition-colors'
            onClick={handleViewMoreNotifications}
        >
            <span className='text-sm text-[#008080] font-medium flex items-center justify-center'>
                Xem thêm <ChevronRight className='ml-1 w-4 h-4' />
            </span>
        </div>
    </PopoverContent>
</Popover>
                            {/* User Profile Popover */}
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer">
                                        <AvatarImage 
                                            src="https://www.gravatar.com/avatar/?d=mp" 
                                            alt="User Avatar" 
                                        />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-2">
                                    <div className='space-y-2'>
                                        <div className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded'>
                                            <User2 className='text-[#DAA520]' />
                                            <Link to='/account'>
                                                <Button variant="link" className="p-0">Tài khoản của tôi</Button>
                                            </Link>
                                        </div>
                                        <div className='flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded' onClick={handleLogout}>
                                            <LogOut className='text-[#DAA520]'/>
                                            <Button variant="link" className="p-0">Đăng xuất</Button>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Toggle */}
                <div className='xl:hidden'>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={toggleMobileMenu}
                    >
                        {isMobileMenuOpen ? <X /> : <Menu />}
                    </Button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div className='fixed inset-0 bg-white z-50 xl:hidden'>
                    <div className='container mx-auto px-4 pt-16'>
                        {/* Mobile Navigation Links */}
                        <ul className='space-y-4'>
                            {navLinks.map((link, index) => (
                                <li key={index} className='border-b pb-2'>
                                    <NavLink
                                        to={link.path}
                                        className={({ isActive }) =>
                                            isActive
                                                ? 'text-[#DAA520] text-[16px] leading-7 font-[600] block'
                                                : 'text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor block'
                                        }
                                        onClick={toggleMobileMenu}
                                    >
                                        {link.display}
                                    </NavLink>
                                </li>
                            ))}
                            {!user ? (
                                <>
                                    <li className='border-b pb-2'>
                                        <NavLink
                                            to='/login'
                                            className='text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor block'
                                            onClick={toggleMobileMenu}
                                        >
                                            Đăng nhập
                                        </NavLink>
                                    </li>
                                    <li className='border-b pb-2'>
                                        <NavLink
                                            to='/register'
                                            className='text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor block'
                                            onClick={toggleMobileMenu}
                                        >
                                            Đăng ký
                                        </NavLink>
                                    </li>
                                </>
                            ) : (
                                <li className='border-b pb-2'>
                                    <NavLink
                                        to='/account'
                                        className='text-textColor text-[16px] leading-7 font-[500] hover:text-primaryColor block'
                                        onClick={toggleMobileMenu}
                                    >
                                        Tài khoản của tôi
                                    </NavLink>
                                </li>
                            )}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar